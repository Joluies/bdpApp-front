import React, { useEffect, useState } from 'react';
import { Card, Text } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import { useClientSide } from '../hooks/useClientSide';

// Datos simulados para el gráfico de ventas por vendedor
const ventasPorVendedorData = [
   {
      vendedor: 'Juan Carlos Pérez',
      ventasHoy: 8,
      ventasMes: 45,
      totalMes: 25640.50
   },
   {
      vendedor: 'Ana María Silva',
      ventasHoy: 6,
      ventasMes: 38,
      totalMes: 19850.25
   },
   {
      vendedor: 'Carlos López',
      ventasHoy: 4,
      ventasMes: 32,
      totalMes: 16420.75
   },
   {
      vendedor: 'María González',
      ventasHoy: 7,
      ventasMes: 41,
      totalMes: 22380.00
   }
];

export const VentasPorVendedorChart = () => {
   const isClient = useClientSide();

   const formatCurrency = (amount: number) => {
      if (!isClient) return 'S/ 0.00';
      return new Intl.NumberFormat('es-PE', {
         style: 'currency',
         currency: 'PEN',
      }).format(amount);
   };

   const maxVentas = Math.max(...ventasPorVendedorData.map(v => v.ventasMes));

   if (!isClient) {
      return (
         <Card css={{ height: '400px', padding: '$4' }}>
            <Card.Header css={{ paddingBottom: '$2' }}>
               <Text h4 css={{ margin: 0 }}>
                  Ventas por Vendedor (Este Mes)
               </Text>
            </Card.Header>
            <Card.Body css={{ padding: 0 }}>
               <div>Cargando gráfico...</div>
            </Card.Body>
         </Card>
      );
   }

   return (
      <Card css={{ height: '400px', padding: '$4' }}>
         <Card.Header css={{ paddingBottom: '$2' }}>
            <Text h4 css={{ margin: 0 }}>
               Ventas por Vendedor (Este Mes)
            </Text>
         </Card.Header>
         <Card.Body css={{ padding: 0 }}>
            <Flex direction="column" css={{ gap: '$3', height: '100%' }}>
               {ventasPorVendedorData.map((vendedor, index) => {
                  const porcentaje = (vendedor.ventasMes / maxVentas) * 100;
                  
                  return (
                     <Box key={index} css={{ width: '100%' }}>
                        <Flex justify="between" align="center" css={{ marginBottom: '$1' }}>
                           <Text size="$sm" weight="medium">
                              {vendedor.vendedor}
                           </Text>
                           <Flex align="center" css={{ gap: '$2' }}>
                              <Text size="$sm" color="$primary">
                                 {vendedor.ventasMes} ventas
                              </Text>
                              <Text size="$xs" color="$gray600">
                                 (Hoy: {vendedor.ventasHoy})
                              </Text>
                           </Flex>
                        </Flex>
                        
                        <Box css={{ position: 'relative', width: '100%', height: '24px', marginBottom: '$1' }}>
                           <Box
                              css={{
                                 position: 'absolute',
                                 top: 0,
                                 left: 0,
                                 width: '100%',
                                 height: '100%',
                                 backgroundColor: '$gray200',
                                 borderRadius: '$sm'
                              }}
                           />
                           <Box
                              css={{
                                 position: 'absolute',
                                 top: 0,
                                 left: 0,
                                 width: `${porcentaje}%`,
                                 height: '100%',
                                 backgroundColor: index === 0 ? '$success' : index === 1 ? '$primary' : index === 2 ? '$secondary' : '$warning',
                                 borderRadius: '$sm',
                                 transition: 'width 0.3s ease'
                              }}
                           />
                        </Box>
                        
                        <Text size="$xs" color="$gray700">
                           Total: {formatCurrency(vendedor.totalMes)}
                        </Text>
                     </Box>
                  );
               })}
            </Flex>
         </Card.Body>
      </Card>
   );
};