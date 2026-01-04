# ✅ Pre-Deploy Checklist

## 📋 Verificación de Archivos

- [x] `.gitignore` - Configurado correctamente
- [x] `.env.example` - Creado con variables de ejemplo
- [x] `.env.local` - Actualizado (NO debe estar en git)
- [x] `package.json` - Todas las dependencias presentes
- [x] `next.config.js` - Optimizado para Vercel
- [x] `vercel.json` - Configuración de Vercel
- [x] `.npmrc` - Configuración de npm
- [x] `.prettierrc` - Configuración de Prettier
- [x] `README.md` - Documentación completa
- [x] `DEPLOY_GUIDE.md` - Guía de deployment
- [x] `SETUP.md` - Guía de configuración

## 🔐 Seguridad

- [x] No hay `.env.local` en el repositorio
- [x] No hay `.env.production.local` en el repositorio
- [x] No hay tokens o API keys en archivos versionados
- [x] Variables sensibles configuradas en Vercel Dashboard

## 📦 Dependencias

- [x] Next.js 12.3.0
- [x] React 18.2.0
- [x] TypeScript 4.8.3
- [x] NextUI 1.0.0-beta.10
- [x] Todas las dependencias en package.json

## 🏗️ Estructura

```
BDP-FRONT/
├── components/       ✓ OK
├── pages/           ✓ OK
├── services/        ✓ OK
├── context/         ✓ OK
├── hooks/           ✓ OK
├── types/           ✓ OK
├── styles/          ✓ OK
├── public/          ✓ OK
├── config/          ✓ OK
└── package.json     ✓ OK
```

## 🔧 Configuración

- [x] `NEXT_PUBLIC_API_URL` = https://api.bebidasdelperuapp.com
- [x] `NEXT_PUBLIC_APP_NAME` = Bebidas del Perú App
- [x] `NODE_ENV` = production

## 🧪 Pruebas

```bash
# Antes de hacer push:
npm install          # ✓ Debe completarse sin errores
npm run build        # ✓ Debe compilar sin errores
npm run lint         # ✓ Revisar errores críticos
npm run dev          # ✓ Iniciar y probar localmente
```

## 📤 Pasos para Deploy

### 1. Preparación

```bash
# Limpiar dependencias antiguas
rm -rf node_modules package-lock.json
npm install

# Verificar build
npm run build

# Si todo está OK, proceder...
```

### 2. Git Setup

```bash
# Configurar git si es primera vez
git init
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# Agregar archivos
git add .
git commit -m "Initial commit: Bebidas del Perú Frontend"

# Crear rama main si es necesario
git branch -M main

# Agregar remote
git remote add origin https://github.com/tu-usuario/bebidas-del-peru-app.git

# Push
git push -u origin main
```

### 3. Vercel Setup

1. Ir a https://vercel.com
2. Sign in con GitHub
3. Click "New Project"
4. Seleccionar repositorio
5. Configurar:
   - Root Directory: `BDP-FRONT`
   - Framework: Next.js (auto-detectado)
6. Agregar Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://api.bebidasdelperuapp.com`
   - `NEXT_PUBLIC_APP_NAME` = `Bebidas del Perú App`
7. Click "Deploy"

## ✨ Post-Deploy

- [x] Visitar URL de Vercel
- [x] Probar login con admin/admin123
- [x] Verificar que rutas protegidas funcionan
- [x] Verificar que API responde correctamente
- [x] Revisar Analytics en Vercel

## 🚀 Actualizaciones Futuras

```bash
# Para cada actualización:
git add .
git commit -m "Descripción"
git push origin main
# Vercel redesplegará automáticamente
```

## 📞 Recursos

- [Vercel Docs](https://vercel.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [GitHub](https://github.com)

---

**Estado**: ✅ LISTO PARA DEPLOY

**Fecha**: Enero 2026

**Responsable**: Equipo de Desarrollo
