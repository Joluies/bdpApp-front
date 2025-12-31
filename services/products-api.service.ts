// Servicio para la API real de productos de Bebidas del Perú
import { API_CONFIG } from '../config/api.config';

const API_BASE_URL = API_CONFIG.BASE_URL;

export interface ApiProduct {
  idProducto: number;
  nombre: string;
  descripcion: string;
  presentacion: string;
  precioUnitario: number;
  precioMayorista: number;
  stock: number;
  created_at: string;
  updated_at: string;
  urlImage: string | null;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: string;
}

export interface CreateProductData {
  nombre: string;
  descripcion: string;
  presentacion: string;
  precioUnitario: number;
  precioMayorista: number;
  stock: number;
  urlImage?: string;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

class ProductsApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      console.log('🌐 Haciendo petición a:', url);
      console.log('⚙️ Configuración de petición:', config);
      
      const response = await fetch(url, config);
      
      console.log('📡 Respuesta del servidor:', {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Intentar leer el JSON sin importar el status code
      let data;
      try {
        data = await response.json();
        console.log('✅ JSON parseado exitosamente:', data);
      } catch (jsonError) {
        console.error('❌ No se pudo parsear JSON:', jsonError);
        // Si no es JSON, intentar como texto
        try {
          const text = await response.text();
          console.log('📄 Respuesta como texto:', text);
          if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText} - ${text}`);
          }
          return {} as T; // Retornar objeto vacío si no hay JSON
        } catch (e) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
      }
      
      // Si el status NO es ok pero tenemos datos JSON, aún retornar los datos
      if (!response.ok) {
        console.warn(`⚠️ Status ${response.status} pero datos disponibles:`, data);
        // Retornar los datos de todos modos si el JSON es válido
        return data;
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        console.error('💥 Error CORS o conexión de red. Detalles:', {
          url,
          message: error.message,
          sugerencia: 'La API puede no tener CORS habilitado o no estar disponible'
        });
      } else {
        console.error('💥 Error en petición API:', error);
      }
      throw error;
    }
  }

  // Obtener todos los productos
  async getProducts(): Promise<ApiProduct[]> {
    try {
      console.log('🔍 Intentando conectar a la API:', `${API_BASE_URL}/products`);
      
      const response = await this.request<any>('/products');
      
      console.log('📦 Respuesta de la API recibida:', response);
      
      // Manejar diferentes formatos de respuesta
      if (Array.isArray(response)) {
        console.log('✅ Datos recibidos como array:', response.length, 'productos');
        return response;
      } else if (response && typeof response === 'object') {
        // Formato específico de la API: { message: "...", products: [...] }
        if ('products' in response) {
          if (Array.isArray(response.products)) {
            console.log('✅ Datos recibidos en formato {products: [...]}:', response.products.length, 'productos');
            return response.products as ApiProduct[];
          } else if (response.products === null || response.products === undefined) {
            console.log('✅ API respondió con products null/undefined - array vacío');
            return [];
          }
        }
        // Formato genérico: { data: [...] }
        else if ('data' in response) {
          if (Array.isArray(response.data)) {
            console.log('✅ Datos recibidos en formato {data: [...]}:', response.data.length, 'productos');
            return response.data as ApiProduct[];
          } else if (response.data === null || response.data === undefined) {
            console.log('✅ API respondió con data null/undefined - array vacío');
            return [];
          }
        }
      }
      
      console.log('⚠️ Formato de respuesta no reconocido, pero conexión exitosa:', typeof response, response);
      console.log('🔄 Retornando array vacío para mantener conexión API activa');
      return [];
    } catch (error) {
      console.error('❌ Error conectando a la API:', error);
      throw error;
    }
  }

  // Obtener un producto por ID
  async getProduct(id: number): Promise<ApiProduct | null> {
    try {
      const response = await this.request<ApiProduct | ApiResponse<ApiProduct>>(`/products/${id}`);
      
      if ('data' in response) {
        return response.data as ApiProduct;
      }
      
      return response as ApiProduct;
    } catch (error) {
      console.error('Error obteniendo producto:', error);
      return null;
    }
  }

  // Crear un nuevo producto
  async createProduct(productData: CreateProductData): Promise<ApiProduct | null> {
    try {
      console.log('📝 Datos a enviar para crear producto:', productData);
      
      const response = await this.request<any>('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });

      console.log('📦 Respuesta completa del servidor al crear producto:', response);
      console.log('📦 Tipo de respuesta:', typeof response);

      // Si la respuesta es null o undefined, es un error
      if (!response) {
        console.error('❌ API retornó respuesta vacía');
        throw new Error('La API no retornó datos válidos');
      }

      // Manejar diferentes formatos de respuesta
      if (typeof response === 'object') {
        // Formato: { data: {...} }
        if ('data' in response && response.data) {
          console.log('✅ Producto creado exitosamente (formato data):', response.data);
          return response.data as ApiProduct;
        } 
        // Formato: { product: {...} }
        else if ('product' in response && response.product) {
          console.log('✅ Producto creado exitosamente (formato product):', response.product);
          return response.product as ApiProduct;
        } 
        // Formato directo: { idProducto, nombre, ... }
        else if ('idProducto' in response) {
          console.log('✅ Producto creado exitosamente (formato directo):', response);
          return response as ApiProduct;
        }
        // Formato: { id, idProducto, ... } - variaciones
        else if ('id' in response || 'nombre' in response) {
          console.log('✅ Producto creado exitosamente (formato alternativo):', response);
          return response as ApiProduct;
        }
        // Si tiene message de éxito pero sin datos
        else if ('message' in response) {
          console.log('⚠️ API respondió con mensaje:', response.message);
          // Retornar la respuesta como está si tiene al menos un message
          return response as any;
        }
      }
      
      console.warn('⚠️ Formato de respuesta no reconocido al crear:', response);
      // Retornar la respuesta como está si llegó a este punto sin errores
      return response as any;
    } catch (error) {
      console.error('❌ Error creando producto:', error);
      throw error;
    }
  }

  // Actualizar un producto
  async updateProduct(id: number, productData: UpdateProductData): Promise<ApiProduct | null> {
    try {
      const response = await this.request<ApiProduct | ApiResponse<ApiProduct>>(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });

      if ('data' in response) {
        return response.data as ApiProduct;
      }
      
      return response as ApiProduct;
    } catch (error) {
      console.error('Error actualizando producto:', error);
      throw error;
    }
  }

  // Actualizar un producto con imagen (FormData)
  async updateProductWithImage(id: number, productData: any, imageFile?: File | null): Promise<ApiProduct | null> {
    try {
      console.log('📝 Actualizando producto con imagen:', { id, productData, hasImage: !!imageFile });
      
      // Crear FormData para enviar el archivo correctamente
      const formData = new FormData();
      
      // Agregar _method=PUT para que Laravel interprete POST como PUT
      formData.append('_method', 'PUT');
      
      // Agregar campos - Usar valores por defecto si están vacíos
      console.log('🔧 Campos a enviar en FormData:');
      const fieldsToAdd = {
        nombre: productData.nombre || '',
        descripcion: productData.descripcion || '',
        presentacion: productData.presentacion || '',
        precioUnitario: String(productData.precioUnitario || '0'),
        precioMayorista: String(productData.precioMayorista || '0'),
        stock: String(productData.stock || '0')
      };
      
      // Log de cada campo
      Object.entries(fieldsToAdd).forEach(([key, value]) => {
        console.log(`  - ${key}: "${value}"`);
        formData.append(key, value);
      });
      
      // Agregar archivo si existe
      if (imageFile) {
        console.log('📸 Archivo de imagen agregado:', imageFile.name);
        console.log('  - Tipo MIME:', imageFile.type);
        console.log('  - Tamaño:', (imageFile.size / 1024).toFixed(2), 'KB');
        formData.append('urlImage', imageFile);
      }

      // Hacer la petición con POST (Laravel lo interpreta como PUT gracias a _method)
      const apiUrl = `${API_BASE_URL}/products/${id}`;
      console.log('🔗 URL completa de actualización:', apiUrl);
      console.log('🔗 Método HTTP: POST (con _method=PUT)');
      
      // ⚠️ IMPORTANTE: NO establecer Content-Type manualmente con FormData
      // El navegador lo hará automáticamente
      const response = await fetch(apiUrl, {
        method: 'POST',
        mode: 'cors',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // NO incluir Content-Type - FormData lo maneja automáticamente
        }
      });

      console.log('📊 Status de respuesta:', response.status);
      console.log('📊 Headers de respuesta:', {
        'content-type': response.headers.get('content-type'),
        'content-length': response.headers.get('content-length')
      });
      
      // Obtener el texto de respuesta
      const responseText = await response.text();
      console.log('📝 Respuesta del servidor (raw):', responseText);

      // Verificar si es JSON válido
      let result;
      try {
        result = JSON.parse(responseText);
      } catch (e) {
        console.error('❌ La respuesta no es JSON válido:', responseText.substring(0, 200));
        throw new Error(`Error del servidor (${response.status}): La respuesta no es JSON válido.`);
      }

      console.log('🔍 Resultado de actualización:', result);

      // Verificar si la respuesta indica error
      if (!response.ok) {
        console.error('❌ Error en la respuesta:', result);
        throw new Error(result?.message || `Error del servidor (${response.status})`);
      }

      // Manejar diferentes formatos de respuesta
      if (typeof result === 'object') {
        // Formato: { product: {...} }
        if ('product' in result && result.product) {
          console.log('✅ Producto actualizado (formato product):', result.product);
          return result.product as ApiProduct;
        }
        // Formato directo: { idProducto, nombre, ... }
        else if ('idProducto' in result) {
          console.log('✅ Producto actualizado (formato directo):', result);
          return result as ApiProduct;
        }
        // Formato: { data: {...} }
        else if ('data' in result && result.data) {
          console.log('✅ Producto actualizado (formato data):', result.data);
          return result.data as ApiProduct;
        }
      }

      console.warn('⚠️ Formato de respuesta no reconocido pero actualización exitosa:', result);
      return result as any;
    } catch (error) {
      console.error('❌ Error actualizando producto con imagen:', error);
      throw error;
    }
  }

  // Eliminar un producto
  async deleteProduct(id: number): Promise<boolean> {
    try {
      await this.request(`/products/${id}`, {
        method: 'DELETE',
      });
      
      return true;
    } catch (error) {
      console.error('Error eliminando producto:', error);
      return false;
    }
  }

  // Subir imagen de producto (si la API lo soporta)
  async uploadProductImage(file: File): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch(`${API_BASE_URL}/products/upload-image`, {
        method: 'POST',
        body: formData,
        // No incluir Content-Type para FormData
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      // Devolver la URL de la imagen subida
      return data.url || data.urlImage || null;
    } catch (error) {
      console.error('Error subiendo imagen:', error);
      return null;
    }
  }

  // Función para convertir ApiProduct a formato local compatible
  mapToLocal(apiProduct: ApiProduct) {
    return {
      id: apiProduct.idProducto,
      name: apiProduct.nombre,
      description: apiProduct.descripcion,
      presentation: apiProduct.presentacion,
      precio_unitario: apiProduct.precioUnitario,
      precio_mayorista: apiProduct.precioMayorista,
      stock: apiProduct.stock,
      image: apiProduct.urlImage || '/images/products/default.jpg',
      category: 'Gaseosas', // Valor por defecto, se puede determinar desde el nombre
      status: apiProduct.stock > 0 ? 'Disponible' as const : 'Agotado' as const,
      created_at: apiProduct.created_at,
      updated_at: apiProduct.updated_at
    };
  }

  // Función para convertir datos locales a formato de API
  mapToApi(localData: any): CreateProductData {
    return {
      nombre: localData.name || localData.nombre,
      descripcion: localData.description || localData.descripcion,
      presentacion: localData.presentation || localData.presentacion,
      precioUnitario: localData.precio_unitario || localData.precioUnitario,
      precioMayorista: localData.precio_mayorista || localData.precioMayorista,
      stock: localData.stock,
      urlImage: localData.image || localData.urlImage
    };
  }
}

export const productsApiService = new ProductsApiService();