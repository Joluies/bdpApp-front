import React, { useState, useEffect } from 'react';
import {
   Modal,
   Button,
   Input,
   Text,
   Row,
   Col,
   Card,
   Dropdown,
   Badge,
   Spacer,
   Loading
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { VentaForm, VentaItemForm } from '../../types/ventas';
import { Cliente } from '../../types/clientes';

interface AddVentaModalProps {
   isOpen: boolean;
   onClose: () => void;
   onVentaCreated?: (venta: any) => void;
}

// Datos simulados - en producción vendrían de APIs
const clientesData: Cliente[] = [
   {
      id: '1',
      tipo: 'mayorista',
      ruc: '12345678901',
      razonSocial: 'Comercial Los Andes SAC',
      direccion: 'Av. Los Andes 123',
      telefonos: ['987654321'],
      estado: 'Activo'
   },
   {
      id: '2',
      tipo: 'minorista',
      dni: '87654321',
      nombres: 'María Elena',
      apellidos: 'González López',
      direccion: 'Jr. Las Flores 456',
      telefonos: ['987123456'],
      estado: 'Activo'
   }
];

const vendedoresData = [
   { id: '1', nombres: 'Juan Carlos', apellidos: 'Pérez García' },
   { id: '2', nombres: 'Ana María', apellidos: 'Silva Torres' }
];

const productosData = [
   { id: 1, nombre: 'Coca Cola 500ml', precio: 2.50, stock: 100 },
   { id: 2, nombre: 'Agua San Luis 625ml', precio: 1.20, stock: 50 },
   { id: 3, nombre: 'Sprite 500ml', precio: 2.30, stock: 75 }
];

export const AddVentaModal: React.FC<AddVentaModalProps> = ({
   isOpen,
   onClose,
   onVentaCreated
}) => {
   const [formData, setFormData] = useState<VentaForm>({
      clienteId: '',
      vendedorId: '',
      tipoDocumento: 'boleta',
      items: [],
      observaciones: ''
   });

   const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
   const [selectedVendedor, setSelectedVendedor] = useState<any>(null);
   const [newItem, setNewItem] = useState<VentaItemForm & { nombreProducto?: string; precio?: number }>({
      idProducto: 0,
      cantidad: 1,
      nombreProducto: '',
      precio: 0
   });

   const [loading, setLoading] = useState(false);

   const resetForm = () => {
      setFormData({
         clienteId: '',
         vendedorId: '',
         tipoDocumento: 'boleta',
         items: [],
         observaciones: ''
      });
      setSelectedCliente(null);
      setSelectedVendedor(null);
      setNewItem({
         idProducto: 0,
         cantidad: 1,
         nombreProducto: '',
         precio: 0
      });
   };

   const handleClose = () => {
      resetForm();
      onClose();
   };

   const handleClienteChange = (clienteId: string) => {
      const cliente = clientesData.find(c => c.id === clienteId);
      setSelectedCliente(cliente || null);
      setFormData(prev => ({ 
         ...prev, 
         clienteId,
         // Auto-determinar tipo de documento basado en el tipo de cliente
         tipoDocumento: cliente?.tipo === 'mayorista' ? 'factura' : 'boleta'
      }));
   };

   const handleVendedorChange = (vendedorId: string) => {
      const vendedor = vendedoresData.find(v => v.id === vendedorId);
      setSelectedVendedor(vendedor || null);
      setFormData(prev => ({ ...prev, vendedorId }));
   };

   const handleProductoChange = (productoId: number) => {
      const producto = productosData.find(p => p.id === productoId);
      if (producto) {
         setNewItem(prev => ({
            ...prev,
            idProducto: productoId,
            nombreProducto: producto.nombre,
            precio: producto.precio,
            precioUnitario: producto.precio
         }));
      }
   };

   const agregarItem = () => {
      if (newItem.idProducto && newItem.cantidad > 0) {
         const item: VentaItemForm = {
            idProducto: newItem.idProducto,
            cantidad: newItem.cantidad,
            precioUnitario: newItem.precio || 0
         };

         setFormData(prev => ({
            ...prev,
            items: [...prev.items, item]
         }));

         setNewItem({
            idProducto: 0,
            cantidad: 1,
            nombreProducto: '',
            precio: 0
         });
      }
   };

   const eliminarItem = (index: number) => {
      setFormData(prev => ({
         ...prev,
         items: prev.items.filter((_, i) => i !== index)
      }));
   };

   const calcularTotal = () => {
      const subtotal = formData.items.reduce((acc, item) => {
         const precio = item.precioUnitario || 0;
         return acc + (precio * item.cantidad);
      }, 0);
      
      const igv = subtotal * 0.18;
      const total = subtotal + igv;

      return { subtotal, igv, total };
   };

   const handleSubmit = async () => {
      if (!formData.clienteId || !formData.vendedorId || formData.items.length === 0) {
         alert('Por favor complete todos los campos requeridos');
         return;
      }

      setLoading(true);
      try {
         // Aquí iría la llamada a la API para crear la venta
         console.log('Creando venta:', formData);
         
         // Simular creación exitosa
         const nuevaVenta = {
            id: Date.now().toString(),
            numeroVenta: `VEN-2025-${String(Date.now()).slice(-3)}`,
            fecha: new Date().toISOString().split('T')[0],
            cliente: selectedCliente!,
            vendedor: selectedVendedor!,
            ...formData,
            ...calcularTotal(),
            estado: 'pendiente'
         };

         onVentaCreated?.(nuevaVenta);
         handleClose();
      } catch (error) {
         console.error('Error al crear venta:', error);
         alert('Error al crear la venta');
      } finally {
         setLoading(false);
      }
   };

   const { subtotal, igv, total } = calcularTotal();

   return (
      <Modal
         closeButton
         aria-labelledby="modal-title"
         open={isOpen}
         onClose={handleClose}
         width="900px"
      >
         <Modal.Header>
            <Text id="modal-title" size={18}>
               Nueva Venta
            </Text>
         </Modal.Header>
         <Modal.Body>
            <Row gap={2}>
               {/* Información del Cliente y Vendedor */}
               <Col span={12}>
                  <Card>
                     <Card.Header>
                        <Text h5>Información de la Venta</Text>
                     </Card.Header>
                     <Card.Body css={{ gap: '$4' }}>
                        <div>
                           <Text size="$sm" color="$gray700" css={{ marginBottom: '$2' }}>
                              Cliente *
                           </Text>
                           <Dropdown>
                              <Dropdown.Button flat css={{ width: '100%', justifyContent: 'flex-start' }}>
                                 {selectedCliente ? (
                                    selectedCliente.tipo === 'mayorista' 
                                       ? selectedCliente.razonSocial 
                                       : `${selectedCliente.nombres} ${selectedCliente.apellidos}`
                                 ) : 'Seleccionar cliente'}
                              </Dropdown.Button>
                              <Dropdown.Menu 
                                 aria-label="Clientes"
                                 onAction={(key) => handleClienteChange(key as string)}
                              >
                                 {clientesData.map((cliente) => (
                                    <Dropdown.Item key={cliente.id}>
                                       {cliente.tipo === 'mayorista' 
                                          ? cliente.razonSocial 
                                          : `${cliente.nombres} ${cliente.apellidos}`}
                                    </Dropdown.Item>
                                 ))}
                              </Dropdown.Menu>
                           </Dropdown>
                        </div>

                        <div>
                           <Text size="$sm" color="$gray700" css={{ marginBottom: '$2' }}>
                              Vendedor *
                           </Text>
                           <Dropdown>
                              <Dropdown.Button flat css={{ width: '100%', justifyContent: 'flex-start' }}>
                                 {selectedVendedor 
                                    ? `${selectedVendedor.nombres} ${selectedVendedor.apellidos}` 
                                    : 'Seleccionar vendedor'}
                              </Dropdown.Button>
                              <Dropdown.Menu 
                                 aria-label="Vendedores"
                                 onAction={(key) => handleVendedorChange(key as string)}
                              >
                                 {vendedoresData.map((vendedor) => (
                                    <Dropdown.Item key={vendedor.id}>
                                       {vendedor.nombres} {vendedor.apellidos}
                                    </Dropdown.Item>
                                 ))}
                              </Dropdown.Menu>
                           </Dropdown>
                        </div>

                        <div>
                           <Text size="$sm" color="$gray700" css={{ marginBottom: '$2' }}>
                              Tipo de Documento
                           </Text>
                           <Badge 
                              color={formData.tipoDocumento === 'factura' ? 'secondary' : 'primary'}
                              variant="flat"
                              size="lg"
                           >
                              {formData.tipoDocumento.toUpperCase()}
                           </Badge>
                           <Text size="$xs" color="$gray600" css={{ marginTop: '$1' }}>
                              {formData.tipoDocumento === 'factura' 
                                 ? 'Para clientes mayoristas (con RUC)' 
                                 : 'Para clientes minoristas (con DNI)'}
                           </Text>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>

               {/* Items de la Venta */}
               <Col span={12}>
                  <Card>
                     <Card.Header>
                        <Text h5>Productos</Text>
                     </Card.Header>
                     <Card.Body css={{ gap: '$3' }}>
                        {/* Agregar nuevo item */}
                        <Box css={{ padding: '$3', border: '1px dashed $gray400', borderRadius: '$md' }}>
                           <Text size="$sm" css={{ marginBottom: '$2' }}>Agregar Producto</Text>
                           <Flex direction="column" css={{ gap: '$2' }}>
                              <Dropdown>
                                 <Dropdown.Button flat size="sm" css={{ width: '100%', justifyContent: 'flex-start' }}>
                                    {newItem.nombreProducto || 'Seleccionar producto'}
                                 </Dropdown.Button>
                                 <Dropdown.Menu 
                                    aria-label="Productos"
                                    onAction={(key) => handleProductoChange(Number(key))}
                                 >
                                    {productosData.map((producto) => (
                                       <Dropdown.Item key={producto.id}>
                                          {producto.nombre} - S/ {producto.precio}
                                       </Dropdown.Item>
                                    ))}
                                 </Dropdown.Menu>
                              </Dropdown>
                              
                              <Row align="center">
                                 <Col>
                                    <Input
                                       size="sm"
                                       type="number"
                                       label="Cantidad"
                                       value={newItem.cantidad.toString()}
                                       onChange={(e) => setNewItem(prev => ({ 
                                          ...prev, 
                                          cantidad: parseInt(e.target.value) || 1 
                                       }))}
                                       min={1}
                                    />
                                 </Col>
                                 <Col css={{ width: 'auto' }}>
                                    <Button 
                                       size="sm" 
                                       color="primary"
                                       disabled={!newItem.idProducto}
                                       onPress={agregarItem}
                                    >
                                       Agregar
                                    </Button>
                                 </Col>
                              </Row>
                           </Flex>
                        </Box>

                        {/* Lista de items agregados */}
                        <Box css={{ maxHeight: '200px', overflow: 'auto' }}>
                           {formData.items.map((item, index) => {
                              const producto = productosData.find(p => p.id === item.idProducto);
                              const subtotalItem = (item.precioUnitario || 0) * item.cantidad;
                              
                              return (
                                 <Box key={index} css={{ 
                                    padding: '$2', 
                                    border: '1px solid $gray300', 
                                    borderRadius: '$sm',
                                    marginBottom: '$1'
                                 }}>
                                    <Flex justify="between" align="center">
                                       <Box>
                                          <Text size="$sm" weight="medium">{producto?.nombre}</Text>
                                          <Text size="$xs" color="$gray600">
                                             {item.cantidad} x S/ {item.precioUnitario?.toFixed(2)} = S/ {subtotalItem.toFixed(2)}
                                          </Text>
                                       </Box>
                                       <Button
                                          size="xs"
                                          color="error"
                                          flat
                                          onPress={() => eliminarItem(index)}
                                       >
                                          Eliminar
                                       </Button>
                                    </Flex>
                                 </Box>
                              );
                           })}
                        </Box>

                        {/* Resumen */}
                        {formData.items.length > 0 && (
                           <Box css={{ padding: '$3', backgroundColor: '$gray50', borderRadius: '$md' }}>
                              <Flex justify="between">
                                 <Text size="$sm">Subtotal:</Text>
                                 <Text size="$sm">S/ {subtotal.toFixed(2)}</Text>
                              </Flex>
                              <Flex justify="between">
                                 <Text size="$sm">IGV (18%):</Text>
                                 <Text size="$sm">S/ {igv.toFixed(2)}</Text>
                              </Flex>
                              <Flex justify="between">
                                 <Text weight="bold">Total:</Text>
                                 <Text weight="bold">S/ {total.toFixed(2)}</Text>
                              </Flex>
                           </Box>
                        )}
                     </Card.Body>
                  </Card>
               </Col>
            </Row>

            <Spacer y={1} />

            {/* Observaciones */}
            <Input
               label="Observaciones (opcional)"
               placeholder="Observaciones adicionales sobre la venta..."
               value={formData.observaciones}
               onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
               css={{ width: '100%' }}
            />
         </Modal.Body>
         <Modal.Footer>
            <Button auto flat color="error" onPress={handleClose}>
               Cancelar
            </Button>
            <Button 
               auto 
               color="success"
               disabled={!formData.clienteId || !formData.vendedorId || formData.items.length === 0 || loading}
               onPress={handleSubmit}
            >
               {loading ? <Loading size="sm" /> : 'Crear Venta'}
            </Button>
         </Modal.Footer>
      </Modal>
   );
};