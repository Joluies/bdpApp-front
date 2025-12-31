import {
   Button,
   Input,
   Modal,
   Text,
   FormElement,
   Dropdown,
   Textarea,
} from '@nextui-org/react';
import React, { useState, useEffect } from 'react';
import {Flex} from '../styles/flex';
import {Box} from '../styles/box';
import {ProductLocal} from './data';

interface EditProductModalProps {
   visible: boolean;
   onClose: () => void;
   onUpdateProduct: (id: number, product: Partial<ProductLocal>) => Promise<void>;
   product: ProductLocal | null;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({ 
   visible, 
   onClose, 
   onUpdateProduct,
   product 
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
   const [selectedCategory, setSelectedCategory] = useState(new Set(['Gaseosas']));
   const [selectedStatus, setSelectedStatus] = useState(new Set(['Disponible']));

   const categories = ['Gaseosas', 'Jugos', 'Aguas', 'Energizantes', 'Otros'];
   const statusOptions = ['Disponible', 'Agotado', 'Descontinuado'];

   // Cargar datos del producto cuando se abre el modal
   useEffect(() => {
      if (product) {
         setFormData({
            name: product.name,
            description: product.description,
            presentation: product.presentation,
            precio_unitario: product.precio_unitario.toString(),
            precio_mayorista: product.precio_mayorista.toString(),
            stock: product.stock.toString(),
            image: product.image,
            category: product.category,
            status: product.status
         });
         setSelectedCategory(new Set([product.category]));
         setSelectedStatus(new Set([product.status]));
         setImagePreview(product.image);
      }
   }, [product]);

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

   const handleSubmit = async () => {
      if (!product) return;

      // Validar campos requeridos
      if (!formData.name || !formData.presentation || 
          !formData.precio_unitario || !formData.precio_mayorista || !formData.stock) {
         return;
      }

      const updatedData: Partial<ProductLocal> & { imageFile?: File | null } = {
         name: formData.name,
         description: formData.description || 'Sin descripción',
         presentation: formData.presentation,
         precio_unitario: parseFloat(formData.precio_unitario),
         precio_mayorista: parseFloat(formData.precio_mayorista),
         stock: parseInt(formData.stock),
         image: formData.image || '/images/products/default.jpg',
         category: Array.from(selectedCategory)[0] as string,
         status: Array.from(selectedStatus)[0] as 'Disponible' | 'Agotado' | 'Descontinuado',
         imageFile: imageFile // Pasar el archivo de imagen
      };

      await onUpdateProduct(product.id, updatedData);
      onClose();
   };

   return (
      <Modal
         closeButton
         blur
         aria-labelledby="modal-title"
         open={visible}
         onClose={onClose}
         width="700px"
      >
         <Modal.Header>
            <Text id="modal-title" size={18} css={{ color: '#034F32', fontWeight: '$bold' }}>
               Editar Producto
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
                  size="lg"
                  placeholder="Descripción del producto"
                  label="Descripción"
                  value={formData.description}
                  onChange={handleInputChange('description')}
               />
               
               {/* Precios en una fila */}
               <Flex css={{gap: '$4', '@sm': {flexDirection: 'column'}}}>
                  <Input
                     clearable
                     bordered
                     fullWidth
                     color="success"
                     size="lg"
                     type="number"
                     placeholder="0.00"
                     label="Precio Unitario (S/.)*"
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
                     placeholder="0.00"
                     label="Precio Mayorista (S/.)*"
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
                  label="Stock Disponible*"
                  value={formData.stock}
                  onChange={handleInputChange('stock')}
               />
               
               {/* Selectores */}
               <Flex css={{gap: '$4', '@sm': {flexDirection: 'column'}}}>
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
                        id="edit-image-upload"
                     />
                     
                     <label htmlFor="edit-image-upload">
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
                                 const input = document.getElementById('edit-image-upload') as HTMLInputElement;
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
            <Button auto flat color="error" onClick={onClose}>
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
               disabled={!formData.name || !formData.presentation || 
                        !formData.precio_unitario || !formData.precio_mayorista || !formData.stock}
            >
               Actualizar Producto
            </Button>
         </Modal.Footer>
      </Modal>
   );
};