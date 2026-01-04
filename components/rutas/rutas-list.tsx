'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RutaService, { Ruta } from '@/services/RutaService';
import { Button, Input, Loading, Table, Badge, Text, Tooltip } from '@nextui-org/react';
import { Loader, Edit2, Trash2, Eye } from 'lucide-react';
import { Flex } from '@/components/styles/flex';

interface RutasListProps {
  idVendedor?: number;
  onRutaSeleccionada?: (ruta: Ruta) => void;
}

export function RutasList({ idVendedor, onRutaSeleccionada }: RutasListProps) {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  const [filtroNombre, setFiltroNombre] = useState<string>('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    cargarRutas();
  }, [filtroEstado, filtroNombre, page, idVendedor]);

  const cargarRutas = async () => {
    try {
      setCargando(true);
      setError(null);

      const params: any = {
        page,
        per_page: 10,
      };

      if (filtroEstado) params.estado = filtroEstado;
      if (filtroNombre) params.search = filtroNombre;
      if (idVendedor) params.idVendedor = idVendedor;

      const response = await RutaService.obtenerRutas(params);
      setRutas(response.data || []);
    } catch (err: any) {
      setError(err.message || 'Error al cargar las rutas');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (idRuta: number) => {
    if (!window.confirm('¿Está seguro de que desea eliminar esta ruta?')) {
      return;
    }

    try {
      await RutaService.eliminarRuta(idRuta);
      cargarRutas();
    } catch (err: any) {
      alert('Error al eliminar la ruta: ' + (err.message || 'Error desconocido'));
    }
  };

  const getEstadoBadge = (estado: string) => {
    const colorMap: any = {
      'Activa': 'success',
      'Completada': 'primary',
      'Cancelada': 'danger',
    };
    return colorMap[estado] || 'default';
  };

  const getPrioridadBadge = (prioridad: string) => {
    const colorMap: any = {
      'Alta': 'danger',
      'Media': 'warning',
      'Baja': 'success',
    };
    return colorMap[prioridad] || 'default';
  };

  const renderCell = (ruta: Ruta, columnKey: string) => {
    switch (columnKey) {
      case 'nombre':
        return (
          <Flex direction="column">
            <Text css={{ fontSize: '$sm', fontWeight: '$semibold', color: '#034F32' }}>
              {ruta.nombre}
            </Text>
            <Text css={{ fontSize: '$xs', color: '$accents7' }}>
              {ruta.descripcion || 'Sin descripción'}
            </Text>
          </Flex>
        );

      case 'estado':
        return (
          <Badge 
            color={getEstadoBadge(ruta.estado)}
            variant="flat"
          >
            {ruta.estado}
          </Badge>
        );

      case 'prioridad':
        return (
          <Badge 
            color={getPrioridadBadge(ruta.prioridad)}
            variant="flat"
          >
            {ruta.prioridad}
          </Badge>
        );

      case 'vendedor':
        return (
          <Text css={{ fontSize: '$sm' }}>
            {ruta.vendedor
              ? `${ruta.vendedor.nombre} ${ruta.vendedor.apellido}`
              : 'Sin asignar'}
          </Text>
        );

      case 'despacho':
        return (
          <Text css={{ fontSize: '$sm' }}>
            {ruta.despacho
              ? `${ruta.despacho.nombre} ${ruta.despacho.apellido}`
              : 'Sin asignar'}
          </Text>
        );

      case 'clientes':
        return (
          <Badge 
            color="secondary"
            variant="flat"
          >
            {ruta.total_clientes}
          </Badge>
        );

      case 'fecha':
        return (
          <Text css={{ fontSize: '$sm' }}>
            {ruta.fecha_programada
              ? new Date(ruta.fecha_programada).toLocaleDateString('es-PE')
              : 'Sin programar'}
          </Text>
        );

      case 'acciones':
        return (
          <Flex justify="center" align="center" css={{ gap: '$6' }}>
            <Link href={`/rutas/${ruta.idRuta}`}>
              <Tooltip content="Ver detalles" color="primary">
                <Button
                  auto
                  light
                  color="primary"
                  icon={<Eye size={20} />}
                  onClick={() => onRutaSeleccionada?.(ruta)}
                />
              </Tooltip>
            </Link>
            <Tooltip content="Eliminar ruta" color="error">
              <Button
                auto
                light
                color="error"
                icon={<Trash2 size={20} />}
                onClick={() => handleEliminar(ruta.idRuta!)}
              />
            </Tooltip>
          </Flex>
        );

      default:
        return null;
    }
  };

  if (cargando) {
    return (
      <Flex justify="center" align="center" css={{ minHeight: '400px' }}>
        <Loading size="xl" color="success">
          Cargando rutas...
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
          onClick={() => cargarRutas()}
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
            placeholder="Buscar por nombre..."
            value={filtroNombre}
            onChange={(e) => {
              setFiltroNombre(e.target.value);
              setPage(1);
            }}
            css={{ minWidth: '250px' }}
          />

          <select
            value={filtroEstado}
            onChange={(e) => {
              setFiltroEstado(e.target.value);
              setPage(1);
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
            <option value="Activa">Activa</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>

          <Link href="/rutas/new">
            <Button color="success">
              + Nueva Ruta
            </Button>
          </Link>
        </Flex>
      </Flex>

      {/* Tabla de rutas */}
      <Table
        aria-label="Tabla de rutas"
        css={{
          height: 'auto',
          minWidth: '100%',
        }}
        color="success"
        shadow={false}
        bordered
      >
        <Table.Header>
          <Table.Column key="nombre">NOMBRE</Table.Column>
          <Table.Column key="estado">ESTADO</Table.Column>
          <Table.Column key="prioridad">PRIORIDAD</Table.Column>
          <Table.Column key="vendedor">VENDEDOR</Table.Column>
          <Table.Column key="despacho">DESPACHO</Table.Column>
          <Table.Column key="clientes">CLIENTES</Table.Column>
          <Table.Column key="fecha">FECHA PROGRAMADA</Table.Column>
          <Table.Column key="acciones" align="center">ACCIONES</Table.Column>
        </Table.Header>
        <Table.Body>
          {rutas.length === 0 ? (
            <Table.Row key="empty">
              <Table.Cell>
                <Text>No se encontraron rutas</Text>
              </Table.Cell>
              <Table.Cell>{'-'}</Table.Cell>
              <Table.Cell>{'-'}</Table.Cell>
              <Table.Cell>{'-'}</Table.Cell>
              <Table.Cell>{'-'}</Table.Cell>
              <Table.Cell>{'-'}</Table.Cell>
              <Table.Cell>{'-'}</Table.Cell>
              <Table.Cell>{'-'}</Table.Cell>
            </Table.Row>
          ) : (
            rutas.map((ruta) => (
              <Table.Row key={ruta.idRuta}>
                <Table.Cell>{renderCell(ruta, 'nombre')}</Table.Cell>
                <Table.Cell>{renderCell(ruta, 'estado')}</Table.Cell>
                <Table.Cell>{renderCell(ruta, 'prioridad')}</Table.Cell>
                <Table.Cell>{renderCell(ruta, 'vendedor')}</Table.Cell>
                <Table.Cell>{renderCell(ruta, 'despacho')}</Table.Cell>
                <Table.Cell>{renderCell(ruta, 'clientes')}</Table.Cell>
                <Table.Cell>{renderCell(ruta, 'fecha')}</Table.Cell>
                <Table.Cell>{renderCell(ruta, 'acciones')}</Table.Cell>
              </Table.Row>
            ))
          )}
        </Table.Body>
      </Table>
    </>
  );
}
