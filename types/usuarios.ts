// Tipos de usuario
export type TipoUsuario = 'administrativo' | 'operativo';

// Roles de usuario
export type Rol = 
  | 'vendedor_mayorista'    // Solo acceso app móvil
  | 'vendedor_minorista'    // Solo acceso app móvil
  | 'despacho'              // Solo acceso app móvil
  | 'jefe_ventas'           // Dashboard
  | 'jefe_despacho'         // Dashboard
  | 'ceo';                  // Todos los accesos

// Interface para Usuario
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  password?: string; // Opcional porque no se devuelve en las consultas
  tipo_usuario: TipoUsuario;
  rol: Rol;
  activo: boolean;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Interface para crear un usuario (sin ID)
export interface CreateUsuarioDto {
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  tipo_usuario: TipoUsuario;
  rol: Rol;
}

// Interface para actualizar un usuario
export interface UpdateUsuarioDto {
  nombre?: string;
  apellido?: string;
  username?: string;
  password?: string;
  tipo_usuario?: TipoUsuario;
  rol?: Rol;
  activo?: boolean;
}

// Configuración de roles
export interface RolConfig {
  label: string;
  tipo_usuario: TipoUsuario;
  descripcion: string;
  acceso: string;
}

// Mapeo de roles con sus configuraciones
export const ROLES_CONFIG: Record<Rol, RolConfig> = {
  vendedor_mayorista: {
    label: 'Vendedor Mayorista',
    tipo_usuario: 'operativo',
    descripcion: 'Vendedor de productos mayoristas',
    acceso: 'App Móvil'
  },
  vendedor_minorista: {
    label: 'Vendedor Minorista',
    tipo_usuario: 'operativo',
    descripcion: 'Vendedor de productos minoristas',
    acceso: 'App Móvil'
  },
  despacho: {
    label: 'Despacho',
    tipo_usuario: 'operativo',
    descripcion: 'Personal de despacho y logística',
    acceso: 'App Móvil'
  },
  jefe_ventas: {
    label: 'Jefe de Ventas',
    tipo_usuario: 'administrativo',
    descripcion: 'Gestión y supervisión de ventas',
    acceso: 'Dashboard'
  },
  jefe_despacho: {
    label: 'Jefe de Despacho',
    tipo_usuario: 'administrativo',
    descripcion: 'Gestión y supervisión de despacho',
    acceso: 'Dashboard'
  },
  ceo: {
    label: 'CEO',
    tipo_usuario: 'administrativo',
    descripcion: 'Acceso completo al sistema',
    acceso: 'Todos'
  }
};

// Función helper para obtener roles por tipo de usuario
export const getRolesByTipoUsuario = (tipoUsuario: TipoUsuario): Rol[] => {
  return Object.entries(ROLES_CONFIG)
    .filter(([_, config]) => config.tipo_usuario === tipoUsuario)
    .map(([rol]) => rol as Rol);
};

// Función helper para obtener el label de un rol
export const getRolLabel = (rol: Rol): string => {
  return ROLES_CONFIG[rol]?.label || rol;
};

// Función helper para obtener el tipo de usuario de un rol
export const getTipoUsuarioFromRol = (rol: Rol): TipoUsuario => {
  return ROLES_CONFIG[rol]?.tipo_usuario || 'operativo';
};
