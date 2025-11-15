import React, { useState, useEffect } from 'react';
import {
   Modal,
   Button,
   Text,
   Input,
   Spacer,
   Grid,
   Dropdown,
   Loading,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import {
   Usuario,
   CreateUsuarioDto,
   UpdateUsuarioDto,
   TipoUsuario,
   Rol,
   ROLES_CONFIG,
   getRolesByTipoUsuario,
} from '../../types/usuarios';
import { createUsuario, updateUsuario } from '../../services/usuarios-api.service';

interface Props {
   open: boolean;
   onClose: () => void;
   onSuccess?: () => void;
   usuarioToEdit?: Usuario | null;
}

export const AddUsuario = ({ open, onClose, onSuccess, usuarioToEdit }: Props) => {
   const isEditMode = !!usuarioToEdit;

   const [formData, setFormData] = useState<CreateUsuarioDto>({
      nombre: '',
      apellido: '',
      username: '',
      password: '',
      tipo_usuario: 'operativo',
      rol: 'vendedor_mayorista',
   });

   const [confirmPassword, setConfirmPassword] = useState('');
   const [loading, setLoading] = useState(false);
   const [apiError, setApiError] = useState<string>('');

   // Cargar datos del usuario si es modo edición
   useEffect(() => {
      if (open && usuarioToEdit) {
         console.log('📝 Cargando datos del usuario a editar:', usuarioToEdit);
         setFormData({
            nombre: usuarioToEdit.nombre,
            apellido: usuarioToEdit.apellido,
            username: usuarioToEdit.username,
            password: '', // No cargar password por seguridad
            tipo_usuario: usuarioToEdit.tipo_usuario,
            rol: usuarioToEdit.rol,
         });
         setConfirmPassword('');
      } else if (open) {
         // Reset form cuando se abre en modo crear
         setFormData({
            nombre: '',
            apellido: '',
            username: '',
            password: '',
            tipo_usuario: 'operativo',
            rol: 'vendedor_mayorista',
         });
         setConfirmPassword('');
      }
      setApiError('');
   }, [open, usuarioToEdit]);

   // Actualizar rol cuando cambia el tipo de usuario
   useEffect(() => {
      const rolesDisponibles = getRolesByTipoUsuario(formData.tipo_usuario);
      if (rolesDisponibles.length > 0 && !rolesDisponibles.includes(formData.rol)) {
         setFormData(prev => ({ ...prev, rol: rolesDisponibles[0] }));
      }
   }, [formData.tipo_usuario]);

   const handleInputChange = (field: keyof CreateUsuarioDto, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
   };

   const handleTipoUsuarioChange = (tipo: TipoUsuario) => {
      const rolesDisponibles = getRolesByTipoUsuario(tipo);
      setFormData(prev => ({
         ...prev,
         tipo_usuario: tipo,
         rol: rolesDisponibles[0] || 'vendedor_mayorista',
      }));
   };

   const validateForm = (): string | null => {
      // Validar nombre
      if (!formData.nombre || formData.nombre.trim().length < 2) {
         return 'El nombre debe tener al menos 2 caracteres';
      }

      // Validar apellido
      if (!formData.apellido || formData.apellido.trim().length < 2) {
         return 'El apellido debe tener al menos 2 caracteres';
      }

      // Validar username
      if (!formData.username || formData.username.trim().length < 4) {
         return 'El nombre de usuario debe tener al menos 4 caracteres';
      }

      // Validar username sin espacios
      if (formData.username.includes(' ')) {
         return 'El nombre de usuario no puede contener espacios';
      }

      // Validar password solo si es modo crear o si se ingresó en modo edición
      if (!isEditMode || formData.password) {
         if (!formData.password || formData.password.length < 6) {
            return 'La contraseña debe tener al menos 6 caracteres';
         }

         // Validar confirmación de password
         if (formData.password !== confirmPassword) {
            return 'Las contraseñas no coinciden';
         }
      }

      return null;
   };

   const handleSubmit = async () => {
      console.log('📝 Enviando formulario de usuario...');
      console.log('📝 Datos del formulario:', formData);
      console.log('📝 Modo edición:', isEditMode);

      // Validar formulario
      const validationError = validateForm();
      if (validationError) {
         setApiError(validationError);
         return;
      }

      setLoading(true);
      setApiError('');

      try {
         if (isEditMode && usuarioToEdit) {
            // Modo edición
            const updateData: UpdateUsuarioDto = {
               nombre: formData.nombre,
               apellido: formData.apellido,
               username: formData.username,
               tipo_usuario: formData.tipo_usuario,
               rol: formData.rol,
            };

            // Solo incluir password si se cambió
            if (formData.password) {
               updateData.password = formData.password;
            }

            console.log('📤 Actualizando usuario:', updateData);
            const response = await updateUsuario(usuarioToEdit.id, updateData);
            console.log('✅ Usuario actualizado exitosamente:', response);
         } else {
            // Modo crear
            console.log('📤 Creando nuevo usuario:', formData);
            const response = await createUsuario(formData);
            console.log('✅ Usuario creado exitosamente:', response);
         }

         // Reset form
         setFormData({
            nombre: '',
            apellido: '',
            username: '',
            password: '',
            tipo_usuario: 'operativo',
            rol: 'vendedor_mayorista',
         });
         setConfirmPassword('');

         onSuccess?.();
         onClose();
      } catch (error: any) {
         console.error('❌ Error al guardar usuario:', error);

         // Manejo de errores
         let errorMessage = 'Error al guardar el usuario. Por favor, inténtelo nuevamente.';

         if (error.message) {
            if (error.message.includes('username')) {
               errorMessage = 'El nombre de usuario ya está en uso';
            } else if (error.message.includes('validación')) {
               errorMessage = error.message;
            } else if (error.message.includes('fetch')) {
               errorMessage = 'No se pudo conectar con el servidor';
            } else if (error.message.includes('400')) {
               errorMessage = 'Datos inválidos. Verifique la información ingresada';
            } else if (error.message.includes('500')) {
               errorMessage = 'Error interno del servidor. Intente más tarde';
            } else if (error.message.includes('timeout')) {
               errorMessage = 'La conexión tardó demasiado. Intente nuevamente';
            } else {
               errorMessage = error.message;
            }
         }

         setApiError(errorMessage);
      } finally {
         setLoading(false);
      }
   };

   const handleClose = () => {
      if (!loading) {
         setFormData({
            nombre: '',
            apellido: '',
            username: '',
            password: '',
            tipo_usuario: 'operativo',
            rol: 'vendedor_mayorista',
         });
         setConfirmPassword('');
         setApiError('');
         onClose();
      }
   };

   // Obtener roles disponibles según el tipo de usuario seleccionado
   const rolesDisponibles = getRolesByTipoUsuario(formData.tipo_usuario);

   return (
      <Modal
         closeButton
         aria-labelledby="modal-title"
         width="600px"
         open={open}
         onClose={handleClose}
         preventClose={loading}
      >
         <Modal.Header css={{ justifyContent: 'start' }}>
            <Text id="modal-title" h3 css={{ mb: 0 }}>
               {isEditMode ? 'Editar Usuario' : 'Agregar Nuevo Usuario'}
            </Text>
         </Modal.Header>
         <Modal.Body css={{ py: '$10' }}>
            <Flex direction="column" css={{ gap: '$8' }}>
               {/* Nombre y Apellido */}
               <Grid.Container gap={2}>
                  <Grid xs={12} sm={6}>
                     <Input
                        clearable
                        fullWidth
                        label="Nombre"
                        placeholder="Ingrese el nombre"
                        value={formData.nombre}
                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                        disabled={loading}
                        required
                        color={formData.nombre.length >= 2 ? 'success' : 'default'}
                     />
                  </Grid>
                  <Grid xs={12} sm={6}>
                     <Input
                        clearable
                        fullWidth
                        label="Apellido"
                        placeholder="Ingrese el apellido"
                        value={formData.apellido}
                        onChange={(e) => handleInputChange('apellido', e.target.value)}
                        disabled={loading}
                        required
                        color={formData.apellido.length >= 2 ? 'success' : 'default'}
                     />
                  </Grid>
               </Grid.Container>

               {/* Username */}
               <Input
                  clearable
                  fullWidth
                  label="Nombre de Usuario"
                  placeholder="username (sin espacios)"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value.toLowerCase().replace(/\s/g, ''))}
                  disabled={loading}
                  required
                  helperText="Mínimo 4 caracteres, sin espacios"
                  color={formData.username.length >= 4 && !formData.username.includes(' ') ? 'success' : 'default'}
               />

               {/* Password */}
               <Input.Password
                  clearable
                  fullWidth
                  label={isEditMode ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
                  placeholder="Ingrese la contraseña"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  disabled={loading}
                  required={!isEditMode}
                  helperText="Mínimo 6 caracteres"
                  color={formData.password.length >= 6 ? 'success' : 'default'}
               />

               {/* Confirmar Password */}
               <Input.Password
                  clearable
                  fullWidth
                  label="Confirmar Contraseña"
                  placeholder="Confirme la contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required={!isEditMode || !!formData.password}
                  color={
                     confirmPassword.length > 0 && confirmPassword === formData.password
                        ? 'success'
                        : 'default'
                  }
               />

               <Spacer y={0.5} />

               {/* Tipo de Usuario */}
               <Flex direction="column" css={{ gap: '$4' }}>
                  <Text size="$sm" weight="medium">
                     Tipo de Usuario *
                  </Text>
                  <Grid.Container gap={1}>
                     <Grid xs={6}>
                        <Button
                           bordered={formData.tipo_usuario !== 'administrativo'}
                           color="primary"
                           css={{ width: '100%' }}
                           onClick={() => handleTipoUsuarioChange('administrativo')}
                           disabled={loading}
                        >
                           Administrativo
                        </Button>
                     </Grid>
                     <Grid xs={6}>
                        <Button
                           bordered={formData.tipo_usuario !== 'operativo'}
                           color="secondary"
                           css={{ width: '100%' }}
                           onClick={() => handleTipoUsuarioChange('operativo')}
                           disabled={loading}
                        >
                           Operativo
                        </Button>
                     </Grid>
                  </Grid.Container>
               </Flex>

               {/* Rol */}
               <Flex direction="column" css={{ gap: '$4' }}>
                  <Text size="$sm" weight="medium">
                     Rol *
                  </Text>
                  <Dropdown>
                     <Dropdown.Button 
                        flat 
                        color="success" 
                        css={{ width: '100%', justifyContent: 'space-between' }}
                        disabled={loading}
                     >
                        {ROLES_CONFIG[formData.rol].label}
                     </Dropdown.Button>
                     <Dropdown.Menu
                        aria-label="Seleccionar rol"
                        selectionMode="single"
                        selectedKeys={[formData.rol]}
                        onSelectionChange={(keys) => {
                           const selected = Array.from(keys)[0] as Rol;
                           handleInputChange('rol', selected);
                        }}
                     >
                        {rolesDisponibles.map((rol) => (
                           <Dropdown.Item key={rol}>
                              <Flex direction="column">
                                 <Text weight="bold">{ROLES_CONFIG[rol].label}</Text>
                                 <Text size="$xs" color="$accents7">
                                    {ROLES_CONFIG[rol].descripcion} - {ROLES_CONFIG[rol].acceso}
                                 </Text>
                              </Flex>
                           </Dropdown.Item>
                        ))}
                     </Dropdown.Menu>
                  </Dropdown>
               </Flex>

               {/* Mostrar error si existe */}
               {apiError && (
                  <Text color="error" size="$sm">
                     ⚠️ {apiError}
                  </Text>
               )}
            </Flex>
         </Modal.Body>
         <Modal.Footer>
            <Button auto flat color="error" onClick={handleClose} disabled={loading}>
               Cancelar
            </Button>
            <Button auto color="success" onClick={handleSubmit} disabled={loading}>
               {loading ? (
                  <Loading type="points" color="currentColor" size="sm" />
               ) : isEditMode ? (
                  'Actualizar Usuario'
               ) : (
                  'Agregar Usuario'
               )}
            </Button>
         </Modal.Footer>
      </Modal>
   );
};
