import React, { useState } from 'react';
import { Button, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { Plus } from 'lucide-react';
import { PedidosList } from './pedidos-list';
import { AddPedidoModal } from './add-pedido-modal';
import { DetallePedidoModal } from './detalle-pedido-modal';
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

      {/* Modal de detalles del pedido */}
      <DetallePedidoModal
        isOpen={detalleModalOpen}
        onClose={() => {
          setDetalleModalOpen(false);
          setPedidoSeleccionado(null);
        }}
        pedido={pedidoSeleccionado}
      />
    </Box>
  );
};
