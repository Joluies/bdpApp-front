import React from 'react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { Text } from '@nextui-org/react';
import { EstadisticasCards } from './estadisticas-cards';
import { VentasTable } from './ventas-table';
import { VentasPorVendedorChart } from './ventas-por-vendedor-chart';
import { VentasPorDiaChart } from './ventas-por-dia-chart';
import { AddVentaModal } from './add-venta-modal';

export const VentasContent = () => {
   return (
      <Box css={{ overflow: 'hidden', height: '100%' }}>
         <Flex
            css={{
               gap: '$6',
               flexDirection: 'column',
               '@sm': {
                  flexDirection: 'column',
               },
               '@md': {
                  flexDirection: 'column',
               },
               '@lg': {
                  flexDirection: 'column',
               },
            }}
         >
            {/* Título */}
            <Flex justify={'between'} align={'center'}>
               <Text h3 css={{ margin: 0 }}>
                  Gestión de Ventas
               </Text>
            </Flex>

            {/* Estadísticas generales */}
            <EstadisticasCards />

            {/* Gráficos de análisis */}
            <Flex
               css={{
                  gap: '$6',
                  flexWrap: 'wrap',
                  '@sm': { flexDirection: 'column' },
                  '@md': { flexDirection: 'row' },
               }}
            >
               <Box css={{ flex: 1, minWidth: '300px' }}>
                  <VentasPorVendedorChart />
               </Box>
               <Box css={{ flex: 1, minWidth: '300px' }}>
                  <VentasPorDiaChart />
               </Box>
            </Flex>

            {/* Tabla principal de ventas */}
            <VentasTable />
         </Flex>
      </Box>
   );
};