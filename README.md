# Ingesoft V — Calculadora REST + CI/CD en IasLab

Aplicación de las historias de usuario HU1–HU5 sobre la infraestructura de **GitHub Actions (self-hosted runner `grid100`)** y despliegue en contenedores Docker.

## Historias de usuario

| HU | Descripción | Criterio cubierto |
| :--- | :--- | :--- |
| **HU1** | Servicio de suma | Frontend llama al Backend por HTTP/REST; el Backend responde JSON |
| **HU2** | Resta y multiplicación | Endpoints `/subtract` y `/multiply`; el Frontend permite seleccionarlos |
| **HU3** | Historial SoR | Cada cálculo exitoso se persiste en archivo local; el Frontend consulta las últimas 5 |
| **HU4** | División con validación | `/divide` retorna HTTP 400 si el denominador es 0, lo registra y el Frontend muestra el error |
| **HU5** | Telemetría / health | `/health` en Backend y `/status` en Frontend: estado, uptime y permisos de escritura |

## Endpoints

| Método | Ruta | Servicio | Notas |
| :--- | :--- | :--- | :--- |
| GET/POST | `/sum` | Backend | `{ "a": 2, "b": 3 }` → `{ result: 5, ... }` |
| GET/POST | `/subtract` | Backend | Resta |
| GET/POST | `/multiply` | Backend | Multiplicación |
| GET/POST | `/divide` | Backend | HTTP 400 si `b = 0` |
| GET | `/history` | Backend | Últimas 5 operaciones persistidas |
| GET | `/health` | Backend | Estado, uptime, persistencia escribible |
| GET | `/status` | Frontend | Estado del frontend + persistencia + backend |
| GET | `/` | Frontend | Interfaz de usuario |

Ejemplos:

```bash
curl -X POST https://pi2tools.icesi.edu.co/iaslab/github-action-docker/sum \
  -H "Content-Type: application/json" -d '{"a":2,"b":3}'

curl "https://pi2tools.icesi.edu.co/iaslab/github-action-docker/divide?a=10&b=0"
curl https://pi2tools.icesi.edu.co/iaslab/github-action-docker/health
curl https://pi2tools.icesi.edu.co/iaslab/github-action-docker/status
```

## Arquitectura

```
Cliente
  └── Nginx grid100  /iaslab/github-action-docker/  →  127.0.0.1:9088
        └── web (nginx) github-action-test-app
              ├── /                → frontend:3000
              ├── /status          → frontend:3000
              ├── /health          → backend:3001
              └── /sum|/subtract|/multiply|/divide|/history → backend:3001
                    └── volumen calc-data  (/data/operations.json)
```

## Despliegue

| Rama | Workflow | URL |
| :--- | :--- | :--- |
| **`docker`** | `deploy-docker.yml` | https://pi2tools.icesi.edu.co/iaslab/github-action-docker/ |
| **`main`** | `deploy-static.yml` | https://pi2tools.icesi.edu.co/iaslab/github-action-test/ |

Un push a `docker` construye backend, frontend y el gateway Nginx, levanta Compose en `grid100` y recarga el reverse proxy.

## Ejecución local

```bash
docker compose up --build
```

La UI queda en `http://127.0.0.1:9088/`.

```bash
cd backend && npm test
```
