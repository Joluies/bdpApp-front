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
                        <Table.Column key={column.key}>{column.label}</Table.Column>
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
                                 <Text size={12} color="$gray600">
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
                                 size="sm" 
                                 color={getDocumentoColor(venta.tipoDocumento)}
                                 variant="flat"
                              >
                                 {venta.tipoDocumento.toUpperCase()}
                              </Badge>
                           </Table.Cell>
                           <Table.Cell>
                              <Badge 
                                 size="sm" 
                                 color={getEstadoColor(venta.estado)}
                                 variant="flat"
                              >
                                 {venta.estado.toUpperCase()}
                              </Badge>
                           </Table.Cell>
                           <Table.Cell>
                              <Row justify="flex-start" align="center">
                                 <Col css={{ width: 'auto' }}>
                                    <Tooltip content="Ver detalle">
                                       <Button
                                          size="sm"
                                          color="primary"
                                          flat
                                          auto
                                          onPress={() => handleVerDetalle(venta)}
                                       >
                                          Ver
                                       </Button>
                                    </Tooltip>
                                 </Col>
                                 
                                 {/* Botones según estado del pedido */}
                                 {venta.estado === 'registrado' && (
                                    <>
                                       <Col css={{ width: 'auto' }}>
                                          <Spacer x={0.5} />
                                          <Tooltip content="Aprobar pedido">
                                             <Button
                                                size="sm"
                                                color="success"
                                                flat
                                                auto
                                                onPress={() => handleAprobarPedido(venta)}
                                             >
                                                Aprobar
                                             </Button>
                                          </Tooltip>
                                       </Col>
                                       <Col css={{ width: 'auto' }}>
                                          <Spacer x={0.5} />
                                          <Tooltip content="Rechazar pedido">
                                             <Button
                                                size="sm"
                                                color="error"
                                                flat
                                                auto
                                                onPress={() => handleRechazarPedido(venta)}
                                             >
                                                Rechazar
                                             </Button>
                                          </Tooltip>
                                       </Col>
                                    </>
                                 )}
                                 
                                 {venta.estado === 'facturado' && (
                                    <Col css={{ width: 'auto' }}>
                                       <Spacer x={0.5} />
                                       <Tooltip content="Editar pedido">
                                          <Button
                                             size="sm"
                                             color="warning"
                                             flat
                                             auto
                                             onPress={() => handleEditarPedido(venta)}
                                          >
                                             Editar
                                          </Button>
                                       </Tooltip>
                                    </Col>
                                 )}
                                 
                                 {(venta.estado === 'en_transito' || venta.estado === 'completado') && (
                                    <Col css={{ width: 'auto' }}>
                                       <Spacer x={0.5} />
                                       <Badge color="success" variant="flat" size="sm">
                                          Disponible
                                       </Badge>
                                    </Col>
                                 )}
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