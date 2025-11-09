import React from 'react';
import { Card, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';

// Simulamos datos - en producción vendrían de una API
const estadisticasData = {
   pedidosHoy: {
      cantidad: 25,
      total: 15450.50,
      porcentajeCambio: +12.5,
   },
   ventasSemana: {
      cantidad: 142,
      total: 89240.75,
      porcentajeCambio: +8.2,
   },
   ventasMes: {
      cantidad: 567,
      total: 342850.25,
      porcentajeCambio: +15.8,
   },
   pedidosProgramados: {
      cantidad: 18,
      total: 12350.00,
      proximaFecha: '2025-11-07',
   }
};

interface EstadisticaCardProps {
   title: string;
   cantidad: number;
   total: number;
   porcentajeCambio?: number;
   color?: 'primary' | 'secondary' | 'success' | 'warning';
}

const EstadisticaCard: React.FC<EstadisticaCardProps> = ({
   title,
   cantidad,
   total,
   porcentajeCambio,
   color = 'primary'
}) => {
   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-PE', {
         style: 'currency',
         currency: 'PEN',
      }).format(amount);
   };

   const getColorStyles = () => {
      switch (color) {
         case 'success':
            return {
               backgroundColor: '#dcfce7', // Verde claro como "Disponibles"
               borderColor: '#bbf7d0',
            };
         case 'warning':
            return {
               backgroundColor: '#fce7e7', // Rosa claro como "Agotados"
               borderColor: '#fbb6b6',
            };
         case 'secondary':
            return {
               backgroundColor: '#064e3b', // Verde oscuro como "Valor Total Inventario"
               borderColor: '#047857',
            };
         default:
            return {
               backgroundColor: '#f0f9ff',
               borderColor: '#bae6fd',
            };
      }
   };

   const colorStyles = getColorStyles();
   const isSecondary = color === 'secondary';

   return (
      <Card
         css={{
            padding: '$6',
            borderRadius: '$lg',
            border: '2px solid',
            backgroundColor: colorStyles.backgroundColor,
            borderColor: colorStyles.borderColor,
            transition: 'all 0.2s ease',
            '&:hover': {
               transform: 'translateY(-2px)',
               boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }
         }}
      >
         <Flex direction="column" css={{ gap: '$2' }}>
            <Text size="$sm" weight="medium" color={isSecondary ? 'white' : '$gray600'}>
               {title}
            </Text>
            
            <Flex align="center" justify="between">
               <Box>
                  <Text size="$2xl" weight="bold" color={isSecondary ? 'white' : '$gray900'}>
                     {cantidad}
                  </Text>
                  <Text size="$xs" color={isSecondary ? '$gray200' : '$gray500'}>
                     ventas
                  </Text>
               </Box>
               
               <Box css={{ textAlign: 'right' }}>
                  <Text size="$lg" weight="semibold" color={isSecondary ? 'white' : '$gray800'}>
                     {formatCurrency(total)}
                  </Text>
                  {porcentajeCambio !== undefined && (
                     <Flex align="center" css={{ gap: '$1' }}>
                        <Text 
                           size="$xs" 
                           color={porcentajeCambio >= 0 ? (isSecondary ? '$success200' : '$success700') : (isSecondary ? '$error200' : '$error700')}
                           weight="medium"
                        >
                           {porcentajeCambio >= 0 ? '+' : ''}{porcentajeCambio}%
                        </Text>
                        <Text size="$xs" color={isSecondary ? '$gray300' : '$gray500'}>
                           vs anterior
                        </Text>
                     </Flex>
                  )}
               </Box>
            </Flex>
         </Flex>
      </Card>
   );
};

export const EstadisticasCards = () => {
   return (
      <Flex
         css={{
            gap: '$4',
            flexWrap: 'wrap',
            '@sm': { flexDirection: 'column' },
            '@md': { flexDirection: 'row' },
         }}
      >
         <Box css={{ flex: 1, minWidth: '250px' }}>
            <EstadisticaCard
               title="Pedidos Completados"
               cantidad={estadisticasData.pedidosHoy.cantidad}
               total={estadisticasData.pedidosHoy.total}
               porcentajeCambio={estadisticasData.pedidosHoy.porcentajeCambio}
               color="success"
            />
         </Box>
         
         <Box css={{ flex: 1, minWidth: '250px' }}>
            <EstadisticaCard
               title="Pedidos Pendientes"
               cantidad={12}
               total={8500.25}
               porcentajeCambio={-5.2}
               color="warning"
            />
         </Box>
         
         <Box css={{ flex: 1, minWidth: '250px' }}>
            <Card
               css={{
                  padding: '$6',
                  borderRadius: '$lg',
                  border: '2px solid',
                  backgroundColor: '#064e3b', // Verde oscuro como "Valor Total Inventario"
                  borderColor: '#047857',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                     transform: 'translateY(-2px)',
                     boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
               }}
            >
               <Flex direction="column" css={{ gap: '$2' }}>
                  <Text size="$sm" weight="medium" color="white">
                     Valor Total Pedidos
                  </Text>
                  
                  <Flex align="center" justify="between">
                     <Box>
                        <Text size="$2xl" weight="bold" color="white">
                           {estadisticasData.pedidosProgramados.cantidad}
                        </Text>
                        <Text size="$xs" color="$gray200">
                           programados
                        </Text>
                     </Box>
                     
                     <Box css={{ textAlign: 'right' }}>
                        <Text size="$lg" weight="semibold" color="white">
                           S/ {estadisticasData.pedidosProgramados.total.toLocaleString()}
                        </Text>
                        <Text size="$xs" color="$gray300">
                           Próxima: {new Date(estadisticasData.pedidosProgramados.proximaFecha).toLocaleDateString('es-PE')}
                        </Text>
                     </Box>
                  </Flex>
               </Flex>
            </Card>
         </Box>
      </Flex>
   );
};