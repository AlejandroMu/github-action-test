# 📌 Contexto de Sesión y Memoria Técnica — Ingesoft V / IasLab

Este documento consolida el contexto técnico, las configuraciones de servidores, la topología de red, los flujos de trabajo de CI/CD y los artefactos generados durante la sesión.

---

## 🗺️ Mapa de Infraestructura y Enrutamiento de Servidores

```mermaid
flowchart TD
    subgraph Internet & Red Externa ICESI
        Client[🌐 Usuario / Navegador] -->|https://pi2tools.icesi.edu.co/| Edge[Edge Gateway ICESI]
    end

    subgraph Servidor grid100 (10.147.20.10 / 192.168.131.10)
        Edge -->|HTTP :80| NginxGrid[Nginx Reverse Proxy]
        
        NginxGrid -->|/iaslab/github-action/| RunnerPortal[Portal Monitor Runner :80]
        NginxGrid -->|/iaslab/github-action-test/| StaticFiles[Archivos Estáticos HTML /home/iaslab/...]
        NginxGrid -->|/iaslab/github-action-docker/| DockerTest[🐳 Contenedor Docker :9088]
        NginxGrid -->|/iaslab/ingesoftV/| Proxy205[Proxy Pass a nodo 205m01 :8080]
        
        RunnerDaemon[⚡ GitHub Actions Runner Daemon] -.->|Long-polling HTTPS| GitHubCloud[☁️ GitHub.com]
    end

    subgraph Nodo 205m01 (10.147.20.61 / 192.168.131.61)
        Proxy205 -->|HTTP :8080| Nginx205[Nginx 1.24.0 :8080]
        Nginx205 -->|include /home/ingesoft/*/nginx.conf| ModularApps[Apps /home/ingesoft/test/public/]
    end
```

---

## 📋 Resumen de Actividades y Configuraciones Realizadas

### 1. Configuración de Self-Hosted Runner en `grid100` (`192.168.131.10`)
- **Directorio del Runner:** `/home/iaslab/github-runner/` (Runner `actions-runner-linux-x64-v2.336.0`).
- **Servicio Systemd:** `actions.runner.AlejandroMu-github-action-test.grid100-runner.service` (activo en background bajo usuario `iaslab`).
- **Portal de Monitoreo:** Visible en `https://pi2tools.icesi.edu.co/iaslab/github-action/` y `http://10.147.20.10/iaslab/github-action/`.
- **Scripts de Control:**
  - `/home/iaslab/github-runner/register.sh`
  - `/home/iaslab/github-runner/service-control.sh`
  - `/home/iaslab/github-runner/update-status.sh`

---

### 2. Estrategia de Ramas y Workflows Condicionales en GitHub Actions
Repositorio: [`git@github.com:AlejandroMu/github-action-test.git`](https://github.com/AlejandroMu/github-action-test)

| Rama | Workflow | Tipo de Despliegue | Endpoint Activo |
| :--- | :--- | :--- | :--- |
| **`main`** | `.github/workflows/deploy-static.yml` | Despliegue estático de archivos HTML en `/home/iaslab/github-action-test/` | `http://10.147.20.10/iaslab/github-action-test/`<br>`https://pi2tools.icesi.edu.co/iaslab/github-action-test/` |
| **`docker`** | `.github/workflows/deploy-docker.yml` | Despliegue en contenedor Docker (`github-action-test-app` en `:9088`) con Reverse Proxy en Nginx | `http://10.147.20.10/iaslab/github-action-docker/`<br>`https://pi2tools.icesi.edu.co/iaslab/github-action-docker/` |

---

### 3. Presentación Institucional en LaTeX Beamer (Universidad Icesi)
- **Paquete de Estilo:** [`custombeamer.sty`](file:///root/work-space/ingesoftV/custombeamer.sty) (sincronizado desde `/mnt/c/Users/alejo/.gemini/config/skills/latex-presentation/resources/`).
- **Código Fuente LaTeX:** [`presentation.tex`](file:///root/work-space/ingesoftV/presentation.tex)
- **PDF Compilado:** [`presentation.pdf`](file:///root/work-space/ingesoftV/presentation.pdf) (26 diapositivas de alta resolución, 16:9).
- **Contenido Temático:**
  1. *Módulo 1: Scripts de Automatización (Shell Scripting Defensivo, `set -euo pipefail`, validación de entorno).*
  2. *Módulo 2: Contenerización con Docker (Multi-Stage Builds para Spring Boot y React, Docker Compose, Nginx).*
  3. *Módulo 3: Estrategias de Git y GitFlow (Topología de ramas, SemVer 2.0.0, Conventional Commits, Pull Requests).*
  4. *Módulo 4: CI/CD con GitHub Actions (Pipelines declarativos, workflows condicionales, Cloud vs Self-Hosted Runners).*
- **Validación Automatizada:** Validado con `verify_presentation.js` (0 desbordamientos visuales `Overfull \vbox`).

---

### 4. Sincronización de Skills y Plugins de Antigravity (Windows <-> WSL)
- Se unificaron las skills entre `/mnt/c/Users/alejo/.gemini/config/skills/` (Windows) y `/root/.gemini/config/skills/` (WSL Ubuntu):
  - `latex-presentation`
  - `rnda-agent-analyst`
  - `rnda-agent-legal`
  - `rnda-setup`
- **Script de Sincronización Automática:** [`/root/.gemini/sync_gemini_config.sh`](file:///root/.gemini/sync_gemini_config.sh).

---

### 5. Nodo `205m01` (`sas1@10.147.20.61` / `192.168.131.61`)
1. **Configuración de Sudo Sin Contraseña:**
   - Archivo `/etc/sudoers.d/sas1` con regla `sas1 ALL=(ALL) NOPASSWD:ALL`.
2. **Servidor Nginx en Puerto 8080:**
   - Nginx `v1.24.0` instalado y escuchando en `0.0.0.0:8080`.
   - `/etc/nginx/sites-available/default` incluye la directiva modular:
     ```nginx
     include /home/ingesoft/*/nginx.conf;
     ```
3. **Módulo de Prueba:**
   - Directorio `/home/ingesoft/test/public/` sirviendo `index.html`.
   - Archivo de enrutamiento `/home/ingesoft/test/nginx.conf`.
4. **Reverse Proxy en `grid100`:**
   - `/home/iaslab/ingesoftV/nginx.conf` redirige `/iaslab/ingesoftV` ➔ `http://192.168.131.61:8080/`.
   - Endpoint activo y verificado: `https://pi2tools.icesi.edu.co/iaslab/ingesoftV/` y `http://10.147.20.10/iaslab/ingesoftV/`.

---

## 🌐 Tabla Consolidada de Endpoints y Servicios

| Servicio | URL Pública (Edge) | URL Local / VPN (grid100) | Servidor / Puerto Destino |
| :--- | :--- | :--- | :--- |
| **Ingesoft V App** | `https://pi2tools.icesi.edu.co/iaslab/ingesoftV/` | `http://10.147.20.10/iaslab/ingesoftV/` | `205m01` (`192.168.131.61:8080`) |
| **Runner Monitor** | `https://pi2tools.icesi.edu.co/iaslab/github-action/` | `http://10.147.20.10/iaslab/github-action/` | `grid100` (`/home/iaslab/github-runner/public/`) |
| **Test Estático (main)** | `https://pi2tools.icesi.edu.co/iaslab/github-action-test/` | `http://10.147.20.10/iaslab/github-action-test/` | `grid100` (`/home/iaslab/github-action-test/`) |
| **Test Docker (docker)** | `https://pi2tools.icesi.edu.co/iaslab/github-action-docker/` | `http://10.147.20.10/iaslab/github-action-docker/` | `grid100` (`127.0.0.1:9088`) |
| **Portal Documentación** | `https://pi2tools.icesi.edu.co/iaslab/docs/` | `http://10.147.20.10/iaslab/docs/` | `grid100` (`/home/iaslab/iaslab-docs/`) |
| **SAAMFI Frontend** | `https://pi2tools.icesi.edu.co/iaslab/saamfi/` | `http://10.147.20.10/iaslab/saamfi/` | `grid100` (`127.0.0.1:9090`) |
| **Survey Manager** | `https://pi2tools.icesi.edu.co/iaslab/survey-manager/` | `http://10.147.20.10/iaslab/survey-manager/` | `grid100` (`127.0.0.1:9020`) |
