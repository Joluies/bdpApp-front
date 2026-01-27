import React from 'react';
import { Box } from '../styles/box';
import { Flex } from '../styles/flex';
import { Text } from '@nextui-org/react';
import { EstadisticasCards } from './estadisticas-cards';
import { PedidosTable } from './pedidos-table';

export const PedidosContent = () => {
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
            <Flex justify={'between'} align={'center'} css={{
               background: 'linear-gradient(135deg, #7c3aed 0%, #5b21b6 100%)',
               padding: '$6',
               borderRadius: '$xl',
               mb: '$4',
            }}>
               <Text h3 css={{ 
                  margin: 0,
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '$2xl',
               }}>
                  📋 Gestión de Pedidos
               </Text>
            </Flex>

            {/* Estadísticas generales */}
            <EstadisticasCards />

            {/* Tabla principal de pedidos */}
            <PedidosTable />
         </Flex>
      </Box>
   );
};