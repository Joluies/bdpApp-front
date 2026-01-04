// =====================================================
// EJEMPLO DE USO DEL SISTEMA DE ROLES Y PERMISOS
// =====================================================

import React, { useState, useEffect } from 'react';
import {
  Button,
  Table,
  Modal,
  Text,
  Badge,
  Loading,
  Tooltip,
  Grid,
} from '@nextui-org/react';
import {
  obtenerRoles,
  obtenerPermisos,
  asignarRolUsuario,
  obtenerPermisosUsuario,
} from '@/services/usuarios-api.service';
import { Usuario, RolData, Permiso } from '@/types/usuarios';

interface GestorRolesProps {
  usuario: Usuario;
  onRolAsignado?: () => void;
}

/**
 * Componente ejemplo para gestionar roles y permisos
 * Muestra:
 * - Cómo cargar roles
 * - Cómo asignar roles
 * - Cómo verificar permisos
 * - Cómo mostrar información de permisos
 */
export const GestorRolesEjemplo = ({ usuario, onRolAsignado }: GestorRolesProps) => {
  const [roles, setRoles] = useState<RolData[]>([]);
  const [permisos, setPermisos] = useState<Permiso[]>([]);
  const [usuarioPermisos, setUsuarioPermisos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  // 1️⃣ Cargar roles y permisos al montar
  useEffect(() => {
    cargarDatos();
  }, [usuario.id]);

  const cargarDatos = async () => {
    try {
      setLoading(true);
      const [rolesData, permisosData, usuarioPermisosData] = await Promise.all([
        obtenerRoles(),
        obtenerPermisos(),
        obtenerPermisosUsuario(usuario.id),
      ]);

      setRoles(rolesData);
      setPermisos(permisosData);
      setUsuarioPermisos(usuarioPermisosData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // 2️⃣ Asignar un rol al usuario
  const handleAsignarRol = async (roleId: number) => {
    try {
      setLoading(true);
      await asignarRolUsuario(usuario.id, roleId);
      await cargarDatos();
      setModalOpen(false);
      onRolAsignado?.();
    } catch (error) {
      console.error('Error asignando rol:', error);
    } finally {
      setLoading(false);
    }
  };

  // 3️⃣ Verificar si usuario tiene permiso
  const tienePermiso = (nombrePermiso: string): boolean => {
    return usuarioPermisos.includes(nombrePermiso);
  };

  // 4️⃣ Obtener color según permiso
  const getColorPermiso = (tiene: boolean) => {
    return tiene ? 'success' : 'default';
  };

  const rolActual = usuario.roles?.[0];

  return (
    <>
      {/* Tarjeta de rol actual */}
      <div style={{ marginBottom: '20px' }}>
        <Text h3>Rol Actual del Usuario</Text>
        {rolActual ? (
          <Grid.Container gap={2}>
            <Grid xs={12} sm={6}>
              <div style={{ padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px', width: '100%' }}>
                <Text weight="bold">Nombre del Rol: {rolActual.nombre}</Text>
                <Text size="sm" color="warning">
                  {rolActual.descripcion}
                </Text>
                <Text size="sm">
                  Tipo: <Badge color="primary">{rolActual.tipo_usuario}</Badge>
                </Text>
              </div>
            </Grid>
            <Grid xs={12} sm={6}>
              <Button
                color="primary"
                onClick={() => setModalOpen(true)}
                disabled={loading}
              >
                Cambiar Rol
              </Button>
            </Grid>
          </Grid.Container>
        ) : (
          <Text color="warning">No hay rol asignado</Text>
        )}
      </div>

      {/* Tabla de permisos del usuario */}
      <div style={{ marginTop: '30px' }}>
        <Text h3>Permisos del Usuario</Text>
        {loading ? (
          <Loading />
        ) : usuarioPermisos.length > 0 ? (
          <Table
            css={{ height: 'auto' }}
            bordered
            shadow={false}
            color="primary"
            striped
          >
            <Table.Header>
              <Table.Column>Permiso</Table.Column>
              <Table.Column>Descripción</Table.Column>
              <Table.Column>Estado</Table.Column>
            </Table.Header>
            <Table.Body>
              {permisos.map((permiso) => {
                const tiene = tienePermiso(permiso.nombre);
                return (
                  <Table.Row key={permiso.id}>
                    <Table.Cell>{permiso.nombre}</Table.Cell>
                    <Table.Cell>{permiso.descripcion}</Table.Cell>
                    <Table.Cell>
                      <Badge color={getColorPermiso(tiene)}>
                        {tiene ? '✓ Tiene acceso' : '✗ Sin acceso'}
                      </Badge>
                    </Table.Cell>
                  </Table.Row>
                );
              })}
            </Table.Body>
          </Table>
        ) : (
          <Text color="warning">Sin permisos asignados</Text>
        )}
      </div>

      {/* Modal para asignar rol */}
      <Modal
        closeButton
        blur
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        width="600px"
      >
        <Modal.Header>
          <Text id="modal-title" b size={18}>
            Asignar Rol a: {usuario.nombre} {usuario.apellido}
          </Text>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <Loading />
          ) : (
            <div>
              <Text weight="bold" size="sm">
                Roles Disponibles:
              </Text>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                {roles.map((rol) => (
                  <div
                    key={rol.id}
                    style={{
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      backgroundColor: rolActual?.id === rol.id ? '#e6f2ff' : '#fff',
                      borderColor: rolActual?.id === rol.id ? '#0070f3' : '#ddd',
                    }}
                    onClick={() => handleAsignarRol(rol.id)}
                  >
                    <Text weight="bold">{rol.nombre}</Text>
                    <Text size="sm" color="warning">
                      {rol.descripcion}
                    </Text>
                    {rolActual?.id === rol.id && (
                      <Badge color="success" size="sm">
                        Actual
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat color="error" onPress={() => setModalOpen(false)}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// =====================================================
// EJEMPLO 2: Verificar permisos antes de mostrar componente
// =====================================================

interface BotonConPermisoProps {
  permiso: string;
  usuario: Usuario;
  children: React.ReactNode;
  [key: string]: any;
}

/**
 * Componente que solo muestra un botón si el usuario tiene el permiso
 */
export const BotonConPermiso = ({
  permiso,
  usuario,
  children,
  ...buttonProps
}: BotonConPermisoProps) => {
  const tienePermiso = usuario.permisos?.includes(permiso);

  if (!tienePermiso) {
    return (
      <Tooltip color="error" content={`No tiene permiso: ${permiso}`}>
        <div>
          <Button disabled {...buttonProps}>
            {children}
          </Button>
        </div>
      </Tooltip>
    );
  }

  return <Button {...buttonProps}>{children}</Button>;
};

// =====================================================
// EJEMPLO 3: Proteger secciones del dashboard
// =====================================================

interface SeccionProtegidaProps {
  permisosRequeridos: string[];
  usuario: Usuario;
  children: React.ReactNode;
  requireAll?: boolean; // true = requiere todos, false = requiere al menos uno
}

/**
 * Componente que solo muestra contenido si usuario tiene los permisos requeridos
 */
export const SeccionProtegida = ({
  permisosRequeridos,
  usuario,
  children,
  requireAll = false,
}: SeccionProtegidaProps) => {
  const userPermisos = usuario.permisos || [];

  const tieneAcceso = requireAll
    ? permisosRequeridos.every((p) => userPermisos.includes(p))
    : permisosRequeridos.some((p) => userPermisos.includes(p));

  if (!tieneAcceso) {
    return (
      <Text color="error" h3>
        ❌ No tiene permisos para acceder a esta sección
      </Text>
    );
  }

  return <>{children}</>;
};

// =====================================================
// EJEMPLO 4: Uso en página del dashboard
// =====================================================

/**
 * Página de ejemplo mostrando cómo usar todo junto
 */
export const EjemploPaginaDashboard = ({ usuarioLogueado }: { usuarioLogueado: Usuario }) => {
  return (
    <div style={{ padding: '20px' }}>
      {/* Encabezado */}
      <Text h2>Dashboard - Gestión de Roles y Permisos</Text>

      {/* Sección 1: Información del usuario */}
      <SeccionProtegida
        permisosRequeridos={['ver_usuarios']}
        usuario={usuarioLogueado}
      >
        <div style={{ marginBottom: '30px' }}>
          <Text h3>Información del Usuario</Text>
          <Text>Usuario actual: {usuarioLogueado.nombre} {usuarioLogueado.apellido}</Text>
          <Text>Username: {usuarioLogueado.username}</Text>
          <Text>
            Rol: <Badge>{usuarioLogueado.roles?.[0]?.nombre}</Badge>
          </Text>
        </div>
      </SeccionProtegida>

      {/* Sección 2: Gestión de usuarios (solo para admin) */}
      <SeccionProtegida
        permisosRequeridos={['crear_usuarios']}
        usuario={usuarioLogueado}
        requireAll={true}
      >
        <div style={{ marginBottom: '30px' }}>
          <Text h3>Gestión de Usuarios</Text>

          {/* Botones con permisos */}
          <Grid.Container gap={1}>
            <Grid xs={12} sm={3}>
              <BotonConPermiso
                permiso="crear_usuarios"
                usuario={usuarioLogueado}
                color="primary"
              >
                ➕ Crear Usuario
              </BotonConPermiso>
            </Grid>
            <Grid xs={12} sm={3}>
              <BotonConPermiso
                permiso="editar_usuarios"
                usuario={usuarioLogueado}
                color="warning"
              >
                ✏️ Editar Usuario
              </BotonConPermiso>
            </Grid>
            <Grid xs={12} sm={3}>
              <BotonConPermiso
                permiso="eliminar_usuarios"
                usuario={usuarioLogueado}
                color="error"
              >
                🗑️ Eliminar Usuario
              </BotonConPermiso>
            </Grid>
            <Grid xs={12} sm={3}>
              <BotonConPermiso
                permiso="asignar_roles"
                usuario={usuarioLogueado}
                color="success"
              >
                👥 Asignar Roles
              </BotonConPermiso>
            </Grid>
          </Grid.Container>
        </div>
      </SeccionProtegida>

      {/* Sección 3: Datos de ventas */}
      <SeccionProtegida
        permisosRequeridos={['ver_ventas']}
        usuario={usuarioLogueado}
      >
        <div style={{ marginBottom: '30px' }}>
          <Text h3>Ventas</Text>
          {/* Contenido de ventas aquí */}
          <Text>Acceso a datos de ventas habilitado ✓</Text>
        </div>
      </SeccionProtegida>

      {/* Sección 4: Datos de reparto */}
      <SeccionProtegida
        permisosRequeridos={['ver_reparto']}
        usuario={usuarioLogueado}
      >
        <div style={{ marginBottom: '30px' }}>
          <Text h3>Reparto</Text>
          {/* Contenido de reparto aquí */}
          <Text>Acceso a datos de reparto habilitado ✓</Text>
        </div>
      </SeccionProtegida>

      {/* Sección 5: Gestor de roles */}
      <SeccionProtegida
        permisosRequeridos={['asignar_roles']}
        usuario={usuarioLogueado}
      >
        <div>
          <Text h3>Gestor de Roles</Text>
          <GestorRolesEjemplo
            usuario={usuarioLogueado}
            onRolAsignado={() => console.log('Rol asignado')}
          />
        </div>
      </SeccionProtegida>
    </div>
  );
};

// =====================================================
// EJEMPLO 5: Hook personalizado para verificar permisos
// =====================================================

/**
 * Hook para verificar permisos de forma rápida
 */
export const usePermiso = (usuario: Usuario, permiso: string): boolean => {
  return usuario.permisos?.includes(permiso) || false;
};

/**
 * Hook para verificar múltiples permisos
 */
export const usePermisos = (
  usuario: Usuario,
  permisos: string[],
  requireAll: boolean = false
): boolean => {
  if (!usuario.permisos) return false;

  if (requireAll) {
    return permisos.every((p) => usuario.permisos?.includes(p));
  }

  return permisos.some((p) => usuario.permisos?.includes(p));
};

// Uso:
// const puedeVer = usePermiso(usuario, 'ver_ventas');
// const puedeGestionar = usePermisos(usuario, ['crear_usuarios', 'editar_usuarios']);
