# 🚀 Ingesoft V — GitHub Actions, Docker & Infraestructura IasLab

Repositorio de trabajo y pruebas de **Ingeniería de Software V** (Universidad Icesi) para la validación de pipelines de CI/CD ejecutados en el **Self-Hosted Runner** de GitHub Actions (`grid100`) y el despliegue distribuido de servicios hacia servidores remotos (`grid101`, `205m01`).

---

## 📁 Estructura del Repositorio

```
.
├── .github/
│   └── workflows/
│       ├── deploy-static.yml         # Despliegue estático local en grid100 (Rama 'main')
│       ├── deploy-docker.yml         # Despliegue en contenedor Docker en grid100 (Rama 'docker')
│       └── deploy-remote.yml         # Despliegue remoto desde Runner (grid100) hacia grid101 vía SSH
├── scripts/
│   └── remote-deploy.sh              # Script modular de despliegue remoto con Docker y SSH
├── GUIA_DESPLIEGUE_REMOTO_RUNNER.md  # 📘 Guía Maestra: Runner en Linux y Despliegue Remoto
├── Dockerfile                        # Empaquetado Nginx Alpine
├── docker-compose.yml                # Servicio web mapeado en 127.0.0.1:9088:80
├── nginx.conf                        # Configuración de Reverse Proxy para Nginx
├── index.html                        # Frontend de prueba
└── README.md                         # Documentación principal
```

---

## 📘 Guía Completa de Despliegue Remoto con Runner

Para aprender cómo configurar un runner en Linux y cómo transferir/ejecutar contenedores Docker en un servidor remoto (`grid100` ➔ `grid101`) vía SSH:
👉 **[GUIA_DESPLIEGUE_REMOTO_RUNNER.md](./GUIA_DESPLIEGUE_REMOTO_RUNNER.md)**

Incluye:
1. Instalación y registro del Self-Hosted Runner como servicio Systemd.
2. Configuración de claves SSH (`Ed25519`, `authorized_keys`, permisos 600/700).
3. 3 Estrategias de transferencia de imagen (Docker Streaming SSH, Registry Nexus/GHCR, Build Remoto).
4. Comparativa: Script en el proyecto (`scripts/remote-deploy.sh`) vs Pasos Inline en GitHub Actions.
5. Checklist de configuración en el servidor de destino (`grid101`).

---

## 🌿 Estrategia de Ramas y Despliegues

| Rama | Workflow | Tipo de Despliegue | Host Destino | URL Activa |
| :--- | :--- | :--- | :--- | :--- |
| **`main`** | `deploy-static.yml` | Despliegue estático de archivos HTML | `grid100` | [https://pi2tools.icesi.edu.co/iaslab/github-action-test/](https://pi2tools.icesi.edu.co/iaslab/github-action-test/) |
| **`docker`** | `deploy-docker.yml` | Contenedor Docker + Reverse Proxy | `grid100` | [https://pi2tools.icesi.edu.co/iaslab/github-action-docker/](https://pi2tools.icesi.edu.co/iaslab/github-action-docker/) |
| **`remote-deploy`** | `deploy-remote.yml` | Despliegue remoto Docker vía SSH | `grid101` | `http://192.168.131.11/iaslab/github-action-remote/` |
