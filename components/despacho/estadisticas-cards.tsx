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
          p: '$8', 
          mw: '400px',
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: 'white',
          borderRadius: '$xl',
          border: 'none',
          boxShadow: '0 10px 30px rgba(245, 158, 11, 0.25)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 15px 40px rgba(245, 158, 11, 0.35)'
          }
        }}>
          <Flex direction="column" css={{ gap: '$2' }}>
            <Text h4 color="white" css={{ m: 0 }}>
              🚗 Camiones
            </Text>
            <Text h2 color="white" css={{ m: 0, fontWeight: 'bold' }}>
              {estadisticas.totalCamiones}
            </Text>
            <Flex css={{ gap: '$4', mt: '$2' }}>
              <Flex direction="column" css={{ alignItems: 'center' }}>
                <Text size="$sm" color="white" css={{ opacity: 0.9 }}>
                  En Ruta
                </Text>
                <Text weight="bold" color="white">
                  {estadisticas.camionesEnRuta}
                </Text>
              </Flex>
              <Flex direction="column" css={{ alignItems: 'center' }}>
                <Text size="$sm" color="white" css={{ opacity: 0.9 }}>
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
          p: '$8', 
          mw: '400px',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: 'white',
          borderRadius: '$xl',
          border: 'none',
          boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 15px 40px rgba(16, 185, 129, 0.35)'
          }
        }}>
          <Flex direction="column" css={{ gap: '$2' }}>
            <Text h4 css={{ m: 0, color: 'white' }}>
              🗺️ Rutas
            </Text>
            <Text h2 css={{ m: 0, fontWeight: 'bold', color: 'white' }}>
              {estadisticas.totalRutas}
            </Text>
            <Flex css={{ gap: '$4', mt: '$2' }}>
              <Flex direction="column" css={{ alignItems: 'center' }}>
                <Text size="$sm" css={{ opacity: 0.9, color: 'white' }}>
                  Activas
                </Text>
                <Text weight="bold" css={{ color: 'white' }}>
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