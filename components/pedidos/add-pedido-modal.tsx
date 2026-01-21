import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Input,
  Text,
  Card,
  Badge,
  Loading,
  Tooltip,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Trash2, Plus } from 'lucide-react';
import PedidoService, { Pedido, DetallePedido } from '@/services/PedidoService';
import { clientesApiService } from '@/services/clientes-api.service';

interface AddPedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPedidoCreated?: (pedido: Pedido) => void;
  pedidoEditando?: Pedido | null;
}

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

interface Cliente {
  idCliente: number;
  nombre: string;
  tipo?: string;
  ruc?: string | null;
  dni?: string | null;
}

interface Vendedor {
  id: number;
  nombre: string;
  email?: string;
}

export const AddPedidoModal: React.FC<AddPedidoModalProps> = ({
  isOpen,
  onClose,
  onPedidoCreated,
  pedidoEditando,
}) => {
  // Estado del formulario
  const [formData, setFormData] = useState<Partial<Pedido>>({
    numero_pedido: '',
    idCliente: 0,
    idVendedor: 0,
    fecha_pedido: new Date().toISOString().split('T')[0],
    fecha_entrega: '',
    estado: 'pendiente',
    monto_total: 0,
    observaciones: '',
    detalles: [],
  });

  // Datos para los dropdowns
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);

  // Estados de carga
  const [loadingClientes, setLoadingClientes] = useState(false);
  const [loadingVendedores, setLoadingVendedores] = useState(false);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Estado para agregar items
  const [newItem, setNewItem] = useState<Partial<DetallePedido>>({
    idProducto: 0,
    cantidad: 1,
    precio_unitario: 0,
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (isOpen) {
      cargarClientes();
      cargarVendedores();
      cargarProductos();
      
      if (pedidoEditando) {
        setFormData(pedidoEditando);
      }
    }
  }, [isOpen, pedidoEditando]);

  const cargarClientes = async () => {
    try {
      setLoadingClientes(true);
      const response = await clientesApiService.obtenerClientesPorTipo('Mayorista');
      // Combinar mayoristas y minoristas
      const minoristas = await clientesApiService.obtenerClientesPorTipo('Minorista');
      setClientes([...response, ...minoristas]);
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      setLoadingClientes(false);
    }
  };

  const cargarVendedores = async () => {
    try {
      setLoadingVendedores(true);
      // Esta sería una llamada a API para obtener vendedores
      // Por ahora usaremos datos simulados
      setVendedores([
        { id: 1, nombre: 'Juan Pérez' },
        { id: 2, nombre: 'María García' },
        { id: 3, nombre: 'Carlos López' },
      ]);
    } catch (error) {
      console.error('Error cargando vendedores:', error);
    } finally {
      setLoadingVendedores(false);
    }
  };

  const cargarProductos = async () => {
    try {
      setLoadingProductos(true);
      // Esta sería una llamada a API para obtener productos
      // Por ahora usaremos datos simulados
      setProductos([
        { id: 1, nombre: 'Coca Cola 500ml', precio: 2.50 },
        { id: 2, nombre: 'Agua San Luis 625ml', precio: 1.20 },
        { id: 3, nombre: 'Sprite 500ml', precio: 2.30 },
        { id: 4, nombre: 'Fanta Naranja 500ml', precio: 2.30 },
        { id: 5, nombre: 'Inca Kola 500ml', precio: 2.50 },
      ]);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoadingProductos(false);
    }
  };

  const resetForm = () => {
    setFormData({
      numero_pedido: '',
      idCliente: 0,
      idVendedor: 0,
      fecha_pedido: new Date().toISOString().split('T')[0],
      fecha_entrega: '',
      estado: 'pendiente',
      monto_total: 0,
      observaciones: '',
      detalles: [],
    });
    setNewItem({
      idProducto: 0,
      cantidad: 1,
      precio_unitario: 0,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const agregarProducto = () => {
    if (!newItem.idProducto || !newItem.cantidad || !newItem.precio_unitario) {
      alert('Por favor completa todos los campos del producto');
      return;
    }

    const nuevoDetalle: DetallePedido = {
      idProducto: newItem.idProducto,
      cantidad: newItem.cantidad,
      precio_unitario: newItem.precio_unitario,
      subtotal: (newItem.cantidad || 1) * (newItem.precio_unitario || 0),
    };

    setFormData((prev) => ({
      ...prev,
      detalles: [...(prev.detalles || []), nuevoDetalle],
    }));

    setNewItem({
      idProducto: 0,
      cantidad: 1,
      precio_unitario: 0,
    });
  };

  const eliminarProducto = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      detalles: prev.detalles?.filter((_, i) => i !== index) || [],
    }));
  };

  const calcularTotal = () => {
    const total = (formData.detalles || []).reduce((sum, detalle) => {
      return sum + ((detalle.subtotal || 0));
    }, 0);
    return total;
  };

  const handleSelectProducto = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId);
    if (producto) {
      setNewItem((prev) => ({
        ...prev,
        idProducto: productoId,
        precio_unitario: producto.precio,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!formData.numero_pedido || !formData.idCliente || !formData.idVendedor || !formData.detalles?.length) {
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setSubmitting(true);
      const total = calcularTotal();

      const datosEnviar = {
        numero_pedido: formData.numero_pedido,
        idCliente: formData.idCliente,
        idVendedor: formData.idVendedor,
        fecha_pedido: formData.fecha_pedido,
        fecha_entrega: formData.fecha_entrega,
        monto_total: total,
        observaciones: formData.observaciones || '',
        detalles: formData.detalles,
      };

      let respuesta;
      if (pedidoEditando?.id) {
        respuesta = await PedidoService.actualizarPedido(pedidoEditando.id, datosEnviar);
      } else {
        respuesta = await PedidoService.crearPedido(datosEnviar);
      }

      onPedidoCreated?.(respuesta);
      handleClose();
    } catch (error: any) {
      alert('Error: ' + (error.message || 'Error al guardar pedido'));
    } finally {
      setSubmitting(false);
    }
  };

  const total = calcularTotal();
  const clienteSeleccionado = clientes.find((c) => c.idCliente === formData.idCliente);
  const productoSeleccionado = productos.find((p) => p.id === newItem.idProducto);

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={handleClose}
      width="700px"
      scroll
    >
      <Modal.Header>
        <Text id="modal-title" size={18} weight="bold">
          {pedidoEditando ? 'Editar Pedido' : 'Nuevo Pedido'}
        </Text>
      </Modal.Header>

      <Modal.Body css={{ gap: '$6' }}>
        {/* Información General */}
        <Card>
          <Card.Header css={{ padding: '$3' }}>
            <Text h6>Información General</Text>
          </Card.Header>
          <Card.Body css={{ gap: '$4', padding: '$3' }}>
            <Input
              label="Número de Pedido"
              placeholder="PED-2025-001"
              value={formData.numero_pedido || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, numero_pedido: e.target.value }))}
              required
            />

            <Flex css={{ gap: '$4' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Cliente *
                </label>
                <select
                  value={formData.idCliente || 0}
                  onChange={(e) => setFormData((prev) => ({ ...prev, idCliente: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '2px solid #e1e1e1',
                    fontSize: '14px',
                  }}
                >
                  <option value={0}>Seleccionar cliente...</option>
                  {clientes.map((cliente) => (
                    <option key={cliente.idCliente} value={cliente.idCliente}>
                      {cliente.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                  Vendedor *
                </label>
                <select
                  value={formData.idVendedor || 0}
                  onChange={(e) => setFormData((prev) => ({ ...prev, idVendedor: parseInt(e.target.value) }))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    border: '2px solid #e1e1e1',
                    fontSize: '14px',
                  }}
                >
                  <option value={0}>Seleccionar vendedor...</option>
                  {vendedores.map((vendedor) => (
                    <option key={vendedor.id} value={vendedor.id}>
                      {vendedor.nombre}
                    </option>
                  ))}
                </select>
              </div>
            </Flex>

            <Flex css={{ gap: '$4' }}>
              <Input
                label="Fecha del Pedido"
                type="date"
                value={formData.fecha_pedido || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, fecha_pedido: e.target.value }))}
                css={{ flex: 1 }}
              />
              <Input
                label="Fecha de Entrega"
                type="date"
                value={formData.fecha_entrega || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, fecha_entrega: e.target.value }))}
                css={{ flex: 1 }}
              />
            </Flex>

            <Input
              label="Observaciones"
              placeholder="Notas adicionales..."
              value={formData.observaciones || ''}
              onChange={(e) => setFormData((prev) => ({ ...prev, observaciones: e.target.value }))}
            />
          </Card.Body>
        </Card>

        {/* Productos */}
        <Card>
          <Card.Header css={{ padding: '$3' }}>
            <Text h6>Productos</Text>
          </Card.Header>
          <Card.Body css={{ gap: '$3', padding: '$3' }}>
            {/* Formulario para agregar producto */}
            <Box css={{ padding: '$3', backgroundColor: '$gray50', borderRadius: '$md', border: '1px dashed $gray300' }}>
              <Flex css={{ gap: '$2', marginBottom: '$2', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '200px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '500', marginBottom: '4px', display: 'block' }}>
                    Producto
                  </label>
                  <select
                    value={newItem.idProducto || 0}
                    onChange={(e) => handleSelectProducto(parseInt(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: '1px solid #ddd',
                      fontSize: '13px',
                    }}
                  >
                    <option value={0}>Seleccionar...</option>
                    {productos.map((prod) => (
                      <option key={prod.id} value={prod.id}>
                        {prod.nombre} - S/. {parseFloat(String(prod.precio || '0')).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <Input
                  label="Cantidad"
                  type="number"
                  min={1}
                  value={newItem.cantidad?.toString() || '1'}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, cantidad: parseInt(e.target.value) || 1 }))}
                  css={{ width: '100px' }}
                  size="sm"
                />

                <Tooltip content="Agregar producto" color="success">
                  <Button
                    auto
                    color="success"
                    size="sm"
                    icon={<Plus size={18} />}
                    onClick={agregarProducto}
                    disabled={!newItem.idProducto || !newItem.cantidad}
                  >
                    Agregar
                  </Button>
                </Tooltip>
              </Flex>

              {productoSeleccionado && (
                <Text size="$xs" color="$gray600">
                  Precio unitario: S/. {parseFloat(String(newItem.precio_unitario || '0')).toFixed(2)} | Subtotal: S/. {(parseFloat(String(newItem.cantidad || 1)) * parseFloat(String(newItem.precio_unitario || 0))).toFixed(2)}
                </Text>
              )}
            </Box>

            {/* Lista de productos agregados */}
            <Box css={{ maxHeight: '250px', overflow: 'auto' }}>
              {(!formData.detalles || formData.detalles.length === 0) ? (
                <Text color="$gray600" size="$sm">
                  No hay productos agregados
                </Text>
              ) : (
                formData.detalles.map((detalle, index) => {
                  const prod = productos.find((p) => p.id === detalle.idProducto);
                  return (
                    <Box
                      key={index}
                      css={{
                        padding: '$2',
                        border: '1px solid $gray300',
                        borderRadius: '$sm',
                        marginBottom: '$1',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <Flex direction="column">
                        <Text size="$sm" weight="semibold">
                          {prod?.nombre}
                        </Text>
                        <Text size="$xs" color="$gray600">
                          {detalle.cantidad} x S/. {parseFloat(String(detalle.precio_unitario || '0')).toFixed(2)} = S/. {parseFloat(String(detalle.subtotal || '0')).toFixed(2)}
                        </Text>
                      </Flex>

                      <Tooltip content="Eliminar" color="error">
                        <Button
                          auto
                          light
                          color="error"
                          icon={<Trash2 size={18} />}
                          onClick={() => eliminarProducto(index)}
                        />
                      </Tooltip>
                    </Box>
                  );
                })
              )}
            </Box>

            {/* Resumen */}
            {formData.detalles && formData.detalles.length > 0 && (
              <Box css={{ padding: '$3', backgroundColor: '$gray50', borderRadius: '$md', borderTop: '2px solid $gray300' }}>
                <Flex justify="between" align="center">
                  <Text weight="bold">Total:</Text>
                  <Text weight="bold" size="$lg" color="$success">
                    S/. {parseFloat(String(total || '0')).toFixed(2)}
                  </Text>
                </Flex>
              </Box>
            )}
          </Card.Body>
        </Card>
      </Modal.Body>

      <Modal.Footer>
        <Button auto flat color="error" onPress={handleClose}>
          Cancelar
        </Button>
        <Button
          auto
          color="success"
          disabled={
            !formData.numero_pedido ||
            !formData.idCliente ||
            !formData.idVendedor ||
            !formData.detalles?.length ||
            submitting
          }
          onClick={handleSubmit}
        >
          {submitting ? <Loading size="sm" /> : pedidoEditando ? 'Actualizar' : 'Crear Pedido'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};