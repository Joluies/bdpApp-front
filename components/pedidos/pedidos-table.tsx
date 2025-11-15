import React, { useState } from 'react';
import {
   Table,
   Card,
   Button,
   Badge,
   Modal,
   Input,
   Text,
   Row,
   Col,
   Spacer,
   Container,
   Tooltip
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Venta, EstadoVenta, TipoDocumento } from '../../types/pedidos';

// Datos simulados - en producción vendrían de una API
const ventasData: Venta[] = [
   {
      id: '1',
      numeroVenta: 'VEN-2025-001',
      fecha: '2025-11-06',
      cliente: {
         id: '1',
         tipo: 'mayorista',
         ruc: '12345678901',
         razonSocial: 'Comercial Los Andes SAC',
         direccion: 'Av. Los Andes 123',
         telefonos: ['987654321'],
         estado: 'Activo'
      },
      vendedor: {
         id: '1',
         nombres: 'Juan Carlos',
         apellidos: 'Pérez García',
         dni: '12345678',
         fechaIngreso: '2024-01-15',
         estado: 'activo'
      },
      items: [
         {
            id: '1',
            idProducto: 1,
            nombreProducto: 'Coca Cola 500ml',
            presentacion: 'Botella',
            cantidad: 24,
            precioUnitario: 2.50,
            subtotal: 60.00
         }
      ],
      subtotal: 60.00,
      igv: 10.80,
      total: 70.80,
      tipoDocumento: 'factura',
      estado: 'facturado'
   },
   {
      id: '2',
      numeroVenta: 'VEN-2025-002',
      fecha: '2025-11-06',
      fechaProgramada: '2025-11-07',
      cliente: {
         id: '2',
         tipo: 'minorista',
         dni: '87654321',
         nombres: 'María Elena',
         apellidos: 'González López',
         direccion: 'Jr. Las Flores 456',
         telefonos: ['987123456'],
         estado: 'Activo'
      },
      vendedor: {
         id: '2',
         nombres: 'Ana María',
         apellidos: 'Silva Torres',
         dni: '87654321',
         fechaIngreso: '2024-03-10',
         estado: 'activo'
      },
      items: [
         {
            id: '2',
            idProducto: 2,
            nombreProducto: 'Agua San Luis 625ml',
            presentacion: 'Botella',
            cantidad: 12,
            precioUnitario: 1.20,
            subtotal: 14.40
         }
      ],
      subtotal: 14.40,
      igv: 2.59,
      total: 16.99,
      tipoDocumento: 'boleta',
      estado: 'en_transito'
   },
   {
      id: '3',
      numeroVenta: 'VEN-2025-003',
      fecha: '2025-11-05',
      cliente: {
         id: '3',
         tipo: 'mayorista',
         ruc: '98765432101',
         razonSocial: 'Distribuidora Norte EIRL',
         direccion: 'Av. Norte 789',
         telefonos: ['987789456'],
         estado: 'Activo'
      },
      vendedor: {
         id: '1',
         nombres: 'Juan Carlos',
         apellidos: 'Pérez García',
         dni: '12345678',
         fechaIngreso: '2024-01-15',
         estado: 'activo'
      },
      items: [
         {
            id: '3',
            idProducto: 3,
            nombreProducto: 'Sprite 500ml',
            presentacion: 'Botella',
            cantidad: 36,
            precioUnitario: 2.30,
            subtotal: 82.80
         }
      ],
      subtotal: 82.80,
      igv: 14.90,
      total: 97.70,
      tipoDocumento: 'factura',
      estado: 'completado'
   }
];

export const PedidosTable = () => {
   const [ventas, setVentas] = useState<Venta[]>(ventasData);
   const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
   const [showDetalleModal, setShowDetalleModal] = useState(false);
   const [busqueda, setBusqueda] = useState('');

   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-PE', {
         style: 'currency',
         currency: 'PEN',
      }).format(amount);
   };

   const getEstadoColor = (estado: string): "primary" | "secondary" | "success" | "warning" | "error" => {
      switch (estado) {
         case 'registrado':
            return 'secondary';
         case 'facturado':
            return 'primary';
         case 'en_transito':
            return 'warning';
         case 'completado':
            return 'success';
         case 'rechazado':
            return 'error';
         default:
            return 'secondary';
      }
   };

   const getDocumentoColor = (tipo: string): "primary" | "secondary" | "success" | "warning" | "error" => {
      return tipo === 'factura' ? 'secondary' : 'primary';
   };

   const ventasFiltradas = ventas.filter(venta => {
      const matchBusqueda = !busqueda || 
         venta.numeroVenta.toLowerCase().includes(busqueda.toLowerCase()) ||
         (venta.cliente.tipo === 'mayorista' 
            ? venta.cliente.razonSocial.toLowerCase().includes(busqueda.toLowerCase())
            : `${venta.cliente.nombres} ${venta.cliente.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())) ||
         `${venta.vendedor.nombres} ${venta.vendedor.apellidos}`.toLowerCase().includes(busqueda.toLowerCase());
      
      return matchBusqueda;
   });

   const handleVerDetalle = (venta: Venta) => {
      setSelectedVenta(venta);
      setShowDetalleModal(true);
   };

   const handleAprobarPedido = (venta: Venta) => {
      // Aquí iría la lógica para aprobar el pedido
      console.log('Aprobando pedido:', venta.numeroVenta);
      // Ejemplo: cambiar estado a 'en_transito'
   };

   const handleRechazarPedido = (venta: Venta) => {
      // Aquí iría la lógica para rechazar el pedido
      console.log('Rechazando pedido:', venta.numeroVenta);
      // Ejemplo: cambiar estado a 'rechazado'
   };

   const handleEditarPedido = (venta: Venta) => {
      // Aquí iría la lógica para editar el pedido
      console.log('Editando pedido:', venta.numeroVenta);
      // Mostrar modal de edición o navegar a página de edición
   };

   const columns = [
      { key: 'numeroVenta', label: 'Número' },
      { key: 'fecha', label: 'Fecha' },
      { key: 'cliente', label: 'Cliente' },
      { key: 'vendedor', label: 'Vendedor' },
      { key: 'total', label: 'Total' },
      { key: 'documento', label: 'Documento' },
      { key: 'estado', label: 'Estado' },
      { key: 'acciones', label: 'Acciones' },
   ];

   return (
      <Container css={{ padding: 0 }}>
         <Card>
            <Card.Header>
               <Row justify="space-between" align="center">
                  <Col>
                     <Text h3 css={{ margin: 0 }}>
                        Registro de Pedidos
                     </Text>
                  </Col>
               </Row>
            </Card.Header>
            <Card.Body css={{ padding: 0 }}>
               {/* Filtro de búsqueda */}
               <Box css={{ padding: '$4' }}>
                  <Input
                     clearable
                     placeholder="Buscar por número, cliente o vendedor..."
                     value={busqueda}
                     onChange={(e) => setBusqueda(e.target.value)}
                     css={{ width: '100%', maxWidth: '400px' }}
                  />
               </Box>

               {/* Tabla */}
               <Table
                  aria-label="Tabla de ventas"
                  css={{
                     height: 'auto',
                     minWidth: '100%',
                  }}
                  selectionMode="none"
               >
                  <Table.Header>
                     {columns.map((column) => (
                        <Table.Column 
                           key={column.key}
                           css={{
                              ...(column.key === 'numeroVenta' && { width: '140px' }),
                              ...(column.key === 'fecha' && { width: '150px' }),
                              ...(column.key === 'cliente' && { width: '350px' }),
                              ...(column.key === 'vendedor' && { width: '200px' }),
                              ...(column.key === 'total' && { width: '150px' }),
                              ...(column.key === 'documento' && { width: '140px' }),
                              ...(column.key === 'estado' && { width: '140px' }),
                              ...(column.key === 'acciones' && { width: '100px', textAlign: 'center' }),
                           }}
                        >
                           {column.label}
                        </Table.Column>
                     ))}
                  </Table.Header>
                  <Table.Body>
                     {ventasFiltradas.map((venta) => (
                        <Table.Row key={venta.id}>
                           <Table.Cell>
                              <Text size={14} weight="semibold">
                                 {venta.numeroVenta}
                              </Text>
                           </Table.Cell>
                           <Table.Cell>
                              <div>
                                 <Text size={14}>
                                    {new Date(venta.fecha).toLocaleDateString('es-PE')}
                                 </Text>
                                 {venta.fechaProgramada && (
                                    <Text size={12} color="primary">
                                       Prog: {new Date(venta.fechaProgramada).toLocaleDateString('es-PE')}
                                    </Text>
                                 )}
                              </div>
                           </Table.Cell>
                           <Table.Cell>
                              <div>
                                 <Text size={14} weight="medium">
                                    {venta.cliente.tipo === 'mayorista' 
                                       ? venta.cliente.razonSocial 
                                       : `${venta.cliente.nombres} ${venta.cliente.apellidos}`}
                                 </Text>
                                 <Text size={14} color="$gray600">
                                    {venta.cliente.tipo === 'mayorista' ? venta.cliente.ruc : venta.cliente.dni}
                                 </Text>
                              </div>
                           </Table.Cell>
                           <Table.Cell>
                              <Text size={14}>
                                 {venta.vendedor.nombres} {venta.vendedor.apellidos}
                              </Text>
                           </Table.Cell>
                           <Table.Cell>
                              <Text size={14} weight="semibold">
                                 {formatCurrency(venta.total)}
                              </Text>
                           </Table.Cell>
                           <Table.Cell>
                              <Badge 
                                 size="md" 
                                 color={getDocumentoColor(venta.tipoDocumento)}
                                 variant="flat"
                              >
                                 {venta.tipoDocumento.toUpperCase()}
                              </Badge>
                           </Table.Cell>
                           <Table.Cell>
                              <Badge 
                                 size="md" 
                                 color={getEstadoColor(venta.estado)}
                                 variant="flat"
                              >
                                 {venta.estado.toUpperCase()}
                              </Badge>
                           </Table.Cell>
                           <Table.Cell>
                              <Row justify="center" align="center" css={{ gap: '$0' }}>
                                 <Tooltip content="Ver detalle">
                                    <Button
                                       light
                                       auto
                                       color="primary"
                                       icon={
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
                                          </svg>
                                       }
                                       onPress={() => handleVerDetalle(venta)}
                                    />
                                 </Tooltip>
                                 
                                 <Tooltip content="Editar pedido">
                                    <Button
                                       light
                                       auto
                                       color="warning"
                                       icon={
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M3 17.25V21H6.75L17.81 9.94L14.06 6.19L3 17.25ZM20.71 7.04C21.1 6.65 21.1 6.02 20.71 5.63L18.37 3.29C17.98 2.9 17.35 2.9 16.96 3.29L15.13 5.12L18.88 8.87L20.71 7.04Z" fill="currentColor"/>
                                          </svg>
                                       }
                                       onPress={() => handleEditarPedido(venta)}
                                    />
                                 </Tooltip>
                                 
                                 <Tooltip content="Eliminar pedido">
                                    <Button
                                       light
                                       auto
                                       color="error"
                                       icon={
                                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                             <path d="M6 19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7H6V19ZM19 4H15.5L14.5 3H9.5L8.5 4H5V6H19V4Z" fill="currentColor"/>
                                          </svg>
                                       }
                                       onPress={() => handleRechazarPedido(venta)}
                                    />
                                 </Tooltip>
                              </Row>
                           </Table.Cell>
                        </Table.Row>
                     ))}
                  </Table.Body>
               </Table>
            </Card.Body>
         </Card>

         {/* Modal para detalle de pedido */}
         <Modal
            closeButton
            aria-labelledby="modal-detalle-title"
            open={showDetalleModal}
            onClose={() => setShowDetalleModal(false)}
            width="800px"
         >
            <Modal.Header>
               <Text id="modal-detalle-title" size={18}>
                  Detalle de Pedido: {selectedVenta?.numeroVenta}
               </Text>
            </Modal.Header>
            <Modal.Body>
               {selectedVenta && (
                  <div>
                     <Text h4>Información del Pedido</Text>
                     <Text><strong>Fecha:</strong> {new Date(selectedVenta.fecha).toLocaleDateString('es-PE')}</Text>
                     <Text><strong>Cliente:</strong> {
                        selectedVenta.cliente.tipo === 'mayorista' 
                           ? selectedVenta.cliente.razonSocial 
                           : `${selectedVenta.cliente.nombres} ${selectedVenta.cliente.apellidos}`
                     }</Text>
                     <Text><strong>Vendedor:</strong> {selectedVenta.vendedor.nombres} {selectedVenta.vendedor.apellidos}</Text>
                     <Text><strong>Estado:</strong> {selectedVenta.estado.toUpperCase()}</Text>
                     <Text><strong>Total:</strong> {formatCurrency(selectedVenta.total)}</Text>
                     
                     <Spacer y={1} />
                     <Text h4>Items del Pedido</Text>
                     {selectedVenta.items.map((item, index) => (
                        <Box key={item.id || index} css={{ marginBottom: '$2' }}>
                           <Text>{item.nombreProducto} - Cantidad: {item.cantidad} - Subtotal: {formatCurrency(item.subtotal)}</Text>
                        </Box>
                     ))}
                  </div>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button auto flat onPress={() => setShowDetalleModal(false)}>
                  Cerrar
               </Button>
            </Modal.Footer>
         </Modal>
      </Container>
   );
};