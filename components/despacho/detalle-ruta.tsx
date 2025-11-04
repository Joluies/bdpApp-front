import React, { useState } from 'react';
import {
  Card,
  Text,
  Badge,
  Button,
  Modal,
  Spacer,
  Progress,
  Collapse
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Ruta, PuntoEntrega, EstadoEntrega } from '../../types/despacho';

interface Props {
  ruta: Ruta;
  visible: boolean;
  onClose: () => void;
}

export const DetalleRuta = ({ ruta, visible, onClose }: Props) => {
  const [puntoSeleccionado, setPuntoSeleccionado] = useState<PuntoEntrega | null>(null);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getEstadoColor = (estado: EstadoEntrega) => {
    switch (estado) {
      case EstadoEntrega.ENTREGADO:
        return 'success';
      case EstadoEntrega.RECHAZADO:
        return 'error';
      case EstadoEntrega.EN_TRANSITO:
        return 'primary';
      case EstadoEntrega.PENDIENTE:
        return 'warning';
      default:
        return 'default';
    }
  };

  const calcularProgreso = () => {
    const totalPuntos = ruta.puntosEntrega.length;
    const puntosCompletados = ruta.puntosEntrega.filter(
      punto => punto.estado === EstadoEntrega.ENTREGADO || punto.estado === EstadoEntrega.RECHAZADO
    ).length;
    return totalPuntos > 0 ? (puntosCompletados / totalPuntos) * 100 : 0;
  };

  const estadisticas = {
    entregados: ruta.puntosEntrega.filter(p => p.estado === EstadoEntrega.ENTREGADO).length,
    rechazados: ruta.puntosEntrega.filter(p => p.estado === EstadoEntrega.RECHAZADO).length,
    pendientes: ruta.puntosEntrega.filter(p => p.estado === EstadoEntrega.PENDIENTE).length,
    enTransito: ruta.puntosEntrega.filter(p => p.estado === EstadoEntrega.EN_TRANSITO).length,
    valorEntregado: ruta.puntosEntrega
      .filter(p => p.estado === EstadoEntrega.ENTREGADO)
      .reduce((sum, p) => sum + p.valorMercaderia, 0),
    valorPendiente: ruta.puntosEntrega
      .filter(p => p.estado === EstadoEntrega.PENDIENTE || p.estado === EstadoEntrega.EN_TRANSITO)
      .reduce((sum, p) => sum + p.valorMercaderia, 0)
  };

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      open={visible}
      onClose={onClose}
      width="900px"
      scroll
    >
      <Modal.Header>
        <Text id="modal-title" h3>
          {ruta.nombre}
        </Text>
      </Modal.Header>
      <Modal.Body>
        <Flex direction="column" css={{ gap: '$4' }}>
          {/* Información general de la ruta */}
          <Card css={{ p: '$4', background: 'linear-gradient(135deg, #034F32 0%, #5CAC4C 100%)' }}>
            <Flex justify="between" align="start">
              <Flex direction="column" css={{ gap: '$2' }}>
                <Text h4 color="white" css={{ m: 0 }}>
                  Información General
                </Text>
                <Text color="white" css={{ opacity: 0.9 }}>
                  {ruta.descripcion}
                </Text>
                <Flex css={{ gap: '$4', mt: '$2' }}>
                  <Flex direction="column">
                    <Text size="$sm" color="white" css={{ opacity: 0.8 }}>
                      Distancia Total
                    </Text>
                    <Text weight="bold" color="white">
                      {ruta.distanciaTotal} km
                    </Text>
                  </Flex>
                  <Flex direction="column">
                    <Text size="$sm" color="white" css={{ opacity: 0.8 }}>
                      Tiempo Estimado
                    </Text>
                    <Text weight="bold" color="white">
                      {ruta.tiempoEstimado} hrs
                    </Text>
                  </Flex>
                  <Flex direction="column">
                    <Text size="$sm" color="white" css={{ opacity: 0.8 }}>
                      Valor Total
                    </Text>
                    <Text weight="bold" color="#C8ECC9">
                      {formatCurrency(ruta.valorTotal)}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>
              <Badge color={getEstadoColor(ruta.estado)} variant="flat" size="lg">
                {ruta.estado}
              </Badge>
            </Flex>
          </Card>

          {/* Progreso de la ruta */}
          <Card css={{ p: '$4' }}>
            <Text h4 css={{ color: '#034F32', mb: '$3' }}>
              Progreso de Entrega
            </Text>
            <Progress
              color="success"
              value={calcularProgreso()}
              css={{ mb: '$3' }}
            />
            <Flex css={{ gap: '$4', flexWrap: 'wrap' }}>
              <Flex align="center" css={{ gap: '$2' }}>
                <Badge color="success" variant="flat">
                  {estadisticas.entregados}
                </Badge>
                <Text size="$sm">Entregados</Text>
              </Flex>
              <Flex align="center" css={{ gap: '$2' }}>
                <Badge color="error" variant="flat">
                  {estadisticas.rechazados}
                </Badge>
                <Text size="$sm">Rechazados</Text>
              </Flex>
              <Flex align="center" css={{ gap: '$2' }}>
                <Badge color="primary" variant="flat">
                  {estadisticas.enTransito}
                </Badge>
                <Text size="$sm">En Tránsito</Text>
              </Flex>
              <Flex align="center" css={{ gap: '$2' }}>
                <Badge color="warning" variant="flat">
                  {estadisticas.pendientes}
                </Badge>
                <Text size="$sm">Pendientes</Text>
              </Flex>
            </Flex>
          </Card>

          {/* Resumen financiero */}
          <Card css={{ p: '$4', background: '$gray50' }}>
            <Text h4 css={{ color: '#034F32', mb: '$3' }}>
              Resumen Financiero
            </Text>
            <Flex css={{ gap: '$4' }}>
              <Flex direction="column" css={{ alignItems: 'center', flex: 1 }}>
                <Text size="$sm" css={{ color: '$gray600', mb: '$1' }}>
                  Valor Entregado
                </Text>
                <Text h4 css={{ color: '$green600', m: 0 }}>
                  {formatCurrency(estadisticas.valorEntregado)}
                </Text>
              </Flex>
              <Flex direction="column" css={{ alignItems: 'center', flex: 1 }}>
                <Text size="$sm" css={{ color: '$gray600', mb: '$1' }}>
                  Valor Pendiente
                </Text>
                <Text h4 css={{ color: '$orange600', m: 0 }}>
                  {formatCurrency(estadisticas.valorPendiente)}
                </Text>
              </Flex>
              <Flex direction="column" css={{ alignItems: 'center', flex: 1 }}>
                <Text size="$sm" css={{ color: '$gray600', mb: '$1' }}>
                  Eficiencia
                </Text>
                <Text h4 css={{ color: '#034F32', m: 0 }}>
                  {Math.round(calcularProgreso())}%
                </Text>
              </Flex>
            </Flex>
          </Card>

          {/* Lista de puntos de entrega */}
          <Card css={{ p: '$4' }}>
            <Text h4 css={{ color: '#034F32', mb: '$3' }}>
              Puntos de Entrega ({ruta.puntosEntrega.length})
            </Text>
            <Flex direction="column" css={{ gap: '$2' }}>
              {ruta.puntosEntrega.map((punto, index) => (
                <Collapse.Group key={punto.id} accordion>
                  <Collapse 
                    title={
                      <Flex justify="between" align="center" css={{ width: '100%', pr: '$4' }}>
                        <Flex align="center" css={{ gap: '$3' }}>
                          <Badge
                            css={{ 
                              minWidth: '24px', 
                              height: '24px', 
                              borderRadius: '$pill',
                              background: '#034F32',
                              color: 'white'
                            }}
                          >
                            {index + 1}
                          </Badge>
                          <Flex direction="column" css={{ alignItems: 'flex-start' }}>
                            <Text weight="bold" size="$sm">
                              {punto.cliente}
                            </Text>
                            <Text size="$xs" css={{ color: '$gray600' }}>
                              {punto.direccion}
                            </Text>
                          </Flex>
                        </Flex>
                        <Flex align="center" css={{ gap: '$3' }}>
                          <Text size="$sm" weight="bold" css={{ color: '$green600' }}>
                            {formatCurrency(punto.valorMercaderia)}
                          </Text>
                          <Badge color={getEstadoColor(punto.estado)} variant="flat">
                            {punto.estado}
                          </Badge>
                        </Flex>
                      </Flex>
                    }
                  >
                    <Card css={{ p: '$3', background: '$gray25' }}>
                      <Flex direction="column" css={{ gap: '$2' }}>
                        <Flex css={{ gap: '$4', flexWrap: 'wrap' }}>
                          {punto.telefono && (
                            <Flex direction="column">
                              <Text size="$xs" css={{ color: '$gray600' }}>Teléfono:</Text>
                              <Text size="$sm">{punto.telefono}</Text>
                            </Flex>
                          )}
                          <Flex direction="column">
                            <Text size="$xs" css={{ color: '$gray600' }}>Fecha Estimada:</Text>
                            <Text size="$sm">{formatDate(punto.fechaEstimada)}</Text>
                          </Flex>
                          {punto.fechaEntrega && (
                            <Flex direction="column">
                              <Text size="$xs" css={{ color: '$gray600' }}>Fecha Entrega:</Text>
                              <Text size="$sm">{formatDate(punto.fechaEntrega)}</Text>
                            </Flex>
                          )}
                        </Flex>
                        {punto.observaciones && (
                          <Flex direction="column" css={{ mt: '$2' }}>
                            <Text size="$xs" css={{ color: '$gray600' }}>Observaciones:</Text>
                            <Text size="$sm">{punto.observaciones}</Text>
                          </Flex>
                        )}
                      </Flex>
                    </Card>
                  </Collapse>
                </Collapse.Group>
              ))}
            </Flex>
          </Card>
        </Flex>
      </Modal.Body>
      <Modal.Footer>
        <Button auto flat onPress={onClose}>
          Cerrar
        </Button>
        <Button 
          auto 
          css={{ 
            background: '#5CAC4C', 
            '&:hover': { background: '#034F32' } 
          }}
        >
          Exportar Reporte
        </Button>
      </Modal.Footer>
    </Modal>
  );
};