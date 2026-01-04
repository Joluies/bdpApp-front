import React, { useState, useEffect } from 'react';
import {
   Table,
   Button,
   Tooltip,
   Text,
   Badge,
   Input,
   Loading,
   Modal,
   Spacer,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Usuario, TipoUsuario, Rol, getRolLabel, ROLES_CONFIG } from '../../types/usuarios';
import { getUsuarios, deleteUsuario, ApiResponse } from '../../services/usuarios-api.service';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import { EyeIcon } from '../icons/table/eye-icon';
import { SearchIcon } from '../icons/searchicon';

interface Props {
   onEdit?: (usuario: Usuario) => void;
   onRefresh?: () => void;
}

export const UsuariosTable = ({ onEdit, onRefresh }: Props) => {
   const [usuarios, setUsuarios] = useState<Usuario[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string>('');
   
   // Estados para paginación de la API
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalUsuarios, setTotalUsuarios] = useState(0);
   const [perPage, setPerPage] = useState(10);

   // Estados para búsqueda y filtros
   const [searchTerm, setSearchTerm] = useState('');
   const [filtroTipo, setFiltroTipo] = useState<TipoUsuario | 'todos'>('todos');
   const [filtroRol, setFiltroRol] = useState<Rol | 'todos'>('todos');

   // Estado para modal de confirmación de eliminación
   const [deleteModalOpen, setDeleteModalOpen] = useState(false);
   const [usuarioToDelete, setUsuarioToDelete] = useState<Usuario | null>(null);
   const [deleting, setDeleting] = useState(false);

   // Cargar usuarios desde la API
   const cargarUsuarios = async (page: number = 1) => {
      setLoading(true);
      setError('');
      
      console.log('🔄 Cargando usuarios página:', page);
      
      try {
         const response: ApiResponse<Usuario> = await getUsuarios(page);
         console.log('✅ Usuarios cargados:', response.data);
         
         setUsuarios(response.data);
         setCurrentPage(response.meta.current_page);
         setTotalPages(response.meta.last_page);
         setTotalUsuarios(response.meta.total);
         setPerPage(response.meta.per_page);
      } catch (error: any) {
         console.error('❌ Error al cargar usuarios:', error);
         setError(error.message || 'Error al cargar los usuarios');
         setUsuarios([]);
      } finally {
         setLoading(false);
      }
   };

   useEffect(() => {
      cargarUsuarios(1);
   }, []);

   // Función para recargar datos (llamada desde el componente padre)
   useEffect(() => {
      if (onRefresh) {
         cargarUsuarios(currentPage);
      }
   }, [onRefresh]);

   // Filtrar usuarios localmente (búsqueda y filtros)
   const usuariosFiltrados = usuarios.filter(usuario => {
      // Filtro de búsqueda
      const matchSearch = searchTerm === '' || 
         usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
         usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
         usuario.username.toLowerCase().includes(searchTerm.toLowerCase());

      // Filtro por tipo de usuario
      const matchTipo = filtroTipo === 'todos' || usuario.tipo_usuario === filtroTipo;

      // Filtro por rol
      const matchRol = filtroRol === 'todos' || usuario.roles?.some((r) => r.nombre === filtroRol);

      return matchSearch && matchTipo && matchRol;
   });

   // Función para cambiar página
   const cambiarPagina = (page: number) => {
      if (page >= 1 && page <= totalPages) {
         cargarUsuarios(page);
      }
   };

   // Handlers
   const handleEdit = (usuario: Usuario) => {
      console.log('Editar usuario:', usuario);
      if (onEdit) {
         onEdit(usuario);
      }
   };

   const handleDeleteClick = (usuario: Usuario) => {
      setUsuarioToDelete(usuario);
      setDeleteModalOpen(true);
   };

   const handleDeleteConfirm = async () => {
      if (!usuarioToDelete) return;

      setDeleting(true);
      try {
         await deleteUsuario(usuarioToDelete.id);
         console.log('✅ Usuario eliminado exitosamente');
         
         // Recargar la página actual
         await cargarUsuarios(currentPage);
         
         setDeleteModalOpen(false);
         setUsuarioToDelete(null);
      } catch (error: any) {
         console.error('❌ Error al eliminar usuario:', error);
         alert(`Error al eliminar usuario: ${error.message}`);
      } finally {
         setDeleting(false);
      }
   };

   const handleView = (usuario: Usuario) => {
      console.log('Ver detalles del usuario:', usuario);
      // Aquí podrías abrir un modal de detalles
   };

   // Renderizar celda
   const renderCell = (usuario: Usuario, columnKey: React.Key) => {
      switch (columnKey) {
         case 'nombre':
            return (
               <Flex direction="column">
                  <Text css={{ fontSize: '$sm', fontWeight: '$semibold', color: '#034F32' }}>
                     {usuario.nombre} {usuario.apellido}
                  </Text>
                  <Text css={{ fontSize: '$xs', color: '$accents7' }}>
                     @{usuario.username}
                  </Text>
               </Flex>
            );

         case 'tipo_usuario':
            return (
               <Badge 
                  color={usuario.tipo_usuario === 'administrativo' ? 'primary' : 'secondary'}
                  variant="flat"
               >
                  {usuario.tipo_usuario === 'administrativo' ? 'Administrativo' : 'Operativo'}
               </Badge>
            );

         case 'rol':
            const rolPrimario = usuario.roles?.[0];
            const rolConfig = rolPrimario ? (ROLES_CONFIG as any)[rolPrimario.nombre] : (ROLES_CONFIG as any)['vendedor'];
            return (
               <Flex direction="column">
                  <Text css={{ fontSize: '$sm', fontWeight: '$semibold' }}>
                     {rolConfig.label}
                  </Text>
                  <Text css={{ fontSize: '$xs', color: '$accents7' }}>
                     {rolConfig.acceso}
                  </Text>
               </Flex>
            );

         case 'estado':
            return (
               <Badge 
                  color={usuario.activo ? 'success' : 'error'}
                  variant="dot"
               >
                  {usuario.activo ? 'Activo' : 'Inactivo'}
               </Badge>
            );

         case 'acciones':
            return (
               <Flex justify="center" align="center" css={{ gap: '$6' }}>
                  <Tooltip content="Ver detalles" color="primary">
                     <Button
                        auto
                        light
                        color="primary"
                        icon={<EyeIcon size={20} fill="#979797" />}
                        onClick={() => handleView(usuario)}
                     />
                  </Tooltip>
                  <Tooltip content="Editar usuario" color="warning">
                     <Button
                        auto
                        light
                        color="warning"
                        icon={<EditIcon size={20} fill="#979797" />}
                        onClick={() => handleEdit(usuario)}
                     />
                  </Tooltip>
                  <Tooltip content="Eliminar usuario" color="error">
                     <Button
                        auto
                        light
                        color="error"
                        icon={<DeleteIcon size={20} fill="#FF0080" />}
                        onClick={() => handleDeleteClick(usuario)}
                     />
                  </Tooltip>
               </Flex>
            );

         default:
            return null;
      }
   };

   if (loading) {
      return (
         <Flex justify="center" align="center" css={{ minHeight: '400px' }}>
            <Loading size="xl" color="success">
               Cargando usuarios...
            </Loading>
         </Flex>
      );
   }

   if (error) {
      return (
         <Flex direction="column" justify="center" align="center" css={{ minHeight: '400px', gap: '$8' }}>
            <Text h3 color="error">
               {error}
            </Text>
            <Button 
               color="success" 
               onClick={() => cargarUsuarios(1)}
            >
               Reintentar
            </Button>
         </Flex>
      );
   }

   return (
      <>
         {/* Filtros y búsqueda */}
         <Flex 
            justify="between" 
            align="center" 
            css={{ mb: '$8', flexWrap: 'wrap', gap: '$6' }}
         >
            <Flex css={{ gap: '$4', flexWrap: 'wrap', flex: 1 }}>
               <Input
                  clearable
                  placeholder="Buscar por nombre o usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  contentLeft={<SearchIcon />}
                  css={{ minWidth: '250px' }}
               />
               
               <select
                  value={filtroTipo}
                  onChange={(e) => setFiltroTipo(e.target.value as TipoUsuario | 'todos')}
                  style={{
                     padding: '8px 12px',
                     borderRadius: '12px',
                     border: '2px solid #e1e1e1',
                     fontSize: '14px',
                     minWidth: '150px',
                  }}
               >
                  <option value="todos">Todos los tipos</option>
                  <option value="administrativo">Administrativo</option>
                  <option value="operativo">Operativo</option>
               </select>

               <select
                  value={filtroRol}
                  onChange={(e) => setFiltroRol(e.target.value as Rol | 'todos')}
                  style={{
                     padding: '8px 12px',
                     borderRadius: '12px',
                     border: '2px solid #e1e1e1',
                     fontSize: '14px',
                     minWidth: '180px',
                  }}
               >
                  <option value="todos">Todos los roles</option>
                  {Object.entries(ROLES_CONFIG).map(([key, config]) => (
                     <option key={key} value={key}>
                        {config.label}
                     </option>
                  ))}
               </select>
            </Flex>

            <Text css={{ fontSize: '$sm', color: '$accents7' }}>
               Total: {totalUsuarios} usuarios
            </Text>
         </Flex>

         {/* Tabla de usuarios */}
         <Table
            aria-label="Tabla de usuarios"
            css={{
               height: 'auto',
               minWidth: '100%',
            }}
            color="success"
            shadow={false}
            bordered
         >
            <Table.Header>
               <Table.Column key="nombre">NOMBRE</Table.Column>
               <Table.Column key="tipo_usuario">TIPO</Table.Column>
               <Table.Column key="rol">ROL</Table.Column>
               <Table.Column key="estado">ESTADO</Table.Column>
               <Table.Column key="acciones" align="center">ACCIONES</Table.Column>
            </Table.Header>
            <Table.Body>
               {usuariosFiltrados.length === 0 ? (
                  <Table.Row key="empty">
                     <Table.Cell>
                        <Text>No se encontraron usuarios</Text>
                     </Table.Cell>
                     <Table.Cell>{'-'}</Table.Cell>
                     <Table.Cell>{'-'}</Table.Cell>
                     <Table.Cell>{'-'}</Table.Cell>
                     <Table.Cell>{'-'}</Table.Cell>
                  </Table.Row>
               ) : (
                  usuariosFiltrados.map((usuario) => (
                     <Table.Row key={usuario.id}>
                        <Table.Cell>{renderCell(usuario, 'nombre')}</Table.Cell>
                        <Table.Cell>{renderCell(usuario, 'tipo_usuario')}</Table.Cell>
                        <Table.Cell>{renderCell(usuario, 'rol')}</Table.Cell>
                        <Table.Cell>{renderCell(usuario, 'estado')}</Table.Cell>
                        <Table.Cell>{renderCell(usuario, 'acciones')}</Table.Cell>
                     </Table.Row>
                  ))
               )}
            </Table.Body>
            <Table.Pagination
               shadow
               noMargin
               align="center"
               rowsPerPage={perPage}
               page={currentPage}
               total={totalPages}
               onPageChange={cambiarPagina}
            />
         </Table>

         {/* Modal de confirmación de eliminación */}
         <Modal
            closeButton
            aria-labelledby="delete-modal"
            open={deleteModalOpen}
            onClose={() => !deleting && setDeleteModalOpen(false)}
         >
            <Modal.Header>
               <Text h3>Confirmar Eliminación</Text>
            </Modal.Header>
            <Modal.Body>
               <Text>
                  ¿Está seguro que desea eliminar al usuario{' '}
                  <strong>
                     {usuarioToDelete?.nombre} {usuarioToDelete?.apellido}
                  </strong>{' '}
                  (@{usuarioToDelete?.username})?
               </Text>
               <Spacer y={0.5} />
               <Text color="error" size="$sm">
                  Esta acción no se puede deshacer.
               </Text>
            </Modal.Body>
            <Modal.Footer>
               <Button 
                  auto 
                  flat 
                  color="default"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleting}
               >
                  Cancelar
               </Button>
               <Button 
                  auto 
                  color="error"
                  onClick={handleDeleteConfirm}
                  disabled={deleting}
               >
                  {deleting ? <Loading size="xs" /> : 'Eliminar'}
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   );
};
