import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth.context';

/**
 * Hook para proteger rutas que requieren autenticación
 * Redirige a login si no está autenticado
 */
export const useProtectedRoute = (): boolean => {
  const router = useRouter();
  const { autenticado, cargando } = useAuth();

  useEffect(() => {
    // Si aún está cargando, no hacer nada
    if (cargando) {
      return;
    }

    // Si no está autenticado, redirigir a login
    if (!autenticado) {
      console.log('🔒 [useProtectedRoute] Usuario no autenticado, redirigiendo a login');
      router.push('/login');
    }
  }, [autenticado, cargando, router]);

  // Retornar true si está autenticado, false si no
  return autenticado && !cargando;
};

/**
 * Hook para proteger rutas que requieren permisos específicos
 * Redirige a /unauthorized si no tiene los permisos
 */
export const usePermisosRoute = (
  permisosRequeridos: string[],
  requireAll: boolean = false
): boolean => {
  const router = useRouter();
  const { usuario, cargando } = useAuth();

  useEffect(() => {
    if (cargando) {
      return;
    }

    if (!usuario) {
      router.push('/login');
      return;
    }

    const userPermisos = usuario.permisos || [];

    const tieneAcceso = requireAll
      ? permisosRequeridos.every((p) => userPermisos.includes(p as any))
      : permisosRequeridos.some((p) => userPermisos.includes(p as any));

    if (!tieneAcceso) {
      console.log('🔒 [usePermisosRoute] Usuario sin permisos requeridos');
      router.push('/unauthorized');
    }
  }, [usuario, cargando, router, permisosRequeridos, requireAll]);

  const userPermisos = usuario?.permisos || [];
  const tieneAcceso = requireAll
    ? permisosRequeridos.every((p) => userPermisos.includes(p as any))
    : permisosRequeridos.some((p) => userPermisos.includes(p as any));

  return tieneAcceso && !cargando;
};

/**
 * Hook para proteger rutas que requieren ser admin
 */
export const useAdminRoute = (): boolean => {
  const router = useRouter();
  const { usuario, cargando } = useAuth();

  useEffect(() => {
    if (cargando) {
      return;
    }

    if (!usuario) {
      router.push('/login');
      return;
    }

    const esAdmin = usuario.roles?.[0]?.nombre === 'admin';

    if (!esAdmin) {
      console.log('🔒 [useAdminRoute] Usuario no es admin');
      router.push('/unauthorized');
    }
  }, [usuario, cargando, router]);

  const esAdmin = usuario?.roles?.[0]?.nombre === 'admin';
  return esAdmin && !cargando;
};
