import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Input,
  Loading,
  Badge,
  Text,
  Tooltip,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import PedidoService, { Pedido } from '@/services/PedidoService';

interface Props {
  onEdit?: (pedido: Pedido) => void;
  onView?: (pedido: Pedido) => void;
  onRefresh?: number;
}

export const PedidosList = ({ onEdit, onView, onRefresh }: Props) => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPedidos, setTotalPedidos] = useState(0);
  const [perPage, setPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [deleting, setDeleting] = useState(false);

  const cargarPedidos = async (page: number = 1) => {
    setLoading(true);
    setError('');

    try {
      const response = await PedidoService.obtenerPedidos({
        page,
        per_page: perPage,
        estado: filtroEstado || undefined,
        search: searchTerm || undefined,
      });

      setPedidos(response.data);
      setCurrentPage(response.meta.current_page);
      setTotalPages(response.meta.last_page);
      setTotalPedidos(response.meta.total);
      setPerPage(response.meta.per_page);
    } catch (error: any) {
      console.error('Error:', error);
      setError(error.message || 'Error al cargar los pedidos');
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPedidos(1);
  }, [filtroEstado, searchTerm]);

  useEffect(() => {
    cargarPedidos(currentPage);
  }, [onRefresh]);

  const handleDelete = async (id: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar este pedido?')) {
      return;
    }

    try {
      setDeleting(true);
      await PedidoService.eliminarPedido(id);
      cargarPedidos(currentPage);
    } catch (error: any) {
      alert('Error al eliminar: ' + (error.message || 'Error desconocido'));
    } finally {
      setDeleting(false);
    }
  };

  const getEstadoColor = (estado: string) => {
    const colorMap: any = {
      'pendiente': 'warning',
      'confirmado': 'primary',
      'enviado': 'secondary',
      'entregado': 'success',
      'cancelado': 'danger',
    };
    return colorMap[estado] || 'default';
  };

  const renderCell = (pedido: Pedido, columnKey: string) => {
    switch (columnKey) {
      case 'numero_pedido':
        return (
          <Flex direction="column">
            <Text css={{ fontSize: '$sm', fontWeight: '$semibold', color: '#034F32' }}>
              {pedido.numero_pedido}
            </Text>
            <Text css={{ fontSize: '$xs', color: '$accents7' }}>
              {new Date(pedido.fecha_pedido || '').toLocaleDateString('es-PE')}
            </Text>
          </Flex>
        );

      case 'cliente':
        return (
          <Text css={{ fontSize: '$sm' }}>
            {pedido.cliente?.nombre || 'Sin nombre'}
          </Text>
        );

      case 'vendedor':
        return (
          <Text css={{ fontSize: '$sm' }}>
            {pedido.vendedor?.nombre || 'Sin asignar'}
          </Text>
        );

      case 'monto_total':
        return (
          <Text css={{ fontSize: '$sm', fontWeight: '$semibold' }}>
            S/. {pedido.monto_total?.toFixed(2) || '0.00'}
          </Text>
        );

      case 'estado':
        return (
          <Badge 
            color={getEstadoColor(pedido.estado)}
            variant="flat"
          >
            {pedido.estado.charAt(0).toUpperCase() + pedido.estado.slice(1)}
          </Badge>
        );

      case 'acciones':
        return (
          <Flex justify="center" align="center" css={{ gap: '$6' }}>
            <Tooltip content="Ver detalles" color="primary">
              <Button
                auto
                light
                color="primary"
                icon={<Eye size={20} />}
                onClick={() => onView?.(pedido)}
              />
            </Tooltip>
            <Tooltip content="Editar" color="warning">
              <Button
                auto
                light
                color="warning"
                icon={<Edit2 size={20} />}
                onClick={() => onEdit?.(pedido)}
              />
            </Tooltip>
            <Tooltip content="Eliminar" color="error">
              <Button
                auto
                light
                color="error"
                icon={<Trash2 size={20} />}
                onClick={() => handleDelete(pedido.id!)}
                disabled={deleting}
              />
            </Tooltip>
          </Flex>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" css={{ minHeight: '400px' }}>
        <Loading size="xl" color="success">
          Cargando pedidos...
        </Loading>
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex direction="column" justify="center" align="center" css={{ minHeight: '400px', gap: '$8' }}>
        <Text h3 color="error">
          {error}
        </Text>
        <Button 
          color="success" 
          onClick={() => cargarPedidos(1)}
        >
          Reintentar
        </Button>
      </Flex>
    );
  }

  return (
    <>
      {/* Filtros y búsqueda */}
      <Flex 
        justify="between" 
        align="center" 
        css={{ mb: '$8', flexWrap: 'wrap', gap: '$6' }}
      >
        <Flex css={{ gap: '$4', flexWrap: 'wrap', flex: 1 }}>
          <Input
            clearable
            placeholder="Buscar por número de pedido..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            css={{ minWidth: '250px' }}
          />

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setCurrentPage(1);
            }}
            style={{
              padding: '8px 12px',
              borderRadius: '12px',
              border: '2px solid #e1e1e1',
              fontSize: '14px',
              minWidth: '180px',
            }}
          >
            <option value="">Todos los estados</option>
            <option value="pendiente">Pendiente</option>
            <option value="confirmado">Confirmado</option>
            <option value="enviado">Enviado</option>
            <option value="entregado">Entregado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </Flex>

        <Text css={{ fontSize: '$sm', color: '$accents7' }}>
          Total: {totalPedidos} pedidos
        </Text>
      </Flex>

      {/* Tabla de pedidos */}
      <Table
        aria-label="Tabla de pedidos"
        css={{
          height: 'auto',
          minWidth: '100%',
        }}
        color="success"
        shadow={false}
        bordered
      >
        <Table.Header>
          <Table.Column key="numero_pedido">PEDIDO</Table.Column>
          <Table.Column key="cliente">CLIENTE</Table.Column>
          <Table.Column key="vendedor">VENDEDOR</Table.Column>
          <Table.Column key="monto_total">MONTO</Table.Column>
          <Table.Column key="estado">ESTADO</Table.Column>
          <Table.Column key="acciones" align="center">ACCIONES</Table.Column>
        </Table.Header>
        <Table.Body>
          {pedidos.length === 0 ? (
            <Table.Row key="empty">
              <Table.Cell>
                <Text css={{ color: '$accents7' }}>No hay datos</Text>
              </Table.Cell>
              <Table.Cell>-</Table.Cell>
              <Table.Cell>-</Table.Cell>
              <Table.Cell>-</Table.Cell>
              <Table.Cell>-</Table.Cell>
              <Table.Cell>-</Table.Cell>
            </Table.Row>
          ) : (
            pedidos.map((pedido) => (
              <Table.Row key={pedido.id}>
                <Table.Cell>{renderCell(pedido, 'numero_pedido')}</Table.Cell>
                <Table.Cell>{renderCell(pedido, 'cliente')}</Table.Cell>
                <Table.Cell>{renderCell(pedido, 'vendedor')}</Table.Cell>
                <Table.Cell>{renderCell(pedido, 'monto_total')}</Table.Cell>
                <Table.Cell>{renderCell(pedido, 'estado')}</Table.Cell>
                <Table.Cell>{renderCell(pedido, 'acciones')}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </>
  );
};
