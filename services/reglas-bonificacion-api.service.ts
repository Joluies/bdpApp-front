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

export interface ReglaBonificacion {
  idRegla: number;
  idProducto: number;
  tipo_regla: 'cantidad_escalonada' | 'precio_escalonada' | 'cantidad_simple';
  valor_minimo: number;
  valor_maximo: number;
  bonificacion: number;
  unidad: 'unidades' | 'soles' | 'porcentaje';
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  producto: Producto;
}

export interface ReglasBonificacionResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: ReglaBonificacion[];
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

export interface CreateReglaBonificacionRequest {
  idProducto: number;
  tipo_regla: 'cantidad_escalonada' | 'precio_escalonada' | 'cantidad_simple';
  valor_minimo: number;
  valor_maximo: number;
  bonificacion: number;
  unidad: 'unidades' | 'soles' | 'porcentaje';
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;
}

export interface ResumenProducto {
  idProducto: number;
  nombre_producto: string;
  total_reglas: number;
  tipos_reglas: string[];
  bonificacion_maxima: number;
}

class ReglasBonificacionApiService {
  /**
   * Obtiene la lista de reglas de bonificación con paginación
   */
  async listarReglas(page = 1, filters?: {
    idProducto?: number;
    tipo_regla?: string;
    activo?: boolean;
    per_page?: number;
  }): Promise<ReglasBonificacionResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (filters?.per_page) {
        params.append('per_page', filters.per_page.toString());
      }
      if (filters?.idProducto) {
        params.append('idProducto', filters.idProducto.toString());
      }
      if (filters?.tipo_regla) {
        params.append('tipo_regla', filters.tipo_regla);
      }
      if (filters?.activo !== undefined) {
        params.append('activo', filters.activo ? 'true' : 'false');
      }

      const response = await api.get<ReglasBonificacionResponse>(`/reglas-bonificacion?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error al listar reglas de bonificación:', error);
      throw error;
    }
  }

  /**
   * Obtiene una regla específica por ID
   */
  async obtenerRegla(id: number): Promise<{ success: boolean; data: ReglaBonificacion }> {
    try {
      const response = await api.get(`/reglas-bonificacion/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener regla ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene la tabla escalonada de un producto
   */
  async obtenerTablaProducto(idProducto: number): Promise<{
    success: boolean;
    data: ReglaBonificacion[];
  }> {
    try {
      const response = await api.get(`/reglas-bonificacion/tabla-escalonada/${idProducto}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener tabla del producto ${idProducto}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene resumen de reglas por producto
   */
  async obtenerResumenPorProducto(): Promise<{
    success: boolean;
    data: ResumenProducto[];
  }> {
    try {
      const response = await api.get('/reglas-bonificacion/resumen/productos');
      return response.data;
    } catch (error) {
      console.error('Error al obtener resumen por producto:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva regla de bonificación
   */
  async crearRegla(data: CreateReglaBonificacionRequest): Promise<{
    success: boolean;
    message: string;
    data: ReglaBonificacion;
  }> {
    try {
      const response = await api.post('/reglas-bonificacion', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear regla:', error);
      throw error;
    }
  }

  /**
   * Actualiza una regla existente
   */
  async actualizarRegla(
    id: number,
    data: Partial<CreateReglaBonificacionRequest>
  ): Promise<{ success: boolean; message: string; data: ReglaBonificacion }> {
    try {
      const response = await api.put(`/reglas-bonificacion/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar regla ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una regla
   */
  async eliminarRegla(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/reglas-bonificacion/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar regla ${id}:`, error);
      throw error;
    }
  }

  /**
   * Restaura una regla eliminada
   */
  async restaurarRegla(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/reglas-bonificacion/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error(`Error al restaurar regla ${id}:`, error);
      throw error;
    }
  }
}

export default new ReglasBonificacionApiService();
