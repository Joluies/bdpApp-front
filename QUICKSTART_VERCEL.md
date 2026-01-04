# 🚀 Quick Start - Deploy a Vercel

## 5 minutos para llevar tu app a producción

### Paso 1: Verificar que todo funciona

```bash
npm install
npm run build
# Si no hay errores, continuar...
```

### Paso 2: Crear repositorio GitHub

1. Ir a https://github.com/new
2. Nombre: `bebidas-del-peru-app`
3. Hacer público o privado (tu elección)
4. Click "Create repository"

### Paso 3: Subir código a GitHub

```bash
cd BDP-FRONT

git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/tu-usuario/bebidas-del-peru-app.git
git push -u origin main
```

### Paso 4: Deploy en Vercel

1. Ir a https://vercel.com/new
2. Seleccionar "GitHub" (conectar si no lo está)
3. Buscar y seleccionar tu repositorio
4. Verificar:
   - **Root Directory**: BDP-FRONT
   - **Framework**: Next.js
5. Agregar variables de entorno:
   ```
   NEXT_PUBLIC_API_URL = https://api.bebidasdelperuapp.com
   NEXT_PUBLIC_APP_NAME = Bebidas del Perú App
   ```
6. Click "Deploy" 🎉

### Paso 5: Listo!

Tu app estará en `https://[nombre-proyecto].vercel.app`

Credenciales de prueba:
- Username: `admin`
- Contraseña: `admin123`

---

## Próximos deploys

Cada vez que hagas un push a GitHub, Vercel se actualiza automáticamente:

```bash
git add .
git commit -m "Tu mensaje"
git push origin main
```

¡Listo! 🎉
