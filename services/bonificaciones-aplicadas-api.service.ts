import api from './api';

export interface BonificacionAplicada {
  idBonificacionAplicada: number;
  idPedido: number;
  idBonificacion: number;
  idBonificacionPrecio?: number;
  cantidad_bonificada: number;
  monto_bonificado: number;
  tipo_bonificacion: 'cantidad' | 'producto' | 'precio' | 'periodo';
  fecha_aplicacion: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface BonificacionesAplicadasResponse {
  success: boolean;
  message: string;
  data: {
    current_page: number;
    data: BonificacionAplicada[];
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

export interface CreateBonificacionAplicadaRequest {
  idPedido: number;
  idBonificacion: number;
  idBonificacionPrecio?: number;
  cantidad_bonificada: number;
  monto_bonificado: number;
  tipo_bonificacion: 'cantidad' | 'producto' | 'precio' | 'periodo';
  fecha_aplicacion: string;
  activo: boolean;
}

export interface ResumenVendedor {
  idVendedor: number;
  nombre_vendedor: string;
  total_bonificaciones_aplicadas: number;
  monto_total_bonificado: number;
  cantidad_total_bonificada: number;
}

class BonificacionesAplicadasApiService {
  /**
   * Obtiene la lista de bonificaciones aplicadas con paginación
   */
  async listarBonificacionesAplicadas(page = 1, filters?: {
    idPedido?: number;
    idVendedor?: number;
    activo?: boolean;
    per_page?: number;
  }): Promise<BonificacionesAplicadasResponse> {
    try {
      const params = new URLSearchParams();
      params.append('page', page.toString());
      if (filters?.per_page) {
        params.append('per_page', filters.per_page.toString());
      }
      if (filters?.idPedido) {
        params.append('idPedido', filters.idPedido.toString());
      }
      if (filters?.idVendedor) {
        params.append('idVendedor', filters.idVendedor.toString());
      }
      if (filters?.activo !== undefined) {
        params.append('activo', filters.activo ? 'true' : 'false');
      }

      const response = await api.get<BonificacionesAplicadasResponse>(
        `/bonificaciones-aplicadas?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error('Error al listar bonificaciones aplicadas:', error);
      throw error;
    }
  }

  /**
   * Obtiene una bonificación aplicada específica por ID
   */
  async obtenerBonificacionAplicada(id: number): Promise<{
    success: boolean;
    data: BonificacionAplicada;
  }> {
    try {
      const response = await api.get(`/bonificaciones-aplicadas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener bonificación aplicada ${id}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene bonificaciones aplicadas por pedido
   */
  async obtenerPorPedido(idPedido: number): Promise<{
    success: boolean;
    data: BonificacionAplicada[];
  }> {
    try {
      const response = await api.get(`/bonificaciones-aplicadas/pedido/${idPedido}`);
      return response.data;
    } catch (error) {
      console.error(`Error al obtener bonificaciones del pedido ${idPedido}:`, error);
      throw error;
    }
  }

  /**
   * Obtiene resumen de bonificaciones por vendedor
   */
  async obtenerResumenPorVendedor(): Promise<{
    success: boolean;
    data: ResumenVendedor[];
  }> {
    try {
      const response = await api.get('/bonificaciones-aplicadas/resumen/vendedor');
      return response.data;
    } catch (error) {
      console.error('Error al obtener resumen por vendedor:', error);
      throw error;
    }
  }

  /**
   * Crea una nueva bonificación aplicada
   */
  async crearBonificacionAplicada(data: CreateBonificacionAplicadaRequest): Promise<{
    success: boolean;
    message: string;
    data: BonificacionAplicada;
  }> {
    try {
      const response = await api.post('/bonificaciones-aplicadas', data);
      return response.data;
    } catch (error) {
      console.error('Error al crear bonificación aplicada:', error);
      throw error;
    }
  }

  /**
   * Actualiza una bonificación aplicada existente
   */
  async actualizarBonificacionAplicada(
    id: number,
    data: Partial<CreateBonificacionAplicadaRequest>
  ): Promise<{ success: boolean; message: string; data: BonificacionAplicada }> {
    try {
      const response = await api.put(`/bonificaciones-aplicadas/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error al actualizar bonificación aplicada ${id}:`, error);
      throw error;
    }
  }

  /**
   * Elimina una bonificación aplicada
   */
  async eliminarBonificacionAplicada(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.delete(`/bonificaciones-aplicadas/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error al eliminar bonificación aplicada ${id}:`, error);
      throw error;
    }
  }

  /**
   * Restaura una bonificación aplicada eliminada
   */
  async restaurarBonificacionAplicada(id: number): Promise<{ success: boolean; message: string }> {
    try {
      const response = await api.post(`/bonificaciones-aplicadas/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error(`Error al restaurar bonificación aplicada ${id}:`, error);
      throw error;
    }
  }
}

export default new BonificacionesAplicadasApiService();
