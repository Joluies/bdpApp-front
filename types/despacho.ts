// Tipos base para el sistema de despacho

export enum EstadoEntrega {
  PENDIENTE = 'PENDIENTE',
  ENTREGADO = 'ENTREGADO',
  RECHAZADO = 'RECHAZADO',
  EN_TRANSITO = 'EN_TRANSITO'
}

export enum EstadoCamion {
  DISPONIBLE = 'DISPONIBLE',
  EN_RUTA = 'EN_RUTA',
  MANTENIMIENTO = 'MANTENIMIENTO',
  FUERA_SERVICIO = 'FUERA_SERVICIO'
}

export interface PuntoEntrega {
  id: string;
  direccion: string;
  cliente: string;
  telefono?: string;
  valorMercaderia: number;
  estado: EstadoEntrega;
  fechaEstimada: string;
  fechaEntrega?: string;
  observaciones?: string;
  coordenadas?: {
    lat: number;
    lng: number;
  };
}

export interface Ruta {
  id: string;
  nombre: string;
  descripcion?: string;
  puntosEntrega: PuntoEntrega[];
  distanciaTotal: number; // en kilómetros
  tiempoEstimado: number; // en horas
  fechaInicio: string;
  fechaFin?: string;
  estado: EstadoEntrega;
  valorTotal: number; // suma de todos los valores de mercadería
}

export interface Camion {
  id: string;
  placa: string;
  modelo: string;
  marca: string;
  anio: number;
  capacidad: number; // en toneladas
  conductor: string;
  telefono?: string;
  estado: EstadoCamion;
  rutaActual?: Ruta;
  rutas: Ruta[];
  kmRecorridos: number;
  consumoCombustible?: number; // litros por 100km
}

export interface EstadisticasDespacho {
  totalCamiones: number;
  camionesEnRuta: number;
  camionesDisponibles: number;
  totalRutas: number;
  rutasActivas: number;
  totalPuntosEntrega: number;
  puntosEntregados: number;
  puntosRechazados: number;
  puntosPendientes: number;
  valorTotalMercaderia: number;
  valorEntregado: number;
  valorPendiente: number;
}

// Interfaces para formularios
export interface FormCamion {
  placa: string;
  modelo: string;
  marca: string;
  anio: number;
  capacidad: number;
  conductor: string;
  telefono: string;
}

export interface FormRuta {
  nombre: string;
  descripcion: string;
  camionId: string;
  fechaInicio: string;
  puntosEntrega: Omit<PuntoEntrega, 'id' | 'estado'>[];
}

export interface FormPuntoEntrega {
  direccion: string;
  cliente: string;
  telefono: string;
  valorMercaderia: number;
  fechaEstimada: string;
  observaciones: string;
}

// Filtros para la vista
export interface FiltrosDespacho {
  estadoCamion?: EstadoCamion;
  estadoRuta?: EstadoEntrega;
  fechaDesde?: string;
  fechaHasta?: string;
  conductor?: string;
}