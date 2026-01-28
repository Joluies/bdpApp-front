import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Text,
  Card,
  Badge,
  Loading,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import PedidoService, { Pedido, DetallePedido } from '@/services/PedidoService';

interface DetallePedidoModalProps {
  isOpen: boolean;
  onClose: () => void;
  pedido: Pedido | null;
}

export const DetallePedidoModal: React.FC<DetallePedidoModalProps> = ({
  isOpen,
  onClose,
  pedido,
}) => {
  const [pedidoCompleto, setPedidoCompleto] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && pedido?.id) {
      cargarDetallePedido();
    }
  }, [isOpen, pedido?.id]);

  const cargarDetallePedido = async () => {
    if (!pedido?.id) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Obtener el pedido completo con sus relaciones desde la API
      const response = await PedidoService.obtenerPedido(pedido.id);
      
      // Manejar diferentes estructuras de respuesta
      const pedidoData = response.success ? response.data : response;
      
      console.log('Pedido completo cargado:', pedidoData);
      setPedidoCompleto(pedidoData);
    } catch (error: any) {
      console.error('Error cargando detalle del pedido:', error);
      setError(error.message || 'Error al cargar el pedido');
      // Si falla, usar el pedido que se pasó como prop
      setPedidoCompleto(pedido);
    } finally {
      setLoading(false);
    }
  };

  if (!pedido) return null;

  // Usar el pedido completo si está disponible, sino usar el pedido prop
  const pedidoActual = pedidoCompleto || pedido;
  
  const clienteInfo = pedidoActual.cliente;
  const vendedorInfo = pedidoActual.vendedor;

  const formatearFecha = (fecha: string | undefined) => {
    if (!fecha) return 'No especificada';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-PE', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit' 
    });
  };

  const calcularTotal = () => {
    return (pedidoActual.detalles || []).reduce((sum, detalle) => {
      return sum + (detalle.subtotal || 0);
    }, 0);
  };

  const total = pedidoActual.monto_total || calcularTotal();

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={isOpen}
      onClose={onClose}
      width="700px"
      scroll
    >
      <Modal.Header>
        <Flex direction="column" css={{ gap: '$2' }}>
          <Text id="modal-title" size={18} weight="bold">
            Detalle del Pedido
          </Text>
          <Badge color="primary" variant="flat">
            {pedidoActual.numero_pedido}
          </Badge>
        </Flex>
      </Modal.Header>

      <Modal.Body css={{ gap: '$6' }}>
        {loading ? (
          <Box css={{ display: 'flex', justifyContent: 'center', padding: '$10' }}>
            <Loading size="lg">Cargando detalle del pedido...</Loading>
          </Box>
        ) : error ? (
          <Box css={{ padding: '$4', backgroundColor: '$red100', borderRadius: '$md' }}>
            <Text color="$red600" weight="semibold">
              {error}
            </Text>
          </Box>
        ) : (
          <>
            {/* Información General */}
            <Card>
              <Card.Header css={{ padding: '$3', backgroundColor: '$gray50' }}>
                <Text h6 css={{ margin: 0 }}>Información General</Text>
              </Card.Header>
              <Card.Body css={{ gap: '$4', padding: '$4' }}>
                <Flex direction="column" css={{ gap: '$3' }}>
                  {/* Cliente */}
                  <Box>
                    <Text size="$xs" color="$gray600" weight="medium" css={{ marginBottom: '$1' }}>
                      Cliente
                    </Text>
                    <Text size="$sm" weight="semibold">
                      {clienteInfo?.nombre || clienteInfo?.razonSocial || 'Cliente no encontrado'}
                    </Text>
                    {clienteInfo && (
                      <Text size="$xs" color="$gray500">
                        {clienteInfo.tipo || clienteInfo.tipoCliente} {clienteInfo.ruc ? `- RUC: ${clienteInfo.ruc}` : clienteInfo.dni ? `- DNI: ${clienteInfo.dni}` : ''}
                      </Text>
                    )}
                  </Box>

                  {/* Vendedor */}
                  <Box>
                    <Text size="$xs" color="$gray600" weight="medium" css={{ marginBottom: '$1' }}>
                      Vendedor
                    </Text>
                    <Text size="$sm" weight="semibold">
                      {vendedorInfo?.nombre || vendedorInfo?.name || 'Vendedor no encontrado'}
                    </Text>
                    {vendedorInfo?.email && (
                      <Text size="$xs" color="$gray500">
                        {vendedorInfo.email}
                      </Text>
                    )}
                  </Box>

                  {/* Fechas */}
                  <Flex css={{ gap: '$4' }}>
                    <Box css={{ flex: 1 }}>
                      <Text size="$xs" color="$gray600" weight="medium" css={{ marginBottom: '$1' }}>
                        Fecha del Pedido
                      </Text>
                      <Text size="$sm" weight="semibold">
                        {formatearFecha(pedidoActual.fecha_pedido)}
                      </Text>
                    </Box>
                    <Box css={{ flex: 1 }}>
                      <Text size="$xs" color="$gray600" weight="medium" css={{ marginBottom: '$1' }}>
                        Fecha de Entrega
                      </Text>
                      <Text size="$sm" weight="semibold">
                        {formatearFecha(pedidoActual.fecha_entrega)}
                      </Text>
                    </Box>
                  </Flex>

                  {/* Estado */}
                  <Box>
                    <Text size="$xs" color="$gray600" weight="medium" css={{ marginBottom: '$1' }}>
                      Estado
                    </Text>
                    <Badge 
                      color={
                        pedidoActual.estado === 'entregado' ? 'success' :
                        pedidoActual.estado === 'pendiente' ? 'warning' :
                        pedidoActual.estado === 'confirmado' || pedidoActual.estado === 'enviado' ? 'primary' :
                        pedidoActual.estado === 'cancelado' ? 'error' :
                        'default'
                      }
                      variant="flat"
                    >
                      {pedidoActual.estado?.toUpperCase() || 'PENDIENTE'}
                    </Badge>
                  </Box>

                  {/* Observaciones */}
                  {pedidoActual.observaciones && (
                    <Box>
                      <Text size="$xs" color="$gray600" weight="medium" css={{ marginBottom: '$1' }}>
                        Observaciones
                      </Text>
                      <Text size="$sm">
                        {pedidoActual.observaciones}
                      </Text>
                    </Box>
                  )}
                </Flex>
              </Card.Body>
            </Card>

            {/* Lista de Productos */}
            <Card>
              <Card.Header css={{ padding: '$3', backgroundColor: '$gray50' }}>
                <Text h6 css={{ margin: 0 }}>Productos del Pedido</Text>
              </Card.Header>
              <Card.Body css={{ gap: '$2', padding: '$3' }}>
                {/* Encabezados */}
                <Box
                  css={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr',
                    gap: '$2',
                    padding: '$2',
                    backgroundColor: '$gray100',
                    borderRadius: '$sm',
                    fontWeight: '600',
                    fontSize: '$xs',
                  }}
                >
                  <Text size="$xs" weight="semibold">Producto</Text>
                  <Text size="$xs" weight="semibold" css={{ textAlign: 'center' }}>Cantidad</Text>
                  <Text size="$xs" weight="semibold" css={{ textAlign: 'right' }}>P. Unitario</Text>
                  <Text size="$xs" weight="semibold" css={{ textAlign: 'right' }}>Subtotal</Text>
                </Box>

                {/* Lista de productos */}
                <Box css={{ maxHeight: '300px', overflow: 'auto' }}>
                  {(!pedidoActual.detalles || pedidoActual.detalles.length === 0) ? (
                    <Box css={{ padding: '$4', textAlign: 'center' }}>
                      <Text color="$gray600" size="$sm">
                        No hay productos en este pedido
                      </Text>
                    </Box>
                  ) : (
                    pedidoActual.detalles.map((detalle: any, index: number) => {
                      const nombreProducto = detalle.producto?.nombre || 
                                            detalle.nombre_producto || 
                                            `Producto ID: ${detalle.idProducto}`;
                      return (
                        <Box
                          key={index}
                          css={{
                            display: 'grid',
                            gridTemplateColumns: '2fr 1fr 1fr 1fr',
                            gap: '$2',
                            padding: '$2',
                            borderBottom: '1px solid $gray200',
                            '&:hover': {
                              backgroundColor: '$gray50',
                            },
                          }}
                        >
                          <Flex direction="column">
                            <Text size="$sm" weight="semibold">
                              {nombreProducto}
                            </Text>
                          </Flex>
                          <Text size="$sm" css={{ textAlign: 'center' }}>
                            {detalle.cantidad}
                          </Text>
                          <Text size="$sm" css={{ textAlign: 'right' }}>
                            S/. {parseFloat(String(detalle.precio_unitario || '0')).toFixed(2)}
                          </Text>
                          <Text size="$sm" weight="semibold" css={{ textAlign: 'right' }}>
                            S/. {parseFloat(String(detalle.subtotal || '0')).toFixed(2)}
                          </Text>
                        </Box>
                      );
                    })
                  )}
                </Box>

                {/* Total */}
                {pedidoActual.detalles && pedidoActual.detalles.length > 0 && (
                  <Box
                    css={{
                      padding: '$3',
                      backgroundColor: '$gray50',
                      borderRadius: '$md',
                      borderTop: '2px solid $primary',
                      marginTop: '$2',
                    }}
                  >
                    <Flex justify="between" align="center">
                      <Text weight="bold" size="$lg">
                        Total del Pedido:
                      </Text>
                      <Text weight="bold" size="$xl" color="$success">
                        S/. {parseFloat(String(total || '0')).toFixed(2)}
                      </Text>
                    </Flex>
                  </Box>
                )}
              </Card.Body>
            </Card>
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button auto color="primary" onPress={onClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
