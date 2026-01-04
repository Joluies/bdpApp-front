// Servicio para API de usuarios
import { API_CONFIG, getCurrentConfig, buildApiUrl } from '../config/api.config';
import {
  Usuario,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  TipoUsuario,
  Rol,
  RolData,
  Permiso,
  getRolLabel,
  AsignarRolDto,
} from '../types/usuarios';

// Detectar entorno de desarrollo
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Obtener configuración actual
const currentConfig = getCurrentConfig();

// Interfaces para la respuesta de la API con paginación
export interface ApiLink {
  url: string | null;
  label: string;
  page?: number | null;
  active: boolean;
}

export interface ApiMeta {
  current_page: number;
  from: number;
  last_page: number;
  links: ApiLink[];
  path: string;
  per_page: number;
  to: number;
  total: number;
}

export interface ApiResponse<T> {
  data: T[];
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: ApiMeta;
}

// Response para operaciones individuales
export interface ApiSingleResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Endpoints de usuarios
const USUARIOS_ENDPOINTS = {
  LIST: '/usuarios',              // GET - Listar usuarios (con paginación)
  CREATE: '/usuarios/create',     // POST - Crear usuario
  UPDATE: '/usuarios',            // PUT - Actualizar usuario (requiere ID en query)
  DELETE: '/usuarios',            // DELETE - Eliminar usuario (requiere ID en query)
  GET_BY_ID: '/usuarios',         // GET - Obtener usuario por ID
};

// Endpoints de roles
const ROLES_ENDPOINTS = {
  LIST: '/roles',                 // GET - Listar todos los roles
  CREATE: '/roles',               // POST - Crear rol
  UPDATE: '/roles',               // PUT - Actualizar rol
  DELETE: '/roles',               // DELETE - Eliminar rol
  GET_BY_ID: '/roles',            // GET - Obtener rol por ID
  PERMISOS: '/permisos',          // GET - Obtener todos los permisos
  CREAR_PERMISO: '/permisos',     // POST - Crear permiso
  ASIGNAR_ROL: '/usuarios',       // POST - Asignar rol a usuario
  ROLES_USUARIO: '/usuarios',     // GET - Obtener roles de usuario
  PERMISOS_USUARIO: '/usuarios',  // GET - Obtener permisos de usuario
  INICIALIZAR: '/inicializar-datos', // POST - Inicializar datos predeterminados
};

/**
 * Servicio para listar usuarios con paginación
 * @param page Número de página (opcional)
 * @returns Promise con los usuarios paginados
 */
export const getUsuarios = async (page: number = 1): Promise<ApiResponse<Usuario>> => {
  const url = buildApiUrl(`${USUARIOS_ENDPOINTS.LIST}?page=${page}`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔍 [getUsuarios] Solicitando usuarios página:', page);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: ApiResponse<Usuario> = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [getUsuarios] Usuarios obtenidos exitosamente:', {
        total: data.meta.total,
        pagina_actual: data.meta.current_page,
        por_pagina: data.meta.per_page,
        usuarios_en_pagina: data.data.length,
      });
    }

    return data;
  } catch (error: any) {
    console.error('❌ [getUsuarios] Error al obtener usuarios:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para obtener un usuario por ID
 * @param id ID del usuario
 * @returns Promise con el usuario
 */
export const getUsuarioById = async (id: number): Promise<Usuario> => {
  const url = buildApiUrl(`${USUARIOS_ENDPOINTS.GET_BY_ID}/${id}`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔍 [getUsuarioById] Obteniendo usuario con ID:', id);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const result: ApiSingleResponse<Usuario> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Usuario no encontrado');
    }

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [getUsuarioById] Usuario obtenido exitosamente:', result.data);
    }

    return result.data;
  } catch (error: any) {
    console.error('❌ [getUsuarioById] Error al obtener usuario:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para crear un nuevo usuario
 * @param usuario Datos del usuario a crear
 * @returns Promise con el usuario creado
 */
export const createUsuario = async (usuario: CreateUsuarioDto): Promise<Usuario> => {
  const url = buildApiUrl(USUARIOS_ENDPOINTS.CREATE);

  if (currentConfig.LOG_REQUESTS) {
    console.log('📤 [createUsuario] Creando usuario:', {
      username: usuario.username,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      tipo_usuario: usuario.tipo_usuario,
      rol: usuario.rol,
    });
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(usuario),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const result: ApiSingleResponse<Usuario> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Error al crear usuario');
    }

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [createUsuario] Usuario creado exitosamente:', result.data);
    }

    return result.data;
  } catch (error: any) {
    console.error('❌ [createUsuario] Error al crear usuario:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para actualizar un usuario existente
 * @param id ID del usuario a actualizar
 * @param usuario Datos a actualizar
 * @returns Promise con el usuario actualizado
 */
export const updateUsuario = async (
  id: number,
  usuario: UpdateUsuarioDto
): Promise<Usuario> => {
  const url = buildApiUrl(`${USUARIOS_ENDPOINTS.UPDATE}?id=${id}`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('📝 [updateUsuario] Actualizando usuario ID:', id);
    console.log('📡 URL:', url);
    console.log('📦 Datos:', usuario);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(usuario),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const result: ApiSingleResponse<Usuario> = await response.json();

    if (!result.success || !result.data) {
      throw new Error(result.error || 'Error al actualizar usuario');
    }

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [updateUsuario] Usuario actualizado exitosamente:', result.data);
    }

    return result.data;
  } catch (error: any) {
    console.error('❌ [updateUsuario] Error al actualizar usuario:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para eliminar un usuario
 * @param id ID del usuario a eliminar
 * @returns Promise con el resultado de la operación
 */
export const deleteUsuario = async (id: number): Promise<boolean> => {
  const url = buildApiUrl(`${USUARIOS_ENDPOINTS.DELETE}?id=${id}`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🗑️ [deleteUsuario] Eliminando usuario ID:', id);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const result: ApiSingleResponse<null> = await response.json();

    if (!result.success) {
      throw new Error(result.error || 'Error al eliminar usuario');
    }

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [deleteUsuario] Usuario eliminado exitosamente');
    }

    return true;
  } catch (error: any) {
    console.error('❌ [deleteUsuario] Error al eliminar usuario:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para buscar usuarios por nombre o username
 * @param searchTerm Término de búsqueda
 * @returns Promise con los usuarios que coinciden
 */
export const searchUsuarios = async (searchTerm: string): Promise<Usuario[]> => {
  const url = buildApiUrl(`${USUARIOS_ENDPOINTS.LIST}?search=${encodeURIComponent(searchTerm)}`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔍 [searchUsuarios] Buscando usuarios con término:', searchTerm);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const data: ApiResponse<Usuario> = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [searchUsuarios] Usuarios encontrados:', data.data.length);
    }

    return data.data;
  } catch (error: any) {
    console.error('❌ [searchUsuarios] Error al buscar usuarios:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

// ======================== FUNCIONES DE ROLES ========================

/**
 * Servicio para obtener todos los roles
 * @returns Promise con la lista de roles
 */
export const obtenerRoles = async (): Promise<RolData[]> => {
  const url = buildApiUrl(ROLES_ENDPOINTS.LIST);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔍 [obtenerRoles] Obteniendo todos los roles');
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const roles: RolData[] = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [obtenerRoles] Roles obtenidos exitosamente:', roles.length);
    }

    return Array.isArray(roles) ? roles : [];
  } catch (error: any) {
    console.error('❌ [obtenerRoles] Error al obtener roles:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para obtener un rol específico con sus permisos
 * @param roleId ID del rol
 * @returns Promise con el rol y sus permisos
 */
export const obtenerRolPorId = async (roleId: number): Promise<RolData> => {
  const url = buildApiUrl(`${ROLES_ENDPOINTS.GET_BY_ID}/${roleId}`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔍 [obtenerRolPorId] Obteniendo rol con ID:', roleId);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const rol: RolData = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [obtenerRolPorId] Rol obtenido exitosamente:', rol);
    }

    return rol;
  } catch (error: any) {
    console.error('❌ [obtenerRolPorId] Error al obtener rol:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para obtener todos los permisos disponibles
 * @returns Promise con la lista de permisos
 */
export const obtenerPermisos = async (): Promise<Permiso[]> => {
  const url = buildApiUrl(ROLES_ENDPOINTS.PERMISOS);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔍 [obtenerPermisos] Obteniendo todos los permisos');
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const permisos: Permiso[] = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [obtenerPermisos] Permisos obtenidos exitosamente:', permisos.length);
    }

    return Array.isArray(permisos) ? permisos : [];
  } catch (error: any) {
    console.error('❌ [obtenerPermisos] Error al obtener permisos:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para crear un nuevo rol
 * @param rol Datos del rol a crear
 * @returns Promise con el rol creado
 */
export const crearRol = async (rol: Omit<RolData, 'id'>): Promise<RolData> => {
  const url = buildApiUrl(ROLES_ENDPOINTS.CREATE);

  if (currentConfig.LOG_REQUESTS) {
    console.log('📤 [crearRol] Creando rol:', rol.nombre);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(rol),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const resultado: RolData = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [crearRol] Rol creado exitosamente:', resultado);
    }

    return resultado;
  } catch (error: any) {
    console.error('❌ [crearRol] Error al crear rol:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para actualizar un rol
 * @param roleId ID del rol a actualizar
 * @param rol Datos a actualizar
 * @returns Promise con el rol actualizado
 */
export const actualizarRol = async (
  roleId: number,
  rol: Partial<RolData>
): Promise<RolData> => {
  const url = buildApiUrl(`${ROLES_ENDPOINTS.UPDATE}/${roleId}`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('📝 [actualizarRol] Actualizando rol ID:', roleId);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(rol),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const resultado: RolData = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [actualizarRol] Rol actualizado exitosamente:', resultado);
    }

    return resultado;
  } catch (error: any) {
    console.error('❌ [actualizarRol] Error al actualizar rol:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para eliminar un rol
 * @param roleId ID del rol a eliminar
 * @returns Promise con el resultado de la operación
 */
export const eliminarRol = async (roleId: number): Promise<boolean> => {
  const url = buildApiUrl(`${ROLES_ENDPOINTS.DELETE}/${roleId}`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🗑️ [eliminarRol] Eliminando rol ID:', roleId);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [eliminarRol] Rol eliminado exitosamente');
    }

    return true;
  } catch (error: any) {
    console.error('❌ [eliminarRol] Error al eliminar rol:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para asignar un rol a un usuario
 * @param userId ID del usuario
 * @param roleId ID del rol a asignar
 * @returns Promise con el usuario actualizado
 */
export const asignarRolUsuario = async (userId: number, roleId: number): Promise<Usuario> => {
  const url = buildApiUrl(`${ROLES_ENDPOINTS.ASIGNAR_ROL}/${userId}/roles`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('📤 [asignarRolUsuario] Asignando rol', roleId, 'al usuario', userId);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ role_id: roleId }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [asignarRolUsuario] Rol asignado exitosamente');
    }

    return result.user || result.data || result;
  } catch (error: any) {
    console.error('❌ [asignarRolUsuario] Error al asignar rol:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para obtener los roles de un usuario
 * @param userId ID del usuario
 * @returns Promise con los roles del usuario
 */
export const obtenerRolesUsuario = async (userId: number): Promise<RolData[]> => {
  const url = buildApiUrl(`${ROLES_ENDPOINTS.ROLES_USUARIO}/${userId}/roles`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔍 [obtenerRolesUsuario] Obteniendo roles del usuario:', userId);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const roles: RolData[] = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [obtenerRolesUsuario] Roles obtenidos:', roles.length);
    }

    return Array.isArray(roles) ? roles : [];
  } catch (error: any) {
    console.error('❌ [obtenerRolesUsuario] Error al obtener roles:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para obtener los permisos de un usuario
 * @param userId ID del usuario
 * @returns Promise con los permisos del usuario
 */
export const obtenerPermisosUsuario = async (userId: number): Promise<string[]> => {
  const url = buildApiUrl(`${ROLES_ENDPOINTS.PERMISOS_USUARIO}/${userId}/permisos`);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔍 [obtenerPermisosUsuario] Obteniendo permisos del usuario:', userId);
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json();
    const permisos = result.permisos || [];

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [obtenerPermisosUsuario] Permisos obtenidos:', permisos.length);
    }

    return Array.isArray(permisos) ? permisos : [];
  } catch (error: any) {
    console.error('❌ [obtenerPermisosUsuario] Error al obtener permisos:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Servicio para inicializar datos predeterminados (roles y permisos)
 * @returns Promise con el resultado de la operación
 */
export const inicializarDatos = async (): Promise<any> => {
  const url = buildApiUrl(ROLES_ENDPOINTS.INICIALIZAR);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🚀 [inicializarDatos] Inicializando datos predeterminados');
    console.log('📡 URL:', url);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error HTTP: ${response.status}`);
    }

    const result = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [inicializarDatos] Datos inicializados exitosamente:', result);
    }

    return result;
  } catch (error: any) {
    console.error('❌ [inicializarDatos] Error al inicializar datos:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};
