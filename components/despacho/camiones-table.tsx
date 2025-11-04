import React, { useState } from 'react';
import {
  Table,
  Row,
  Col,
  Tooltip,
  User,
  Text,
  Badge,
  Button,
  Modal,
  Card,
  Spacer
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Camion, EstadoCamion, EstadoEntrega } from '../../types/despacho';
import { EyeIcon } from '../icons/table/eye-icon';

interface Props {
  camiones: Camion[];
  onVerDetalles: (camion: Camion) => void;
}

export const CamionesTable = ({ camiones, onVerDetalles }: Props) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [camionSeleccionado, setCamionSeleccionado] = useState<Camion | null>(null);

  const columns = [
    { name: 'CAMIÓN', uid: 'camion' },
    { name: 'CONDUCTOR', uid: 'conductor' },
    { name: 'ESTADO', uid: 'estado' },
    { name: 'RUTAS', uid: 'rutas' },
    { name: 'PUNTOS', uid: 'puntos' },
    { name: 'VALOR CARGA', uid: 'valor' },
    { name: 'ACCIONES', uid: 'acciones' }
  ];

  const getEstadoColor = (estado: EstadoCamion) => {
    switch (estado) {
      case EstadoCamion.DISPONIBLE:
        return 'success';
      case EstadoCamion.EN_RUTA:
        return 'primary';
      case EstadoCamion.MANTENIMIENTO:
        return 'warning';
      case EstadoCamion.FUERA_SERVICIO:
        return 'error';
      default:
        return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const calcularEstadisticasRuta = (camion: Camion) => {
    const totalPuntos = camion.rutas.reduce((acc, ruta) => acc + ruta.puntosEntrega.length, 0);
    const puntosEntregados = camion.rutas.reduce((acc, ruta) => 
      acc + ruta.puntosEntrega.filter(punto => punto.estado === EstadoEntrega.ENTREGADO).length, 0
    );
    const puntosRechazados = camion.rutas.reduce((acc, ruta) => 
      acc + ruta.puntosEntrega.filter(punto => punto.estado === EstadoEntrega.RECHAZADO).length, 0
    );
    const valorTotal = camion.rutas.reduce((acc, ruta) => acc + ruta.valorTotal, 0);
    
    return {
      totalPuntos,
      puntosEntregados,
      puntosRechazados,
      puntosPendientes: totalPuntos - puntosEntregados - puntosRechazados,
      valorTotal
    };
  };

  const handleVerDetalles = (camion: Camion) => {
    setCamionSeleccionado(camion);
    setModalVisible(true);
  };

  const renderCell = (camion: Camion, columnKey: React.Key) => {
    const stats = calcularEstadisticasRuta(camion);

    switch (columnKey) {
      case 'camion':
        return (
          <User
            squared
            src={`https://ui-avatars.com/api/?name=${camion.marca}+${camion.modelo}&background=034F32&color=fff`}
            name={
              <Text weight="bold" size="$sm">
                {camion.placa}
              </Text>
            }
            description={`${camion.marca} ${camion.modelo} (${camion.anio})`}
          />
        );
      
      case 'conductor':
        return (
          <Flex direction="column">
            <Text weight="bold" size="$sm">
              {camion.conductor}
            </Text>
            {camion.telefono && (
              <Text size="$xs" css={{ color: '$gray600' }}>
                {camion.telefono}
              </Text>
            )}
          </Flex>
        );
      
      case 'estado':
        return (
          <Badge color={getEstadoColor(camion.estado)} variant="flat">
            {camion.estado}
          </Badge>
        );
      
      case 'rutas':
        return (
          <Flex direction="column" css={{ gap: '$1' }}>
            <Text weight="bold" size="$sm">
              {camion.rutas.length} rutas
            </Text>
            <Text size="$xs" css={{ color: '$gray600' }}>
              {camion.rutaActual ? `Ruta actual: ${camion.rutaActual.nombre}` : 'Sin ruta activa'}
            </Text>
          </Flex>
        );
      
      case 'puntos':
        return (
          <Flex direction="column" css={{ gap: '$1' }}>
            <Text weight="bold" size="$sm">
              {stats.totalPuntos} puntos
            </Text>
            <Flex css={{ gap: '$2' }}>
              <Badge color="success" variant="flat" size="xs">
                {stats.puntosEntregados} OK
              </Badge>
              <Badge color="error" variant="flat" size="xs">
                {stats.puntosRechazados} X
              </Badge>
              <Badge color="warning" variant="flat" size="xs">
                {stats.puntosPendientes} P
              </Badge>
            </Flex>
          </Flex>
        );
      
      case 'valor':
        return (
          <Text weight="bold" size="$sm" css={{ color: '$green600' }}>
            {formatCurrency(stats.valorTotal)}
          </Text>
        );
      
      case 'acciones':
        return (
          <Row justify="center" align="center">
            <Col css={{ d: 'flex' }}>
              <Tooltip content="Ver detalles">
                <Button
                  auto
                  light
                  css={{ color: '#5CAC4C', '&:hover': { color: '#034F32' } }}
                  icon={<EyeIcon size={20} fill="currentColor" />}
                  onPress={() => handleVerDetalles(camion)}
                />
              </Tooltip>
            </Col>
          </Row>
        );
      
      default:
        return null;
    }
  };

  return (
    <>
      <Table
        aria-label="Tabla de camiones"
        css={{
          height: 'auto',
          minWidth: '100%',
        }}
        selectionMode="none"
      >
        <Table.Header columns={columns}>
          {(column) => (
            <Table.Column
              key={column.uid}
              hideHeader={column.uid === 'acciones'}
              align={column.uid === 'acciones' ? 'center' : 'start'}
            >
              {column.name}
            </Table.Column>
          )}
        </Table.Header>
        <Table.Body items={camiones}>
          {(item) => (
            <Table.Row>
              {(columnKey) => (
                <Table.Cell>{renderCell(item, columnKey)}</Table.Cell>
              )}
            </Table.Row>
          )}
        </Table.Body>
      </Table>

      {/* Modal de detalles */}
      <Modal
        closeButton
        aria-labelledby="modal-title"
        open={modalVisible}
        onClose={() => setModalVisible(false)}
        width="800px"
      >
        <Modal.Header>
          <Text id="modal-title" h3>
            Detalles del Camión: {camionSeleccionado?.placa}
          </Text>
        </Modal.Header>
        <Modal.Body>
          {camionSeleccionado && (
            <Flex direction="column" css={{ gap: '$4' }}>
              {/* Información del camión */}
              <Card css={{ p: '$4', background: '$gray50' }}>
                <Text h4 css={{ color: '#034F32', mb: '$2' }}>
                  Información del Vehículo
                </Text>
                <Flex css={{ gap: '$4', flexWrap: 'wrap' }}>
                  <Flex direction="column">
                    <Text size="$sm" css={{ color: '$gray600' }}>Marca/Modelo:</Text>
                    <Text weight="bold">{camionSeleccionado.marca} {camionSeleccionado.modelo}</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text size="$sm" css={{ color: '$gray600' }}>Año:</Text>
                    <Text weight="bold">{camionSeleccionado.anio}</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text size="$sm" css={{ color: '$gray600' }}>Capacidad:</Text>
                    <Text weight="bold">{camionSeleccionado.capacidad} Ton</Text>
                  </Flex>
                  <Flex direction="column">
                    <Text size="$sm" css={{ color: '$gray600' }}>Conductor:</Text>
                    <Text weight="bold">{camionSeleccionado.conductor}</Text>
                  </Flex>
                </Flex>
              </Card>

              {/* Rutas asignadas */}
              <Card css={{ p: '$4' }}>
                <Text h4 css={{ color: '#034F32', mb: '$3' }}>
                  Rutas Asignadas ({camionSeleccionado.rutas.length})
                </Text>
                {camionSeleccionado.rutas.map((ruta) => (
                  <Card key={ruta.id} css={{ p: '$3', mb: '$2', background: '$gray25' }}>
                    <Flex justify="between" align="center">
                      <Flex direction="column" css={{ gap: '$1' }}>
                        <Text weight="bold">{ruta.nombre}</Text>
                        <Text size="$sm" css={{ color: '$gray600' }}>
                          {ruta.puntosEntrega.length} puntos de entrega
                        </Text>
                        <Text size="$sm" css={{ color: '$green600' }}>
                          Valor: {formatCurrency(ruta.valorTotal)}
                        </Text>
                      </Flex>
                      <Badge 
                        color={ruta.estado === EstadoEntrega.ENTREGADO ? 'success' : 'warning'} 
                        variant="flat"
                      >
                        {ruta.estado}
                      </Badge>
                    </Flex>
                  </Card>
                ))}
              </Card>
            </Flex>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button auto flat onPress={() => setModalVisible(false)}>
            Cerrar
          </Button>
          <Button 
            auto 
            css={{ 
              background: '#5CAC4C', 
              '&:hover': { background: '#034F32' } 
            }}
            onPress={() => {
              if (camionSeleccionado) {
                onVerDetalles(camionSeleccionado);
              }
              setModalVisible(false);
            }}
          >
            Ver Ruta Detallada
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};