import React, { useState } from 'react';
import { Card, Button, Spacer, Text, Grid } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { TipoCliente } from '../../types/clientes';
import { AddClienteMayorista } from './add-cliente-mayorista';
import { AddClienteMinorista } from './add-cliente-minorista';
import { ClientesTable } from './clientes-table';
import { CompactApiStatus } from './compact-api-status';
import { ApiDiagnosticModal } from './api-diagnostic-modal';

export const ClientesContent = () => {
   const [activeTab, setActiveTab] = useState<TipoCliente>(TipoCliente.MAYORISTA);
   const [showAddModal, setShowAddModal] = useState(false);
   const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
   const [apiConnected, setApiConnected] = useState<boolean | null>(null);

   // Datos de ejemplo para estadísticas (en el futuro vendrá de la API)
   const stats = {
      totalClientes: 156,
      clientesMayoristas: 89,
      clientesMinoristas: 67,
      clientesActivos: 142
   };

   const handleAddCliente = () => {
      setShowAddModal(true);
   };

   const handleCloseModal = () => {
      setShowAddModal(false);
   };

   const handleTabChange = (tipo: TipoCliente) => {
      setActiveTab(tipo);
   };

   const handleApiStatusChange = (connected: boolean) => {
      setApiConnected(connected);
   };

   return (
      <Flex
         css={{
            mt: '$5',
            px: '$6',
            '@sm': {
               mt: '$10',
               px: '$16',
            },
         }}
         justify={'center'}
         direction={'column'}
      >
         <Flex justify="between" align="center">
            <Flex direction="column">
               <Text h3 css={{ color: '#034F32', fontWeight: 'bold' }}>
                  Gestión de Clientes
               </Text>
               {apiConnected === false && (
                  <Text css={{ fontSize: '$xs', color: '$warning', mt: '$1' }}>
                     💡 Tip: Haz doble clic en el indicador de API para ejecutar diagnósticos
                  </Text>
               )}
            </Flex>
            <Flex align="center" css={{ gap: '$2' }}>
               <Button
                  auto
                  flat
                  color="warning"
                  size="sm"
                  onPress={() => setShowDiagnosticModal(true)}
               >
                  🔧 Diagnóstico API
               </Button>
               <CompactApiStatus onStatusChange={handleApiStatusChange} />
            </Flex>
         </Flex>
         
         <Spacer y={1} />

         {/* Tarjetas de estadísticas */}
         <Grid.Container gap={2} justify="center">
            <Grid xs={6} md={3}>
               <Card css={{ backgroundColor: '#F1F1E9', p: '$6', w: '100%' }}>
                  <Card.Body>
                     <Text css={{ color: '#034F32', fontSize: '2rem', fontWeight: 'bold' }}>
                        {stats.totalClientes}
                     </Text>
                     <Text css={{ color: '#034F32', fontSize: '0.9rem' }}>
                        Total Clientes
                     </Text>
                  </Card.Body>
               </Card>
            </Grid>
            <Grid xs={6} md={3}>
               <Card css={{ backgroundColor: '#C8ECC9', p: '$6', w: '100%' }}>
                  <Card.Body>
                     <Text css={{ color: '#034F32', fontSize: '2rem', fontWeight: 'bold' }}>
                        {stats.clientesMayoristas}
                     </Text>
                     <Text css={{ color: '#034F32', fontSize: '0.9rem' }}>
                        Mayoristas
                     </Text>
                  </Card.Body>
               </Card>
            </Grid>
            <Grid xs={6} md={3}>
               <Card css={{ backgroundColor: '#F8D7DA', p: '$6', w: '100%' }}>
                  <Card.Body>
                     <Text css={{ color: '#034F32', fontSize: '2rem', fontWeight: 'bold' }}>
                        {stats.clientesMinoristas}
                     </Text>
                     <Text css={{ color: '#034F32', fontSize: '0.9rem' }}>
                        Minoristas
                     </Text>
                  </Card.Body>
               </Card>
            </Grid>
            <Grid xs={6} md={3}>
               <Card css={{ backgroundColor: '#034F32', p: '$6', w: '100%' }}>
                  <Card.Body>
                     <Text css={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                        {stats.clientesActivos}
                     </Text>
                     <Text css={{ color: 'white', fontSize: '0.9rem' }}>
                        Activos
                     </Text>
                  </Card.Body>
               </Card>
            </Grid>
         </Grid.Container>

         <Spacer y={2} />

         {/* Selector de tipo y botón de agregar */}
         <Flex justify="between" align="center" css={{ flexWrap: 'wrap', gap: '$4' }}>
            <Flex css={{ gap: '$2' }}>
               <Button 
                  auto 
                  flat={activeTab !== TipoCliente.MAYORISTA}
                  css={{
                     backgroundColor: activeTab === TipoCliente.MAYORISTA ? '#5CAC4C' : 'transparent',
                     color: activeTab === TipoCliente.MAYORISTA ? 'white' : '#034F32',
                     border: '2px solid #5CAC4C',
                     '&:hover': {
                        backgroundColor: activeTab === TipoCliente.MAYORISTA ? '#4A9C3C' : '#F1F1E9'
                     }
                  }}
                  onPress={() => handleTabChange(TipoCliente.MAYORISTA)}
               >
                  Clientes Mayoristas ({stats.clientesMayoristas})
               </Button>
               <Button 
                  auto 
                  flat={activeTab !== TipoCliente.MINORISTA}
                  css={{
                     backgroundColor: activeTab === TipoCliente.MINORISTA ? '#5CAC4C' : 'transparent',
                     color: activeTab === TipoCliente.MINORISTA ? 'white' : '#034F32',
                     border: '2px solid #5CAC4C',
                     '&:hover': {
                        backgroundColor: activeTab === TipoCliente.MINORISTA ? '#4A9C3C' : '#F1F1E9'
                     }
                  }}
                  onPress={() => handleTabChange(TipoCliente.MINORISTA)}
               >
                  Clientes Minoristas ({stats.clientesMinoristas})
               </Button>
            </Flex>
            
            <Button
               auto
               disabled={apiConnected === false}
               css={{
                  backgroundColor: apiConnected === false ? '$gray400' : '#5CAC4C',
                  color: 'white',
                  '&:hover': {
                     backgroundColor: apiConnected === false ? '$gray400' : '#4A9C3C'
                  }
               }}
               onPress={handleAddCliente}
            >
               Agregar Cliente {activeTab === TipoCliente.MAYORISTA ? 'Mayorista' : 'Minorista'}
            </Button>
         </Flex>

         <Spacer y={1.5} />

         {/* Tabla de clientes */}
         <ClientesTable tipoCliente={activeTab} apiConnected={apiConnected} />

         {/* Modales de agregar clientes */}
         {showAddModal && activeTab === TipoCliente.MAYORISTA && (
            <AddClienteMayorista 
               open={showAddModal} 
               onClose={handleCloseModal}
            />
         )}
         
         {showAddModal && activeTab === TipoCliente.MINORISTA && (
            <AddClienteMinorista 
               open={showAddModal} 
               onClose={handleCloseModal}
            />
         )}

         {/* Modal de diagnóstico de API */}
         <ApiDiagnosticModal 
            open={showDiagnosticModal}
            onClose={() => setShowDiagnosticModal(false)}
         />
      </Flex>
   );
};