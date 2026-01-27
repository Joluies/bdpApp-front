import React, { useEffect, useState } from 'react';
import { Card, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { useClientSide } from '../hooks/useClientSide';

// Simulamos datos - en producción vendrían de una API
const estadisticasData = {
   ventasHoy: {
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
   ventasProgramadas: {
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
   const isClient = useClientSide();

   const formatCurrency = (amount: number) => {
      if (!isClient) return 'S/ 0.00';
      return new Intl.NumberFormat('es-PE', {
         style: 'currency',
         currency: 'PEN',
      }).format(amount);
   };

   const getColorClasses = () => {
      switch (color) {
         case 'success':
            return {
               background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
               borderColor: '#10b981',
            };
         case 'warning':
            return {
               background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
               borderColor: '#f59e0b',
            };
         case 'secondary':
            return {
               background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
               borderColor: '#06b6d4',
            };
         default:
            return {
               background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
               borderColor: '#3b82f6',
            };
      }
   };

   const isSecondary = color === 'secondary' || color === 'success' || color === 'warning';

   if (!isClient) {
      return (
         <Card
            css={{
               padding: '$8',
               borderRadius: '$xl',
               border: 'none',
               minHeight: '120px',
            }}
         >
            <div>Cargando...</div>
         </Card>
      );
   }

   const colorStyles = getColorClasses();

   return (
      <Card
         css={{
            padding: '$8',
            borderRadius: '$xl',
            border: 'none',
            background: colorStyles.background,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 30px ' + (
               color === 'success' ? 'rgba(16, 185, 129, 0.25)' :
               color === 'warning' ? 'rgba(245, 158, 11, 0.25)' :
               color === 'secondary' ? 'rgba(6, 182, 212, 0.25)' :
               'rgba(59, 130, 246, 0.25)'
            ),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
               transform: 'translateY(-4px)',
               boxShadow: '0 15px 40px ' + (
                  color === 'success' ? 'rgba(16, 185, 129, 0.35)' :
                  color === 'warning' ? 'rgba(245, 158, 11, 0.35)' :
                  color === 'secondary' ? 'rgba(6, 182, 212, 0.35)' :
                  'rgba(59, 130, 246, 0.35)'
               ),
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
                  <Text size="$xs" color={isSecondary ? 'rgba(255, 255, 255, 0.7)' : '$gray500'}>
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
                           color={porcentajeCambio >= 0 ? '$success700' : '$error700'}
                           weight="medium"
                        >
                           {porcentajeCambio >= 0 ? '+' : ''}{porcentajeCambio}%
                        </Text>
                        <Text size="$xs" color="$gray500">
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
   const isClient = useClientSide();

   if (!isClient) {
      return (
         <Flex
            css={{
               gap: '$4',
               flexWrap: 'wrap',
               '@sm': { flexDirection: 'column' },
               '@md': { flexDirection: 'row' },
            }}
         >
            {[1, 2, 3, 4].map((i) => (
               <Box key={i} css={{ flex: 1, minWidth: '250px' }}>
                  <Card css={{ padding: '$6', minHeight: '120px' }}>
                     <div>Cargando...</div>
                  </Card>
               </Box>
            ))}
         </Flex>
      );
   }

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
               title="Ventas Hoy"
               cantidad={estadisticasData.ventasHoy.cantidad}
               total={estadisticasData.ventasHoy.total}
               porcentajeCambio={estadisticasData.ventasHoy.porcentajeCambio}
               color="success"
            />
         </Box>
         
         <Box css={{ flex: 1, minWidth: '250px' }}>
            <EstadisticaCard
               title="Ventas Esta Semana"
               cantidad={estadisticasData.ventasSemana.cantidad}
               total={estadisticasData.ventasSemana.total}
               porcentajeCambio={estadisticasData.ventasSemana.porcentajeCambio}
               color="primary"
            />
         </Box>
         
         <Box css={{ flex: 1, minWidth: '250px' }}>
            <EstadisticaCard
               title="Ventas Este Mes"
               cantidad={estadisticasData.ventasMes.cantidad}
               total={estadisticasData.ventasMes.total}
               porcentajeCambio={estadisticasData.ventasMes.porcentajeCambio}
               color="secondary"
            />
         </Box>
         
         <Box css={{ flex: 1, minWidth: '250px' }}>
            <Card
               css={{
                  padding: '$6',
                  borderRadius: '$lg',
                  border: '2px solid',
                  backgroundColor: '$warning50',
                  borderColor: '$warning200',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                     transform: 'translateY(-2px)',
                     boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  }
               }}
            >
               <Flex direction="column" css={{ gap: '$2' }}>
                  <Text size="$sm" weight="medium" color="$gray600">
                     Ventas Programadas
                  </Text>
                  
                  <Flex align="center" justify="between">
                     <Box>
                        <Text size="$2xl" weight="bold" color="$gray900">
                           {estadisticasData.ventasProgramadas.cantidad}
                        </Text>
                        <Text size="$xs" color="$gray500">
                           pendientes
                        </Text>
                     </Box>
                     
                     <Box css={{ textAlign: 'right' }}>
                        <Text size="$lg" weight="semibold" color="$gray800">
                           S/ {estadisticasData.ventasProgramadas.total.toLocaleString()}
                        </Text>
                        <Text size="$xs" color="$warning700">
                           Próxima: {new Date(estadisticasData.ventasProgramadas.proximaFecha).toLocaleDateString('es-PE')}
                        </Text>
                     </Box>
                  </Flex>
               </Flex>
            </Card>
         </Box>
      </Flex>
   );
};