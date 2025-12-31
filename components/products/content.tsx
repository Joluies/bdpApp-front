import React, {useState, useEffect} from 'react';
import {
   Text,
   Button,
   Input,
   Dropdown,
   Grid,
   Card,
   Spacer,
   Loading
} from '@nextui-org/react';
import {Box} from '../styles/box';
import {Flex} from '../styles/flex';
import {ProductsTable} from './products-table';
import {productsData, ProductLocal, mapApiProductToLocal} from './data';
import {AddProductModal} from './add-product-modal';
import {productsApiService, ApiProduct} from '../../services/products-api.service';
import {APIStatus} from './api-status';

export const ProductsContent = () => {
   const [products, setProducts] = useState<ProductLocal[]>([]);
   const [loading, setLoading] = useState(true);
   const [searchValue, setSearchValue] = useState('');
   const [filterStatus, setFilterStatus] = useState('todos');
   const [showAddModal, setShowAddModal] = useState(false);
   const [apiConnected, setApiConnected] = useState(false);
   const [lastUpdated, setLastUpdated] = useState<Date | undefined>(undefined);

   // Cargar productos de la API
   useEffect(() => {
      loadProducts();
   }, []);

   const loadProducts = async () => {
      setLoading(true);
      console.log('🔄 Iniciando carga de productos...');
      
      try {
         console.log('🌐 Intentando conectar a la API...');
         const apiProducts = await productsApiService.getProducts();
         
         console.log('📊 Productos recibidos de la API:', apiProducts);
         
         // Si llegamos aquí, la API respondió exitosamente
         console.log('✅ API conectada exitosamente');
         setApiConnected(true);
         setLastUpdated(new Date());
         
         if (apiProducts && apiProducts.length > 0) {
            console.log('📦 Productos encontrados:', apiProducts.length);
            // Convertir productos de API al formato local
            const localProducts = apiProducts.map(mapApiProductToLocal);
            setProducts(localProducts);
         } else {
            console.log('📭 API conectada pero sin productos disponibles');
            // API conectada pero sin productos - mostrar array vacío
            setProducts([]);
         }
      } catch (error) {
         console.error('❌ Error conectando a la API:', error);
         console.log('📁 Usando datos locales como fallback');
         setProducts(productsData);
         setApiConnected(false);
      } finally {
         setLoading(false);
         console.log('🏁 Carga de productos completada');
      }
   };

   // Filtrar productos basado en búsqueda y estado
   const filteredProducts = products.filter(product => {
      // Validar que el producto tenga las propiedades necesarias
      if (!product || !product.name) {
         console.warn('⚠️ Producto sin propiedades requeridas:', product);
         return false;
      }

      const matchesSearch = (product.name || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                          (product.description || '').toLowerCase().includes(searchValue.toLowerCase()) ||
                          (product.category || '').toLowerCase().includes(searchValue.toLowerCase());
      
      const matchesStatus = filterStatus === 'todos' || product.status === filterStatus;
      
      return matchesSearch && matchesStatus;
   });

   // Estadísticas rápidas
   const stats = {
      total: products.length,
      disponibles: products.filter(p => p.status === 'Disponible').length,
      agotados: products.filter(p => p.status === 'Agotado').length,
      valorTotal: products.reduce((sum, p) => sum + (p.precio_unitario * p.stock), 0)
   };

   // Función para agregar un nuevo producto
   const handleAddProduct = async (newProductData: Omit<ProductLocal, 'id'>) => {
      console.log('🚀 Iniciando proceso de agregar producto:', newProductData);
      
      try {
         // Validar que el producto tenga las propiedades necesarias
         if (!newProductData.name || !newProductData.presentation) {
            console.error('❌ Datos incompletos del producto:', newProductData);
            alert('Error: Faltan datos requeridos del producto');
            return;
         }

         // Asegurar que todas las propiedades existan con valores por defecto
         const sanitizedProduct: Omit<ProductLocal, 'id'> = {
            name: newProductData.name || '',
            description: newProductData.description || 'Sin descripción',
            presentation: newProductData.presentation || '',
            precio_unitario: newProductData.precio_unitario || 0,
            precio_mayorista: newProductData.precio_mayorista || 0,
            stock: newProductData.stock || 0,
            image: newProductData.image || '/images/products/default.jpg',
            category: newProductData.category || 'Gaseosas',
            status: newProductData.status || 'Disponible'
         };

         // Convertir datos locales al formato de la API
         const apiProductData: any = {
            nombre: sanitizedProduct.name,
            descripcion: sanitizedProduct.description,
            presentacion: sanitizedProduct.presentation,
            precioUnitario: sanitizedProduct.precio_unitario,
            precioMayorista: sanitizedProduct.precio_mayorista,
            stock: sanitizedProduct.stock,
            urlImage: sanitizedProduct.image || 'https://via.placeholder.com/150x150.png?text=Sin+Imagen'
         };

         console.log('🔄 Enviando producto a la API:', apiProductData);
         const newProduct = await productsApiService.createProduct(apiProductData);
         
         if (newProduct) {
            console.log('✅ Producto creado exitosamente en la API:', newProduct);
            // Agregar el producto local directamente sin convertir
            setProducts(prev => {
               console.log('📋 Agregando producto a lista local');
               const productWithId: ProductLocal = {
                  id: newProduct.idProducto || Date.now(),
                  ...sanitizedProduct
               };
               const updatedList = [...prev, productWithId];
               console.log('📊 Total de productos después de agregar:', updatedList.length);
               return updatedList;
            });
            
            // Recargar productos desde la API para asegurar sincronización
            console.log('🔄 Recargando productos desde la API...');
            await loadProducts();
         } else {
            console.log('⚠️ API no devolvió producto. Agregando localmente como fallback');
            // Si falla la API, agregar localmente como fallback
            const newId = Math.max(...products.map(p => p.id)) + 1;
            const localProduct: ProductLocal = {
               ...newProductData,
               id: newId
            };
            setProducts(prev => [...prev, localProduct]);
         }
      } catch (error) {
         console.error('❌ Error al agregar producto:', error);
         console.log('📁 Agregando localmente como fallback debido a error');
         // Fallback a agregar localmente
         const newId = Math.max(...products.map(p => p.id)) + 1;
         const localProduct: ProductLocal = {
            ...newProductData,
            id: newId
         };
         setProducts(prev => [...prev, localProduct]);
      }
   };

   // Función para actualizar un producto
   const handleUpdateProduct = async (id: number, updatedData: Partial<ProductLocal> & { imageFile?: File | null }) => {
      try {
         console.log('📝 Iniciando actualización de producto:', { id, updatedData });
         
         // Si hay un archivo de imagen, usar el método con FormData
         if (updatedData.imageFile) {
            console.log('📸 Detectada imagen para actualizar');
            console.log('📋 Campos disponibles en updatedData:', Object.keys(updatedData));
            
            // Preparar datos para la API - Asegurar que todos los campos tengan valores
            const apiUpdateData = {
               nombre: updatedData.name || updatedData.nombre || '',
               descripcion: updatedData.description || updatedData.descripcion || '',
               presentacion: updatedData.presentation || updatedData.presentacion || '',
               precioUnitario: updatedData.precio_unitario || updatedData.precioUnitario || 0,
               precioMayorista: updatedData.precio_mayorista || updatedData.precioMayorista || 0,
               stock: updatedData.stock || 0
            };
            
            console.log('📊 Datos a enviar al API:', apiUpdateData);
            console.log('🔄 Enviando actualización con imagen a la API...');
            console.log('🔗 URL completa: ' + `${process.env.NEXT_PUBLIC_API_URL}/api/products/${id}`);
            console.log('📁 ImageFile disponible:', !!updatedData.imageFile);
            if (updatedData.imageFile) {
               console.log('   - Nombre:', updatedData.imageFile.name);
               console.log('   - Tipo:', updatedData.imageFile.type);
               console.log('   - Tamaño:', updatedData.imageFile.size);
            } else {
               console.log('   ⚠️ imageFile es null/undefined!');
            }

            // 🔥 LLAMADA REAL AL API CON IMAGEN
            const updatedProduct = await productsApiService.updateProductWithImage(
               id, 
               apiUpdateData, 
               updatedData.imageFile
            );

            if (updatedProduct) {
               console.log('✅ Producto actualizado con imagen en la API');
               console.log('📦 Producto API recibido:', updatedProduct);
               // Convertir el producto actualizado a formato local
               const localProduct = mapApiProductToLocal(updatedProduct);
               console.log('🖼️ Producto local después de mapeo:', localProduct);
               setProducts(prev => prev.map(p => p.id === id ? localProduct : p));
            } else {
               console.log('⚠️ API no devolvió producto actualizado, actualizando localmente');
               // Fallback a actualizar localmente
               const dataWithoutFile = { ...updatedData };
               delete dataWithoutFile.imageFile;
               setProducts(prev => prev.map(p => 
                  p.id === id ? { ...p, ...dataWithoutFile } : p
               ));
            }
         } else {
            // Sin imagen, usar el método normal
            console.log('📝 Actualización sin imagen, usando método estándar');
            
            // Convertir datos locales al formato de la API
            const apiUpdateData = productsApiService.mapToApi(updatedData);

            const updatedProduct = await productsApiService.updateProduct(id, apiUpdateData);
            
            if (updatedProduct) {
               console.log('✅ Producto actualizado en la API');
               // Convertir el producto actualizado a formato local
               const localProduct = mapApiProductToLocal(updatedProduct);
               setProducts(prev => prev.map(p => p.id === id ? localProduct : p));
            } else {
               console.log('⚠️ API no devolvió producto, actualizando localmente');
               // Fallback a actualizar localmente
               setProducts(prev => prev.map(p => 
                  p.id === id ? { ...p, ...updatedData } : p
               ));
            }
         }
      } catch (error) {
         console.error('❌ Error al actualizar producto:', error);
         // Fallback a actualizar localmente
         const dataWithoutFile = { ...updatedData };
         delete dataWithoutFile.imageFile;
         setProducts(prev => prev.map(p => 
            p.id === id ? { ...p, ...dataWithoutFile } : p
         ));
      }
   };

   // Función para eliminar un producto
   const handleDeleteProduct = async (id: number) => {
      try {
         const success = await productsApiService.deleteProduct(id);
         
         if (success) {
            setProducts(prev => prev.filter(p => p.id !== id));
         } else {
            // Si falla la API, eliminar localmente como fallback
            setProducts(prev => prev.filter(p => p.id !== id));
         }
      } catch (error) {
         console.error('Error al eliminar producto:', error);
         // Fallback a eliminar localmente
         setProducts(prev => prev.filter(p => p.id !== id));
      }
   };

   return (
      <Box css={{overflow: 'hidden', height: '100%'}}>
         {/* Header */}
         <Flex
            css={{
               'gap': '$8',
               'pt': '$5',
               'height': 'fit-content',
               'flexWrap': 'wrap',
               '@sm': {
                  pt: '$10',
               },
            }}
            justify={'center'}
         >
            <Flex
               css={{
                  'px': '$12',
                  'mt': '$8',
                  '@xsMax': {px: '$10'},
                  'gap': '$12',
                  'width': '100%'
               }}
               direction={'column'}
            >
               {/* Título y botón agregar */}
               <Flex justify="between" align="center">
                  <Box>
                     <Text
                        h1
                        css={{
                           'textAlign': 'center',
                           'color': '#034F32',
                           'fontSize': '$3xl',
                           'fontWeight': '$bold',
                           '@sm': {
                              textAlign: 'inherit',
                           },
                        }}
                     >
                        Productos - Bebidas Gaseosas
                     </Text>
                     <Text
                        css={{
                           'textAlign': 'center',
                           'color': '#5CAC4C',
                           'fontSize': '$lg',
                           '@sm': {
                              textAlign: 'inherit',
                           },
                        }}
                     >
                        Gestiona el inventario de bebidas de Bebidas del Perú
                     </Text>
                     
                     <APIStatus 
                        isConnected={apiConnected} 
                        isLoading={loading} 
                        lastUpdated={lastUpdated}
                        productsCount={products.length}
                     />
                  </Box>
                  
                  <Flex css={{ gap: '$4' }}>
                     <Button
                        auto
                        flat
                        onClick={loadProducts}
                        disabled={loading}
                        css={{
                           backgroundColor: '#E8F5E8',
                           color: '#5CAC4C',
                           border: '1px solid #5CAC4C',
                           '&:hover': {
                              backgroundColor: '#D4F4D4'
                           }
                        }}
                     >
                        🔄 Recargar
                     </Button>
                     
                     <Button
                        auto
                        flat
                        onClick={async () => {
                           console.log('🧪 Probando API directamente...');
                           try {
                              const testProduct = {
                                 nombre: 'Producto Test API',
                                 descripcion: 'Test desde frontend',
                                 presentacion: 'Test 500ml',
                                 precioUnitario: 10.50,
                                 precioMayorista: 9.50,
                                 stock: 50,
                                 urlImage: 'https://via.placeholder.com/150x150.png?text=Test+API'
                              };
                              const result = await productsApiService.createProduct(testProduct);
                              console.log('🎯 Resultado de prueba API:', result);
                              if (result) {
                                 await loadProducts();
                              }
                           } catch (error) {
                              console.error('💥 Error en prueba API:', error);
                           }
                        }}
                        css={{
                           backgroundColor: '#FFA500',
                           color: 'white',
                           '&:hover': {
                              backgroundColor: '#FF8C00'
                           }
                        }}
                     >
                        🧪 Test API
                     </Button>
                     
                     <Button
                        auto
                        onClick={() => setShowAddModal(true)}
                        css={{
                           backgroundColor: '#5CAC4C',
                           color: 'white',
                           fontWeight: '$semibold',
                           '&:hover': {
                              backgroundColor: '#4A9C3C'
                           }
                        }}
                     >
                        + Agregar Producto
                     </Button>
                  </Flex>
               </Flex>

               {/* Estadísticas rápidas */}
               <Grid.Container gap={2} justify="flex-start">
                  <Grid xs={12} sm={3}>
                     <Card css={{ backgroundColor: '#F1F1E9', p: '$6' }}>
                        <Text css={{ color: '#034F32', fontSize: '$sm', fontWeight: '$medium' }}>
                           Total Productos
                        </Text>
                        <Text css={{ color: '#5CAC4C', fontSize: '$2xl', fontWeight: '$bold' }}>
                           {stats.total}
                        </Text>
                     </Card>
                  </Grid>
                  <Grid xs={12} sm={3}>
                     <Card css={{ backgroundColor: '#C8ECC9', p: '$6' }}>
                        <Text css={{ color: '#034F32', fontSize: '$sm', fontWeight: '$medium' }}>
                           Disponibles
                        </Text>
                        <Text css={{ color: '#034F32', fontSize: '$2xl', fontWeight: '$bold' }}>
                           {stats.disponibles}
                        </Text>
                     </Card>
                  </Grid>
                  <Grid xs={12} sm={3}>
                     <Card css={{ backgroundColor: '#F8D7DA', p: '$6' }}>
                        <Text css={{ color: '#721C24', fontSize: '$sm', fontWeight: '$medium' }}>
                           Agotados
                        </Text>
                        <Text css={{ color: '#721C24', fontSize: '$2xl', fontWeight: '$bold' }}>
                           {stats.agotados}
                        </Text>
                     </Card>
                  </Grid>
                  <Grid xs={12} sm={3}>
                     <Card css={{ backgroundColor: '#034F32', p: '$6' }}>
                        <Text css={{ color: 'white', fontSize: '$sm', fontWeight: '$medium' }}>
                           Valor Total Inventario
                        </Text>
                        <Text css={{ color: '#C8ECC9', fontSize: '$xl', fontWeight: '$bold' }}>
                           S/ {stats.valorTotal.toFixed(2)}
                        </Text>
                     </Card>
                  </Grid>
               </Grid.Container>

               {/* Filtros y búsqueda */}
               <Flex
                  css={{
                     gap: '$8',
                     flexWrap: 'wrap',
                     alignItems: 'flex-end'
                  }}
               >
                  <Box css={{ flex: 1, minWidth: '200px' }}>
                     <Input
                        clearable
                        placeholder="Buscar productos..."
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        css={{
                           '& .nextui-input': {
                              borderColor: '#C8ECC9',
                           },
                           '& .nextui-input:focus': {
                              borderColor: '#5CAC4C',
                           }
                        }}
                     />
                  </Box>
                  
                  <Dropdown>
                     <Dropdown.Button
                        auto
                        css={{
                           backgroundColor: '#F1F1E9',
                           color: '#034F32',
                           border: '1px solid #C8ECC9',
                           '&:hover': {
                              backgroundColor: '#C8ECC9'
                           }
                        }}
                     >
                        Estado: {filterStatus === 'todos' ? 'Todos' : filterStatus}
                     </Dropdown.Button>
                     <Dropdown.Menu
                        aria-label="Filtrar por estado"
                        onAction={(key) => setFilterStatus(String(key))}
                     >
                        <Dropdown.Item key="todos">Todos</Dropdown.Item>
                        <Dropdown.Item key="Disponible">Disponible</Dropdown.Item>
                        <Dropdown.Item key="Agotado">Agotado</Dropdown.Item>
                        <Dropdown.Item key="Descontinuado">Descontinuado</Dropdown.Item>
                     </Dropdown.Menu>
                  </Dropdown>
               </Flex>

               <Spacer y={1} />

               {/* Tabla de productos */}
               <Box>
                  {loading ? (
                     <Flex justify="center" align="center" css={{ minHeight: '400px' }}>
                        <Loading size="xl" color="success">
                           Cargando productos desde la API...
                        </Loading>
                     </Flex>
                  ) : (
                     <ProductsTable 
                        products={filteredProducts} 
                        onUpdateProduct={handleUpdateProduct}
                        onDeleteProduct={handleDeleteProduct}
                     />
                  )}
               </Box>
            </Flex>
         </Flex>

         {/* Modal para agregar producto */}
         <AddProductModal
            visible={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAddProduct={handleAddProduct}
         />
      </Box>
   );
};