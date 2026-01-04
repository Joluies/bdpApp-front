import {Avatar, Dropdown, Navbar, Text, Loading} from '@nextui-org/react';
import React from 'react';
import { useRouter } from 'next/router';
import {DarkModeSwitch} from './darkmodeswitch';
import { useAuth } from '../../context/auth.context';

export const UserDropdown = () => {
   const { usuario, logout, cargando } = useAuth();
   const router = useRouter();

   const handleLogout = async () => {
      try {
         await logout();
         router.push('/login');
      } catch (error) {
         console.error('Error al cerrar sesión:', error);
      }
   };

   if (cargando) {
      return <Loading size="sm" color="secondary" />;
   }

   const nombreUsuario = usuario 
      ? `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim() || usuario.username
      : 'Usuario';

   const iniciales = usuario 
      ? `${usuario.nombre?.charAt(0) || ''}${usuario.apellido?.charAt(0) || ''}`
      : 'U';

   return (
      <Dropdown placement="bottom-right">
         <Navbar.Item>
            <Dropdown.Trigger>
               <Avatar
                  bordered
                  as="button"
                  color="secondary"
                  size="md"
                  text={iniciales}
                  pointer
               />
            </Dropdown.Trigger>
         </Navbar.Item>
         <Dropdown.Menu
            aria-label="User menu actions"
            onAction={(actionKey) => {
               if (actionKey === 'logout') {
                  handleLogout();
               }
            }}
         >
            <Dropdown.Item key="profile" css={{height: '$18'}}>
               <Text b color="inherit" css={{d: 'flex'}}>
                  Sesión iniciada como
               </Text>
               <Text b color="inherit" css={{d: 'flex', fontSize: '12px'}}>
                  {nombreUsuario}
               </Text>
               <Text color="inherit" css={{d: 'flex', fontSize: '11px', color: '$accents6'}}>
                  @{usuario?.username}
               </Text>
            </Dropdown.Item>
            <Dropdown.Item key="settings" withDivider>
               Mi Perfil
            </Dropdown.Item>
            <Dropdown.Item key="team_settings">Configuración</Dropdown.Item>
            <Dropdown.Item key="help_and_feedback" withDivider>
               Ayuda y Soporte
            </Dropdown.Item>
            <Dropdown.Item key="logout" withDivider color="error">
               Cerrar Sesión
            </Dropdown.Item>
            <Dropdown.Item key="switch" withDivider>
               <DarkModeSwitch />
            </Dropdown.Item>
         </Dropdown.Menu>
      </Dropdown>
   );
};
