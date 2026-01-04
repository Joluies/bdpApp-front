import { API_CONFIG } from '@/config/api.config';

const apiUrl = API_CONFIG.BASE_URL || 'https://api.bebidasdelperuapp.com/api';

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
    const queryString = new URLSearchParams(
      Object.entries(params || {}).reduce((acc: any, [key, value]) => {
        if (value !== undefined) acc[key] = String(value);
        return acc;
      }, {})
    ).toString();

    const response = await fetch(`${apiUrl}/pedidos${queryString ? '?' + queryString : ''}`);
    if (!response.ok) throw new Error('Error al obtener pedidos');
    return response.json();
  }

  /**
   * Crear un nuevo pedido
   */
  static async crearPedido(data: Partial<Pedido>) {
    const response = await fetch(`${apiUrl}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
    const response = await fetch(`${apiUrl}/pedidos/${id}`);
    if (!response.ok) throw new Error('Error al obtener pedido');
    return response.json();
  }

  /**
   * Actualizar un pedido
   */
  static async actualizarPedido(id: number, data: Partial<Pedido>) {
    const response = await fetch(`${apiUrl}/pedidos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
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
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado })
    });
    if (!response.ok) throw new Error('Error al cambiar estado del pedido');
    return response.json();
  }

  /**
   * Eliminar un pedido
   */
  static async eliminarPedido(id: number) {
    const response = await fetch(`${apiUrl}/pedidos/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar pedido');
    return response.json();
  }

  /**
   * Obtener pedidos por vendedor
   */
  static async obtenerPedidosPorVendedor(vendedorId: number) {
    const response = await fetch(`${apiUrl}/pedidos/vendedor/${vendedorId}`);
    if (!response.ok) throw new Error('Error al obtener pedidos del vendedor');
    return response.json();
  }

  /**
   * Obtener pedidos por cliente
   */
  static async obtenerPedidosPorCliente(clienteId: number) {
    const response = await fetch(`${apiUrl}/pedidos/cliente/${clienteId}`);
    if (!response.ok) throw new Error('Error al obtener pedidos del cliente');
    return response.json();
  }
}

export default PedidoService;
