// Servicio de Autenticación
import { API_CONFIG, getCurrentConfig, buildApiUrl } from '../config/api.config';
import { Usuario } from '../types/usuarios';

const currentConfig = getCurrentConfig();

// Tipos
export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    usuario: Usuario;
  };
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  error?: string;
}

// Endpoints
const AUTH_ENDPOINTS = {
  LOGIN: '/login',
  LOGOUT: '/logout',
  ME: '/me',
  VALIDATE_TOKEN: '/validate-token',
  CHANGE_PASSWORD: '/change-password',
};

/**
 * Login - Autenticar usuario
 */
export const login = async (credentials: LoginDto): Promise<LoginResponse> => {
  const url = buildApiUrl(AUTH_ENDPOINTS.LOGIN);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔐 [login] Intentando login para usuario:', credentials.username);
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
      body: JSON.stringify(credentials),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: LoginResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error HTTP: ${response.status}`);
    }

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [login] Login exitoso para usuario:', data.data?.usuario.username);
    }

    return data;
  } catch (error: any) {
    console.error('❌ [login] Error en login:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Logout - Cerrar sesión
 */
export const logout = async (): Promise<AuthResponse> => {
  const url = buildApiUrl(AUTH_ENDPOINTS.LOGOUT);
  const token = localStorage.getItem('token');

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔓 [logout] Cerrando sesión');
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
        'Authorization': token ? `Bearer ${token}` : '',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: AuthResponse = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [logout] Sesión cerrada exitosamente');
    }

    return data;
  } catch (error: any) {
    console.error('❌ [logout] Error en logout:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Validar token
 */
export const validateToken = async (token: string): Promise<AuthResponse> => {
  const url = buildApiUrl(AUTH_ENDPOINTS.VALIDATE_TOKEN);

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔍 [validateToken] Validando token');
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
        'Authorization': `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: AuthResponse = await response.json();

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [validateToken] Token válido');
    }

    return data;
  } catch (error: any) {
    console.error('❌ [validateToken] Error validando token:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Cambiar contraseña
 */
export const changePassword = async (
  username: string,
  passwordActual: string,
  passwordNueva: string,
  passwordConfirmar: string
): Promise<AuthResponse> => {
  const url = buildApiUrl(AUTH_ENDPOINTS.CHANGE_PASSWORD);
  const token = localStorage.getItem('token');

  if (currentConfig.LOG_REQUESTS) {
    console.log('🔑 [changePassword] Cambiando contraseña para:', username);
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
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: JSON.stringify({
        username,
        password_actual: passwordActual,
        password_nueva: passwordNueva,
        password_confirmar: passwordConfirmar,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data: AuthResponse = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error HTTP: ${response.status}`);
    }

    if (currentConfig.LOG_REQUESTS) {
      console.log('✅ [changePassword] Contraseña cambiada exitosamente');
    }

    return data;
  } catch (error: any) {
    console.error('❌ [changePassword] Error cambiando contraseña:', error);
    if (error.name === 'AbortError') {
      throw new Error('La solicitud ha excedido el tiempo de espera');
    }
    throw error;
  }
};

/**
 * Guardar sesión en localStorage
 */
export const guardarSesion = (token: string, usuario: Usuario): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('sessionTimestamp', new Date().getTime().toString());

    if (currentConfig.LOG_REQUESTS) {
      console.log('💾 [guardarSesion] Sesión guardada en localStorage');
    }
  }
};

/**
 * Obtener sesión desde localStorage
 */
export const obtenerSesion = (): {
  token: string | null;
  usuario: Usuario | null;
} => {
  if (typeof window === 'undefined') {
    return { token: null, usuario: null };
  }

  const token = localStorage.getItem('token');
  const usuarioJSON = localStorage.getItem('usuario');

  let usuario: Usuario | null = null;
  if (usuarioJSON) {
    try {
      usuario = JSON.parse(usuarioJSON);
    } catch {
      usuario = null;
    }
  }

  return { token, usuario };
};

/**
 * Limpiar sesión
 */
export const limpiarSesion = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('sessionTimestamp');

    if (currentConfig.LOG_REQUESTS) {
      console.log('🧹 [limpiarSesion] Sesión limpiada');
    }
  }
};

/**
 * Verificar si hay sesión activa
 */
export const tieneSesion = (): boolean => {
  const { token } = obtenerSesion();
  return !!token;
};

/**
 * Obtener usuario de la sesión
 */
export const obtenerUsuarioActual = (): Usuario | null => {
  const { usuario } = obtenerSesion();
  return usuario || null;
};

/**
 * Obtener token de la sesión
 */
export const obtenerToken = (): string | null => {
  const { token } = obtenerSesion();
  return token || null;
};
