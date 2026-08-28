#!/usr/bin/env bash
# ==============================================================================
# Script de Despliegue Remoto con Docker vía SSH - IasLab / Ingesoft V
# Uso: ./scripts/remote-deploy.sh [TARGET_HOST] [TARGET_USER] [DEPLOY_DIR]
# Ejemplo: ./scripts/remote-deploy.sh grid101 iaslab /home/iaslab/my-app
# ==============================================================================

set -euo pipefail

# Colores para salida en terminal
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# 1. Parámetros de conexión y rutas
TARGET_HOST="${1:-grid101}"
TARGET_USER="${2:-iaslab}"
DEPLOY_DIR="${3:-/home/iaslab/github-action-remote}"
APP_PORT="${4:-9088}"
IMAGE_NAME="github-action-remote-app:latest"

echo -e "${BLUE}======================================================${NC}"
echo -e "${BLUE}  🚀 Iniciando Despliegue Remoto con Docker vía SSH   ${NC}"
echo -e "${BLUE}  Host de Ejecución (Runner): $(hostname) ($(whoami))  ${NC}"
echo -e "${BLUE}  Servidor de Destino:        ${TARGET_USER}@${TARGET_HOST}  ${NC}"
echo -e "${BLUE}  Directorio en Destino:      ${DEPLOY_DIR}          ${NC}"
echo -e "${BLUE}======================================================${NC}"

# 2. Validar conectividad SSH con el servidor de despliegue
echo -e "\n${YELLOW}[Paso 1/5] Verificando conectividad SSH con ${TARGET_HOST}...${NC}"
if ! ssh -o BatchMode=yes -o ConnectTimeout=5 "${TARGET_USER}@${TARGET_HOST}" "echo 'Conexión SSH exitosa a ' \$(hostname)"; then
    echo -e "${RED}❌ Error: No se pudo establecer conexión SSH sin contraseña hacia ${TARGET_USER}@${TARGET_HOST}.${NC}"
    echo -e "${YELLOW}Asegúrate de haber configurado la clave SSH con 'ssh-copy-id ${TARGET_USER}@${TARGET_HOST}'.${NC}"
    exit 1
fi

# 3. Compilar la imagen Docker localmente en el Runner
echo -e "\n${YELLOW}[Paso 2/5] Compilando imagen Docker en el Runner (${IMAGE_NAME})...${NC}"
docker build -t "${IMAGE_NAME}" .

# 4. Transferir la imagen Docker al servidor remoto mediante streaming SSH
echo -e "\n${YELLOW}[Paso 3/5] Transfiriendo imagen comprimida hacia ${TARGET_HOST}...${NC}"
docker save "${IMAGE_NAME}" | gzip -c | ssh "${TARGET_USER}@${TARGET_HOST}" "gunzip -c | docker load"
echo -e "${GREEN}✓ Imagen cargada exitosamente en el motor Docker de ${TARGET_HOST}.${NC}"

# 5. Sincronizar archivos de configuración (docker-compose, nginx.conf)
echo -e "\n${YELLOW}[Paso 4/5] Sincronizando archivos de despliegue en ${TARGET_HOST}:${DEPLOY_DIR}...${NC}"
ssh "${TARGET_USER}@${TARGET_HOST}" "mkdir -p '${DEPLOY_DIR}'"
scp docker-compose.yml nginx.conf "${TARGET_USER}@${TARGET_HOST}:${DEPLOY_DIR}/"
ssh "${TARGET_USER}@${TARGET_HOST}" "chmod -R 755 '${DEPLOY_DIR}'"

# 6. Levantar contenedores y recargar Nginx en el servidor de destino
echo -e "\n${YELLOW}[Paso 5/5] Levantando servicios y recargando Nginx en ${TARGET_HOST}...${NC}"
ssh "${TARGET_USER}@${TARGET_HOST}" bash << REMOTE_COMMANDS
    set -euo pipefail
    cd "${DEPLOY_DIR}"
    
    echo "Levantando contenedor en ${TARGET_HOST}..."
    docker compose down --remove-orphans || true
    docker compose up -d --force-recreate

    echo "Validando sintaxis de Nginx..."
    sudo nginx -t
    echo "Recargando Nginx..."
    sudo systemctl reload nginx
REMOTE_COMMANDS

# 7. Healthcheck de verificación
echo -e "\n${YELLOW}[Verificación] Ejecutando healthcheck en ${TARGET_HOST}...${NC}"
sleep 2
if ssh "${TARGET_USER}@${TARGET_HOST}" "curl -sI http://127.0.0.1:${APP_PORT}/ | head -n 5"; then
    echo -e "\n${GREEN}======================================================${NC}"
    echo -e "${GREEN}  ✅ Despliegue Remoto Finalizado con Éxito en ${TARGET_HOST}  ${NC}"
    echo -e "${GREEN}======================================================${NC}"
else
    echo -e "\n${RED}⚠️ Advertencia: El contenedor no respondió en el puerto ${APP_PORT}.${NC}"
    exit 1
fi
