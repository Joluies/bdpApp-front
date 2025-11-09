import React, { useState, useEffect } from 'react';
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
import { ClienteMayoristaForm, TelefonoForm } from '../../types/clientes';
import { clientesApiService } from '../../services/clientes-api.service';

interface Props {
   open: boolean;
   onClose: () => void;
   onSuccess?: () => void;
}

export const AddClienteMayorista = ({ open, onClose, onSuccess }: Props) => {
   const [formData, setFormData] = useState<ClienteMayoristaForm>({
      ruc: '',
      razonSocial: '',
      nombre: '',
      apellidos: '',
      dni: '',
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

   // Ejecutar validación cuando se abra el modal
   useEffect(() => {
      if (open) {
         console.log('📝 Modal de mayorista abierto');
      }
   }, [open]);

   const handleInputChange = (field: keyof ClienteMayoristaForm, value: string) => {
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

   const handleSubmit = async () => {
      console.log('📝 Enviando formulario mayorista...');
      console.log('📝 Datos del formulario:', formData);
      
      // Validaciones básicas antes de enviar
      if (!formData.ruc || formData.ruc.length !== 11) {
         setApiError('El RUC debe tener exactamente 11 dígitos');
         return;
      }
      
      if (!formData.razonSocial || formData.razonSocial.trim().length < 3) {
         setApiError('La Razón Social debe tener al menos 3 caracteres');
         return;
      }
      
      if (!formData.nombre || formData.nombre.trim().length < 2) {
         setApiError('El nombre debe tener al menos 2 caracteres');
         return;
      }
      
      if (!formData.apellidos || formData.apellidos.trim().length < 2) {
         setApiError('Los apellidos deben tener al menos 2 caracteres');
         return;
      }
      
      if (!formData.dni || formData.dni.length !== 8) {
         setApiError('El DNI debe tener exactamente 8 dígitos');
         return;
      }
      
      if (!formData.direccion || formData.direccion.trim().length < 10) {
         setApiError('La dirección debe tener al menos 10 caracteres');
         return;
      }
      
      // Validar que al menos haya un teléfono válido
      const telefonosValidos = formData.telefonos.filter(tel => tel.number.trim().length >= 7);
      if (telefonosValidos.length === 0) {
         setApiError('Debe proporcionar al menos un teléfono válido (mínimo 7 dígitos)');
         return;
      }
      
      setLoading(true);
      setApiError(''); // Limpiar errores previos

      try {
         // Preparar los datos para la API con el formato esperado
         const apiData = {
            tipoCliente: 'Mayorista' as const,
            ruc: formData.ruc,
            razonSocial: formData.razonSocial,
            nombre: formData.nombre,
            apellidos: formData.apellidos,
            dni: formData.dni,
            direccion: formData.direccion,
            telefonos: telefonosValidos
         };

         console.log('📤 Enviando datos a la API:', apiData);

         // Llamada a la API real
         const response = await clientesApiService.crearClienteMayorista(apiData);
         
         console.log('✅ Cliente mayorista creado exitosamente:', response);
         
         // Verificar si la respuesta indica éxito
         if (response.success) {
            // Reset form solo si fue exitoso
            setFormData({
               ruc: '',
               razonSocial: '',
               nombre: '',
               apellidos: '',
               dni: '',
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
         console.error('Error al agregar cliente mayorista:', error);
         
         // Manejo de errores más específico
         let errorMessage = 'Error al crear el cliente. Por favor, inténtelo nuevamente.';
         
         if (error.message) {
            if (error.message.includes('Errores de validación')) {
               errorMessage = error.message; // Mostrar errores específicos de la API
            } else if (error.message.includes('fetch')) {
               errorMessage = 'No se pudo conectar con el servidor. Verifique su conexión a internet.';
            } else if (error.message.includes('400')) {
               errorMessage = 'Datos inválidos. Verifique la información ingresada.';
            } else if (error.message.includes('500')) {
               errorMessage = 'Error interno del servidor. Intente más tarde.';
            } else if (error.message.includes('timeout') || error.message.includes('AbortError')) {
               errorMessage = 'La conexión tardó demasiado. Intente nuevamente.';
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
         ruc: '',
         razonSocial: '',
         nombre: '',
         apellidos: '',
         dni: '',
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
               Agregar Cliente Mayorista
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
                  {/* RUC */}
                  <Grid xs={12}>
                     <Input
                        clearable
                        fullWidth
                        color="success"
                        size="lg"
                        placeholder="Ingrese RUC (11 dígitos)"
                        label="RUC *"
                        value={formData.ruc}
                        onChange={(e) => handleInputChange('ruc', e.target.value)}
                        maxLength={11}
                     />
                  </Grid>

                  {/* Razón Social */}
                  <Grid xs={12}>
                     <Input
                        clearable
                        fullWidth
                        color="success"
                        size="lg"
                        placeholder="Ingrese razón social de la empresa"
                        label="Razón Social *"
                        value={formData.razonSocial}
                        onChange={(e) => handleInputChange('razonSocial', e.target.value)}
                        maxLength={100}
                     />
                  </Grid>

                  {/* Datos del Representante */}
                  <Grid xs={12}>
                     <Text h4 css={{ color: '#034F32', mt: '$2', mb: '$2' }}>
                        Datos del Representante Legal
                     </Text>
                  </Grid>

                  {/* Nombre del Representante */}
                  <Grid xs={12} sm={6}>
                     <Input
                        clearable
                        fullWidth
                        color="success"
                        size="lg"
                        placeholder="Ingrese nombre del representante"
                        label="Nombre *"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        maxLength={50}
                     />
                  </Grid>

                  {/* Apellidos del Representante */}
                  <Grid xs={12} sm={6}>
                     <Input
                        clearable
                        fullWidth
                        color="success"
                        size="lg"
                        placeholder="Ingrese apellidos del representante"
                        label="Apellidos *"
                        value={formData.apellidos}
                        onChange={(e) => handleInputChange('apellidos', e.target.value)}
                        maxLength={50}
                     />
                  </Grid>

                  {/* DNI del Representante */}
                  <Grid xs={12} sm={6}>
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

                  {/* Dirección */}
                  <Grid xs={12}>
                     <Input
                        clearable
                        fullWidth
                        color="success"
                        size="lg"
                        placeholder="Ingrese dirección completa (mínimo 10 caracteres)"
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
                              placeholder="Ingrese número (mínimo 7 dígitos)"
                              label="Número de Teléfono"
                              value={telefono.number}
                              onChange={(e) => handleTelefonoChange(index, 'number', e.target.value)}
                              maxLength={12}
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