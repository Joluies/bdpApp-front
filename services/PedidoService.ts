// Usar la URL base disponible desde variables de entorno o fallback
const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.bebidasdelperuapp.com/api';

// Helper para obtener headers con autenticación
const getHeaders = () => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  
  // Obtener token del localStorage
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

export interface DetallePedido {
  id?: number;
  idProducto: number;
  cantidad: number;
  precio_unitario: number;
  subtotal?: number;
}

export interface Pedido {
  id?: number;
  idCliente: number;
  idVendedor: number;
  numero_pedido: string;
  fecha_pedido?: string;
  fecha_entrega: string;
  estado: 'pendiente' | 'confirmado' | 'enviado' | 'entregado' | 'cancelado';
  monto_total?: number;
  observaciones?: string;
  detalles?: DetallePedido[];
  cliente?: any;
  vendedor?: any;
}

class PedidoService {
  /**
   * Obtener todos los pedidos
   */
  static async obtenerPedidos(params?: {
    estado?: string;
    vendedor_id?: number;
    cliente_id?: number;
    search?: string;
    per_page?: number;
    page?: number;
  }) {
    try {
      const queryString = new URLSearchParams(
        Object.entries(params || {}).reduce((acc: any, [key, value]) => {
          if (value !== undefined) acc[key] = String(value);
          return acc;
        }, {})
      ).toString();

      const url = `${apiUrl}/pedidos${queryString ? '?' + queryString : ''}`;
      console.log('Fetching pedidos from:', url);
      
      const response = await fetch(url, {
        headers: getHeaders()
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Respuesta del API:', data);
      
      // Manejar la estructura de respuesta con success/message/data/meta
      if (data.success !== undefined && data.data !== undefined) {
        // Nueva estructura: { success, message, data, meta }
        const responseStructured = {
          data: Array.isArray(data.data) ? data.data : [],
          meta: data.meta || { current_page: 1, last_page: 1, total: 0, per_page: 10 }
        };
        console.log('Pedidos procesados correctamente:', responseStructured);
        return responseStructured;
      }
      
      // Estructura alternativa: { data, meta } sin success
      if (Array.isArray(data.data) && data.meta) {
        console.log('Pedidos loaded successfully:', data);
        return data;
      }
      
      throw new Error('Estructura de respuesta inválida: esperado { data, meta } o { success, data, meta }');
    } catch (error: any) {
      console.error('Error en obtenerPedidos:', error);
      throw error;
    }
  }

  /**
   * Crear un nuevo pedido
   */
  static async crearPedido(data: Partial<Pedido>) {
    const response = await fetch(`${apiUrl}/pedidos`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear pedido');
    }
    return response.json();
  }

  /**
   * Obtener un pedido específico
   */
  static async obtenerPedido(id: number) {
    const response = await fetch(`${apiUrl}/pedidos/${id}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener pedido');
    return response.json();
  }

  /**
   * Actualizar un pedido
   */
  static async actualizarPedido(id: number, data: Partial<Pedido>) {
    const response = await fetch(`${apiUrl}/pedidos/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar pedido');
    return response.json();
  }

  /**
   * Cambiar estado de un pedido
   */
  static async cambiarEstado(id: number, estado: string) {
    const response = await fetch(`${apiUrl}/pedidos/${id}/estado`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ estado })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
    }
    
    return data;
  }

  /**
   * Eliminar un pedido
   */
  static async eliminarPedido(id: number) {
    const response = await fetch(`${apiUrl}/pedidos/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    if (!response.ok) throw new Error('Error al eliminar pedido');
    return response.json();
  }

  /**
   * Obtener pedidos por vendedor
   */
  static async obtenerPedidosPorVendedor(vendedorId: number) {
    const response = await fetch(`${apiUrl}/pedidos/vendedor/${vendedorId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener pedidos del vendedor');
    return response.json();
  }

  /**
   * Obtener pedidos por cliente
   */
  static async obtenerPedidosPorCliente(clienteId: number) {
    const response = await fetch(`${apiUrl}/pedidos/cliente/${clienteId}`, {
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Error al obtener pedidos del cliente');
    return response.json();
  }
}

export default PedidoService;
