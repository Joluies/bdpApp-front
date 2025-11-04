import React from 'react';
import { Card, Text, Grid } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { EstadisticasDespacho } from '../../types/despacho';

interface Props {
  estadisticas: EstadisticasDespacho;
}

export const EstadisticasDespachoCards = ({ estadisticas }: Props) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };

  return (
    <Grid.Container gap={2} justify="flex-start">
      {/* Estadísticas de Camiones */}
      <Grid xs={12} sm={6} md={3}>
        <Card css={{ 
          p: '$6', 
          mw: '400px',
          background: 'linear-gradient(135deg, #034F32 0%, #5CAC4C 100%)',
          color: 'white'
        }}>
          <Flex direction="column" css={{ gap: '$2' }}>
            <Text h4 color="white" css={{ m: 0 }}>
              Camiones
            </Text>
            <Text h2 color="white" css={{ m: 0, fontWeight: 'bold' }}>
              {estadisticas.totalCamiones}
            </Text>
            <Flex css={{ gap: '$4', mt: '$2' }}>
              <Flex direction="column" css={{ alignItems: 'center' }}>
                <Text size="$sm" color="white" css={{ opacity: 0.8 }}>
                  En Ruta
                </Text>
                <Text weight="bold" color="white">
                  {estadisticas.camionesEnRuta}
                </Text>
              </Flex>
              <Flex direction="column" css={{ alignItems: 'center' }}>
                <Text size="$sm" color="white" css={{ opacity: 0.8 }}>
                  Disponibles
                </Text>
                <Text weight="bold" color="white">
                  {estadisticas.camionesDisponibles}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Grid>

      {/* Estadísticas de Rutas */}
      <Grid xs={12} sm={6} md={3}>
        <Card css={{ 
          p: '$6', 
          mw: '400px',
          background: 'linear-gradient(135deg, #5CAC4C 0%, #C8ECC9 100%)',
          color: '#034F32'
        }}>
          <Flex direction="column" css={{ gap: '$2' }}>
            <Text h4 css={{ m: 0, color: '#034F32' }}>
              Rutas
            </Text>
            <Text h2 css={{ m: 0, fontWeight: 'bold', color: '#034F32' }}>
              {estadisticas.totalRutas}
            </Text>
            <Flex css={{ gap: '$4', mt: '$2' }}>
              <Flex direction="column" css={{ alignItems: 'center' }}>
                <Text size="$sm" css={{ opacity: 0.7, color: '#034F32' }}>
                  Activas
                </Text>
                <Text weight="bold" css={{ color: '#034F32' }}>
                  {estadisticas.rutasActivas}
                </Text>
              </Flex>
              <Flex direction="column" css={{ alignItems: 'center' }}>
                <Text size="$sm" css={{ opacity: 0.7, color: '#034F32' }}>
                  Completadas
                </Text>
                <Text weight="bold" css={{ color: '#034F32' }}>
                  {estadisticas.totalRutas - estadisticas.rutasActivas}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Grid>

      {/* Estadísticas de Puntos de Entrega */}
      <Grid xs={12} sm={6} md={3}>
        <Card css={{ 
          p: '$6', 
          mw: '400px',
          background: 'linear-gradient(135deg, #C8ECC9 0%, #F1F1E9 100%)',
          color: '#034F32'
        }}>
          <Flex direction="column" css={{ gap: '$2' }}>
            <Text h4 css={{ m: 0, color: '#034F32' }}>
              Puntos de Entrega
            </Text>
            <Text h2 css={{ m: 0, fontWeight: 'bold', color: '#034F32' }}>
              {estadisticas.totalPuntosEntrega}
            </Text>
            <Flex css={{ gap: '$3', mt: '$2', flexWrap: 'wrap' }}>
              <Flex direction="column" css={{ alignItems: 'center', minWidth: '60px' }}>
                <Text size="$xs" css={{ opacity: 0.7, color: '#034F32', textAlign: 'center' }}>
                  Entregados
                </Text>
                <Text weight="bold" css={{ color: '#5CAC4C' }}>
                  {estadisticas.puntosEntregados}
                </Text>
              </Flex>
              <Flex direction="column" css={{ alignItems: 'center', minWidth: '60px' }}>
                <Text size="$xs" css={{ opacity: 0.7, color: '#034F32', textAlign: 'center' }}>
                  Rechazados
                </Text>
                <Text weight="bold" css={{ color: '#ff6b6b' }}>
                  {estadisticas.puntosRechazados}
                </Text>
              </Flex>
              <Flex direction="column" css={{ alignItems: 'center', minWidth: '60px' }}>
                <Text size="$xs" css={{ opacity: 0.7, color: '#034F32', textAlign: 'center' }}>
                  Pendientes
                </Text>
                <Text weight="bold" css={{ color: '#ffa726' }}>
                  {estadisticas.puntosPendientes}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Grid>

      {/* Estadísticas de Valor de Mercadería */}
      <Grid xs={12} sm={6} md={3}>
        <Card css={{ 
          p: '$6', 
          mw: '400px',
          background: 'linear-gradient(135deg, #F1F1E9 0%, #034F32 100%)',
          color: 'white'
        }}>
          <Flex direction="column" css={{ gap: '$2' }}>
            <Text h4 color="white" css={{ m: 0 }}>
              Valor Mercadería
            </Text>
            <Text h3 color="white" css={{ m: 0, fontWeight: 'bold', fontSize: '$lg' }}>
              {formatCurrency(estadisticas.valorTotalMercaderia)}
            </Text>
            <Flex css={{ gap: '$4', mt: '$2' }}>
              <Flex direction="column" css={{ alignItems: 'center' }}>
                <Text size="$sm" color="white" css={{ opacity: 0.8 }}>
                  Entregado
                </Text>
                <Text size="$sm" weight="bold" color="#C8ECC9">
                  {formatCurrency(estadisticas.valorEntregado)}
                </Text>
              </Flex>
              <Flex direction="column" css={{ alignItems: 'center' }}>
                <Text size="$sm" color="white" css={{ opacity: 0.8 }}>
                  Pendiente
                </Text>
                <Text size="$sm" weight="bold" color="#ffa726">
                  {formatCurrency(estadisticas.valorPendiente)}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Card>
      </Grid>
    </Grid.Container>
  );
};