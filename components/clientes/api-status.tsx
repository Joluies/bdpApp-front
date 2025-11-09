import React, { useState, useEffect } from 'react';
import { Card, Text, Badge, Button } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { clientesApiService } from '../../services/clientes-api.service';

interface ApiStatusProps {
   onStatusChange?: (connected: boolean) => void;
}

export const ApiStatus = ({ onStatusChange }: ApiStatusProps) => {
   const [isConnected, setIsConnected] = useState<boolean | null>(null);
   const [isChecking, setIsChecking] = useState(false);
   const [lastCheck, setLastCheck] = useState<Date | null>(null);
   const [diagnosticInfo, setDiagnosticInfo] = useState<string>('');

   const checkApiConnection = async () => {
      setIsChecking(true);
      try {
         // Usar el método de diagnóstico detallado
         const diagnostic = await clientesApiService.diagnosticarConexion();
         setIsConnected(diagnostic.conectado);
         setDiagnosticInfo(diagnostic.detalles);
         onStatusChange?.(diagnostic.conectado);
      } catch (error) {
         console.warn('API no disponible:', error);
         setIsConnected(false);
         setDiagnosticInfo(`❌ Error inesperado: ${error}`);
         onStatusChange?.(false);
      } finally {
         setIsChecking(false);
         setLastCheck(new Date());
      }
   };

   useEffect(() => {
      // Verificar conexión al montar el componente
      checkApiConnection();

      // Verificar conexión cada 30 segundos
      const interval = setInterval(checkApiConnection, 30000);

      return () => clearInterval(interval);
   }, []);

   const getStatusColor = () => {
      if (isChecking) return 'warning';
      return isConnected ? 'success' : 'error';
   };

   const getStatusText = () => {
      if (isChecking) return 'Verificando conexión...';
      return isConnected ? 'API Conectada' : 'API Desconectada';
   };

   const getBackgroundColor = () => {
      if (isChecking) return '#fff3cd';
      return isConnected ? '#d4edda' : '#f8d7da';
   };

   const getBorderColor = () => {
      if (isChecking) return '#ffeaa7';
      return isConnected ? '#c3e6cb' : '#f5c6cb';
   };

   return (
      <Card 
         css={{ 
            p: '$3',
            backgroundColor: getBackgroundColor(),
            border: `1px solid ${getBorderColor()}`,
            minWidth: '250px',
            maxWidth: '300px'
         }}
      >
         <Card.Body>
            <Flex direction="column" css={{ gap: '$2' }}>
               {/* Estado principal */}
               <Flex align="center" justify="between">
                  <Flex align="center" css={{ gap: '$2' }}>
                     <div 
                        style={{
                           width: '10px',
                           height: '10px',
                           borderRadius: '50%',
                           backgroundColor: isChecking ? '#ffc107' : isConnected ? '#28a745' : '#dc3545',
                           animation: isChecking ? 'pulse 1.5s infinite' : 'none'
                        }}
                     />
                     <Text 
                        css={{ 
                           fontSize: '$sm', 
                           fontWeight: '$semibold',
                           color: isConnected ? '#155724' : isChecking ? '#856404' : '#721c24'
                        }}
                     >
                        {getStatusText()}
                     </Text>
                  </Flex>
                  
                  <Button
                     auto
                     size="xs"
                     flat
                     disabled={isChecking}
                     css={{
                        minWidth: 'auto',
                        padding: '$1 $2',
                        fontSize: '$xs'
                     }}
                     onPress={checkApiConnection}
                  >
                     {isChecking ? '...' : '🔄'}
                  </Button>
               </Flex>

               {/* Información adicional */}
               <Flex direction="column" css={{ gap: '$1' }}>
                  <Text css={{ fontSize: '$xs', color: '$gray600' }}>
                     Endpoint: api.bebidasdelperu.name
                  </Text>
                  {diagnosticInfo && (
                     <Text css={{ fontSize: '$xs', color: '$gray600' }}>
                        {diagnosticInfo}
                     </Text>
                  )}
                  {lastCheck && (
                     <Text css={{ fontSize: '$xs', color: '$gray600' }}>
                        Última verificación: {lastCheck.toLocaleTimeString()}
                     </Text>
                  )}
               </Flex>
            </Flex>
         </Card.Body>
      </Card>
   );
};