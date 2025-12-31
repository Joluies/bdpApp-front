import React, { useState } from 'react';
import {
   Modal,
   Button,
   Text,
   Input,
   Row,
   Checkbox,
   Container,
   Spacer,
   Grid,
   Dropdown,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { ClienteMinoristaForm, TelefonoForm } from '../../types/clientes';
import { clientesApiService } from '../../services/clientes-api.service';

interface Props {
   open: boolean;
   onClose: () => void;
   onSuccess?: () => void;
}

export const AddClienteMinorista = ({ open, onClose, onSuccess }: Props) => {
   const [formData, setFormData] = useState<ClienteMinoristaForm>({
      dni: '',
      nombres: '',
      apellidos: '',
      direccion: '',
      telefonos: [{ number: '', description: 'Número de Casa' }],
   });

   const [loading, setLoading] = useState(false);
   const [apiError, setApiError] = useState<string>('');

   const tiposTelefono = [
      { key: 'casa', name: 'Número de Casa' },
      { key: 'personal', name: 'Número Personal' },
      { key: 'oficina', name: 'Número de la Oficina' },
   ];

   const handleInputChange = (field: keyof ClienteMinoristaForm, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
   };

   const handleTelefonoChange = (index: number, field: 'number' | 'description', value: string) => {
      setFormData(prev => ({
         ...prev,
         telefonos: prev.telefonos.map((telefono, i) => 
            i === index ? { ...telefono, [field]: value } : telefono
         )
      }));
   };

   const addTelefono = () => {
      if (formData.telefonos.length < 3) {
         setFormData(prev => ({
            ...prev,
            telefonos: [...prev.telefonos, { number: '', description: 'Número de Casa' }]
         }));
      }
   };

   const removeTelefono = (index: number) => {
      if (formData.telefonos.length > 1) {
         setFormData(prev => ({
            ...prev,
            telefonos: prev.telefonos.filter((_, i) => i !== index)
         }));
      }
   };

   const handleTestEndpoint = async () => {
      console.log('🔍 Probando conectividad del endpoint...');
      try {
         await clientesApiService.probarEndpointCreacion();
      } catch (error) {
         console.error('❌ Error en test de endpoint:', error);
      }
   };

   const handleSubmit = async () => {
      // Validación básica solo al enviar
      if (!formData.dni || !formData.nombres || !formData.apellidos || !formData.direccion) {
         setApiError('Por favor complete todos los campos requeridos');
         return;
      }

      // Validar que DNI tenga 8 dígitos
      if (formData.dni.length !== 8 || !/^\d+$/.test(formData.dni)) {
         setApiError('El DNI debe tener exactamente 8 dígitos numéricos');
         return;
      }

      // Validar que nombres y apellidos tengan al menos 2 caracteres
      if (formData.nombres.length < 2) {
         setApiError('Los nombres deben tener al menos 2 caracteres');
         return;
      }

      if (formData.apellidos.length < 2) {
         setApiError('Los apellidos deben tener al menos 2 caracteres');
         return;
      }

      // Validar que dirección tenga al menos 10 caracteres (requisito de la API)
      if (formData.direccion.length < 10) {
         setApiError('La dirección debe tener al menos 10 caracteres');
         return;
      }

      if (!formData.telefonos.some(tel => tel.number.trim() !== '')) {
         setApiError('Debe agregar al menos un teléfono');
         return;
      }

      // Validar que cada teléfono sea exactamente 9 dígitos y comience con 9 (validación peruana)
      const telefonosValidos = formData.telefonos.filter(tel => tel.number.trim() !== '');
      for (let tel of telefonosValidos) {
         if (!/^\d{9}$/.test(tel.number)) {
            setApiError('Los teléfonos deben ser exactamente 9 dígitos numéricos');
            return;
         }
         if (!tel.number.startsWith('9')) {
            setApiError('Los teléfonos deben empezar con 9 (número móvil peruano)');
            return;
         }
      }

      setLoading(true);
      setApiError('');

      try {
         console.log('📤 Enviando datos del cliente minorista:', formData);
         
         // Crear FormData para enviar datos correctamente
         const formDataToSend = new FormData();
         
         // Agregar datos básicos
         formDataToSend.append('tipoCliente', 'Minorista');
         formDataToSend.append('nombre', formData.nombres);
         formDataToSend.append('apellidos', formData.apellidos);
         formDataToSend.append('dni', formData.dni);
         formDataToSend.append('direccion', formData.direccion);
         
         // Nota: Las coordenadas y fotos se agregarán desde la app móvil
         
         // Agregar teléfonos válidos
         const telefonosValidos = formData.telefonos.filter(tel => tel.number.trim() !== '');
         telefonosValidos.forEach((tel, index) => {
            formDataToSend.append(`telefonos[${index}][number]`, tel.number);
            formDataToSend.append(`telefonos[${index}][description]`, tel.description);
         });

         console.log('📤 FormData preparado para API de customers...');
         
         // Llamada a la nueva API mejorada
         const response = await clientesApiService.crearClienteConFotosYCoordenadas(formDataToSend);
         console.log('✅ Cliente minorista creado exitosamente:', response);
         
         // Verificar si la respuesta indica éxito
         if (response.success) {
            // Reset form solo si fue exitoso
            setFormData({
               dni: '',
               nombres: '',
               apellidos: '',
               direccion: '',
               telefonos: [{ number: '', description: 'Número de Casa' }],
            });
            
            // Mostrar mensaje de éxito si está disponible
            if (response.message) {
               console.log('✅ ' + response.message);
            }
            
            onSuccess?.();
            onClose();
         } else {
            // Si la respuesta indica fallo, mostrar el mensaje de error
            setApiError(response.message || 'Error al crear el cliente');
         }
         
      } catch (error: any) {
         console.error('❌ Error completo al agregar cliente minorista:', error);
         console.error('❌ Error message:', error.message);
         console.error('❌ Error stack:', error.stack);
         
         let errorMessage = 'Error al crear el cliente. Por favor, inténtelo nuevamente.';
         
         if (error.message) {
            if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
               errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
            } else if (error.message.includes('400')) {
               errorMessage = 'Datos inválidos. Verifique que todos los campos sean correctos.';
            } else if (error.message.includes('422')) {
               errorMessage = 'Datos enviados no válidos para la API.';
            } else if (error.message.includes('500')) {
               errorMessage = 'Error interno del servidor. Intente más tarde.';
            } else if (error.message.includes('timeout')) {
               errorMessage = 'La conexión tardó demasiado. Intente nuevamente.';
            } else if (error.message.includes('Error al crear el cliente:')) {
               errorMessage = error.message; // Usar el mensaje detallado del servicio
            } else {
               errorMessage = `Error: ${error.message}`;
            }
         }
         
         setApiError(errorMessage);
      } finally {
         setLoading(false);
      }
   };

   const handleClose = () => {
      setFormData({
         dni: '',
         nombres: '',
         apellidos: '',
         direccion: '',
         telefonos: [{ number: '', description: 'Número de Casa' }],
      });
      setApiError('');
      onClose();
   };

   return (
      <Modal
         closeButton
         aria-labelledby="modal-title"
         width="600px"
         open={open}
         onClose={handleClose}
      >
         <Modal.Header>
            <Text id="modal-title" h3 css={{ color: '#034F32' }}>
               Agregar Cliente Minorista
            </Text>
         </Modal.Header>
         
         <Modal.Body>
            <Container css={{ p: 0 }}>
               {apiError && (
                  <Text 
                     css={{ 
                        color: '#e74c3c', 
                        textAlign: 'center', 
                        mb: '$4',
                        fontSize: '$sm'
                     }}
                  >
                     {apiError}
                  </Text>
               )}
               
               <Grid.Container gap={2}>
                  {/* DNI */}
                  <Grid xs={12}>
                     <Input
                        clearable
                        fullWidth
                        color="success"
                        size="lg"
                        placeholder="Ingrese DNI (8 dígitos)"
                        label="DNI *"
                        value={formData.dni}
                        onChange={(e) => handleInputChange('dni', e.target.value)}
                        maxLength={8}
                     />
                  </Grid>

                  {/* Nombres */}
                  <Grid xs={6}>
                     <Input
                        clearable
                        fullWidth
                        color="success"
                        size="lg"
                        placeholder="Ingrese nombres"
                        label="Nombres *"
                        value={formData.nombres}
                        onChange={(e) => handleInputChange('nombres', e.target.value)}
                        maxLength={50}
                     />
                  </Grid>

                  {/* Apellidos */}
                  <Grid xs={6}>
                     <Input
                        clearable
                        fullWidth
                        color="success"
                        size="lg"
                        placeholder="Ingrese apellidos"
                        label="Apellidos *"
                        value={formData.apellidos}
                        onChange={(e) => handleInputChange('apellidos', e.target.value)}
                        maxLength={50}
                     />
                  </Grid>

                  {/* Dirección */}
                  <Grid xs={12}>
                     <Input
                        clearable
                        fullWidth
                        color="success"
                        size="lg"
                        placeholder="Ingrese dirección completa"
                        label="Dirección *"
                        value={formData.direccion}
                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                        maxLength={200}
                     />
                  </Grid>

                  {/* Teléfonos */}
                  <Grid xs={12}>
                     <Flex justify="between" align="center" css={{ mb: '$2' }}>
                        <Text css={{ color: '#034F32', fontWeight: '$semibold' }}>
                           Teléfonos de Contacto
                        </Text>
                        {formData.telefonos.length < 3 && (
                           <Button
                              auto
                              size="sm"
                              flat
                              color="success"
                              onPress={addTelefono}
                           >
                              + Agregar
                           </Button>
                        )}
                     </Flex>
                  </Grid>

                  {formData.telefonos.map((telefono, index) => (
                     <React.Fragment key={index}>
                        <Grid xs={12}>
                           <Flex justify="between" align="center" css={{ mb: '$2' }}>
                              <Text css={{ color: '#666', fontSize: '$sm' }}>
                                 Teléfono {index + 1} {index === 0 && '*'}
                              </Text>
                              {formData.telefonos.length > 1 && (
                                 <Button
                                    auto
                                    size="sm"
                                    flat
                                    color="error"
                                    onPress={() => removeTelefono(index)}
                                 >
                                    Eliminar
                                 </Button>
                              )}
                           </Flex>
                        </Grid>

                        <Grid xs={12} sm={6}>
                           <Input
                              clearable
                              fullWidth
                              color="success"
                              size="lg"
                              placeholder="9xxxxxxxx (9 dígitos)"
                              label="Número de Teléfono"
                              value={telefono.number}
                              onChange={(e) => handleTelefonoChange(index, 'number', e.target.value)}
                              maxLength={9}
                           />
                        </Grid>

                        <Grid xs={12} sm={6}>
                           <Dropdown>
                              <Dropdown.Button
                                 flat
                                 color="success"
                                 css={{ 
                                    width: '100%',
                                    height: '56px',
                                    fontSize: '$base',
                                    justifyContent: 'flex-start'
                                 }}
                              >
                                 {telefono.description}
                              </Dropdown.Button>
                              <Dropdown.Menu
                                 aria-label="Tipo de teléfono"
                                 color="success"
                                 disallowEmptySelection
                                 selectionMode="single"
                                 selectedKeys={new Set([telefono.description])}
                                 onSelectionChange={(keys) => {
                                    const selectedKey = Array.from(keys)[0] as string;
                                    handleTelefonoChange(index, 'description', selectedKey);
                                 }}
                              >
                                 {tiposTelefono.map((tipo) => (
                                    <Dropdown.Item key={tipo.name}>
                                       {tipo.name}
                                    </Dropdown.Item>
                                 ))}
                              </Dropdown.Menu>
                           </Dropdown>
                        </Grid>
                     </React.Fragment>
                  ))}
               </Grid.Container>
            </Container>
         </Modal.Body>

         <Modal.Footer>
            <Button 
               auto 
               flat 
               color="error" 
               onPress={handleClose}
               disabled={loading}
            >
               Cancelar
            </Button>
            <Button
               auto
               flat
               color="warning"
               onPress={handleTestEndpoint}
               disabled={loading}
            >
               Test Endpoint
            </Button>
            <Button
               auto
               disabled={loading}
               css={{
                  backgroundColor: '#5CAC4C',
                  color: 'white',
                  '&:hover': {
                     backgroundColor: '#4A9C3C'
                  }
               }}
               onPress={handleSubmit}
            >
               {loading ? 'Agregando...' : 'Agregar Cliente'}
            </Button>
         </Modal.Footer>
      </Modal>
   );
};