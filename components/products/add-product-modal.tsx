import {
   Button,
   Input,
   Modal,
   Text,
   FormElement,
   Dropdown,
   Textarea,
} from '@nextui-org/react';
import React, { useState } from 'react';
import {Flex} from '../styles/flex';
import {Box} from '../styles/box';
import {ProductLocal} from './data';

interface AddProductModalProps {
   visible: boolean;
   onClose: () => void;
   onAddProduct: (product: Omit<ProductLocal, 'id'>) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({ 
   visible, 
   onClose, 
   onAddProduct 
}) => {
   const [formData, setFormData] = useState({
      name: '',
      description: '',
      presentation: '',
      precio_unitario: '',
      precio_mayorista: '',
      stock: '',
      image: '',
      category: 'Gaseosas',
      status: 'Disponible' as 'Disponible' | 'Agotado' | 'Descontinuado'
   });

   const [imageFile, setImageFile] = useState<File | null>(null);
   const [imagePreview, setImagePreview] = useState<string>('');
   const [isLoading, setIsLoading] = useState(false);

   const [selectedCategory, setSelectedCategory] = useState(new Set(['Gaseosas']));
   const [selectedStatus, setSelectedStatus] = useState(new Set(['Disponible']));

   const categories = ['Gaseosas', 'Jugos', 'Aguas', 'Energizantes', 'Otros'];
   const statusOptions = ['Disponible', 'Agotado', 'Descontinuado'];

   const resetForm = () => {
      setFormData({
         name: '',
         description: '',
         presentation: '',
         precio_unitario: '',
         precio_mayorista: '',
         stock: '',
         image: '',
         category: 'Gaseosas',
         status: 'Disponible'
      });
      setImageFile(null);
      setImagePreview('');
      setSelectedCategory(new Set(['Gaseosas']));
      setSelectedStatus(new Set(['Disponible']));
      setIsLoading(false);
      
      // Limpiar el input de archivo
      const input = document.getElementById('image-upload') as HTMLInputElement;
      if (input) input.value = '';
   };

   const handleCategoryChange = (keys: any) => {
      setSelectedCategory(new Set(keys));
   };

   const handleStatusChange = (keys: any) => {
      setSelectedStatus(new Set(keys));
   };

   const handleInputChange = (field: string) => (e: React.ChangeEvent<FormElement>) => {
      setFormData(prev => ({
         ...prev,
         [field]: e.target.value
      }));
   };

   const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         setImageFile(file);
         const reader = new FileReader();
         reader.onloadend = () => {
            const base64String = reader.result as string;
            setImagePreview(base64String);
            setFormData(prev => ({
               ...prev,
               image: base64String
            }));
         };
         reader.readAsDataURL(file);
      }
   };

   const createProductInAPI = async (productData: FormData) => {
      try {
         const response = await fetch('https://api.bebidasdelperu.name/api/products', {
            method: 'POST',
            body: productData,
         });

         const result = await response.json();

         if (!response.ok) {
            // Manejo específico de errores de validación de Laravel
            if (result.errors) {
               const errorMessages = Object.values(result.errors).flat().join(', ');
               throw new Error(`Errores de validación: ${errorMessages}`);
            }
            throw new Error(result.message || `Error ${response.status}: ${response.statusText}`);
         }

         console.log('✅ Producto creado exitosamente:', result);
         return result;
      } catch (error) {
         console.error('❌ Error al crear producto:', error);
         throw error;
      }
   };

   const handleSubmit = async () => {
      console.log('📝 Datos del formulario al enviar:', formData);
      
      // Validar campos requeridos
      if (!formData.name || !formData.presentation || 
          !formData.precio_unitario || !formData.precio_mayorista || !formData.stock) {
         console.log('❌ Validación fallida - campos requeridos faltantes');
         alert('Por favor, completa todos los campos requeridos');
         return;
      }

      setIsLoading(true);
      
      try {
         // Crear FormData para enviar a la API de Laravel
         const apiFormData = new FormData();
         apiFormData.append('nombre', formData.name);
         apiFormData.append('descripcion', formData.description || 'Sin descripción');
         apiFormData.append('presentacion', formData.presentation);
         apiFormData.append('precioUnitario', formData.precio_unitario);
         apiFormData.append('precioMayorista', formData.precio_mayorista);
         apiFormData.append('stock', formData.stock);

         // Agregar imagen si existe
         if (imageFile) {
            apiFormData.append('urlImage', imageFile);
         }

         console.log('📤 Enviando datos a la API...');
         
         // Enviar a la API
         const apiResult = await createProductInAPI(apiFormData);
         
         // También crear el producto local para la tabla
         const newProduct: Omit<ProductLocal, 'id'> = {
            name: formData.name,
            description: formData.description || 'Sin descripción',
            presentation: formData.presentation,
            precio_unitario: parseFloat(formData.precio_unitario),
            precio_mayorista: parseFloat(formData.precio_mayorista),
            stock: parseInt(formData.stock),
            image: imagePreview || '/images/products/default.jpg',
            category: Array.from(selectedCategory)[0] as string,
            status: Array.from(selectedStatus)[0] as 'Disponible' | 'Agotado' | 'Descontinuado'
         };

         console.log('📦 Producto procesado para tabla local:', newProduct);
         onAddProduct(newProduct);
         
         // Reset form
         resetForm();
         
         alert('¡Producto creado exitosamente!');
         onClose();
         
      } catch (error: any) {
         console.error('💥 Error al crear producto:', error);
         const errorMessage = error?.message || 'Error desconocido al crear el producto';
         alert(`Error: ${errorMessage}`);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <Modal
         closeButton
         blur
         aria-labelledby="modal-title"
         open={visible}
         onClose={() => {
            resetForm();
            onClose();
         }}
         width="700px"
      >
         <Modal.Header>
            <Text id="modal-title" size={18} css={{ color: '#034F32', fontWeight: '$bold' }}>
               Agregar Nuevo Producto
            </Text>
         </Modal.Header>
         <Modal.Body>
            <Flex
               direction={'column'}
               css={{
                  flexWrap: 'wrap',
                  gap: '$4',
                  '@lg': {flexWrap: 'nowrap'},
               }}
            >
               {/* Nombre del producto */}
               <Input
                  clearable
                  bordered
                  fullWidth
                  color="success"
                  size="lg"
                  placeholder="Ej: Ice Kola"
                  label="Nombre del Producto*"
                  value={formData.name}
                  onChange={handleInputChange('name')}
               />
               
               {/* Presentación */}
               <Input
                  clearable
                  bordered
                  fullWidth
                  color="success"
                  size="lg"
                  placeholder="Ej: 500ml - Botella PET"
                  label="Presentación*"
                  value={formData.presentation}
                  onChange={handleInputChange('presentation')}
               />
               
               {/* Descripción */}
               <Textarea
                  bordered
                  fullWidth
                  color="success"
                  placeholder="Describe las características del producto..."
                  label="Descripción"
                  value={formData.description}
                  onChange={handleInputChange('description')}
                  rows={3}
               />
               
               {/* Precios */}
               <Flex css={{ gap: '$4' }}>
                  <Input
                     clearable
                     bordered
                     fullWidth
                     color="success"
                     size="lg"
                     type="number"
                     step="0.01"
                     placeholder="0.00"
                     label="Precio Unitario (S/)*"
                     value={formData.precio_unitario}
                     onChange={handleInputChange('precio_unitario')}
                  />
                  
                  <Input
                     clearable
                     bordered
                     fullWidth
                     color="success"
                     size="lg"
                     type="number"
                     step="0.01"
                     placeholder="0.00"
                     label="Precio Mayorista (S/)*"
                     value={formData.precio_mayorista}
                     onChange={handleInputChange('precio_mayorista')}
                  />
               </Flex>
               
               {/* Stock */}
               <Input
                  clearable
                  bordered
                  fullWidth
                  color="success"
                  size="lg"
                  type="number"
                  placeholder="0"
                  label="Stock*"
                  value={formData.stock}
                  onChange={handleInputChange('stock')}
               />
               
               {/* Categoría y Estado */}
               <Flex css={{ gap: '$4' }}>
                  <Dropdown>
                     <Dropdown.Button flat color="success">
                        {Array.from(selectedCategory)[0] || 'Seleccionar Categoría'}
                     </Dropdown.Button>
                     <Dropdown.Menu
                        aria-label="Categorías"
                        color="success"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedCategory}
                        onSelectionChange={handleCategoryChange}
                     >
                        {categories.map((category) => (
                           <Dropdown.Item key={category}>{category}</Dropdown.Item>
                        ))}
                     </Dropdown.Menu>
                  </Dropdown>
                  
                  <Dropdown>
                     <Dropdown.Button flat color="success">
                        {Array.from(selectedStatus)[0] || 'Seleccionar Estado'}
                     </Dropdown.Button>
                     <Dropdown.Menu
                        aria-label="Estados"
                        color="success"
                        disallowEmptySelection
                        selectionMode="single"
                        selectedKeys={selectedStatus}
                        onSelectionChange={handleStatusChange}
                     >
                        {statusOptions.map((status) => (
                           <Dropdown.Item key={status}>{status}</Dropdown.Item>
                        ))}
                     </Dropdown.Menu>
                  </Dropdown>
               </Flex>
               
               {/* Upload de imagen */}
               <Flex direction="column" css={{gap: '$3'}}>
                  <Text size="$sm" css={{color: '$accents7', fontWeight: '$medium'}}>
                     Imagen del Producto
                  </Text>
                  
                  <Flex direction="column" css={{gap: '$2'}}>
                     <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                        id="image-upload"
                     />
                     
                     <label htmlFor="image-upload">
                        <Button
                           as="span"
                           flat
                           css={{
                              backgroundColor: '#F1F9F1',
                              border: '2px dashed #5CAC4C',
                              color: '#5CAC4C',
                              padding: '$4 $6',
                              borderRadius: '$lg',
                              cursor: 'pointer',
                              width: '100%',
                              '&:hover': {
                                 backgroundColor: '#E8F5E8',
                                 borderColor: '#4A9C3C'
                              }
                           }}
                        >
                           📷 {imagePreview ? 'Cambiar Imagen' : 'Seleccionar Imagen'}
                        </Button>
                     </label>
                     
                     {imagePreview && (
                        <Flex direction="column" css={{gap: '$2', alignItems: 'center'}}>
                           <Box css={{
                              border: '1px solid $accents4',
                              borderRadius: '$lg',
                              padding: '$2',
                              backgroundColor: '$accents0'
                           }}>
                              <img 
                                 src={imagePreview} 
                                 alt="Preview" 
                                 style={{
                                    maxWidth: '200px',
                                    maxHeight: '150px',
                                    borderRadius: '8px',
                                    objectFit: 'cover',
                                    display: 'block'
                                 }}
                              />
                           </Box>
                           <Button
                              size="xs"
                              flat
                              color="error"
                              onClick={() => {
                                 setImagePreview('');
                                 setImageFile(null);
                                 const input = document.getElementById('image-upload') as HTMLInputElement;
                                 if (input) input.value = '';
                              }}
                           >
                              🗑️ Remover Imagen
                           </Button>
                        </Flex>
                     )}
                  </Flex>
               </Flex>
            </Flex>
         </Modal.Body>
         <Modal.Footer>
            <Button auto flat color="error" onClick={() => {
               resetForm();
               onClose();
            }} disabled={isLoading}>
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
               disabled={isLoading || !formData.name || !formData.presentation || 
                        !formData.precio_unitario || !formData.precio_mayorista || !formData.stock}
            >
               {isLoading ? '🔄 Creando...' : 'Agregar Producto'}
            </Button>
         </Modal.Footer>
      </Modal>
   );
};