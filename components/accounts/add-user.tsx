'use client';

import {Button, Divider, Input, Modal, Text, Select, SelectItem, Card} from '@nextui-org/react';
import React, {useState, useEffect} from 'react';
import {Flex} from '../styles/flex';
import { createUsuario } from '@/services/usuarios-api.service';

// ==========================================
// MAPEO DE ROLES POR TIPO DE USUARIO
// ==========================================
const ROLES_POR_TIPO = {
   administrativo: [
      { id: 'administrador', label: 'Administrador' },
   ],
   operativo: [
      { id: 'jefe_ventas', label: 'Jefe de Ventas' },
      { id: 'jefe_despacho', label: 'Jefe de Despacho' },
      { id: 'admin_movil', label: 'Administrador Móvil' },
      { id: 'vendedor', label: 'Vendedor' },
      { id: 'despacho', label: 'Despacho/Transportista' },
   ]
};

interface FormData {
   nombre: string;
   apellido: string;
   username: string;
   password: string;
   confirmPassword: string;
   tipo_usuario: 'administrativo' | 'operativo' | '';
   roleId: string;
}

interface FormErrors {
   [key: string]: string;
}

export const AddUser = () => {
   const [visible, setVisible] = React.useState(false);
   const [loading, setLoading] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   const [successMessage, setSuccessMessage] = useState('');
   const [errorMessage, setErrorMessage] = useState('');

   const [formData, setFormData] = useState<FormData>({
      nombre: '',
      apellido: '',
      username: '',
      password: '',
      confirmPassword: '',
      tipo_usuario: '',
      roleId: ''
   });

   const [errors, setErrors] = useState<FormErrors>({});

   const handler = () => setVisible(true);

   const closeHandler = () => {
      setVisible(false);
      resetForm();
   };

   const resetForm = () => {
      setFormData({
         nombre: '',
         apellido: '',
         username: '',
         password: '',
         confirmPassword: '',
         tipo_usuario: '',
         roleId: ''
      });
      setErrors({});
      setSuccessMessage('');
      setErrorMessage('');
      setShowPassword(false);
      setShowConfirmPassword(false);
   };

   // ==========================================
   // HANDLERS DE CAMBIO
   // ==========================================
   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({
         ...prev,
         [name]: value
      }));
      // Limpiar error del campo
      if (errors[name]) {
         setErrors(prev => ({
            ...prev,
            [name]: ''
         }));
      }
   };

   const handleTipoUsuarioChange = (value: string) => {
      const tipoUsuario = value as 'administrativo' | 'operativo';
      setFormData(prev => ({
         ...prev,
         tipo_usuario: tipoUsuario,
         roleId: '' // Reset role cuando cambia tipo
      }));
      if (errors.tipo_usuario) {
         setErrors(prev => ({
            ...prev,
            tipo_usuario: ''
         }));
      }
   };

   const handleRoleChange = (value: string) => {
      setFormData(prev => ({
         ...prev,
         roleId: value
      }));
      if (errors.roleId) {
         setErrors(prev => ({
            ...prev,
            roleId: ''
         }));
      }
   };

   // ==========================================
   // VALIDACIÓN
   // ==========================================
   const validateForm = (): boolean => {
      const newErrors: FormErrors = {};

      if (!formData.nombre.trim()) {
         newErrors.nombre = 'El nombre es requerido';
      }

      if (!formData.apellido.trim()) {
         newErrors.apellido = 'El apellido es requerido';
      }

      if (!formData.username.trim()) {
         newErrors.username = 'El nombre de usuario es requerido';
      } else if (formData.username.includes(' ')) {
         newErrors.username = 'El nombre de usuario no puede contener espacios';
      } else if (formData.username.length < 3) {
         newErrors.username = 'El nombre de usuario debe tener al menos 3 caracteres';
      }

      if (!formData.password) {
         newErrors.password = 'La contraseña es requerida';
      } else if (formData.password.length < 6) {
         newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      }

      if (formData.password !== formData.confirmPassword) {
         newErrors.confirmPassword = 'Las contraseñas no coinciden';
      }

      if (!formData.tipo_usuario) {
         newErrors.tipo_usuario = 'Debe seleccionar un tipo de usuario';
      }

      if (!formData.roleId) {
         newErrors.roleId = 'Debe seleccionar un rol';
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
   };

   // ==========================================
   // ENVÍO DEL FORMULARIO
   // ==========================================
   const handleSubmit = async () => {
      setErrorMessage('');
      setSuccessMessage('');

      if (!validateForm()) {
         setErrorMessage('Por favor completa todos los campos correctamente');
         return;
      }

      setLoading(true);

      try {
         // Llamar a la API
         await createUsuario({
            nombre: formData.nombre,
            apellido: formData.apellido,
            username: formData.username,
            password: formData.password,
            tipo_usuario: formData.tipo_usuario,
            role_id: parseInt(formData.roleId)
         });

         setSuccessMessage(`✅ Usuario "${formData.username}" creado exitosamente`);
         setTimeout(() => {
            closeHandler();
         }, 2000);
      } catch (error: any) {
         console.error('Error al crear usuario:', error);
         const errorMsg = error?.response?.data?.message 
            || error?.message 
            || 'Error al crear el usuario. Intenta de nuevo.';
         setErrorMessage(errorMsg);
      } finally {
         setLoading(false);
      }
   };

   // Get roles disponibles según tipo_usuario
   const availableRoles = formData.tipo_usuario 
      ? ROLES_POR_TIPO[formData.tipo_usuario as 'administrativo' | 'operativo']
      : [];

   return (
      <div>
         <Button 
            auto 
            css={{
               backgroundColor: '#5CAC4C',
               color: 'white',
               '&:hover': {
                  backgroundColor: '#4A9C3C'
               }
            }}
            onClick={handler}
         >
            Agregar Usuario
         </Button>

         <Modal
            closeButton
            aria-labelledby="modal-title"
            width="700px"
            open={visible}
            onClose={closeHandler}
            blur
         >
            <Modal.Header css={{justifyContent: 'start'}}>
               <Text id="modal-title" h4>
                  Crear Nuevo Usuario
               </Text>
            </Modal.Header>

            <Divider css={{my: '$5'}} />

            <Modal.Body css={{py: '$10'}}>
               <Flex
                  direction={'column'}
                  css={{
                     'flexWrap': 'wrap',
                     'gap': '$8',
                  }}
               >
                  {/* MENSAJES */}
                  {successMessage && (
                     <Card css={{backgroundColor: '#D4EDDA', borderColor: '#28A745', borderWidth: 1}}>
                        <Card.Body css={{p: '$8'}}>
                           <Text color="#155724">{successMessage}</Text>
                        </Card.Body>
                     </Card>
                  )}

                  {errorMessage && (
                     <Card css={{backgroundColor: '#F8D7DA', borderColor: '#F5C6CB', borderWidth: 1}}>
                        <Card.Body css={{p: '$8'}}>
                           <Text color="#721C24">{errorMessage}</Text>
                        </Card.Body>
                     </Card>
                  )}

                  {/* NOMBRE Y APELLIDO */}
                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Input
                        label="Nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        bordered
                        clearable
                        fullWidth
                        size="lg"
                        placeholder="Ingrese el nombre"
                        status={errors.nombre ? 'error' : 'default'}
                        helperColor="error"
                        helperText={errors.nombre}
                     />
                     <Input
                        label="Apellido"
                        name="apellido"
                        value={formData.apellido}
                        onChange={handleInputChange}
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Ingrese el apellido"
                        status={errors.apellido ? 'error' : 'default'}
                        helperColor="error"
                        helperText={errors.apellido}
                     />
                  </Flex>

                  {/* USERNAME */}
                  <Flex>
                     <Input
                        label="Nombre de Usuario"
                        name="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        clearable
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="username (sin espacios)"
                        helperText="Mínimo 4 caracteres, sin espacios"
                        status={errors.username ? 'error' : 'default'}
                        helperColor={errors.username ? 'error' : 'default'}
                     />
                  </Flex>

                  {/* CONTRASEÑA */}
                  <Flex
                     css={{
                        'gap': '$10',
                        'flexWrap': 'wrap',
                        '@lg': {flexWrap: 'nowrap'},
                     }}
                  >
                     <Input
                        label="Contraseña"
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleInputChange}
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Mínimo 6 caracteres"
                        helperText="Mínimo 6 caracteres"
                        status={errors.password ? 'error' : 'default'}
                        helperColor={errors.password ? 'error' : 'default'}
                        contentRight={
                           <button
                              onClick={() => setShowPassword(!showPassword)}
                              style={{
                                 background: 'none',
                                 border: 'none',
                                 cursor: 'pointer',
                                 padding: '8px'
                              }}
                           >
                              {showPassword ? '👁️' : '👁️‍🗨️'}
                           </button>
                        }
                     />
                     <Input
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        bordered
                        fullWidth
                        size="lg"
                        placeholder="Confirme la contraseña"
                        status={errors.confirmPassword ? 'error' : 'default'}
                        helperColor="error"
                        helperText={errors.confirmPassword}
                        contentRight={
                           <button
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              style={{
                                 background: 'none',
                                 border: 'none',
                                 cursor: 'pointer',
                                 padding: '8px'
                              }}
                           >
                              {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                           </button>
                        }
                     />
                  </Flex>

                  {/* TIPO DE USUARIO */}
                  <Flex>
                     <Select
                        label="Tipo de Usuario"
                        placeholder="Seleccione tipo de usuario"
                        value={formData.tipo_usuario}
                        onChange={(e) => handleTipoUsuarioChange(e.target.value)}
                        bordered
                        fullWidth
                        size="lg"
                        status={errors.tipo_usuario ? 'error' : 'default'}
                        helperColor="error"
                        helperText={errors.tipo_usuario}
                     >
                        <SelectItem key="administrativo" value="administrativo">
                           Administrativo
                        </SelectItem>
                        <SelectItem key="operativo" value="operativo">
                           Operativo
                        </SelectItem>
                     </Select>
                  </Flex>

                  {/* ROL - Solo visible si hay tipo_usuario seleccionado */}
                  {formData.tipo_usuario && (
                     <Flex>
                        <Select
                           label="Rol"
                           placeholder="Seleccione rol"
                           value={formData.roleId}
                           onChange={(e) => handleRoleChange(e.target.value)}
                           bordered
                           fullWidth
                           size="lg"
                           status={errors.roleId ? 'error' : 'default'}
                           helperColor="error"
                           helperText={errors.roleId || `Roles disponibles para ${formData.tipo_usuario}`}
                        >
                           {availableRoles.map((role) => (
                              <SelectItem key={role.id} value={role.id}>
                                 {role.label}
                              </SelectItem>
                           ))}
                        </Select>
                     </Flex>
                  )}

                  {!formData.tipo_usuario && (
                     <Card css={{backgroundColor: '#FFF3CD', borderColor: '#FFE69C', borderWidth: 1}}>
                        <Card.Body css={{p: '$8'}}>
                           <Text color="#856404">⚠️ No hay roles disponibles para este tipo de usuario</Text>
                        </Card.Body>
                     </Card>
                  )}
               </Flex>
            </Modal.Body>

            <Divider css={{my: '$5'}} />

            <Modal.Footer>
               <Button 
                  auto 
                  color="error"
                  onClick={closeHandler}
               >
                  Cancelar
               </Button>
               <Button 
                  auto 
                  css={{
                     backgroundColor: '#5CAC4C',
                     color: 'white',
                     '&:hover': {
                        backgroundColor: '#4A9C3C'
                     }
                  }}
                  onClick={handleSubmit}
                  loading={loading}
                  disabled={loading}
               >
                  {loading ? 'Creando...' : 'Agregar Usuario'}
               </Button>
            </Modal.Footer>
         </Modal>
      </div>
   );
};
