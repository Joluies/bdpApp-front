import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? process.env.NEXT_PUBLIC_API_URL
  : 'https://api.bebidasdelperuapp.com';

// Interfaces
export interface StockItem {
  idProducto: number;
  nombre: string;
  precioUnitario: number;
  stock: number;
  urlImage?: string | null;
  estado?: 'NORMAL' | 'STOCK_BAJO' | 'AGOTADO';
  created_at?: string;
  updated_at?: string;
}

export interface AddStockRequest {
  idProducto: number;
  cantidad: number;
}

export interface AddStockResponse {
  success: boolean;
  message: string;
  data?: {
    idProducto: number;
    nuevoStock: number;
  };
}

export interface DailyStockReport {
  fecha: string;
  productos: StockItem[];
  totalMovimientos: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

class InventarioApiService {
  private client: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.client = axios.create({
      baseURL: this.baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para agregar token de autenticación
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para manejar errores de respuesta
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('Error en petición:', error);
        if (error.response) {
          console.error('Status:', error.response.status);
          console.error('Data:', error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Obtiene el stock actual de todos los productos (polling)
   */
  async getStockActual(): Promise<StockItem[]> {
    try {
      console.log('🔍 Llamando a /api/inventory/current...');
      
      const response = await this.client.get<{
        success: boolean;
        data: Array<{
          idProducto: number;
          nombre: string;
          precioUnitario: number;
          current_stock: number;
          stockTotal?: number;
          urlImage?: string;
          created_at?: string;
          updated_at?: string;
        }>;
      }>('/api/inventory/current');

      console.log('✅ Respuesta recibida:', response.data);

      if (!response.data || !response.data.data) {
        console.warn('⚠️ No hay datos en la respuesta');
        return [];
      }

      // Mapeamos los datos al formato StockItem
      const stockItems: StockItem[] = response.data.data.map((product) => ({
        idProducto: product.idProducto,
        nombre: product.nombre,
        precioUnitario: product.precioUnitario,
        stock: product.current_stock || 0,
        urlImage: product.urlImage,
        created_at: product.created_at,
        updated_at: product.updated_at,
        estado: product.current_stock === 0 
          ? 'AGOTADO' 
          : product.current_stock < 10 
          ? 'STOCK_BAJO' 
          : 'NORMAL',
      }));

      console.log(`✅ ${stockItems.length} productos mapeados`);
      return stockItems;
    } catch (error: any) {
      console.error('❌ Error al obtener stock:', error);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      throw error;
    }
  }

  /**
   * Obtiene el estado de un producto específico
   */
  async getProductoStock(idProducto: number): Promise<StockItem> {
    try {
      const response = await this.client.get<ApiResponse<StockItem>>(
        `/api/inventory/stock/${idProducto}`
      );
      return response.data.data || ({} as StockItem);
    } catch (error) {
      console.error(`Error al obtener stock del producto ${idProducto}:`, error);
      throw error;
    }
  }

  /**
   * Añade stock a un producto
   */
  async addStock(request: AddStockRequest): Promise<AddStockResponse> {
    try {
      console.log('Enviando petición addStock:', {
        product_id: request.idProducto,
        quantity: request.cantidad,
      });

      const response = await this.client.post<AddStockResponse>(
        '/api/inventory/add',
        {
          product_id: request.idProducto,
          quantity: request.cantidad,
        }
      );

      console.log('Respuesta addStock:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error al añadir stock:', error);
      
      // Manejo detallado de errores
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.statusText;
        throw new Error(`Error ${error.response.status}: ${errorMessage}`);
      } else if (error.request) {
        throw new Error('No se recibió respuesta del servidor');
      } else {
        throw new Error(error.message || 'Error desconocido');
      }
    }
  }

  /**
   * Descarga el reporte diario de stock en Excel/CSV
   */
  async downloadDailyReport(): Promise<Blob> {
    try {
      console.log('📊 Descargando reporte diario...');
      
      const response = await this.client.get('/api/reports/daily-stock', {
        responseType: 'blob',
        headers: {
          'Accept': 'text/csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        },
      });
      
      console.log('✅ Reporte descargado, tamaño:', response.data.size, 'bytes');
      
      if (response.data.size === 0) {
        throw new Error('El archivo descargado está vacío');
      }
      
      return response.data as Blob;
    } catch (error: any) {
      console.error('❌ Error al descargar reporte:', error);
      
      if (error.response) {
        console.error('Status:', error.response.status);
        console.error('Headers:', error.response.headers);
      }
      
      throw error;
    }
  }

  /**
   * Obtiene productos con stock bajo (< threshold)
   */
  async getStockBajo(threshold: number = 10): Promise<StockItem[]> {
    try {
      const response = await this.client.get<{
        success: boolean;
        data: Array<{
          idProducto: number;
          nombre: string;
          precioUnitario: number;
          current_stock: number;
          urlImage?: string;
        }>;
      }>(`/api/inventory/stock-bajo?threshold=${threshold}`);
      
      if (!response.data || !response.data.data) {
        return [];
      }

      // Mapeamos los datos al formato StockItem
      return response.data.data.map((product) => ({
        idProducto: product.idProducto,
        nombre: product.nombre,
        precioUnitario: product.precioUnitario,
        stock: product.current_stock || 0,
        urlImage: product.urlImage,
        estado: 'STOCK_BAJO' as const,
      }));
    } catch (error) {
      console.error('Error al obtener stock bajo:', error);
      return [];
    }
  }

  /**
   * Obtiene el historial de movimientos de stock
   */
  async getHistorialMovimientos(
    idProducto?: number,
    limit: number = 50
  ): Promise<any[]> {
    try {
      const params = new URLSearchParams({ limit: limit.toString() });
      const endpoint = idProducto
        ? `/api/inventory/movements/${idProducto}?${params}`
        : `/api/inventory/movements?${params}`;
      
      const response = await this.client.get<ApiResponse<any[]>>(endpoint);
      return response.data.data || [];
    } catch (error) {
      console.error('Error al obtener historial:', error);
      return [];
    }
  }

  /**
   * Actualiza la configuración de alertas de stock
   */
  async updateStockAlertConfig(threshold: number): Promise<boolean> {
    try {
      const response = await this.client.put(
        '/api/inventory/config',
        { alertThreshold: threshold }
      );
      return response.status === 200;
    } catch (error) {
      console.error('Error al actualizar configuración:', error);
      throw error;
    }
  }

  /**
   * Obtiene estadísticas del inventario
   */
  async getEstadisticas(): Promise<{
    totalProductos: number;
    productosStockBajo: number;
    productosAgotados: number;
    valorTotalInventario: number;
  }> {
    try {
      const response = await this.client.get<
        ApiResponse<{
          totalProductos: number;
          productosStockBajo: number;
          productosAgotados: number;
          valorTotalInventario: number;
        }>
      >('/api/inventory/estadisticas');
      return response.data.data || {
        totalProductos: 0,
        productosStockBajo: 0,
        productosAgotados: 0,
        valorTotalInventario: 0,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      throw error;
    }
  }
}

export const inventarioApiService = new InventarioApiService();
