# GitHub Actions Test Deployment

Repositorio de prueba para validación de pipelines de CI/CD ejecutados en el **Self-Hosted Runner** de GitHub Actions configurado en **`grid100`** (`192.168.131.10`).

---

## 📁 Estructura del Proyecto

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml   # Workflow para ejecución en el runner self-hosted
├── index.html           # Página HTML sencilla de prueba
└── README.md            # Documentación del proyecto
```

---

## 🚀 Pasos para Registrar el Runner con este Repositorio

Si aún no has vinculado el runner en `grid100` a este repositorio:

1. **Obtener el token de registro en GitHub:**
   - En este repositorio en GitHub, ve a **Settings** ➔ **Actions** ➔ **Runners** ➔ **New self-hosted runner**.
   - Copia el token de registro generado.

2. **Ejecutar el registro en `grid100`:**
   ```bash
   ssh grid100
   cd /home/iaslab/github-runner
   ./register.sh https://github.com/AlejandroMu/github-action-test <TOKEN>
   ```

3. **Hacer Push o Ejecutar el Workflow:**
   - Al realizar un `git push` a `main`, el workflow `.github/workflows/deploy.yml` se ejecutará automáticamente en el servidor `grid100`.
