import React, {useState} from 'react';
import {
   Table,
   Badge,
   Text,
   Tooltip,
   Button,
   Col,
   Row,
   Modal
} from '@nextui-org/react';
import {ProductLocal} from './data';
import {Flex} from '../styles/flex';
import {Box} from '../styles/box';
import {EditProductModal} from './edit-product-modal';

interface Props {
   products: ProductLocal[];
   onUpdateProduct?: (id: number, updatedData: Partial<ProductLocal>) => Promise<void>;
   onDeleteProduct?: (id: number) => Promise<void>;
}

export const ProductsTable = ({products, onUpdateProduct, onDeleteProduct}: Props) => {
   const [editingProduct, setEditingProduct] = useState<ProductLocal | null>(null);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [productToDelete, setProductToDelete] = useState<number | null>(null);
   const [showImageModal, setShowImageModal] = useState(false);
   const [selectedImage, setSelectedImage] = useState<{src: string, name: string} | null>(null);

   const handleEditProduct = (product: ProductLocal) => {
      setEditingProduct(product);
   };

   const handleDeleteProduct = (productId: number) => {
      setProductToDelete(productId);
      setShowDeleteModal(true);
   };

   const handleImageClick = (imageSrc: string, productName: string) => {
      setSelectedImage({src: imageSrc, name: productName});
      setShowImageModal(true);
   };

   const confirmDelete = async () => {
      if (productToDelete && onDeleteProduct) {
         await onDeleteProduct(productToDelete);
         setShowDeleteModal(false);
         setProductToDelete(null);
      }
   };

   const renderCell = (product: ProductLocal, columnKey: React.Key) => {
      switch (columnKey) {
         case 'image':
            return (
               <Box css={{display: 'flex', alignItems: 'center'}}>
                  <Box
                     css={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '$md',
                        overflow: 'hidden',
                        backgroundColor: '$accents1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                           transform: 'scale(1.1)',
                           boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                        }
                     }}
                     onClick={() => {
                        const imageUrl = (product as any).urlImage || product.image;
                        if (imageUrl && imageUrl !== '/images/products/default.jpg') {
                           handleImageClick(imageUrl, product.name);
                        }
                     }}
                  >
                     {((product as any).urlImage || product.image) && ((product as any).urlImage || product.image) !== '/images/products/default.jpg' ? (
                        <img 
                           src={(product as any).urlImage || product.image} 
                           alt={product.name}
                           style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                           }}
                           onError={(e) => {
                              console.error(`Error cargando imagen: ${(product as any).urlImage || product.image}`);
                              (e.target as HTMLImageElement).style.display = 'none';
                           }}
                        />
                     ) : (
                        <Text css={{fontSize: '$xl'}}>🥤</Text>
                     )}
                  </Box>
               </Box>
            );
         case 'name':
            return (
               <Flex direction="column">
                  <Text
                     css={{
                        fontSize: '$sm',
                        fontWeight: '$semibold',
                        color: '#034F32'
                     }}
                  >
                     {product.name}
                  </Text>
                  <Text
                     css={{
                        fontSize: '$xs',
                        color: '#5CAC4C'
                     }}
                  >
                     {product.category}
                  </Text>
               </Flex>
            );
         case 'description':
            return (
               <Tooltip content={product.description} css={{maxWidth: '300px'}}>
                  <Text
                     css={{
                        fontSize: '$xs',
                        maxWidth: '200px',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                        whiteSpace: 'nowrap'
                     }}
                  >
                     {product.description}
                  </Text>
               </Tooltip>
            );
         case 'presentation':
            return (
               <Badge
                  color="primary"
                  variant="flat"
                  css={{
                     backgroundColor: '#F1F1E9',
                     color: '#034F32'
                  }}
               >
                  {product.presentation}
               </Badge>
            );
         case 'precio_unitario':
            return (
               <Text
                  css={{
                     fontSize: '$sm',
                     fontWeight: '$medium',
                     color: '#034F32'
                  }}
               >
                  S/ {product.precio_unitario.toFixed(2)}
               </Text>
            );
         case 'precio_mayorista':
            return (
               <Text
                  css={{
                     fontSize: '$sm',
                     fontWeight: '$medium',
                     color: '#5CAC4C'
                  }}
               >
                  S/ {product.precio_mayorista.toFixed(2)}
               </Text>
            );
         case 'stock':
            return (
               <Badge
                  color={product.stock > 50 ? "success" : product.stock > 0 ? "warning" : "error"}
                  variant="flat"
                  css={{
                     backgroundColor: product.stock > 50 ? '#C8ECC9' : 
                                    product.stock > 0 ? '#FFF3CD' : '#F8D7DA',
                     color: product.stock > 50 ? '#034F32' : 
                           product.stock > 0 ? '#856404' : '#721C24'
                  }}
               >
                  {product.stock} unid.
               </Badge>
            );
         case 'status':
            return (
               <Badge
                  color={product.status === 'Disponible' ? 'success' : 
                        product.status === 'Agotado' ? 'error' : 'warning'}
                  variant="flat"
                  css={{
                     backgroundColor: product.status === 'Disponible' ? '#C8ECC9' : 
                                    product.status === 'Agotado' ? '#F8D7DA' : '#FFF3CD',
                     color: product.status === 'Disponible' ? '#034F32' : 
                           product.status === 'Agotado' ? '#721C24' : '#856404'
                  }}
               >
                  {product.status}
               </Badge>
            );
         case 'actions':
            return (
               <Flex css={{gap: '$2'}}>
                  <Button
                     auto
                     size="sm"
                     css={{
                        backgroundColor: '#5CAC4C',
                        color: 'white',
                        '&:hover': {
                           backgroundColor: '#4A9C3C'
                        }
                     }}
                     onClick={() => handleEditProduct(product)}
                  >
                     Editar
                  </Button>
                  <Button
                     auto
                     size="sm"
                     css={{
                        backgroundColor: '#DC2626',
                        color: 'white',
                        '&:hover': {
                           backgroundColor: '#B91C1C'
                        }
                     }}
                     onClick={() => handleDeleteProduct(product.id)}
                  >
                     Eliminar
                  </Button>
               </Flex>
            );
         default:
            return <Text>{String(product[columnKey as keyof ProductLocal])}</Text>;
      }
   };

const columns = [
      {name: 'IMAGEN', uid: 'image'},
      {name: 'NOMBRE', uid: 'name'},
      {name: 'DESCRIPCIÓN', uid: 'description'},
      {name: 'PRESENTACIÓN', uid: 'presentation'},
      {name: 'P. UNITARIO', uid: 'precio_unitario'},
      {name: 'P. MAYORISTA', uid: 'precio_mayorista'},
      {name: 'STOCK', uid: 'stock'},
      {name: 'ESTADO', uid: 'status'},
      {name: 'ACCIONES', uid: 'actions'},
   ];

   // Mostrar mensaje cuando no hay productos
   if (products.length === 0) {
      return (
         <Box
            css={{
               display: 'flex',
               flexDirection: 'column',
               alignItems: 'center',
               justifyContent: 'center',
               minHeight: '300px',
               textAlign: 'center',
               py: '$10'
            }}
         >
            <Text
               h3
               css={{
                  color: '$accents7',
                  mb: '$4'
               }}
            >
               📦 No hay productos disponibles
            </Text>
            <Text
               css={{
                  color: '$accents6',
                  maxWidth: '400px'
               }}
            >
               No se encontraron productos en el inventario. Agrega algunos productos para comenzar a gestionar tu inventario.
            </Text>
         </Box>
      );
   }

   return (
      <>
      <Box
         css={{
            '& .nextui-table-container': {
               boxShadow: 'none',
            },
         }}
      >
         <Table
            aria-label="Tabla de productos de bebidas gaseosas"
            css={{
               height: "auto",
               minWidth: "100%",
               boxShadow: 'none',
               width: '100%',
               px: 0,
            }}
            selectionMode="multiple"
         >
            <Table.Header columns={columns}>
               {(column) => (
                  <Table.Column
                     key={column.uid}
                     hideHeader={column.uid === "actions"}
                     align={column.uid === "actions" ? "center" : "start"}
                  >
                     {column.name}
                  </Table.Column>
               )}
            </Table.Header>
            <Table.Body items={products}>
               {(product) => (
                  <Table.Row>
                     {(columnKey) => (
                        <Table.Cell css={{ py: "$4" }}>
                           {renderCell(product, columnKey)}
                        </Table.Cell>
                     )}
                  </Table.Row>
               )}
            </Table.Body>
         </Table>
      </Box>

      {/* Modal de edición */}
      <EditProductModal
         visible={editingProduct !== null}
         onClose={() => setEditingProduct(null)}
         onUpdateProduct={onUpdateProduct!}
         product={editingProduct}
      />

      {/* Modal de confirmación para eliminar */}
      <Modal
         closeButton
         aria-labelledby="modal-title"
         open={showDeleteModal}
         onClose={() => setShowDeleteModal(false)}
      >
         <Modal.Header>
            <Text id="modal-title" size={18} css={{ color: '#DC2626', fontWeight: '$bold' }}>
               Confirmar Eliminación
            </Text>
         </Modal.Header>
         <Modal.Body>
            <Text>¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.</Text>
         </Modal.Body>
         <Modal.Footer>
            <Button auto flat color="default" onClick={() => setShowDeleteModal(false)}>
               Cancelar
            </Button>
            <Button 
               auto 
               css={{
                  backgroundColor: '#DC2626',
                  color: 'white',
                  '&:hover': {
                     backgroundColor: '#B91C1C'
                  }
               }}
               onClick={confirmDelete}
            >
               Eliminar
            </Button>
         </Modal.Footer>
      </Modal>

      {/* Modal de imagen ampliada */}
      <Modal
         closeButton
         aria-labelledby="image-modal-title"
         open={showImageModal}
         onClose={() => setShowImageModal(false)}
         width="auto"
         css={{
            maxWidth: '90vw',
            maxHeight: '90vh'
         }}
      >
         <Modal.Header>
            <Text id="image-modal-title" size={18} css={{ color: '#034F32', fontWeight: '$bold' }}>
               {selectedImage?.name || 'Imagen del Producto'}
            </Text>
         </Modal.Header>
         <Modal.Body css={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '$10'
         }}>
            {selectedImage && (
               <img 
                  src={selectedImage.src} 
                  alt={selectedImage.name}
                  style={{
                     maxWidth: '100%',
                     maxHeight: '70vh',
                     objectFit: 'contain',
                     borderRadius: '8px'
                  }}
               />
            )}
         </Modal.Body>
      </Modal>
      </>
   );
};