import api from './api';

export interface Bonificacion {
  idBonificacion: number;
  nombre: string;
  descripcion: string;
  tipo_bonificacion: 'cantidad' | 'producto' | 'precio' | 'periodo';
  productoRequerido: { idProducto: number; nombre: string; precio: number };
  productoBonificacion: { idProducto: number; nombre: string; precio: number };
  cantidad_minima: number | null;
  precio_minimo: number | null;
  cantidad_bonificacion: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface BonificacionResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: Bonificacion[];
    first_page_url: string;
    from: number | null;
    last_page: number;
    last_page_url: string;
    links: Array<{
      url: string | null;
      label: string;
      page: number | null;
      active: boolean;
    }>;
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number | null;
    total: number;
  };
}

export interface CreateBonificacionRequest {
  nombre: string;
  descripcion: string;
  tipo_bonificacion: 'cantidad' | 'producto' | 'precio' | 'periodo';
  idProducto_requerido: number;
  idProducto_bonificacion: number;
  cantidad_minima?: number | null;
  precio_minimo?: number | null;
  cantidad_bonificacion: number;
  unidad_bonificacion?: 'botella' | 'paquete';
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

class BonificacionesApiService {
  /**
   * Obtiene la lista de bonificaciones con paginación
   */
  async listarBonificaciones(page = 1, filters?: {
    activo?: boolean;
    tipo?: string;
    per_page?: number;
  }): Promise<BonificacionResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (filters?.per_page) {
        params.append('per_page', filters.per_page.toString());
      }
      if (filters?.activo !== undefined) {
        params.append('activo', filters.activo ? 'true' : 'false');
      }
      if (filters?.tipo) {
        params.append('tipo', filters.tipo);
      }

      const response = await api.get<BonificacionResponse>(`/bonificaciones?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al listar bonificaciones:', error);
      throw error;
    }
  }

  /**
   * Obtiene una bonificación específica por ID
   */
  async obtenerBonificacion(id: number): Promise<{ success: boolean; data: Bonificacion }> {
    try {
      const response = await api.get(`/bonificaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener bonificación ${id}:`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva bonificación
   */
  async crearBonificacion(data: CreateBonificacionRequest): Promise<{
    success: boolean;
    message: string;
    data: Bonificacion;
  }> {
    try {
      const response = await api.post('/bonificaciones', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear bonificación:', error);
      throw error;
    }
  }

  /**
   * Actualiza una bonificación existente
   */
  async actualizarBonificacion(
    id: number,
    data: Partial<CreateBonificacionRequest>
  ): Promise<{ success: boolean; message: string; data: Bonificacion }> {
    try {
      const response = await api.put(`/bonificaciones/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar bonificación ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una bonificación
   */
  async eliminarBonificacion(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/bonificaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar bonificación ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene la lista de productos disponibles
   */
  async listarProductos(): Promise<{
    success: boolean;
    data: Array<{ idProducto: number; nombre: string; precio: number }>;
  }> {
    try {
      console.log('🔍 Llamando a /products');
      const response = await api.get('/products');
      console.log('📦 Respuesta completa de /products:', response);
      console.log('📦 response.data:', response.data);
      
      // Mapear la respuesta a formato esperado
      if (response.data.products && Array.isArray(response.data.products)) {
        console.log('✅ Encontrados productos en response.data.products');
        const mapped = response.data.products.map((p: any) => ({
          idProducto: p.idProducto,
          nombre: p.nombre,
          precio: p.precioUnitario || 0
        }));
        console.log('✅ Productos mapeados:', mapped);
        return {
          success: true,
          data: mapped
        };
      } else if (Array.isArray(response.data)) {
        console.log('✅ response.data es un array directamente');
        const mapped = response.data.map((p: any) => ({
          idProducto: p.idProducto,
          nombre: p.nombre,
          precio: p.precioUnitario || 0
        }));
        console.log('✅ Productos mapeados:', mapped);
        return {
          success: true,
          data: mapped
        };
      }
      
      console.warn('⚠️ Estructura de respuesta no reconocida:', response.data);
      return {
        success: false,
        data: []
      };
    } catch (error) {
      console.error('❌ Error al listar productos:', error);
      console.error('❌ Detalles del error:', {
        message: error instanceof Error ? error.message : String(error),
        response: error instanceof Error && 'response' in error ? (error as any).response : 'N/A'
      });
      throw error;
    }
  }

  /**
   * Obtiene la lista de productos para selector (alias)
   */
  async obtenerProductos(): Promise<{
    success: boolean;
    data: Array<{ idProducto: number; nombre: string; precio: number }>;
  }> {
    return this.listarProductos();
  }
}

export default new BonificacionesApiService();
