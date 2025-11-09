import React, { useState, useEffect } from 'react';
import { Badge, Text, Tooltip, Button } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { clientesApiService } from '../../services/clientes-api.service';
import { ApiDiagnosticModal } from './api-diagnostic-modal';

interface CompactApiStatusProps {
   onStatusChange?: (connected: boolean) => void;
}

export const CompactApiStatus = ({ onStatusChange }: CompactApiStatusProps) => {
   const [isConnected, setIsConnected] = useState<boolean | null>(null);
   const [isChecking, setIsChecking] = useState(false);
   const [lastCheck, setLastCheck] = useState<Date | null>(null);
   const [showDiagnostic, setShowDiagnostic] = useState(false);

   const checkApiConnection = async () => {
      setIsChecking(true);
      try {
         // Intentar primero el método principal
         let isApiConnected = await clientesApiService.verificarConexion();
         
         // Si falla, intentar el método alternativo
         if (!isApiConnected) {
            console.log('Método principal falló, intentando método alternativo...');
            isApiConnected = await clientesApiService.verificarConexionAlternativa();
         }
         
         setIsConnected(isApiConnected);
         onStatusChange?.(isApiConnected);
         
         if (isApiConnected) {
            console.log('✅ API conectada exitosamente');
         } else {
            console.warn('❌ API no disponible - ambos métodos fallaron');
         }
      } catch (error) {
         console.warn('Error en verificación de API:', error);
         setIsConnected(false);
         onStatusChange?.(false);
      } finally {
         setIsChecking(false);
         setLastCheck(new Date());
      }
   };

   useEffect(() => {
      checkApiConnection();
      const interval = setInterval(checkApiConnection, 30000);
      return () => clearInterval(interval);
   }, []);

   const getStatusColor = () => {
      if (isChecking) return 'warning';
      return isConnected ? 'success' : 'error';
   };

   const getTooltipContent = () => {
      const status = isChecking ? 'Verificando conexión...' : 
                    isConnected ? 'API Conectada' : 'API Desconectada';
      const lastCheckText = lastCheck ? 
         `Última verificación: ${lastCheck.toLocaleTimeString()}` : '';
      
      return (
         <div>
            <div>{status}</div>
            <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
               Endpoint: api.bebidasdelperu.name
            </div>
            {lastCheckText && (
               <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                  {lastCheckText}
               </div>
            )}
            <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '4px' }}>
               Clic para actualizar manualmente
            </div>
            <div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '2px' }}>
               Doble clic para diagnóstico avanzado
            </div>
         </div>
      );
   };

   return (
      <>
         <Tooltip content={getTooltipContent()} placement="bottomEnd">
            <Flex 
               align="center" 
               css={{ gap: '$2', cursor: 'pointer' }} 
               onClick={checkApiConnection}
               onDoubleClick={() => setShowDiagnostic(true)}
            >
               <div 
                  style={{
                     width: '8px',
                     height: '8px',
                     borderRadius: '50%',
                     backgroundColor: isChecking ? '#ffc107' : isConnected ? '#28a745' : '#dc3545',
                     animation: isChecking ? 'pulse 1.5s infinite' : 'none'
                  }}
               />
               <Badge 
                  color={getStatusColor()}
                  variant="flat"
                  css={{ 
                     fontSize: '$xs',
                     padding: '$1 $2'
                  }}
               >
                  API {isChecking ? 'Verificando...' : isConnected ? 'Conectada' : 'Desconectada'}
               </Badge>
            </Flex>
         </Tooltip>
         
         <ApiDiagnosticModal 
            open={showDiagnostic}
            onClose={() => setShowDiagnostic(false)}
         />
      </>
   );
};