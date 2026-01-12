import React, { useState } from 'react';
import { Button, Modal, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Plus } from 'lucide-react';
import { PedidosList } from './pedidos-list';
import { AddPedidoModal } from './add-pedido-modal';
import { Pedido } from '@/services/PedidoService';

export const PedidosTable = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [detalleModalOpen, setDetalleModalOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(null);
  const [pedidoEditando, setPedidoEditando] = useState<Pedido | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleOpenCrear = () => {
    setPedidoEditando(null);
    setModalOpen(true);
  };

  const handleOpenEditar = (pedido: Pedido) => {
    setPedidoEditando(pedido);
    setModalOpen(true);
  };

  const handleView = (pedido: Pedido) => {
    setPedidoSeleccionado(pedido);
    setDetalleModalOpen(true);
  };

  const handlePedidoCreated = () => {
    setModalOpen(false);
    setPedidoEditando(null);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <Box>
      {/* Botón para crear nuevo pedido */}
      <Flex justify="between" align="center" css={{ mb: '$6' }}>
        <Text h5 css={{ m: 0 }}>
          Lista de Pedidos
        </Text>
        <Button
          color="success"
          icon={<Plus size={20} />}
          onPress={handleOpenCrear}
        >
          Nuevo Pedido
        </Button>
      </Flex>

      {/* Tabla de pedidos */}
      <PedidosList
        onEdit={handleOpenEditar}
        onView={handleView}
        onRefresh={refreshKey > 0 ? refreshKey : undefined}
      />

      {/* Modal para crear/editar pedido */}
      <AddPedidoModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPedidoEditando(null);
        }}
        onPedidoCreated={handlePedidoCreated}
        pedidoEditando={pedidoEditando}
      />

      {/* Modal de detalles */}
      <Modal
        closeButton
        open={detalleModalOpen}
        onClose={() => setDetalleModalOpen(false)}
        width="600px"
      >
        <Modal.Header>
          <Text id="modal-title" size={18} weight="bold">
            Detalles del Pedido
          </Text>
        </Modal.Header>
        <Modal.Body>
          {pedidoSeleccionado && (
            <Box css={{ gap: '$4' }}>
              <div>
                <Text size="$sm" color="$gray700">
                  <strong>Número:</strong> {pedidoSeleccionado.numero_pedido}
                </Text>
                <Text size="$sm" color="$gray700">
                  <strong>Cliente:</strong> {pedidoSeleccionado.cliente?.nombre}
                </Text>
                <Text size="$sm" color="$gray700">
                  <strong>Vendedor:</strong> {pedidoSeleccionado.vendedor?.nombre}
                </Text>
                <Text size="$sm" color="$gray700">
                  <strong>Fecha:</strong>{' '}
                  {new Date(pedidoSeleccionado.fecha_pedido || '').toLocaleDateString('es-PE')}
                </Text>
                <Text size="$sm" color="$gray700">
                  <strong>Monto Total:</strong> S/. {parseFloat(String(pedidoSeleccionado.monto_total || '0')).toFixed(2)}
                </Text>
                <Text size="$sm" color="$gray700">
                  <strong>Estado:</strong> {pedidoSeleccionado.estado}
                </Text>
                {pedidoSeleccionado.observaciones && (
                  <Text size="$sm" color="$gray700">
                    <strong>Observaciones:</strong> {pedidoSeleccionado.observaciones}
                  </Text>
                )}
              </div>

              {pedidoSeleccionado.detalles && pedidoSeleccionado.detalles.length > 0 && (
                <Box>
                  <Text weight="bold" size="$sm" css={{ mb: '$2' }}>
                    Productos:
                  </Text>
                  {pedidoSeleccionado.detalles.map((detalle, index) => (
                    <Text key={index} size="$xs" color="$gray700">
                      • {detalle.cantidad}x Producto {detalle.idProducto} - S/. {parseFloat(String(detalle.precio_unitario || '0')).toFixed(2)}
                    </Text>
                  ))}
                </Box>
              )}
            </Box>
          )}
        </Modal.Body>
      </Modal>
    </Box>
  );
};
