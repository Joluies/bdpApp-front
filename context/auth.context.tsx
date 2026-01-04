import React, { createContext, useContext, useEffect, useState } from 'react';
import { Usuario } from '../types/usuarios';
import {
  login as loginAPI,
  logout as logoutAPI,
  obtenerSesion,
  guardarSesion,
  limpiarSesion,
  tieneSesion,
  obtenerToken,
} from '../services/auth-api.service';

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  autenticado: boolean;
  cargando: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  limpiarError: () => void;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar sesión al montar el componente
  useEffect(() => {
    const cargarSesion = () => {
      const { token: tokenGuardado, usuario: usuarioGuardado } = obtenerSesion();

      if (tokenGuardado && usuarioGuardado) {
        setToken(tokenGuardado);
        setUsuario(usuarioGuardado);

        if (typeof window !== 'undefined') {
          console.log('📍 [AuthProvider] Sesión restaurada desde localStorage');
        }
      }

      setCargando(false);
    };

    if (typeof window !== 'undefined') {
      cargarSesion();
    }
  }, []);

  // Función de login
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      setCargando(true);
      setError(null);

      const response = await loginAPI({ username, password });

      if (!response.success || !response.data) {
        setError(response.error || 'Error en autenticación');
        return false;
      }

      // Guardar token y usuario
      guardarSesion(response.data.token, response.data.usuario);

      // Actualizar estado
      setToken(response.data.token);
      setUsuario(response.data.usuario);

      console.log('✅ [AuthProvider] Login exitoso');
      return true;
    } catch (err: any) {
      console.error('❌ [AuthProvider] Error en login:', err);
      const errorMessage = err.message || 'Error al conectar con el servidor';
      setError(errorMessage);
      return false;
    } finally {
      setCargando(false);
    }
  };

  // Función de logout
  const logout = async (): Promise<void> => {
    try {
      setCargando(true);

      // Llamar a API de logout
      await logoutAPI();

      // Limpiar sesión
      limpiarSesion();

      // Limpiar estado
      setToken(null);
      setUsuario(null);
      setError(null);

      console.log('✅ [AuthProvider] Logout exitoso');
    } catch (err: any) {
      console.error('⚠️ [AuthProvider] Error en logout (limpiando sesión igual):', err);
      // Igual limpiamos la sesión localmente aunque falle el API
      limpiarSesion();
      setToken(null);
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  };

  // Limpiar error
  const limpiarError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    usuario,
    token,
    autenticado: !!usuario && !!token,
    cargando,
    error,
    login,
    logout,
    limpiarError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook para usar el contexto de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }

  return context;
};

/**
 * Hook para verificar si el usuario tiene un permiso específico
 */
export const usePermiso = (permiso: string): boolean => {
  const { usuario } = useAuth();
  return usuario?.permisos?.includes(permiso) || false;
};

/**
 * Hook para verificar múltiples permisos
 */
export const usePermisos = (
  permisos: string[],
  requireAll: boolean = false
): boolean => {
  const { usuario } = useAuth();

  if (!usuario?.permisos) return false;

  if (requireAll) {
    return permisos.every((p) => usuario.permisos?.includes(p));
  }

  return permisos.some((p) => usuario.permisos?.includes(p));
};

/**
 * Hook para verificar si es admin
 */
export const useIsAdmin = (): boolean => {
  const { usuario } = useAuth();
  return usuario?.roles?.[0]?.nombre === 'admin' || false;
};
