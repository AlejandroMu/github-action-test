# 🚀 Ingesoft V — GitHub Actions, Docker & Infraestructura IasLab

Repositorio de trabajo y pruebas de **Ingeniería de Software V** (Universidad Icesi) para la validación de pipelines de CI/CD ejecutados en el **Self-Hosted Runner** de GitHub Actions (`grid100`) y el despliegue distribuido de servicios hacia nodos de laboratorio (`205m01`).

---

## 📁 Estructura del Repositorio

```
.
├── .github/
│   └── workflows/
│       ├── deploy-static.yml   # Workflow para rama 'main' (Despliegue Estático)
│       └── deploy-docker.yml   # Workflow para rama 'docker' (Contenedor Docker)
├── Dockerfile                  # Empaquetado Nginx Alpine
├── docker-compose.yml          # Servicio web mapeado en 127.0.0.1:9088:80
├── nginx.conf                  # Configuración de Reverse Proxy para grid100
├── index.html                  # Frontend de prueba
├── custombeamer.sty            # Plantilla Beamer oficial con logo vectorial ICESI
├── presentation.tex            # Código fuente LaTeX de la guía DevOps (26 slides)
├── presentation.pdf            # Presentación compilada en alta resolución (16:9)
├── SESSION_CONTEXT.md          # Memoria técnica completa de la sesión
└── README.md                   # Documentación principal
```

---

## 🌿 Estrategia de Ramas y Despliegues

| Rama | Workflow | Tipo de Despliegue | URL Activa |
| :--- | :--- | :--- | :--- |
| **`main`** | `deploy-static.yml` | Despliegue estático de archivos HTML en `grid100` | [https://pi2tools.icesi.edu.co/iaslab/github-action-test/](https://pi2tools.icesi.edu.co/iaslab/github-action-test/) |
| **`docker`** | `deploy-docker.yml` | Contenedor Docker + Reverse Proxy en `grid100` | [https://pi2tools.icesi.edu.co/iaslab/github-action-docker/](https://pi2tools.icesi.edu.co/iaslab/github-action-docker/) |

---

## 📊 Presentación Institucional en LaTeX

El repositorio incluye la guía integral de DevOps para estudiantes de ingeniería de software:
- **Archivo LaTeX:** [`presentation.tex`](./presentation.tex)
- **PDF Compilado:** [`presentation.pdf`](./presentation.pdf)
- **Paquete de Estilo:** [`custombeamer.sty`](./custombeamer.sty)

---

## 📖 Contexto y Topología de Servidores

Para detalles completos sobre la configuración del runner en `grid100`, el enrutamiento de Nginx hacia el nodo `205m01` (`192.168.131.61:8080`) y la sincronización de herramientas, consulta:
👉 [`SESSION_CONTEXT.md`](./SESSION_CONTEXT.md)
