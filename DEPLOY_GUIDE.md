# Guía de Desarrollo y Deploy

## 🚀 Inicio Rápido

### Desarrollo local

```bash
# 1. Instalar dependencias
npm install

# 2. Crear .env.local (copiar de .env.example)
cp .env.example .env.local

# 3. Ejecutar servidor de desarrollo
npm run dev

# La app estará en http://localhost:3000
```

### Verificación antes de subir a GitHub

```bash
# 1. Limpiar dependencias
rm -rf node_modules
npm install

# 2. Ejecutar linter
npm run lint

# 3. Build de producción
npm run build

# 4. Verificar que compile sin errores
npm start
```

### Subir a GitHub

```bash
# 1. Inicializar git (si no está inicializado)
git init

# 2. Agregar archivos
git add .

# 3. Commit inicial
git commit -m "Initial commit: Bebidas del Perú Frontend"

# 4. Agregar remote
git remote add origin https://github.com/tu-usuario/bebidas-del-peru-app.git

# 5. Push a main
git branch -M main
git push -u origin main
```

## 🔗 Deploy en Vercel

### Opción 1: GitHub + Vercel (Recomendado)

1. **Ir a https://vercel.com**
2. **Hacer login con GitHub**
3. **Hacer click en "New Project"**
4. **Seleccionar el repositorio "bebidas-del-peru-app"**
5. **Configurar:**
   - **Project Name:** bebidas-del-peru-app-frontend
   - **Framework Preset:** Next.js (debe detectarse automáticamente)
   - **Root Directory:** BDP-FRONT
   - **Environment Variables:**
     - `NEXT_PUBLIC_API_URL`: `https://api.bebidasdelperuapp.com`
     - `NEXT_PUBLIC_APP_NAME`: `Bebidas del Perú App`
     - `NODE_ENV`: `production`
6. **Click "Deploy"**

### Opción 2: CLI de Vercel

```bash
# 1. Instalar Vercel CLI
npm install -g vercel

# 2. Desde el directorio BDP-FRONT
cd BDP-FRONT

# 3. Deploy
vercel

# 4. Seguir las instrucciones (permitir git, seleccionar proyecto, etc.)
```

## 📋 Checklist antes de Deploy

- [ ] No hay archivos `.env.local` en el repo (agregado a .gitignore)
- [ ] `npm run build` compila sin errores
- [ ] `npm run lint` no muestra errores críticos
- [ ] Todas las rutas API usan `NEXT_PUBLIC_API_URL`
- [ ] No hay console.log() en código de producción
- [ ] Las variables de entorno están configuradas en Vercel
- [ ] El `.gitignore` está configurado correctamente
- [ ] El `README.md` tiene instrucciones claras

## 🔐 Variables de Entorno Importantes

**NUNCA** commitar archivos `.env.local` o `.env.production.local`

Las variables sensibles se configuran en Vercel Dashboard:
- Settings → Environment Variables

Para desarrollo local, usar `.env.local` con valores locales.

## 📊 Monitoreo Post-Deploy

Una vez deployado:

1. **Analytics**: Dashboard de Vercel → Analytics
2. **Logs**: Vercel → Functions (si hay API routes)
3. **Performance**: Vercel → Analytics → Performance
4. **Errors**: Vercel → Deployments → Logs

## 🐛 Troubleshooting

### Error: "Cannot find module"

```bash
# Limpiar y reinstalar
rm -rf node_modules .next
npm install
npm run build
```

### Error: "API URL not found"

Verificar que `.env.local` o variables de Vercel tengan `NEXT_PUBLIC_API_URL`

### Build falla en Vercel pero funciona localmente

1. Verificar Node.js version: `node --version`
2. Verificar npm version: `npm --version`
3. En Vercel Settings, ajustar Node.js version si es necesario

### Login no funciona después del deploy

Verificar que `NEXT_PUBLIC_API_URL` apunte a la URL correcta del backend en Vercel.

## 📝 Cambios después del Deploy

Cada vez que hagas un push a `main`:

```bash
git add .
git commit -m "Descripción del cambio"
git push origin main
```

Vercel detectará el cambio y redesplegará automáticamente.

---

**Versión**: 1.0.0
**Última actualización**: Enero 2026
