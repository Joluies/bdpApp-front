import React, { useState } from 'react';
import { Modal, Button, Text, Card, Badge } from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { clientesApiService } from '../../services/clientes-api.service';

interface ApiDiagnosticModalProps {
   open: boolean;
   onClose: () => void;
}

export const ApiDiagnosticModal = ({ open, onClose }: ApiDiagnosticModalProps) => {
   const [isRunning, setIsRunning] = useState(false);
   const [results, setResults] = useState<any[]>([]);

   const runDiagnostic = async () => {
      setIsRunning(true);
      setResults([]);
      
      const tests = [
         { name: 'Verificación estándar', method: () => clientesApiService.verificarConexion() },
         { name: 'Verificación alternativa', method: () => clientesApiService.verificarConexionAlternativa() },
         { name: 'Diagnóstico detallado', method: () => clientesApiService.diagnosticarConexion() }
      ];

      for (const test of tests) {
         try {
            const startTime = Date.now();
            const result = await test.method();
            const endTime = Date.now();
            
            setResults(prev => [...prev, {
               test: test.name,
               success: typeof result === 'boolean' ? result : result.conectado,
               details: typeof result === 'object' ? result.detalles : 'Prueba completada',
               time: endTime - startTime
            }]);
         } catch (error: any) {
            setResults(prev => [...prev, {
               test: test.name,
               success: false,
               details: error.message || 'Error desconocido',
               time: 0
            }]);
         }
      }
      
      setIsRunning(false);
   };

   return (
      <Modal
         closeButton
         aria-labelledby="diagnostic-modal"
         width="600px"
         open={open}
         onClose={onClose}
      >
         <Modal.Header>
            <Text h3 css={{ color: '#034F32' }}>
               Diagnóstico de Conexión API
            </Text>
         </Modal.Header>
         
         <Modal.Body>
            <Flex direction="column" css={{ gap: '$4' }}>
               <Text css={{ fontSize: '$sm', color: '$gray600' }}>
                  Este diagnóstico ejecuta múltiples pruebas para verificar el estado de la conexión con la API.
               </Text>
               
               <Button
                  auto
                  disabled={isRunning}
                  css={{
                     backgroundColor: '#5CAC4C',
                     color: 'white',
                     '&:hover': {
                        backgroundColor: '#4A9C3C'
                     }
                  }}
                  onPress={runDiagnostic}
               >
                  {isRunning ? 'Ejecutando diagnóstico...' : 'Ejecutar Diagnóstico'}
               </Button>

               {results.length > 0 && (
                  <Flex direction="column" css={{ gap: '$3' }}>
                     <Text css={{ fontWeight: '$semibold', color: '#034F32' }}>
                        Resultados:
                     </Text>
                     
                     {results.map((result, index) => (
                        <Card key={index} css={{ p: '$3' }}>
                           <Flex justify="between" align="center">
                              <Flex direction="column" css={{ gap: '$1' }}>
                                 <Flex align="center" css={{ gap: '$2' }}>
                                    <Badge 
                                       color={result.success ? 'success' : 'error'}
                                       variant="flat"
                                    >
                                       {result.success ? '✅' : '❌'}
                                    </Badge>
                                    <Text css={{ fontWeight: '$semibold' }}>
                                       {result.test}
                                    </Text>
                                 </Flex>
                                 <Text css={{ fontSize: '$sm', color: '$gray600' }}>
                                    {result.details}
                                 </Text>
                              </Flex>
                              <Text css={{ fontSize: '$xs', color: '$gray500' }}>
                                 {result.time}ms
                              </Text>
                           </Flex>
                        </Card>
                     ))}
                  </Flex>
               )}
            </Flex>
         </Modal.Body>

         <Modal.Footer>
            <Button auto flat color="primary" onPress={onClose}>
               Cerrar
            </Button>
         </Modal.Footer>
      </Modal>
   );
};