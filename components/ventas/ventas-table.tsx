import React, { useState, useEffect, useRef } from 'react';
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
import { useReactToPrint } from 'react-to-print';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Venta, EstadoVenta, TipoDocumento } from '../../types/ventas';
import { useClientSide } from '../hooks/useClientSide';
import { VentasApiService } from '../../services/ventas-api.service';
import TicketFactura from './TicketFactura';

// Declaración de tipo para el componente TicketFactura
const TicketFacturaTyped = TicketFactura as React.ForwardRefExoticComponent<{ venta: Venta } & React.RefAttributes<any>>;

export const VentasTable = () => {
   const isClient = useClientSide();
   const [ventas, setVentas] = useState<Venta[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [selectedVenta, setSelectedVenta] = useState<Venta | null>(null);
   const [showAddModal, setShowAddModal] = useState(false);
   const [showDetalleModal, setShowDetalleModal] = useState(false);
   const [busqueda, setBusqueda] = useState('');
   const ticketRef = useRef<HTMLDivElement>(null);

   // Configurar react-to-print
   const handlePrint = useReactToPrint({
      contentRef: ticketRef,
      documentTitle: `Ticket-${selectedVenta?.numeroVenta || 'venta'}`,
   });

   // Cargar ventas desde la API
   useEffect(() => {
      const cargarVentas = async () => {
         try {
            setLoading(true);
            setError(null);
            console.log('Cargando ventas...');
            const data = await VentasApiService.getVentas();
            console.log('Ventas cargadas:', data);
            setVentas(data);
         } catch (error) {
            console.error('Error al cargar las ventas:', error);
            setError('Error al cargar las ventas. Por favor, verifica la consola.');
         } finally {
            setLoading(false);
         }
      };

      cargarVentas();
   }, []);

   // Función para recargar las ventas
   const recargarVentas = async () => {
      try {
         setLoading(true);
         setError(null);
         console.log('Recargando ventas...');
         const data = await VentasApiService.getVentas();
         console.log('Ventas recargadas:', data);
         setVentas(data);
      } catch (error) {
         console.error('Error al recargar las ventas:', error);
         setError('Error al recargar las ventas. Por favor, verifica la consola.');
      } finally {
         setLoading(false);
      }
   };

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
      // Esperar un momento para que el estado se actualice antes de imprimir
      setTimeout(() => {
         if (handlePrint) {
            handlePrint();
         }
      }, 100);
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
                     <Row>
                        <Button 
                           color="default" 
                           auto
                           flat
                           onPress={recargarVentas}
                           disabled={loading}
                           css={{ marginRight: '$4' }}
                        >
                           {loading ? 'Cargando...' : '🔄 Actualizar'}
                        </Button>
                        <Button 
                           color="primary" 
                           auto
                           onPress={() => setShowAddModal(true)}
                        >
                           Nueva Venta
                        </Button>
                     </Row>
                  </Col>
               </Row>
            </Card.Header>
            <Card.Body css={{ padding: 0 }}>
               {/* Mensaje de error */}
               {error && (
                  <Box css={{ padding: '$4', backgroundColor: '$error100', borderRadius: '$sm', margin: '$4' }}>
                     <Text color="error">{error}</Text>
                  </Box>
               )}

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

               {/* Información de debug */}
               {!loading && (
                  <Box css={{ padding: '$4', paddingTop: 0 }}>
                     <Text size={12} color="$gray600">
                        Total de ventas cargadas: {ventas.length}
                     </Text>
                  </Box>
               )}

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
                     {loading ? (
                        <Table.Row>
                           <Table.Cell><Text>Cargando ventas...</Text></Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                        </Table.Row>
                     ) : error ? (
                        <Table.Row>
                           <Table.Cell>Error al cargar las ventas</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                        </Table.Row>
                     ) : ventasFiltradas.length === 0 ? (
                        <Table.Row>
                           <Table.Cell>No hay pedidos confirmados registrados. Los pedidos confirmados aparecerán aquí automáticamente.</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                           <Table.Cell>-</Table.Cell>
                        </Table.Row>
                     ) : (
                        ventasFiltradas.map((venta) => (
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
                                       {venta.cliente.codCliente && `Cod: ${venta.cliente.codCliente} | `}
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
                                          <Tooltip content="Imprimir ticket">
                                             <Button
                                                size="sm"
                                                color="secondary"
                                                flat
                                                auto
                                                onPress={() => handleGenerarDocumento(venta)}
                                             >
                                                🖨️ Imprimir
                                             </Button>
                                          </Tooltip>
                                       </Col>
                                    )}
                                 </Row>
                              </Table.Cell>
                           </Table.Row>
                        ))
                     )}
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

         {/* Componente de ticket oculto para impresión */}
         <div style={{ display: 'none' }}>
            {selectedVenta && (
               <TicketFacturaTyped ref={ticketRef} venta={selectedVenta} />
            )}
         </div>
      </Container>
   );
};