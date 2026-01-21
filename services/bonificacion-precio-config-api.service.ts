import api from './api';

export interface Producto {
  idProducto: number;
  nombre: string;
  descripcion: string;
  presentacion: string;
  precioUnitario: number;
  precioMayorista: number;
  stock: number;
  created_at: string;
  updated_at: string;
  urlImage: string;
}

export interface ConfigPrecio {
  idConfigPrecio: number;
  idProducto: number;
  precio_base: string | number;
  precio_acordado: string | number;
  monto_bonificacion: string | number;
  paquetes_bonificacion: number;
  cantidad_minima_paquetes: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  producto: Producto;
}

export interface ConfigPrecioResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: ConfigPrecio[];
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

export interface CreateConfigPrecioRequest {
  idProducto: number;
  precio_base: number;
  precio_acordado: number;
  monto_bonificacion: number;
  paquetes_bonificacion: number;
  cantidad_minima_paquetes: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

class BonificacionPrecioConfigApiService {
  /**
   * Obtiene la lista de configuraciones de bonificación por precio con paginación
   */
  async listarConfiguraciones(page = 1, filters?: {
    activo?: boolean;
    idProducto?: number;
    per_page?: number;
  }): Promise<ConfigPrecioResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (filters?.per_page) {
        params.append('per_page', filters.per_page.toString());
      }
      if (filters?.activo !== undefined) {
        params.append('activo', filters.activo ? 'true' : 'false');
      }
      if (filters?.idProducto) {
        params.append('idProducto', filters.idProducto.toString());
      }

      const response = await api.get<ConfigPrecioResponse>(`/bonificacion-precio-config?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al listar configuraciones de precio:', error);
      throw error;
    }
  }

  /**
   * Obtiene una configuración específica por ID
   */
  async obtenerConfiguracion(id: number): Promise<{ success: boolean; data: ConfigPrecio }> {
    try {
      const response = await api.get(`/bonificacion-precio-config/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener configuración ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene configuraciones activas por producto
   */
  async obtenerActivasPorProducto(idProducto: number): Promise<{
    success: boolean;
    data: ConfigPrecio[];
  }> {
    try {
      const response = await api.get(`/bonificacion-precio-config/activas/${idProducto}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener configuraciones activas del producto ${idProducto}:`, error);
      throw error;
    }
  }

  /**
   * Crea una nueva configuración de bonificación por precio
   */
  async crearConfiguracion(data: CreateConfigPrecioRequest): Promise<{
    success: boolean;
    message: string;
    data: ConfigPrecio;
  }> {
    try {
      const response = await api.post('/bonificacion-precio-config', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear configuración:', error);
      throw error;
    }
  }

  /**
   * Actualiza una configuración existente
   */
  async actualizarConfiguracion(
    id: number,
    data: Partial<CreateConfigPrecioRequest>
  ): Promise<{ success: boolean; message: string; data: ConfigPrecio }> {
    try {
      const response = await api.put(`/bonificacion-precio-config/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar configuración ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una configuración
   */
  async eliminarConfiguracion(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/bonificacion-precio-config/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar configuración ${id}:`, error);
      throw error;
    }
  }

  /**
   * Restaura una configuración eliminada
   */
  async restaurarConfiguracion(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/bonificacion-precio-config/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error(`Error al restaurar configuración ${id}:`, error);
      throw error;
    }
  }
}

export default new BonificacionPrecioConfigApiService();
