// ==================== TIPOS BÁSICOS ====================

// Tipos de usuario
export type TipoUsuario = 'administrativo' | 'operativo';

// Roles disponibles
export type Rol = 
  | 'admin'                    // Admin - acceso total
  | 'vendedor'                 // Vendedor - app móvil ventas
  | 'repartidor'               // Repartidor - app móvil reparto
  | 'supervisor_ventas'        // Supervisor - dashboard ventas
  | 'supervisor_reparto';      // Supervisor - dashboard reparto

// Permisos disponibles
export type NombrePermiso = 
  | 'crear_usuarios'
  | 'editar_usuarios'
  | 'eliminar_usuarios'
  | 'ver_usuarios'
  | 'crear_roles'
  | 'editar_roles'
  | 'asignar_roles'
  | 'ver_ventas'
  | 'editar_ventas'
  | 'ver_pedidos'
  | 'editar_pedidos'
  | 'ver_reparto'
  | 'editar_reparto'
  | 'ver_facturacion'
  | 'editar_facturacion';

// ==================== INTERFACES ====================

// Interface para Permiso
export interface Permiso {
  id: number;
  nombre: NombrePermiso;
  descripcion?: string;
  created_at?: string;
  updated_at?: string;
}

// Interface para Rol
export interface RolData {
  id: number;
  nombre: Rol;
  descripcion?: string;
  tipo_usuario: TipoUsuario;
  permisos?: Permiso[];
  created_at?: string;
  updated_at?: string;
}

// Interface para Usuario
export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  password?: string;
  tipo_usuario: TipoUsuario;
  activo: boolean;
  roles?: RolData[];
  permisos?: NombrePermiso[];
  ultimo_acceso?: string;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
}

// Interface para crear un usuario
export interface CreateUsuarioDto {
  nombre: string;
  apellido: string;
  username: string;
  password: string;
  tipo_usuario: TipoUsuario;
  role_id?: number;
}

// Interface para actualizar un usuario
export interface UpdateUsuarioDto {
  nombre?: string;
  apellido?: string;
  username?: string;
  password?: string;
  tipo_usuario?: TipoUsuario;
  role_id?: number;
  activo?: boolean;
}

// Interface para asignar rol
export interface AsignarRolDto {
  role_id: number;
}

// ==================== CONFIGURACIÓN DE ROLES ====================

export interface RolConfig {
  label: string;
  tipo_usuario: TipoUsuario;
  descripcion: string;
  acceso: string;
  permisos?: NombrePermiso[];
}

// Mapeo de configuración de roles
export const ROLES_CONFIG: Record<Rol, RolConfig> = {
  admin: {
    label: 'Administrador',
    tipo_usuario: 'administrativo',
    descripcion: 'Acceso total al sistema',
    acceso: 'Total',
    permisos: [
      'crear_usuarios',
      'editar_usuarios',
      'eliminar_usuarios',
      'ver_usuarios',
      'crear_roles',
      'editar_roles',
      'asignar_roles',
      'ver_ventas',
      'editar_ventas',
      'ver_pedidos',
      'editar_pedidos',
      'ver_reparto',
      'editar_reparto',
      'ver_facturacion',
      'editar_facturacion'
    ]
  },
  vendedor: {
    label: 'Vendedor',
    tipo_usuario: 'operativo',
    descripcion: 'Vendedor con acceso a app móvil de ventas',
    acceso: 'App Móvil',
  },
  repartidor: {
    label: 'Repartidor',
    tipo_usuario: 'operativo',
    descripcion: 'Repartidor con acceso a app móvil de reparto',
    acceso: 'App Móvil',
  },
  supervisor_ventas: {
    label: 'Supervisor de Ventas',
    tipo_usuario: 'administrativo',
    descripcion: 'Supervisor con acceso a dashboard de ventas',
    acceso: 'Dashboard Ventas',
    permisos: [
      'ver_usuarios',
      'ver_ventas',
      'ver_pedidos',
      'ver_facturacion'
    ]
  },
  supervisor_reparto: {
    label: 'Supervisor de Reparto',
    tipo_usuario: 'administrativo',
    descripcion: 'Supervisor con acceso a dashboard de reparto',
    acceso: 'Dashboard Reparto',
    permisos: [
      'ver_usuarios',
      'ver_reparto'
    ]
  }
};

// ==================== FUNCIONES HELPER ====================

/**
 * Obtener roles disponibles por tipo de usuario
 */
export const getRolesByTipoUsuario = (tipoUsuario: TipoUsuario): Rol[] => {
  return Object.entries(ROLES_CONFIG)
    .filter(([_, config]) => config.tipo_usuario === tipoUsuario)
    .map(([rol]) => rol as Rol);
};

/**
 * Obtener etiqueta de rol
 */
export const getRolLabel = (rol: Rol): string => {
  return ROLES_CONFIG[rol]?.label || rol;
};

/**
 * Obtener descripción de rol
 */
export const getRolDescripcion = (rol: Rol): string => {
  return ROLES_CONFIG[rol]?.descripcion || '';
};

/**
 * Obtener permisos de un rol
 */
export const getPermisosDelRol = (rol: Rol): NombrePermiso[] => {
  return ROLES_CONFIG[rol]?.permisos || [];
};

/**
 * Verificar si un usuario tiene un permiso
 */
export const usuarioTienePermiso = (usuario: Usuario, permiso: NombrePermiso): boolean => {
  return usuario.permisos?.includes(permiso) || false;
};

/**
 * Obtener tipos de acceso disponibles
 */
export const getTiposAcceso = (): { label: string; value: TipoUsuario }[] => {
  return [
    { label: 'Administrativo', value: 'administrativo' },
    { label: 'Operativo', value: 'operativo' }
  ];
};

/**
 * Obtener el tipo de usuario de un rol
 */
export const getTipoUsuarioFromRol = (rol: Rol): TipoUsuario => {
  return ROLES_CONFIG[rol]?.tipo_usuario || 'operativo';
};
