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
   Radio,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Cliente, TipoCliente, ClienteMayorista, ClienteMinorista } from '../../types/clientes';
import { ClienteAPIReal, TelefonoAPI, clientesApiService, RespuestaClientesAPI } from '../../services/clientes-api.service';
import { EditIcon } from '../icons/table/edit-icon';
import { DeleteIcon } from '../icons/table/delete-icon';
import { EyeIcon } from '../icons/table/eye-icon';

interface Props {
   apiConnected?: boolean | null;
   tipoCliente?: TipoCliente | string;
}

export const ClientesTable = ({ apiConnected, tipoCliente }: Props) => {
   const [clientes, setClientes] = useState<ClienteAPIReal[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string>('');
   const [searchTerm, setSearchTerm] = useState('');
   
   // Estados para paginación de API
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [totalClientes, setTotalClientes] = useState(0);
   const [perPage, setPerPage] = useState(10);

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
         
         console.log('🔄 Iniciando carga de clientes de página', currentPage);
         
         try {
            // Cargar clientes con paginación de API
            const respuesta: RespuestaClientesAPI = await clientesApiService.obtenerClientesConPaginacion(currentPage);
            
            console.log('✅ Clientes cargados:', respuesta.data);
            console.log('📊 Página actual:', respuesta.meta.current_page);
            console.log('📈 Total de páginas:', respuesta.meta.last_page);
            console.log('📊 Total de clientes:', respuesta.meta.total);
            
            setClientes(respuesta.data || []);
            setTotalPages(respuesta.meta?.last_page || 1);
            setTotalClientes(respuesta.meta?.total || 0);
            setPerPage(respuesta.meta?.per_page || 10);
         } catch (error: any) {
            console.error('❌ Error al cargar clientes:', error);
            console.error('❌ Error message:', error.message);
            console.error('❌ Error stack:', error.stack);
            
            // Diagnosticar tipo de error
            let mensajeError = 'Error al cargar los clientes';
            
            if (error.message?.includes('CORS') || error.message?.includes('blocked')) {
               mensajeError = '🔒 Error CORS: No se puede conectar con el servidor. Verifica que el servidor está corriendo y que CORS está habilitado.';
            } else if (error.message?.includes('network') || error.message?.includes('Failed to fetch')) {
               mensajeError = '🌐 Error de red: No se puede alcanzar el servidor. Verifica la conexión a internet y la URL de la API.';
            } else if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
               mensajeError = '⏱️ Timeout: El servidor tardó demasiado en responder. Intenta de nuevo.';
            } else if (error.message?.includes('404') || error.message?.includes('not found')) {
               mensajeError = '❌ Endpoint no encontrado (404). Verifica que la URL de la API es correcta.';
            } else if (error.message?.includes('500') || error.message?.includes('server error')) {
               mensajeError = '❌ Error del servidor (500). El servidor reportó un error interno.';
            } else {
               mensajeError = error.message || 'Error desconocido al cargar los clientes';
            }
            
            setError(mensajeError);
            setClientes([]);
         } finally {
            setLoading(false);
         }
      };

      if (apiConnected !== false) {
         cargarClientes();
      } else {
         setLoading(false);
      }
   }, [apiConnected, currentPage]);

   // Función para recargar datos
   const recargarDatos = async () => {
      setCurrentPage(1); // Volver a la primera página
   };

   // Función para cambiar página
   const cambiarPagina = (page: number) => {
      if (page >= 1 && page <= totalPages) {
         setCurrentPage(page);
         // Scroll al inicio de la tabla
         window.scrollTo({ top: 0, behavior: 'smooth' });
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
         
         // Crear FormData para enviar datos con archivos
         const formData = new FormData();
         
         // Agregar datos básicos
         formData.append('tipoCliente', editandoCliente.tipoCliente);
         formData.append('nombre', editandoCliente.nombre || '');
         formData.append('apellidos', editandoCliente.apellidos || '');
         formData.append('direccion', editandoCliente.direccion || '');
         
         // Agregar DNI y RUC siempre - el vendedor puede cambiar el tipo de cliente
         // El controlador maneja correctamente ambos campos
         if (editandoCliente.dni) {
            formData.append('dni', editandoCliente.dni);
         }
         if (editandoCliente.ruc) {
            formData.append('ruc', editandoCliente.ruc);
         }
         if (editandoCliente.razonSocial || editandoCliente.razon_social) {
            formData.append('razonSocial', editandoCliente.razonSocial || editandoCliente.razon_social || '');
         }
         
         // Agregar teléfonos si existen
         if (editandoCliente.telefonos && editandoCliente.telefonos.length > 0) {
            editandoCliente.telefonos.forEach((tel, index) => {
               formData.append(`telefonos[${index}][number]`, tel.number || tel.numero || '');
               formData.append(`telefonos[${index}][description]`, tel.description || '');
            });
         }
         
         // TODO: Agregar soporte para fotos y coordenadas aquí
         // formData.append('fotosFachada', file);
         // formData.append('coordenadas[latitud]', lat);
         // formData.append('coordenadas[longitud]', lng);
         
         await clientesApiService.actualizarClienteConFotosYCoordenadas(
            editandoCliente.idCliente.toString(),
            formData
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
         case 'codigoCliente':
            return (
               <Text css={{ fontSize: '$sm', fontWeight: '$semibold' }}>
                  {cliente.codigoCliente || cliente.idCliente}
               </Text>
            );

         case 'dni':
            return (
               <Text css={{ fontSize: '$sm' }}>
                  {cliente.dni || '-'}
               </Text>
            );

         case 'nombreApellido':
            return (
               <Text css={{ fontSize: '$sm', fontWeight: '$semibold', color: '#034F32' }}>
                  {`${cliente.nombre || ''} ${cliente.apellidos || ''}`.trim() || '-'}
               </Text>
            );

         case 'ruc':
            return (
               <Text css={{ fontSize: '$sm' }}>
                  {cliente.ruc || '-'}
               </Text>
            );

         case 'razonSocial':
            return (
               <Text css={{ fontSize: '$sm' }}>
                  {cliente.razonSocial || cliente.razon_social || '-'}
               </Text>
            );

         case 'direccion':
            return (
               <Text css={{ fontSize: '$sm', maxWidth: '250px' }}>
                  {cliente.direccion || '-'}
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

         case 'distrito':
            return (
               <Text css={{ fontSize: '$sm' }}>
                  {cliente.distrito || cliente.distritio || '-'}
               </Text>
            );

         case 'tipoCliente':
            return (
               <Badge 
                  color={cliente.tipoCliente === 'Mayorista' ? 'primary' : 'success'}
                  variant="flat"
                  size="sm"
               >
                  {cliente.tipoCliente}
               </Badge>
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

   const columnas = [
      { name: 'Cód. Cliente', uid: 'codigoCliente' },
      { name: 'DNI', uid: 'dni' },
      { name: 'Nombre y Apellido', uid: 'nombreApellido' },
      { name: 'RUC', uid: 'ruc' },
      { name: 'Razón Social', uid: 'razonSocial' },
      { name: 'Dirección', uid: 'direccion' },
      { name: 'Distrito', uid: 'distrito' },
      { name: 'Teléfonos', uid: 'telefonos' },
      { name: 'Tipo Cliente', uid: 'tipoCliente' },
      { name: 'Acciones', uid: 'acciones' },
   ];

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
            <Flex direction="column" css={{ gap: '$3', mb: '$4' }}>
               <Flex justify="between" align="center">
                  <Text h4 css={{ color: '#034F32' }}>
                     Clientes {` (${totalClientes})`}
                  </Text>
                  <Flex css={{ gap: '$2' }}>
                     <Text css={{ fontSize: '$sm', color: '$accents7' }}>
                        Página {currentPage} de {totalPages}
                     </Text>
                     <Button auto flat color="success" size="sm" onPress={() => setCurrentPage(1)}>
                        🔄 Actualizar
                     </Button>
                  </Flex>
               </Flex>
               
               {/* Buscador local (nota: esto es búsqueda en los 10 items de la página actual) */}
               <Input
                  fullWidth
                  clearable
                  bordered
                  placeholder="🔍 Buscar en esta página por nombre, DNI, RUC, código, dirección o distrito..."
                  value={searchTerm}
                  onChange={(e) => {
                     setSearchTerm(e.target.value);
                  }}
                  css={{ width: '100%' }}
                  size="lg"
               />
               
               {/* Información de resultados */}
               <Flex justify="between" align="center">
                  <Text css={{ fontSize: '$sm', color: '$accents7' }}>
                     Mostrando clientes {(currentPage - 1) * perPage + 1} al {Math.min(currentPage * perPage, totalClientes)} de {totalClientes} clientes
                  </Text>
                  <Text css={{ fontSize: '$xs', color: '$accents7' }}>
                     {perPage} clientes por página
                  </Text>
               </Flex>
            </Flex>
         )}

         {/* Tabla */}
         {!loading && !error && (
            <Table
               aria-label="Tabla de Clientes"
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
               {clientes.map((item) => (
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
               
               {/* Mostrar números de página inteligentemente */}
               {Array.from({ length: Math.min(totalPages, 10) }, (_, index) => {
                  let page: number = 0;
                  if (totalPages <= 10) {
                     // Si hay 10 o menos páginas, mostrar todas
                     page = index + 1;
                  } else if (currentPage <= 5) {
                     // Si estamos en las primeras 5 páginas, mostrar 1-10
                     page = index + 1;
                  } else if (currentPage > totalPages - 5) {
                     // Si estamos en las últimas 5 páginas, mostrar últimas 10
                     page = totalPages - 9 + index;
                  } else {
                     // Si estamos en el medio, mostrar 5 antes y 5 después
                     page = currentPage - 5 + index;
                  }
                  
                  return (
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
                  );
               })}
               
               {totalPages > 10 && currentPage < totalPages - 4 && (
                  <>
                     <Text>...</Text>
                     <Button
                        auto
                        flat
                        color="default"
                        size="sm"
                        onPress={() => cambiarPagina(totalPages)}
                        css={{ minWidth: '40px' }}
                     >
                        {totalPages}
                     </Button>
                  </>
               )}
               
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
                  Página {currentPage} de {totalPages} | Total: {totalClientes} clientes
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
                  No hay clientes registrados en esta página.
                  <br />
                  Intenta navegar a otra página.
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
                        <Text>{clienteSeleccionado.created_at ? new Date(clienteSeleccionado.created_at).toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' }) : '-'}</Text>
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
                     {/* SELECTOR DE TIPO DE CLIENTE */}
                     <Flex direction="column" css={{ gap: '$2' }}>
                        <Text size={14} weight="bold">Tipo de Cliente</Text>
                        <Text size={12} css={{ color: '$accents7' }}>
                           El vendedor determina el tipo de cliente. Puedes asignar DNI o RUC a cualquier tipo.
                        </Text>
                        <Flex css={{ gap: '$4' }}>
                           <Radio
                              label="Mayorista"
                              value="Mayorista"
                              checked={editandoCliente.tipoCliente === 'Mayorista'}
                              onChange={(e) => actualizarCampoEdicion('tipoCliente', (e.target as HTMLInputElement).value)}
                              color="success"
                           />
                           <Radio
                              label="Minorista"
                              value="Minorista"
                              checked={editandoCliente.tipoCliente === 'Minorista'}
                              onChange={(e) => actualizarCampoEdicion('tipoCliente', (e.target as HTMLInputElement).value)}
                              color="success"
                           />
                           <Radio
                              label="Independiente"
                              value="Independiente"
                              checked={editandoCliente.tipoCliente === 'Independiente'}
                              onChange={(e) => actualizarCampoEdicion('tipoCliente', (e.target as HTMLInputElement).value)}
                              color="success"
                           />
                        </Flex>
                     </Flex>

                     {/* TODOS LOS CAMPOS - Flexibles según lo que ingrese el vendedor */}
                     <Flex direction="column" css={{ gap: '$1' }}>
                        <Text size={14} weight="bold">DNI (Opcional)</Text>
                        <Input
                           fullWidth
                           bordered
                           value={editandoCliente.dni || ''}
                           onChange={(e) => actualizarCampoEdicion('dni', e.target.value)}
                           placeholder="12345678"
                        />
                     </Flex>

                     <Flex direction="column" css={{ gap: '$1' }}>
                        <Text size={14} weight="bold">RUC (Opcional)</Text>
                        <Input
                           fullWidth
                           bordered
                           value={editandoCliente.ruc || ''}
                           onChange={(e) => actualizarCampoEdicion('ruc', e.target.value)}
                           placeholder="11123456789"
                        />
                     </Flex>

                     <Flex direction="column" css={{ gap: '$1' }}>
                        <Text size={14} weight="bold">Nombres (Opcional)</Text>
                        <Input
                           fullWidth
                           bordered
                           value={editandoCliente.nombre || ''}
                           onChange={(e) => actualizarCampoEdicion('nombre', e.target.value)}
                           placeholder="Juan"
                        />
                     </Flex>

                     <Flex direction="column" css={{ gap: '$1' }}>
                        <Text size={14} weight="bold">Apellidos (Opcional)</Text>
                        <Input
                           fullWidth
                           bordered
                           value={editandoCliente.apellidos || ''}
                           onChange={(e) => actualizarCampoEdicion('apellidos', e.target.value)}
                           placeholder="Pérez García"
                        />
                     </Flex>

                     <Flex direction="column" css={{ gap: '$1' }}>
                        <Text size={14} weight="bold">Razón Social (Opcional)</Text>
                        <Input
                           fullWidth
                           bordered
                           value={editandoCliente.razonSocial || editandoCliente.razon_social || ''}
                           onChange={(e) => actualizarCampoEdicion('razonSocial', e.target.value)}
                           placeholder="Nombre de la empresa"
                        />
                     </Flex>

                     {/* Añadir Foto de Fachada */}
                     <Flex direction="column" css={{ gap: '$1' }}>
                        <Text size={14} weight="bold">Añadir Foto de Fachada</Text>
                        <Button
                           auto
                           color="success"
                           css={{ width: '60px', height: '60px', p: 0 }}
                           onPress={() => {
                              // Aquí va la lógica para agregar foto
                              console.log('Agregar foto de fachada');
                           }}
                        >
                           +
                        </Button>
                     </Flex>

                     <Flex direction="column" css={{ gap: '$1' }}>
                        <Text size={14} weight="bold">Dirección</Text>
                        <Input
                           fullWidth
                           bordered
                           value={editandoCliente.direccion || ''}
                           onChange={(e) => actualizarCampoEdicion('direccion', e.target.value)}
                           placeholder="Calle principal 123"
                        />
                     </Flex>

                     {/* Campos de Teléfono - Array dinámico */}
                     <Flex direction="column" css={{ gap: '$2' }}>
                        <Text size={14} weight="bold">Teléfonos</Text>
                        {editandoCliente.telefonos && editandoCliente.telefonos.length > 0 ? (
                           <Flex direction="column" css={{ gap: '$2', width: '100%' }}>
                              {editandoCliente.telefonos.map((tel, index) => (
                                 <Grid.Container gap={1} key={index} justify="flex-start">
                                    <Grid xs={12} sm={6}>
                                       <Input
                                          fullWidth
                                          bordered
                                          label="Número"
                                          placeholder="(51) 123456789"
                                          value={tel.number || tel.numero || ''}
                                          onChange={(e) => {
                                             const newTelefonos = [...editandoCliente.telefonos];
                                             newTelefonos[index] = {
                                                ...newTelefonos[index],
                                                number: e.target.value,
                                                numero: e.target.value
                                             };
                                             actualizarCampoEdicion('telefonos', newTelefonos);
                                          }}
                                       />
                                    </Grid>
                                    <Grid xs={12} sm={6}>
                                       <Input
                                          fullWidth
                                          bordered
                                          label="Tipo/Descripción"
                                          placeholder="Casa, Personal, Tienda..."
                                          value={tel.description || ''}
                                          onChange={(e) => {
                                             const newTelefonos = [...editandoCliente.telefonos];
                                             newTelefonos[index] = {
                                                ...newTelefonos[index],
                                                description: e.target.value
                                             };
                                             actualizarCampoEdicion('telefonos', newTelefonos);
                                          }}
                                       />
                                    </Grid>
                                 </Grid.Container>
                              ))}
                           </Flex>
                        ) : (
                           <Text css={{ fontSize: '$sm', color: '$accents7' }}>
                              Sin teléfonos registrados
                           </Text>
                        )}
                     </Flex>

                     {/* Añadir Ubicación */}
                     <Flex direction="column" css={{ gap: '$1' }}>
                        <Text size={14} weight="bold">Ubicación</Text>
                        <Button
                           auto
                           flat
                           color="default"
                           css={{ justifyContent: 'flex-start', width: '100%' }}
                           onPress={() => {
                              // Aquí va la lógica para agregar ubicación
                              console.log('Agregar ubicación');
                           }}
                        >
                           📍 Añadir Ubicación
                        </Button>
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