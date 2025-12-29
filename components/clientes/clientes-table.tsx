import React, { useState, useEffect } from 'react';
import {
   Table,
   Button,
   Tooltip,
   Text,
   Badge,
   Input,
   Dropdown,
   Grid,
   Spacer,
   Card,
   Loading,
   Modal,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Cliente, TipoCliente, ClienteMayorista, ClienteMinorista } from '../../types/clientes';
import { ClienteAPIReal, TelefonoAPI, clientesApiService } from '../../services/clientes-api.service';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import { EyeIcon } from '../icons/table/eye-icon';

interface Props {
   tipoCliente: TipoCliente;
   apiConnected?: boolean | null;
}

export const ClientesTable = ({ tipoCliente, apiConnected }: Props) => {
   const [clientes, setClientes] = useState<ClienteAPIReal[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string>('');
   
   // Estados para paginación
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 6;

   // Estados para modales
   const [visibleModalDetalles, setVisibleModalDetalles] = useState(false);
   const [visibleModalEditar, setVisibleModalEditar] = useState(false);
   const [clienteSeleccionado, setClienteSeleccionado] = useState<ClienteAPIReal | null>(null);
   const [editandoCliente, setEditandoCliente] = useState<ClienteAPIReal | null>(null);
   const [loadingEdicion, setLoadingEdicion] = useState(false);

   // Cargar clientes desde la API
   useEffect(() => {
      const cargarClientes = async () => {
         setLoading(true);
         setError('');
         
         console.log('🔄 Iniciando carga de clientes tipo:', tipoCliente);
         
         try {
            const clientesData = await clientesApiService.obtenerClientesPorTipo(
               tipoCliente === TipoCliente.MAYORISTA ? 'Mayorista' : 'Minorista'
            );
            console.log('✅ Clientes cargados:', clientesData);
            setClientes(clientesData);
         } catch (error: any) {
            console.error('❌ Error al cargar clientes:', error);
            setError(error.message || 'Error al cargar los clientes');
            setClientes([]);
         } finally {
            setLoading(false);
         }
      };

      cargarClientes();
   }, [tipoCliente, apiConnected]);

   // Función para recargar datos
   const recargarDatos = async () => {
      const cargarClientes = async () => {
         setLoading(true);
         setError('');
         
         try {
            const clientesData = await clientesApiService.obtenerClientesPorTipo(
               tipoCliente === TipoCliente.MAYORISTA ? 'Mayorista' : 'Minorista'
            );
            setClientes(clientesData);
            setCurrentPage(1); // Resetear a la primera página
         } catch (error: any) {
            console.error('Error al recargar clientes:', error);
            setError(error.message || 'Error al recargar los clientes');
         } finally {
            setLoading(false);
         }
      };

      await cargarClientes();
   };

   // Cálculos de paginación
   const totalPages = Math.ceil(clientes.length / itemsPerPage);
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const clientesPaginados = clientes.slice(startIndex, endIndex);

   // Función para cambiar página
   const cambiarPagina = (page: number) => {
      if (page >= 1 && page <= totalPages) {
         setCurrentPage(page);
      }
   };

   const handleEdit = (cliente: ClienteAPIReal) => {
      console.log('Editar cliente:', cliente);
      setClienteSeleccionado(cliente);
      setEditandoCliente({ ...cliente });
      setVisibleModalEditar(true);
   };

   const handleDelete = async (cliente: ClienteAPIReal) => {
      if (window.confirm(`¿Está seguro de que desea eliminar a ${cliente.nombre}?`)) {
         try {
            await clientesApiService.eliminarCliente(cliente.idCliente.toString());
            alert('Cliente eliminado exitosamente');
            await recargarDatos();
         } catch (error: any) {
            alert(`Error al eliminar: ${error.message}`);
         }
      }
   };

   const handleView = (cliente: ClienteAPIReal) => {
      console.log('Ver detalles del cliente:', cliente);
      setClienteSeleccionado(cliente);
      setVisibleModalDetalles(true);
   };

   // Guardar cambios del cliente editado
   const guardarCambiosCliente = async () => {
      if (!editandoCliente) return;
      
      setLoadingEdicion(true);
      try {
         console.log('Guardando cambios del cliente:', editandoCliente);
         await clientesApiService.actualizarCliente(
            editandoCliente.idCliente.toString(),
            editandoCliente
         );
         alert('Cliente actualizado exitosamente');
         setVisibleModalEditar(false);
         setEditandoCliente(null);
         await recargarDatos();
      } catch (error: any) {
         alert(`Error al actualizar: ${error.message}`);
      } finally {
         setLoadingEdicion(false);
      }
   };

   // Actualizar campos del cliente siendo editado
   const actualizarCampoEdicion = (campo: string, valor: any) => {
      if (editandoCliente) {
         setEditandoCliente({
            ...editandoCliente,
            [campo]: valor
         });
      }
   };

   const renderCell = (cliente: ClienteAPIReal, columnKey: React.Key) => {
      switch (columnKey) {
         case 'identificacion':
            return (
               <Text css={{ fontSize: '$sm', fontWeight: '$semibold' }}>
                  {cliente.tipoCliente === 'Mayorista' 
                     ? cliente.ruc
                     : cliente.dni
                  }
               </Text>
            );

         case 'nombre':
            return (
               <Flex direction="column">
                  <Text css={{ fontSize: '$sm', fontWeight: '$semibold', color: '#034F32' }}>
                     {cliente.tipoCliente === 'Mayorista' 
                        ? (cliente.razonSocial || cliente.razon_social)
                        : `${cliente.nombre} ${cliente.apellidos}`
                     }
                  </Text>
                  <Text css={{ fontSize: '$xs', color: '$accents7' }}>
                     {cliente.tipoCliente === 'Mayorista' ? 'Empresa' : 'Persona Natural'}
                  </Text>
               </Flex>
            );

         case 'direccion':
            return (
               <Text css={{ fontSize: '$sm', maxWidth: '300px' }}>
                  {cliente.direccion}
               </Text>
            );

         case 'telefonos':
            return (
               <Text css={{ fontSize: '$sm' }}>
                  {cliente.telefonos && cliente.telefonos.length > 0 
                     ? cliente.telefonos.map(tel => tel.numero || tel.number || 'N/A').join(', ')
                     : 'Sin datos'
                  }
               </Text>
            );

         case 'estado':
            return (
               <Badge 
                  color="success"
                  variant="flat"
                  size="sm"
               >
                  Activo
               </Badge>
            );

         case 'fechaCreacion':
            return (
               <Text css={{ fontSize: '$sm' }}>
                  {new Date(cliente.created_at).toLocaleDateString('es-PE')}
               </Text>
            );

         case 'acciones':
            return (
               <Flex css={{ gap: '$2' }}>
                  <Tooltip content="Ver detalles" color="primary">
                     <Button 
                        auto 
                        light 
                        size="sm" 
                        css={{ minWidth: 'auto', p: '$2' }}
                        onPress={() => handleView(cliente)}
                     >
                        <EyeIcon size={16} fill="#979797" />
                     </Button>
                  </Tooltip>
                  
                  <Tooltip content="Editar cliente" color="success">
                     <Button 
                        auto 
                        light 
                        size="sm" 
                        css={{ minWidth: 'auto', p: '$2' }}
                        onPress={() => handleEdit(cliente)}
                     >
                        <EditIcon size={16} fill="#979797" />
                     </Button>
                  </Tooltip>
                  
                  <Tooltip content="Eliminar cliente" color="error">
                     <Button 
                        auto 
                        light 
                        size="sm" 
                        css={{ minWidth: 'auto', p: '$2' }}
                        onPress={() => handleDelete(cliente)}
                     >
                        <DeleteIcon size={16} fill="#FF0080" />
                     </Button>
                  </Tooltip>
               </Flex>
            );

         default:
            return <Text css={{ fontSize: '$sm' }}>-</Text>;
      }
   };

   const columnasMayorista = [
      { name: 'RUC', uid: 'identificacion' },
      { name: 'Razón Social', uid: 'nombre' },
      { name: 'Dirección', uid: 'direccion' },
      { name: 'Teléfonos', uid: 'telefonos' },
      { name: 'Estado', uid: 'estado' },
      { name: 'Fecha Registro', uid: 'fechaCreacion' },
      { name: 'Acciones', uid: 'acciones' },
   ];

   const columnasMinorista = [
      { name: 'DNI', uid: 'identificacion' },
      { name: 'Nombres y Apellidos', uid: 'nombre' },
      { name: 'Dirección', uid: 'direccion' },
      { name: 'Teléfonos', uid: 'telefonos' },
      { name: 'Estado', uid: 'estado' },
      { name: 'Fecha Registro', uid: 'fechaCreacion' },
      { name: 'Acciones', uid: 'acciones' },
   ];

   const columnas = tipoCliente === TipoCliente.MAYORISTA ? columnasMayorista : columnasMinorista;

   return (
      <Card css={{ p: '$6' }}>
         {/* Mensaje de carga */}
         {loading && (
            <Flex justify="center" align="center" css={{ py: '$10' }}>
               <Loading size="lg">Cargando clientes...</Loading>
            </Flex>
         )}

         {/* Mensaje de error */}
         {error && !loading && (
            <Card css={{ backgroundColor: '$errorLight', p: '$4', mb: '$4' }}>
               <Flex justify="between" align="center">
                  <Text css={{ color: '$error' }}>❌ {error}</Text>
                  <Button auto flat color="error" size="sm" onPress={recargarDatos}>
                     Reintentar
                  </Button>
               </Flex>
            </Card>
         )}

         {/* Header con filtros */}
         {!loading && (
            <Flex justify="between" align="center" css={{ mb: '$4' }}>
               <Text h4 css={{ color: '#034F32' }}>
                  {tipoCliente === TipoCliente.MAYORISTA 
                     ? 'Clientes Mayoristas' 
                     : 'Clientes Minoristas'}
                  {` (${clientes.length})`}
               </Text>
               <Flex css={{ gap: '$2' }}>
                  <Text css={{ fontSize: '$sm', color: '$accents7' }}>
                     Página {currentPage} de {totalPages}
                  </Text>
                  <Button auto flat color="success" size="sm" onPress={recargarDatos}>
                     🔄 Actualizar
                  </Button>
               </Flex>
            </Flex>
         )}

         {/* Tabla */}
         {!loading && !error && (
            <Table
               aria-label={`Tabla de ${tipoCliente}`}
               css={{
                  height: 'auto',
                  minWidth: '100%',
                  '& .nextui-table-header': {
                     backgroundColor: '#F1F1E9',
                  },
                  '& .nextui-table-header th': {
                     color: '#034F32',
                     fontWeight: '$semibold',
                  },
               '& .nextui-table-row:hover': {
                  backgroundColor: '#F9F9F9',
               }
            }}
            selectionMode="none"
         >
            <Table.Header columns={columnas}>
               {(column) => (
                  <Table.Column key={column.uid} align={column.uid === 'acciones' ? 'center' : 'start'}>
                     {column.name}
                  </Table.Column>
               )}
            </Table.Header>
            
            <Table.Body>
               {clientesPaginados.map((item) => (
                  <Table.Row key={item.idCliente}>
                     {(columnKey) => (
                        <Table.Cell>
                           {renderCell(item, columnKey)}
                        </Table.Cell>
                     )}
                  </Table.Row>
               ))}
            </Table.Body>
         </Table>
         )}

         {/* Controles de paginación */}
         {!loading && !error && clientes.length > 0 && totalPages > 1 && (
            <Flex justify="center" align="center" css={{ mt: '$4', gap: '$2' }}>
               <Button 
                  auto 
                  flat 
                  size="sm" 
                  disabled={currentPage === 1}
                  onPress={() => cambiarPagina(currentPage - 1)}
                  css={{ minWidth: '40px' }}
               >
                  ‹
               </Button>
               
               {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                  <Button
                     key={page}
                     auto
                     flat={page !== currentPage}
                     color={page === currentPage ? "success" : "default"}
                     size="sm"
                     onPress={() => cambiarPagina(page)}
                     css={{ 
                        minWidth: '40px',
                        backgroundColor: page === currentPage ? '#034F32' : 'transparent',
                        color: page === currentPage ? 'white' : '#034F32'
                     }}
                  >
                     {page}
                  </Button>
               ))}
               
               <Button 
                  auto 
                  flat 
                  size="sm" 
                  disabled={currentPage === totalPages}
                  onPress={() => cambiarPagina(currentPage + 1)}
                  css={{ minWidth: '40px' }}
               >
                  ›
               </Button>
            </Flex>
         )}

         {/* Información de paginación */}
         {!loading && !error && clientes.length > 0 && (
            <Flex justify="center" css={{ mt: '$2' }}>
               <Text css={{ fontSize: '$xs', color: '$accents7' }}>
                  Mostrando {startIndex + 1}-{Math.min(endIndex, clientes.length)} de {clientes.length} clientes
               </Text>
            </Flex>
         )}

         {/* Mensaje cuando API no está conectada */}
         {apiConnected === false && (
            <Flex justify="center" align="center" css={{ py: '$8' }}>
               <Text css={{ color: '$error', textAlign: 'center', fontSize: '$sm' }}>
                  ⚠️ No se puede cargar la información de clientes
                  <br />
                  La API no está disponible en este momento
               </Text>
            </Flex>
         )}

         {/* Mensaje cuando no hay clientes */}
         {!loading && !error && clientes.length === 0 && apiConnected !== false && (
            <Flex justify="center" align="center" css={{ py: '$10' }}>
               <Text css={{ color: '$accents7', textAlign: 'center' }}>
                  No hay clientes {tipoCliente} registrados aún.
                  <br />
                  ¡Agrega el primero usando el botón de arriba!
               </Text>
            </Flex>
         )}

         {/* MODAL DE DETALLES */}
         <Modal
            closeButton
            aria-labelledby="modal-detalles"
            open={visibleModalDetalles}
            onClose={() => {
               setVisibleModalDetalles(false);
               setClienteSeleccionado(null);
            }}
            width="600px"
         >
            <Modal.Header css={{ fontSize: '20px', fontWeight: '$bold' }}>
               Detalles del Cliente
            </Modal.Header>
            <Modal.Body css={{ py: '$10' }}>
               {clienteSeleccionado && (
                  <Flex direction="column" css={{ gap: '$4' }}>
                     {clienteSeleccionado.tipoCliente === 'Mayorista' ? (
                        <>
                           <Flex direction="column" css={{ gap: '$2' }}>
                              <Text size={14} color="warning" weight="bold">RUC</Text>
                              <Text>{clienteSeleccionado.ruc}</Text>
                           </Flex>
                           <Flex direction="column" css={{ gap: '$2' }}>
                              <Text size={14} color="warning" weight="bold">Razón Social</Text>
                              <Text>{clienteSeleccionado.razonSocial || clienteSeleccionado.razon_social}</Text>
                           </Flex>
                        </>
                     ) : (
                        <>
                           <Flex direction="column" css={{ gap: '$2' }}>
                              <Text size={14} color="warning" weight="bold">DNI</Text>
                              <Text>{clienteSeleccionado.dni}</Text>
                           </Flex>
                           <Flex direction="column" css={{ gap: '$2' }}>
                              <Text size={14} color="warning" weight="bold">Nombres</Text>
                              <Text>{clienteSeleccionado.nombre}</Text>
                           </Flex>
                           <Flex direction="column" css={{ gap: '$2' }}>
                              <Text size={14} color="warning" weight="bold">Apellidos</Text>
                              <Text>{clienteSeleccionado.apellidos}</Text>
                           </Flex>
                        </>
                     )}
                     
                     <Flex direction="column" css={{ gap: '$2' }}>
                        <Text size={14} color="warning" weight="bold">Dirección</Text>
                        <Text>{clienteSeleccionado.direccion}</Text>
                     </Flex>

                     <Flex direction="column" css={{ gap: '$2' }}>
                        <Text size={14} color="warning" weight="bold">Teléfonos</Text>
                        {clienteSeleccionado.telefonos && clienteSeleccionado.telefonos.length > 0 ? (
                           <Flex direction="column" css={{ gap: '$1' }}>
                              {clienteSeleccionado.telefonos.map((tel, index) => (
                                 <Text key={index}>
                                    • {tel.numero || tel.number} - {tel.description}
                                 </Text>
                              ))}
                           </Flex>
                        ) : (
                           <Text>Sin teléfonos registrados</Text>
                        )}
                     </Flex>

                     <Flex direction="column" css={{ gap: '$2' }}>
                        <Text size={14} color="warning" weight="bold">Tipo de Cliente</Text>
                        <Badge color="success" variant="flat">
                           {clienteSeleccionado.tipoCliente}
                        </Badge>
                     </Flex>

                     <Flex direction="column" css={{ gap: '$2' }}>
                        <Text size={14} color="warning" weight="bold">Fecha de Registro</Text>
                        <Text>{new Date(clienteSeleccionado.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })}</Text>
                     </Flex>
                  </Flex>
               )}
            </Modal.Body>
         </Modal>

         {/* MODAL DE EDICIÓN */}
         <Modal
            closeButton
            aria-labelledby="modal-editar"
            open={visibleModalEditar}
            onClose={() => {
               setVisibleModalEditar(false);
               setEditandoCliente(null);
            }}
            width="600px"
         >
            <Modal.Header css={{ fontSize: '20px', fontWeight: '$bold' }}>
               Editar Cliente
            </Modal.Header>
            <Modal.Body css={{ py: '$10' }}>
               {editandoCliente && (
                  <Flex direction="column" css={{ gap: '$4' }}>
                     {editandoCliente.tipoCliente === 'Mayorista' ? (
                        <>
                           <Flex direction="column" css={{ gap: '$1' }}>
                              <Text size={14} weight="bold">RUC</Text>
                              <Input
                                 fullWidth
                                 bordered
                                 value={editandoCliente.ruc || ''}
                                 onChange={(e) => actualizarCampoEdicion('ruc', e.target.value)}
                                 disabled
                              />
                           </Flex>
                           <Flex direction="column" css={{ gap: '$1' }}>
                              <Text size={14} weight="bold">Razón Social</Text>
                              <Input
                                 fullWidth
                                 bordered
                                 value={editandoCliente.razonSocial || ''}
                                 onChange={(e) => actualizarCampoEdicion('razonSocial', e.target.value)}
                              />
                           </Flex>
                        </>
                     ) : (
                        <>
                           <Flex direction="column" css={{ gap: '$1' }}>
                              <Text size={14} weight="bold">DNI</Text>
                              <Input
                                 fullWidth
                                 bordered
                                 value={editandoCliente.dni || ''}
                                 onChange={(e) => actualizarCampoEdicion('dni', e.target.value)}
                                 disabled
                              />
                           </Flex>
                           <Flex direction="column" css={{ gap: '$1' }}>
                              <Text size={14} weight="bold">Nombres</Text>
                              <Input
                                 fullWidth
                                 bordered
                                 value={editandoCliente.nombre || ''}
                                 onChange={(e) => actualizarCampoEdicion('nombre', e.target.value)}
                              />
                           </Flex>
                           <Flex direction="column" css={{ gap: '$1' }}>
                              <Text size={14} weight="bold">Apellidos</Text>
                              <Input
                                 fullWidth
                                 bordered
                                 value={editandoCliente.apellidos || ''}
                                 onChange={(e) => actualizarCampoEdicion('apellidos', e.target.value)}
                              />
                           </Flex>
                        </>
                     )}

                     <Flex direction="column" css={{ gap: '$1' }}>
                        <Text size={14} weight="bold">Dirección</Text>
                        <Input
                           fullWidth
                           bordered
                           value={editandoCliente.direccion || ''}
                           onChange={(e) => actualizarCampoEdicion('direccion', e.target.value)}
                        />
                     </Flex>
                  </Flex>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button
                  auto
                  flat
                  color="default"
                  onPress={() => {
                     setVisibleModalEditar(false);
                     setEditandoCliente(null);
                  }}
               >
                  Cancelar
               </Button>
               <Button
                  auto
                  color="success"
                  disabled={loadingEdicion}
                  onPress={guardarCambiosCliente}
               >
                  {loadingEdicion ? 'Guardando...' : 'Guardar Cambios'}
               </Button>
            </Modal.Footer>
         </Modal>
      </Card>
   );
};