import React, { useState, useEffect } from 'react';
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
import { Venta, EstadoVenta, TipoDocumento } from '../../types/ventas';
import { useClientSide } from '../hooks/useClientSide';

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
      estado: 'completada'
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
      estado: 'programada'
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
      estado: 'completada'
   }
];

export const VentasTable = () => {
   const isClient = useClientSide();
   const [ventas, setVentas] = useState<Venta[]>(ventasData);
   const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
   const [showAddModal, setShowAddModal] = useState(false);
   const [showDetalleModal, setShowDetalleModal] = useState(false);
   const [showDocumentoModal, setShowDocumentoModal] = useState(false);
   const [busqueda, setBusqueda] = useState('');

   const formatCurrency = (amount: number) => {
      if (!isClient) return 'S/ 0.00';
      return new Intl.NumberFormat('es-PE', {
         style: 'currency',
         currency: 'PEN',
      }).format(amount);
   };

   const getEstadoColor = (estado: string): "primary" | "secondary" | "success" | "warning" | "error" => {
      switch (estado) {
         case 'completada':
            return 'success';
         case 'pendiente':
            return 'warning';
         case 'programada':
            return 'primary';
         case 'cancelada':
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

   const handleGenerarDocumento = (venta: Venta) => {
      setSelectedVenta(venta);
      setShowDocumentoModal(true);
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
                        Registro de Ventas
                     </Text>
                  </Col>
                  <Col css={{ width: 'auto' }}>
                     <Button 
                        color="primary" 
                        auto
                        onPress={() => setShowAddModal(true)}
                     >
                        Nueva Venta
                     </Button>
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
                                 {venta.estado === 'completada' && (
                                    <Col css={{ width: 'auto' }}>
                                       <Spacer x={0.5} />
                                       <Tooltip content="Generar documento">
                                          <Button
                                             size="sm"
                                             color="secondary"
                                             flat
                                             auto
                                             onPress={() => handleGenerarDocumento(venta)}
                                          >
                                             PDF
                                          </Button>
                                       </Tooltip>
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

         {/* Modal para nueva venta */}
         <Modal
            closeButton
            aria-labelledby="modal-title"
            open={showAddModal}
            onClose={() => setShowAddModal(false)}
            width="600px"
         >
            <Modal.Header>
               <Text id="modal-title" size={18}>
                  Nueva Venta
               </Text>
            </Modal.Header>
            <Modal.Body>
               <Text>Funcionalidad para agregar nueva venta en desarrollo...</Text>
            </Modal.Body>
            <Modal.Footer>
               <Button auto flat color="error" onPress={() => setShowAddModal(false)}>
                  Cancelar
               </Button>
               <Button auto onPress={() => setShowAddModal(false)}>
                  Guardar
               </Button>
            </Modal.Footer>
         </Modal>

         {/* Modal para detalle de venta */}
         <Modal
            closeButton
            aria-labelledby="modal-detalle-title"
            open={showDetalleModal}
            onClose={() => setShowDetalleModal(false)}
            width="800px"
         >
            <Modal.Header>
               <Text id="modal-detalle-title" size={18}>
                  Detalle de Venta: {selectedVenta?.numeroVenta}
               </Text>
            </Modal.Header>
            <Modal.Body>
               {selectedVenta && (
                  <div>
                     <Text h4>Información de la Venta</Text>
                     <Text><strong>Fecha:</strong> {new Date(selectedVenta.fecha).toLocaleDateString('es-PE')}</Text>
                     <Text><strong>Cliente:</strong> {
                        selectedVenta.cliente.tipo === 'mayorista' 
                           ? selectedVenta.cliente.razonSocial 
                           : `${selectedVenta.cliente.nombres} ${selectedVenta.cliente.apellidos}`
                     }</Text>
                     <Text><strong>Vendedor:</strong> {selectedVenta.vendedor.nombres} {selectedVenta.vendedor.apellidos}</Text>
                     <Text><strong>Total:</strong> {formatCurrency(selectedVenta.total)}</Text>
                     
                     <Spacer y={1} />
                     <Text h4>Items de la Venta</Text>
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

         {/* Modal para generar documento */}
         <Modal
            closeButton
            aria-labelledby="modal-documento-title"
            open={showDocumentoModal}
            onClose={() => setShowDocumentoModal(false)}
            width="600px"
         >
            <Modal.Header>
               <Text id="modal-documento-title" size={18}>
                  Generar Documento
               </Text>
            </Modal.Header>
            <Modal.Body>
               {selectedVenta && (
                  <div>
                     <Text>Generando {selectedVenta.tipoDocumento} para la venta {selectedVenta.numeroVenta}</Text>
                     <Spacer y={1} />
                     <Text>Cliente: {
                        selectedVenta.cliente.tipo === 'mayorista' 
                           ? selectedVenta.cliente.razonSocial 
                           : `${selectedVenta.cliente.nombres} ${selectedVenta.cliente.apellidos}`
                     }</Text>
                     <Text>Total: {formatCurrency(selectedVenta.total)}</Text>
                  </div>
               )}
            </Modal.Body>
            <Modal.Footer>
               <Button auto flat color="error" onPress={() => setShowDocumentoModal(false)}>
                  Cancelar
               </Button>
               <Button auto color="success" onPress={() => {
                  // Aquí iría la lógica para generar el PDF
                  console.log('Generando documento PDF...');
                  setShowDocumentoModal(false);
               }}>
                  Generar PDF
               </Button>
            </Modal.Footer>
         </Modal>
      </Container>
   );
};