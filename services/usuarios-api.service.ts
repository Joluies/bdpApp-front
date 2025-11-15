// Servicio para API de usuarios
import { API_CONFIG, getCurrentConfig, buildApiUrl } from '../config/api.config';
import {
  Usuario,
  CreateUsuarioDto,
  UpdateUsuarioDto,
  TipoUsuario,
  Rol,
  getRolLabel
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
