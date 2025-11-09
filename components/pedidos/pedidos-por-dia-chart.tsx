import React from 'react';
import { Card, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';

// Datos simulados para ventas por día (últimos 7 días)
const ventasPorDiaData = [
   { fecha: '2025-10-31', ventas: 12, total: 8450.25 },
   { fecha: '2025-11-01', ventas: 15, total: 10230.50 },
   { fecha: '2025-11-02', ventas: 8, total: 5890.75 },
   { fecha: '2025-11-03', ventas: 18, total: 12640.00 },
   { fecha: '2025-11-04', ventas: 22, total: 15230.25 },
   { fecha: '2025-11-05', ventas: 16, total: 11450.50 },
   { fecha: '2025-11-06', ventas: 25, total: 18750.75 },
];

export const PedidosPorDiaChart = () => {
   const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat('es-PE', {
         style: 'currency',
         currency: 'PEN',
         minimumFractionDigits: 0,
         maximumFractionDigits: 0
      }).format(amount);
   };

   const maxVentas = Math.max(...ventasPorDiaData.map(v => v.ventas));
   const maxTotal = Math.max(...ventasPorDiaData.map(v => v.total));

   const formatFecha = (fecha: string) => {
      const date = new Date(fecha);
      const today = new Date();
      
      if (date.toDateString() === today.toDateString()) {
         return 'Hoy';
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (date.toDateString() === yesterday.toDateString()) {
         return 'Ayer';
      }
      
      return date.toLocaleDateString('es-PE', { 
         weekday: 'short', 
         day: '2-digit' 
      });
   };

   return (
      <Card css={{ height: '400px', padding: '$4' }}>
         <Card.Header css={{ paddingBottom: '$2' }}>
            <Text h4 css={{ margin: 0 }}>
               Ventas por Día (Últimos 7 días)
            </Text>
         </Card.Header>
         <Card.Body css={{ padding: 0 }}>
            <Flex direction="column" css={{ height: '100%', gap: '$2' }}>
               {/* Gráfico de barras simple */}
               <Box css={{ flex: 1, position: 'relative' }}>
                  <Flex 
                     align="end" 
                     justify="between" 
                     css={{ 
                        height: '200px', 
                        padding: '$2 0',
                        gap: '$1'
                     }}
                  >
                     {ventasPorDiaData.map((dia, index) => {
                        const alturaVentas = (dia.ventas / maxVentas) * 180;
                        const esHoy = dia.fecha === '2025-11-06';
                        
                        return (
                           <Flex 
                              key={dia.fecha} 
                              direction="column" 
                              align="center" 
                              css={{ 
                                 flex: 1,
                                 gap: '$1'
                              }}
                           >
                              <Text size="$xs" weight="bold" css={{ marginBottom: '$1' }}>
                                 {dia.ventas}
                              </Text>
                              <Box
                                 css={{
                                    width: '24px',
                                    height: `${alturaVentas}px`,
                                    backgroundColor: esHoy ? '$success' : '$primary',
                                    borderRadius: '$sm',
                                    minHeight: '10px',
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                       opacity: 0.8,
                                       transform: 'scale(1.05)'
                                    }
                                 }}
                              />
                              <Text size="$xs" css={{ textAlign: 'center' }}>
                                 {formatFecha(dia.fecha)}
                              </Text>
                           </Flex>
                        );
                     })}
                  </Flex>
               </Box>

               {/* Resumen */}
               <Box css={{ borderTop: '1px solid $gray300', paddingTop: '$3' }}>
                  <Flex justify="between" css={{ marginBottom: '$2' }}>
                     <Text size="$sm" weight="medium">
                        Resumen de la Semana
                     </Text>
                  </Flex>
                  <Flex justify="between" align="center">
                     <Box>
                        <Text size="$xs" color="$gray600">
                           Total de Ventas
                        </Text>
                        <Text size="$sm" weight="bold">
                           {ventasPorDiaData.reduce((acc, dia) => acc + dia.ventas, 0)} ventas
                        </Text>
                     </Box>
                     <Box css={{ textAlign: 'right' }}>
                        <Text size="$xs" color="$gray600">
                           Monto Total
                        </Text>
                        <Text size="$sm" weight="bold">
                           {formatCurrency(ventasPorDiaData.reduce((acc, dia) => acc + dia.total, 0))}
                        </Text>
                     </Box>
                  </Flex>
                  <Box css={{ marginTop: '$2' }}>
                     <Text size="$xs" color="$gray600">
                        Promedio diario: {Math.round(ventasPorDiaData.reduce((acc, dia) => acc + dia.ventas, 0) / 7)} ventas
                        - {formatCurrency(ventasPorDiaData.reduce((acc, dia) => acc + dia.total, 0) / 7)}
                     </Text>
                  </Box>
               </Box>
            </Flex>
         </Card.Body>
      </Card>
   );
};