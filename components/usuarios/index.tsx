import React, { useState, useEffect } from 'react';
import { Card, Button, Spacer, Text, Grid, Loading } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Usuario } from '../../types/usuarios';
import { AddUsuario } from './add-usuario';
import { UsuariosTable } from './usuarios-table';
import { getUsuarios } from '../../services/usuarios-api.service';

export const UsuariosContent = () => {
   const [showAddModal, setShowAddModal] = useState(false);
   const [usuarioToEdit, setUsuarioToEdit] = useState<Usuario | null>(null);
   const [refreshKey, setRefreshKey] = useState(0);
   
   // Estados para estadísticas
   const [stats, setStats] = useState({
      totalUsuarios: 0,
      administrativos: 0,
      operativos: 0,
      activos: 0
   });
   const [loadingStats, setLoadingStats] = useState(true);

   // Cargar estadísticas
   useEffect(() => {
      cargarEstadisticas();
   }, [refreshKey]);

   const cargarEstadisticas = async () => {
      setLoadingStats(true);
      try {
         const response = await getUsuarios(1);
         const usuarios = response.data;
         
         const administrativos = usuarios.filter(u => u.tipo_usuario === 'administrativo').length;
         const operativos = usuarios.filter(u => u.tipo_usuario === 'operativo').length;
         const activos = usuarios.filter(u => u.activo).length;
         
         setStats({
            totalUsuarios: response.meta.total,
            administrativos,
            operativos,
            activos
         });
      } catch (error) {
         console.error('Error al cargar estadísticas:', error);
      } finally {
         setLoadingStats(false);
      }
   };

   const handleAddUsuario = () => {
      setUsuarioToEdit(null);
      setShowAddModal(true);
   };

   const handleEditUsuario = (usuario: Usuario) => {
      setUsuarioToEdit(usuario);
      setShowAddModal(true);
   };

   const handleCloseModal = () => {
      setShowAddModal(false);
      setUsuarioToEdit(null);
   };

   const handleSuccess = () => {
      // Forzar recarga de la tabla y estadísticas
      setRefreshKey(prev => prev + 1);
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
         {/* Header */}
         <Flex justify="between" align="center">
            <Flex direction="column">
               <Text h3 css={{ color: '#034F32', fontWeight: 'bold' }}>
                  Gestión de Usuarios
               </Text>
               <Text css={{ fontSize: '$sm', color: '$accents7', mt: '$1' }}>
                  Administración de usuarios del sistema
               </Text>
            </Flex>
            <Button
               auto
               color="success"
               onClick={handleAddUsuario}
               css={{
                  background: '#034F32',
                  '&:hover': {
                     background: '#023320',
                  },
               }}
            >
               + Agregar Usuario
            </Button>
         </Flex>

         <Spacer y={1} />

         {/* Tarjetas de estadísticas */}
         <Grid.Container gap={2} css={{ mb: '$8' }}>
            <Grid xs={12} sm={3}>
               <Card css={{ 
                  background: '#F5F5F0',
                  padding: '$8'
               }}>
                  <Flex direction="column">
                     <Text 
                        css={{ 
                           fontSize: '$xs', 
                           color: '#5A5A5A',
                           fontWeight: '600',
                           textTransform: 'uppercase',
                           letterSpacing: '0.5px'
                        }}
                     >
                        Total Usuarios
                     </Text>
                     <Spacer y={0.5} />
                     {loadingStats ? (
                        <Loading color="currentColor" size="md" />
                     ) : (
                        <Text 
                           h2 
                           css={{ 
                              color: '#2C2C2C',
                              fontWeight: 'bold',
                              margin: 0
                           }}
                        >
                           {stats.totalUsuarios}
                        </Text>
                     )}
                  </Flex>
               </Card>
            </Grid>

            <Grid xs={12} sm={3}>
               <Card css={{ 
                  background: '#D4F4DD',
                  padding: '$8'
               }}>
                  <Flex direction="column">
                     <Text 
                        css={{ 
                           fontSize: '$xs', 
                           color: '#2A6B3F',
                           fontWeight: '600',
                           textTransform: 'uppercase',
                           letterSpacing: '0.5px'
                        }}
                     >
                        Administrativos
                     </Text>
                     <Spacer y={0.5} />
                     {loadingStats ? (
                        <Loading color="currentColor" size="md" />
                     ) : (
                        <Text 
                           h2 
                           css={{ 
                              color: '#1A4D2E',
                              fontWeight: 'bold',
                              margin: 0
                           }}
                        >
                           {stats.administrativos}
                        </Text>
                     )}
                  </Flex>
               </Card>
            </Grid>

            <Grid xs={12} sm={3}>
               <Card css={{ 
                  background: '#FFE4E8',
                  padding: '$8'
               }}>
                  <Flex direction="column">
                     <Text 
                        css={{ 
                           fontSize: '$xs', 
                           color: '#8B4A5A',
                           fontWeight: '600',
                           textTransform: 'uppercase',
                           letterSpacing: '0.5px'
                        }}
                     >
                        Operativos
                     </Text>
                     <Spacer y={0.5} />
                     {loadingStats ? (
                        <Loading color="currentColor" size="md" />
                     ) : (
                        <Text 
                           h2 
                           css={{ 
                              color: '#6B2C3A',
                              fontWeight: 'bold',
                              margin: 0
                           }}
                        >
                           {stats.operativos}
                        </Text>
                     )}
                  </Flex>
               </Card>
            </Grid>

            <Grid xs={12} sm={3}>
               <Card css={{ 
                  background: '#034F32',
                  padding: '$8'
               }}>
                  <Flex direction="column">
                     <Text 
                        css={{ 
                           fontSize: '$xs', 
                           color: 'white',
                           opacity: 0.9,
                           fontWeight: '600',
                           textTransform: 'uppercase',
                           letterSpacing: '0.5px'
                        }}
                     >
                        Usuarios Activos
                     </Text>
                     <Spacer y={0.5} />
                     {loadingStats ? (
                        <Loading color="white" size="md" />
                     ) : (
                        <Text 
                           h2 
                           css={{ 
                              color: 'white',
                              fontWeight: 'bold',
                              margin: 0
                           }}
                        >
                           {stats.activos}
                        </Text>
                     )}
                  </Flex>
               </Card>
            </Grid>
         </Grid.Container>

         {/* Tabla de usuarios */}
         <Card css={{ padding: '$10', background: 'white' }}>
            <UsuariosTable 
               onEdit={handleEditUsuario} 
               onRefresh={handleSuccess}
            />
         </Card>

         {/* Modal para agregar/editar usuario */}
         <AddUsuario
            open={showAddModal}
            onClose={handleCloseModal}
            onSuccess={handleSuccess}
            usuarioToEdit={usuarioToEdit}
         />
      </Flex>
   );
};
