// Interfaz que coincide exactamente con la API
export interface ApiProduct {
  idProducto: number;
  codProduct?: string;
  nombre: string;
  descripcion: string;
  presentacion: string;
  precioUnitario: number;
  precioMayorista: number;
  stockPaquete?: number;
  stockUnid?: number;
  stockTotal?: number;
  stock?: number;
  created_at: string;
  updated_at: string;
  urlImage: string | null;
}

// Mantener la interfaz original para compatibilidad
export interface Product extends ApiProduct {
  // Campos adicionales para compatibilidad local
  category?: string;
  brand?: string;
  status?: 'Disponible' | 'Agotado' | 'Descontinuado';
}

// Interfaz para compatibilidad con el código existente
export interface ProductLocal {
  id: number;
  codProduct: string;
  name: string;
  description: string;
  presentation: string;
  precio_unitario: number;
  precio_mayorista: number;
  stockPaquete: number;
  stockUnid: number;
  stockTotal: number;
  image: string;
  category: string;
  status: 'Disponible' | 'Agotado' | 'Descontinuado';
}

// Función para convertir datos de la API al formato local
export const mapApiProductToLocal = (apiProduct: ApiProduct): ProductLocal => {
  let imageUrl = apiProduct.urlImage || '/images/products/default.jpg';
  
  // Caso 1: URL relativa sin dominio (ej: storage/img/1767160816_6954bbf068153.jpg)
  if (imageUrl && !imageUrl.startsWith('http') && imageUrl !== '/images/products/default.jpg') {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.bebidasdelperuapp.com';
    // Insertar "productos/" en la ruta: storage/img/... → storage/img/productos/...
    const imagePath = imageUrl.replace('storage/img/', 'storage/img/productos/');
    imageUrl = `${baseUrl}/${imagePath}`;
    console.log('🖼️ URL relativa transformada:', {
      original: apiProduct.urlImage,
      transformed: imageUrl
    });
  }
  // Caso 2: URL absoluta SIN productos/ (ej: https://api.bebidasdelperuapp.com/storage/img/...)
  else if (imageUrl && imageUrl.startsWith('http') && imageUrl.includes('storage/img/') && !imageUrl.includes('storage/img/productos/')) {
    // Reemplazar storage/img/ por storage/img/productos/
    imageUrl = imageUrl.replace('storage/img/', 'storage/img/productos/');
    console.log('🖼️ URL absoluta transformada:', {
      original: apiProduct.urlImage,
      transformed: imageUrl
    });
  }
  
  return {
    id: apiProduct.idProducto,
    codProduct: apiProduct.codProduct || `PRD-${apiProduct.idProducto}`,
    name: apiProduct.nombre,
    description: apiProduct.descripcion,
    presentation: apiProduct.presentacion,
    precio_unitario: apiProduct.precioUnitario,
    precio_mayorista: apiProduct.precioMayorista,
    stockPaquete: apiProduct.stockPaquete || 0,
    stockUnid: apiProduct.stockUnid || 0,
    stockTotal: apiProduct.stockTotal ?? apiProduct.stock ?? 0,
    image: imageUrl,
    category: 'Gaseosas', // Valor por defecto
    status: (apiProduct.stockTotal ?? apiProduct.stock ?? 0) > 0 ? 'Disponible' : 'Agotado'
  };
};

export const productsData: ProductLocal[] = [
  {
    id: 1,
    name: 'Coca Cola Clásica',
    description: 'La bebida gaseosa más popular del mundo. Sabor único y refrescante.',
    presentation: '500ml - Botella PET',
    precio_unitario: 2.50,
    precio_mayorista: 2.20,
    stockTotal: 150,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-001',
    image: '/images/products/coca-cola-500ml.jpg',
    category: 'Gaseosas',
    status: 'Disponible'
  },
  {
    id: 2,
    name: 'Pepsi Cola',
    description: 'Bebida cola con sabor intenso y refrescante para toda la familia.',
    presentation: '600ml - Botella PET',
    precio_unitario: 2.80,
    precio_mayorista: 2.50,
    stockTotal: 89,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-002',
    image: '/images/products/pepsi-600ml.jpg',
    category: 'Gaseosas',
    status: 'Disponible'
  },
  {
    id: 3,
    name: 'Sprite Lima-Limón',
    description: 'Gaseosa transparente con sabor cítrico natural de lima y limón.',
    presentation: '355ml - Lata',
    precio_unitario: 1.80,
    precio_mayorista: 1.50,
    stockTotal: 200,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-003',
    image: '/images/products/sprite-355ml.jpg',
    category: 'Gaseosas',
    status: 'Disponible'
  },
  {
    id: 4,
    name: 'Fanta Naranja',
    description: 'Deliciosa gaseosa con sabor a naranja natural. Ideal para niños y adultos.',
    presentation: '500ml - Botella Vidrio',
    precio_unitario: 3.20,
    precio_mayorista: 2.90,
    stockTotal: 45,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-004',
    image: '/images/products/fanta-500ml.jpg',
    category: 'Gaseosas',
    status: 'Disponible'
  },
  {
    id: 5,
    name: 'Inca Kola Dorada',
    description: 'La bebida del sabor nacional. Gaseosa amarilla con sabor único peruano.',
    presentation: '650ml - Botella PET',
    precio_unitario: 3.50,
    precio_mayorista: 3.20,
    stockTotal: 120,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-005',
    image: '/images/products/inca-kola-650ml.jpg',
    category: 'Gaseosas',
    status: 'Disponible'
  },
  {
    id: 6,
    name: 'Guaraná Antarctica',
    description: 'Gaseosa brasileña con extracto natural de guaraná. Energizante y refrescante.',
    presentation: '350ml - Lata',
    precio_unitario: 2.20,
    precio_mayorista: 1.90,
    stockTotal: 78,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-006',
    image: '/images/products/guarana-350ml.jpg',
    category: 'Gaseosas',
    status: 'Disponible'
  },
  {
    id: 7,
    name: 'Seven Up Lima-Limón',
    description: 'Gaseosa cristalina con burbujas naturales y sabor cítrico intenso.',
    presentation: '500ml - Botella PET',
    precio_unitario: 2.60,
    precio_mayorista: 2.30,
    stockTotal: 95,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-007',
    image: '/images/products/seven-up-500ml.jpg',
    category: 'Gaseosas',
    status: 'Disponible'
  },
  {
    id: 8,
    name: 'Crush Naranja',
    description: 'Gaseosa con intenso sabor a naranja y pulpa natural de fruta.',
    presentation: '400ml - Botella Vidrio',
    precio_unitario: 2.90,
    precio_mayorista: 2.60,
    stockTotal: 12,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-008',
    image: '/images/products/crush-400ml.jpg',
    category: 'Gaseosas',
    status: 'Disponible'
  },
  {
    id: 9,
    name: 'Ginger Ale Schweppes',
    description: 'Bebida gaseosa premium con extracto natural de jengibre.',
    presentation: '250ml - Botella Vidrio',
    precio_unitario: 4.50,
    precio_mayorista: 4.00,
    stockTotal: 0,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-009',
    image: '/images/products/schweppes-250ml.jpg',
    category: 'Gaseosas',
    status: 'Agotado'
  },
  {
    id: 10,
    name: 'Kola Real',
    description: 'Gaseosa peruana de sabor cola, alternativa nacional de calidad.',
    presentation: '1.5L - Botella PET',
    precio_unitario: 4.80,
    precio_mayorista: 4.30,
    stockTotal: 67,
    stockPaquete: 0,
    stockUnid: 0,
    codProduct: 'PRD-010',
    image: '/images/products/kola-real-1.5l.jpg',
    category: 'Gaseosas',
    status: 'Disponible'
  }
];