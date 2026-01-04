# Setup Guide - Bebidas del Perú Frontend

Guía completa para configurar el proyecto localmente y deployarlo.

## 1️⃣ Instalación Inicial

### Prerrequisitos

- Node.js 16.x o superior
- npm 7.x o superior
- Git configurado con SSH o HTTPS

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/bebidas-del-peru-app.git
cd bebidas-del-peru-app

# 2. Navegar al directorio del frontend
cd BDP-FRONT

# 3. Instalar dependencias
npm install

# 4. Crear archivo de variables de entorno
cp .env.example .env.local

# 5. Editar .env.local con tus valores (si es necesario)
# NEXT_PUBLIC_API_URL debe apuntar a tu backend
```

## 2️⃣ Desarrollo Local

### Iniciar servidor

```bash
npm run dev
```

Abre http://localhost:3000 en tu navegador.

### Credenciales de prueba

```
Username: admin
Contraseña: admin123
```

### Estructura de carpetas clave

```
BDP-FRONT/
├── pages/              # Rutas y páginas (Next.js)
├── components/         # Componentes React reutilizables
├── services/           # Servicios de API
├── context/            # Context API para estado global
├── hooks/              # Custom React hooks
├── types/              # TypeScript interfaces
└── styles/             # CSS/SCSS global
```

## 3️⃣ Antes del Deploy

### Verificaciones

```bash
# 1. Linter
npm run lint

# 2. Build de producción (debe completarse sin errores)
npm run build

# 3. Probar el build
npm run start
```

Si todo funciona, proceder al siguiente paso.

### Verificar Git

```bash
# 1. Ver status
git status

# 2. Verificar que .gitignore está correcto
# Debe excluir: node_modules/, .env.local, .next/, etc.

# 3. Agregar todos los cambios
git add .

# 4. Commit
git commit -m "Initial commit"

# 5. Subir a GitHub
git push origin main
```

## 4️⃣ Deploy en Vercel

### Método 1: Web (Recomendado)

1. Ir a https://vercel.com
2. Conectar tu cuenta de GitHub
3. Seleccionar el repositorio
4. Click en "Import Project"
5. **Configuración importante:**
   - **Framework**: Next.js (detección automática)
   - **Root Directory**: `BDP-FRONT`
   - **Build Command**: `npm run build`
   - **Install Command**: `npm install`
   - **Output Directory**: `.next`

6. **Agregar Environment Variables:**
   - `NEXT_PUBLIC_API_URL` = `https://api.bebidasdelperuapp.com`
   - `NEXT_PUBLIC_APP_NAME` = `Bebidas del Perú App`

7. Click "Deploy"

### Método 2: CLI

```bash
npm install -g vercel
cd BDP-FRONT
vercel
```

## 5️⃣ Post-Deploy

### Verificar que todo funciona

1. Visita la URL de Vercel (ej: https://bebidas-del-peru-app-frontend.vercel.app)
2. Intenta hacer login
3. Verifica que la API responda correctamente

### Monitoreo

En Vercel Dashboard:
- **Analytics**: Ver tráfico y performance
- **Logs**: Ver errores en tiempo real
- **Deployments**: Historial de deploys

## 6️⃣ Actualizaciones Futuras

### Para actualizar el código

```bash
# 1. Hacer cambios locales
# 2. Probar localmente (npm run dev)
# 3. Verificar que compila (npm run build)
# 4. Commit y push

git add .
git commit -m "Descripción del cambio"
git push origin main

# Vercel redesplegará automáticamente
```

## 🔐 Seguridad

### Lo que NO debe estar en el repositorio

- ❌ Archivos `.env.local`
- ❌ Archivos `.env.production.local`
- ❌ Tokens o API keys
- ❌ Contraseñas

### Que debe estar en Vercel (no en código)

✅ Variables de entorno sensibles se configuran en Vercel Dashboard

## 📚 Documentación Adicional

- [README.md](README.md) - Descripción del proyecto
- [DEPLOY_GUIDE.md](DEPLOY_GUIDE.md) - Guía de deploy detallada
- [../GUIA_INSTALACION_AUTENTICACION.md](../GUIA_INSTALACION_AUTENTICACION.md) - Sistema de auth

## ⚠️ Troubleshooting

### "Module not found"
```bash
rm -rf node_modules
npm install
```

### "Build failed"
1. Verificar que `npm run build` funciona localmente
2. Revisar logs de Vercel
3. Verificar que todas las dependencias están en package.json

### "API not responding"
Verificar que `NEXT_PUBLIC_API_URL` es correcta en Vercel.

## 📞 Soporte

Para problemas con Vercel, revisar su documentación oficial:
https://vercel.com/docs/next.js/overview

---

**Última actualización**: Enero 2026
