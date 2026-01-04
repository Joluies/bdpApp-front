import { API_CONFIG } from '@/config/api.config';

const apiUrl = API_CONFIG.BASE_URL || 'https://api.bebidasdelperuapp.com/api';

export interface ClienteRuta {
  idCliente: number;
  nombre: string;
  apellidos: string;
  direccion: string;
  coordenadas: {
    latitud: number;
    longitud: number;
  };
  telefono: string;
  tipoCliente: string;
}

export interface Ruta {
  idRuta?: number;
  nombre: string;
  descripcion?: string;
  idVendedor?: number | null;
  idDespacho?: number | null;
  estado: 'Activa' | 'Completada' | 'Cancelada';
  prioridad: 'Baja' | 'Media' | 'Alta';
  fecha_programada?: string | null;
  total_clientes: number;
  vendedor?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  despacho?: {
    id: number;
    nombre: string;
    apellido: string;
  };
  clientes?: ClienteRuta[];
  created_at?: string;
  updated_at?: string;
}

export interface RutaCluster {
  centro: {
    lat: number;
    lng: number;
  };
  clientes: any[];
  idClientes: number[];
}

export interface AgruparClientesResponse {
  total_clusters: number;
  clusters: RutaCluster[];
  rutas_creadas: Ruta[];
}

class RutaService {
  /**
   * Obtener todas las rutas
   */
  static async obtenerRutas(params?: {
    estado?: string;
    idVendedor?: number;
    idDespacho?: number;
    prioridad?: string;
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
    
    const response = await fetch(`${apiUrl}/rutas${queryString ? '?' + queryString : ''}`);
    if (!response.ok) throw new Error('Error al obtener rutas');
    return response.json();
  }

  /**
   * Crear una nueva ruta
   */
  static async crearRuta(data: Partial<Ruta>) {
    const response = await fetch(`${apiUrl}/rutas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al crear ruta');
    return response.json();
  }

  /**
   * Obtener una ruta específica con sus clientes
   */
  static async obtenerRuta(idRuta: number) {
    const response = await fetch(`${apiUrl}/rutas/${idRuta}`);
    if (!response.ok) throw new Error('Error al obtener ruta');
    return response.json();
  }

  /**
   * Actualizar una ruta
   */
  static async actualizarRuta(idRuta: number, data: Partial<Ruta>) {
    const response = await fetch(`${apiUrl}/rutas/${idRuta}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Error al actualizar ruta');
    return response.json();
  }

  /**
   * Eliminar una ruta
   */
  static async eliminarRuta(idRuta: number) {
    const response = await fetch(`${apiUrl}/rutas/${idRuta}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al eliminar ruta');
    return response.json();
  }

  /**
   * Agregar cliente a una ruta
   */
  static async agregarClienteARuta(
    idRuta: number,
    idCliente: number,
    orden?: number,
    tiempoEstimado?: number
  ) {
    const response = await fetch(`${apiUrl}/rutas/${idRuta}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        idCliente,
        orden,
        tiempo_estimado: tiempoEstimado,
      })
    });
    if (!response.ok) throw new Error('Error al agregar cliente');
    return response.json();
  }

  /**
   * Remover cliente de una ruta
   */
  static async removerClienteDERuta(idRuta: number, idCliente: number) {
    const response = await fetch(`${apiUrl}/rutas/${idRuta}/clientes/${idCliente}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Error al remover cliente');
    return response.json();
  }

  /**
   * Agrupar clientes automáticamente por proximidad geográfica
   */
  static async agruparClientes(params: {
    idVendedor: number;
    radio_km?: number;
    max_clientes_ruta?: number;
    crear_rutas?: boolean;
  }) {
    const response = await fetch(`${apiUrl}/rutas/agrupar-clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params)
    });
    if (!response.ok) throw new Error('Error al agrupar clientes');
    return response.json() as Promise<AgruparClientesResponse>;
  }

  /**
   * Optimizar orden de visita en una ruta usando nearest neighbor
   */
  static async optimizarOrdenRuta(idRuta: number) {
    const response = await fetch(`${apiUrl}/rutas/${idRuta}/optimizar-orden`, {
      method: 'POST'
    });
    if (!response.ok) throw new Error('Error al optimizar ruta');
    return response.json();
  }
}

export default RutaService;
