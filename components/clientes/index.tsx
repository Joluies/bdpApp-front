import React, { useState, useEffect } from 'react';
import { Card, Button, Spacer, Text, Grid, Loading, Modal } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { TipoCliente } from '../../types/clientes';
import { AddClienteMayorista } from './add-cliente-mayorista';
import { AddClienteMinorista } from './add-cliente-minorista';
import { ClientesTable } from './clientes-table';
import { CompactApiStatus } from './compact-api-status';
import { ApiDiagnosticModal } from './api-diagnostic-modal';
import { clientesApiService } from '../../services/clientes-api.service';

export const ClientesContent = () => {
   const [activeTab, setActiveTab] = useState<TipoCliente>(TipoCliente.MAYORISTA);
   const [showAddModal, setShowAddModal] = useState(false);
   const [showTypeSelectionModal, setShowTypeSelectionModal] = useState(false);
   const [showDiagnosticModal, setShowDiagnosticModal] = useState(false);
   const [apiConnected, setApiConnected] = useState<boolean | null>(null);
   
   // Estados para estadísticas desde la API
   const [stats, setStats] = useState({
      totalClientes: 0,
      clientesMayoristas: 0,
      clientesMinoristas: 0,
      clientesActivos: 0
   });
   const [loadingStats, setLoadingStats] = useState(true);

   // Cargar estadísticas desde la API
   useEffect(() => {
      cargarEstadisticas();
   }, [apiConnected]);

   const cargarEstadisticas = async () => {
      if (apiConnected === false) {
         setLoadingStats(false);
         return;
      }

      setLoadingStats(true);
      try {
         const estadisticas = await clientesApiService.obtenerEstadisticasClientes();
         setStats({
            totalClientes: estadisticas.total,
            clientesMayoristas: estadisticas.mayoristas,
            clientesMinoristas: estadisticas.minoristas,
            clientesActivos: estadisticas.total // Asumimos que todos están activos por ahora
         });
      } catch (error) {
         console.error('Error al cargar estadísticas:', error);
         // Mantener los valores en 0 si hay error
      } finally {
         setLoadingStats(false);
      }
   };

   const handleAddCliente = () => {
      setShowTypeSelectionModal(true);
   };

   const handleSelectType = (tipo: TipoCliente) => {
      setActiveTab(tipo);
      setShowTypeSelectionModal(false);
      setShowAddModal(true);
   };

   const handleCloseModal = () => {
      setShowAddModal(false);
      // Recargar estadísticas después de cerrar el modal (por si se agregó un cliente)
      cargarEstadisticas();
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
         <Flex justify="between" align="center" css={{
            background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
            padding: '$6',
            borderRadius: '$xl',
            marginBottom: '$4',
         }}>
            <Flex direction="column">
               <Text h3 css={{ color: 'white', fontWeight: 'bold' }}>
                  👥 Gestión de Clientes
               </Text>
               {apiConnected === false && (
                  <Text css={{ fontSize: '$xs', color: 'rgba(255, 255, 255, 0.8)', mt: '$1' }}>
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
               <Card css={{ 
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  p: '$8', 
                  w: '100%',
                  borderRadius: '$xl',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(59, 130, 246, 0.25)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                     transform: 'translateY(-4px)',
                     boxShadow: '0 15px 40px rgba(59, 130, 246, 0.35)'
                  }
               }}>
                  <Card.Body css={{ padding: 0 }}>
                     {loadingStats ? (
                        <Loading size="lg" color="success" />
                     ) : (
                        <>
                           <Text css={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                              {stats.totalClientes}
                           </Text>
                           <Text css={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                              Total Clientes
                           </Text>
                        </>
                     )}
                  </Card.Body>
               </Card>
            </Grid>
            <Grid xs={6} md={3}>
               <Card css={{ 
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  p: '$8', 
                  w: '100%',
                  borderRadius: '$xl',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(16, 185, 129, 0.25)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                     transform: 'translateY(-4px)',
                     boxShadow: '0 15px 40px rgba(16, 185, 129, 0.35)'
                  }
               }}>
                  <Card.Body css={{ padding: 0 }}>
                     {loadingStats ? (
                        <Loading size="lg" color="success" />
                     ) : (
                        <>
                           <Text css={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                              {stats.clientesMayoristas}
                           </Text>
                           <Text css={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                              Mayoristas
                           </Text>
                        </>
                     )}
                  </Card.Body>
               </Card>
            </Grid>
            <Grid xs={6} md={3}>
               <Card css={{ 
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  p: '$8', 
                  w: '100%',
                  borderRadius: '$xl',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(245, 158, 11, 0.25)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                     transform: 'translateY(-4px)',
                     boxShadow: '0 15px 40px rgba(245, 158, 11, 0.35)'
                  }
               }}>
                  <Card.Body css={{ padding: 0 }}>
                     {loadingStats ? (
                        <Loading size="lg" color="success" />
                     ) : (
                        <>
                           <Text css={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                              {stats.clientesMinoristas}
                           </Text>
                           <Text css={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                              Minoristas
                           </Text>
                        </>
                     )}
                  </Card.Body>
               </Card>
            </Grid>
            <Grid xs={6} md={3}>
               <Card css={{ 
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  p: '$8', 
                  w: '100%',
                  borderRadius: '$xl',
                  border: 'none',
                  boxShadow: '0 10px 30px rgba(6, 182, 212, 0.25)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                     transform: 'translateY(-4px)',
                     boxShadow: '0 15px 40px rgba(6, 182, 212, 0.35)'
                  }
               }}>
                  <Card.Body css={{ padding: 0 }}>
                     {loadingStats ? (
                        <Loading size="lg" color="white" />
                     ) : (
                        <>
                           <Text css={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>
                              {stats.clientesActivos}
                           </Text>
                           <Text css={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '0.9rem' }}>
                              Activos
                           </Text>
                        </>
                     )}
                  </Card.Body>
               </Card>
            </Grid>
         </Grid.Container>

         <Spacer y={2} />

         {/* Botón de agregar cliente */}
         <Flex justify="end" css={{ mb: '$4' }}>
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
               ➕ Agregar Cliente
            </Button>
         </Flex>

         <Spacer y={1} />

         {/* Tabla de clientes */}
         <ClientesTable apiConnected={apiConnected} />

         {/* Modales de agregar clientes */}
         {/* Modal de selección de tipo */}
         <Modal
            closeButton
            aria-labelledby="modal-tipo"
            open={showTypeSelectionModal}
            onClose={() => setShowTypeSelectionModal(false)}
            width="400px"
         >
            <Modal.Header css={{ fontSize: '18px', fontWeight: '$bold' }}>
               Seleccionar Tipo de Cliente
            </Modal.Header>
            <Modal.Body css={{ py: '$6', gap: '$4' }}>
               <Text>¿Qué tipo de cliente deseas agregar?</Text>
               <Flex direction="column" css={{ gap: '$3' }}>
                  <Button
                     flat
                     color="success"
                     onPress={() => handleSelectType(TipoCliente.MAYORISTA)}
                     css={{
                        backgroundColor: '#C8ECC9',
                        color: '#034F32',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        height: '50px'
                     }}
                  >
                     🏢 Cliente Mayorista
                  </Button>
                  <Button
                     flat
                     color="success"
                     onPress={() => handleSelectType(TipoCliente.MINORISTA)}
                     css={{
                        backgroundColor: '#F8D7DA',
                        color: '#034F32',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        height: '50px'
                     }}
                  >
                     👤 Cliente Minorista
                  </Button>
               </Flex>
            </Modal.Body>
         </Modal>

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