# 🍹 Bebidas del Perú - Frontend Dashboard

Dashboard administrativo para la gestión de ventas, pedidos, clientes y despacho de Bebidas del Perú.

## 🚀 Características

- ✅ **Autenticación segura** con roles y permisos
- ✅ **Dashboard administrativo** con gráficos y estadísticas
- ✅ **Gestión de usuarios** con control de roles
- ✅ **Gestión de productos** con categorías
- ✅ **Gestión de clientes** mayoristas y detallistas
- ✅ **Sistema de ventas** con cálculo automático
- ✅ **Sistema de pedidos** con estados
- ✅ **Gestión de despacho** y seguimiento
- ✅ **Interfaz responsive** con NextUI
- ✅ **Tema oscuro/claro**

## 📋 Requisitos Previos

- Node.js 16+
- npm o yarn
- Backend API en ejecución (https://api.bebidasdelperuapp.com)

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/bebidas-del-peru-app.git
cd bebidas-del-peru-app/BDP-FRONT
```

### 2. Instalar dependencias

```bash
npm install
# o
yarn install
```

### 3. Configurar variables de entorno

Copiar el archivo `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Actualizar las variables según tu entorno:

```env
NEXT_PUBLIC_API_URL=https://api.bebidasdelperuapp.com
NEXT_PUBLIC_APP_NAME=Bebidas del Perú App
NODE_ENV=production
```

### 4. Ejecutar en desarrollo

```bash
npm run dev
# o
yarn dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Estructura del Proyecto

```
BDP-FRONT/
├── components/          # Componentes reutilizables
│   ├── navbar/         # Barra de navegación
│   ├── usuarios/       # Componentes de gestión de usuarios
│   └── ...
├── pages/              # Páginas de la aplicación
│   ├── _app.tsx       # App principal con AuthProvider
│   ├── index.tsx      # Dashboard
│   ├── login.tsx      # Página de login
│   ├── usuarios.tsx   # Gestión de usuarios
│   └── ...
├── services/           # Servicios API
│   ├── auth-api.service.ts
│   ├── usuarios-api.service.ts
│   └── ...
├── context/            # Context API para estado global
│   └── auth.context.tsx
├── hooks/              # Custom React hooks
│   └── useProtectedRoute.ts
├── types/              # Tipos TypeScript
└── styles/             # Estilos CSS/SCSS
```

## 🔐 Autenticación

El sistema utiliza autenticación basada en tokens con roles y permisos:

### Usuarios de prueba

| Username | Contraseña | Rol |
|----------|-----------|-----|
| admin | admin123 | Administrador |
| vendedor | vendedor123 | Vendedor |
| repartidor | repartidor123 | Repartidor |
| supervisor_ventas | supervisor123 | Supervisor Ventas |
| supervisor_reparto | supervisor123 | Supervisor Reparto |

### Flujo de autenticación

1. Usuario ingresa credenciales
2. Frontend hace POST a `/api/login`
3. Backend valida y retorna token + usuario + permisos
4. Token se almacena en localStorage
5. Se incluye en header `Authorization: Bearer {token}` en todas las peticiones

## 🛡️ Protección de Rutas

Las rutas están protegidas con diferentes niveles de seguridad:

```typescript
// Requiere autenticación básica
useProtectedRoute();

// Requiere permisos específicos
usePermisosRoute(['crear_usuario', 'editar_usuario']);

// Requiere rol de admin
useAdminRoute();
```

## 📦 Build y Deploy

### Build para producción

```bash
npm run build
npm run start
```

### Deploy en Vercel

#### Opción 1: Via GitHub (Recomendado)

1. Subir a GitHub
2. Conectar repositorio en https://vercel.com
3. Vercel detectará automáticamente Next.js
4. Configurar variables de entorno en Settings
5. Deploy automático en cada push

#### Opción 2: Via CLI de Vercel

```bash
npm install -g vercel
vercel
```

### Variables de entorno en Vercel

En el dashboard de Vercel, ir a Settings > Environment Variables y agregar:

```
NEXT_PUBLIC_API_URL=https://api.bebidasdelperuapp.com
NEXT_PUBLIC_APP_NAME=Bebidas del Perú App
NODE_ENV=production
```

## 🧪 Linting y Verificación

```bash
# Ejecutar linter
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📚 Documentación Adicional

- [Guía de Autenticación](../GUIA_INSTALACION_AUTENTICACION.md)
- [Sistema de Roles y Permisos](../RESUMEN_EJECUTIVO_AUTENTICACION.md)
- [API Backend](../bdp-backend/README.md)

## 🤝 Contribuir

1. Crear rama: `git checkout -b feature/nueva-caracteristica`
2. Commit cambios: `git commit -am 'Agregar nueva característica'`
3. Push a la rama: `git push origin feature/nueva-caracteristica`
4. Abrir Pull Request

## 📝 Licencia

Proyecto privado - Bebidas del Perú

## 📞 Soporte

Para reportar problemas o sugerencias, contactar al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última actualización:** Enero 2026
