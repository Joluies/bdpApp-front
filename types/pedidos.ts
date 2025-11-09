import { Cliente } from './clientes';

// Interfaces para la gestión de ventas
export interface VentaItem {
   id?: string;
   idProducto: number;
   nombreProducto: string;
   presentacion: string;
   cantidad: number;
   precioUnitario: number;
   subtotal: number;
}

export interface Venta {
   id?: string;
   numeroVenta: string;
   fecha: string;
   fechaProgramada?: string; // Para ventas programadas
   cliente: Cliente;
   vendedor: Vendedor;
   items: VentaItem[];
   subtotal: number;
   igv: number;
   total: number;
   tipoDocumento: 'boleta' | 'factura';
   estado: 'registrado' | 'facturado' | 'en_transito' | 'completado' | 'rechazado';
   fechaCreacion?: string;
   fechaActualizacion?: string;
   observaciones?: string;
}

export interface Vendedor {
   id: string;
   nombres: string;
   apellidos: string;
   dni: string;
   telefono?: string;
   email?: string;
   fechaIngreso: string;
   estado: 'activo' | 'inactivo';
   ventasMes?: number;
   ventasTotal?: number;
}

// Interfaces para estadísticas
export interface EstadisticasVentas {
   ventasHoy: number;
   ventasSemana: number;
   ventasMes: number;
   ventasAno: number;
   totalVentasHoy: number;
   totalVentasSemana: number;
   totalVentasMes: number;
   totalVentasAno: number;
}

export interface VentasPorVendedor {
   vendedor: Vendedor;
   ventasHoy: number;
   ventasMes: number;
   totalVentasHoy: number;
   totalVentasMes: number;
   ultimaVenta?: string;
}

export interface VentasPorDia {
   fecha: string;
   cantidadVentas: number;
   totalVentas: number;
   ventasCompletadas: number;
   ventasPendientes: number;
}

// Interfaces para formularios
export interface VentaForm {
   clienteId: string;
   vendedorId: string;
   fechaProgramada?: string;
   items: VentaItemForm[];
   tipoDocumento: 'boleta' | 'factura';
   observaciones?: string;
}

export interface VentaItemForm {
   idProducto: number;
   cantidad: number;
   precioUnitario?: number; // Se puede override el precio
}

// Interfaces para documentos
export interface DocumentoVenta {
   id?: string;
   ventaId: string;
   tipoDocumento: 'boleta' | 'factura';
   numeroDocumento: string;
   fechaEmision: string;
   datosCliente: {
      documento: string;
      nombre: string;
      direccion: string;
   };
   datosEmpresa: {
      ruc: string;
      razonSocial: string;
      direccion: string;
   };
   items: VentaItem[];
   subtotal: number;
   igv: number;
   total: number;
   estado: 'emitido' | 'anulado';
}

// Tipos de filtros
export interface FiltrosVentas {
   fechaInicio?: string;
   fechaFin?: string;
   vendedorId?: string;
   clienteId?: string;
   estado?: Venta['estado'];
   tipoDocumento?: Venta['tipoDocumento'];
   montoMinimo?: number;
   montoMaximo?: number;
}

// Enums
export enum EstadoVenta {
   REGISTRADO = 'registrado',
   FACTURADO = 'facturado',
   EN_TRANSITO = 'en_transito',
   COMPLETADO = 'completado',
   RECHAZADO = 'rechazado'
}

export enum TipoDocumento {
   BOLETA = 'boleta',
   FACTURA = 'factura'
}

export enum EstadoVendedor {
   ACTIVO = 'activo',
   INACTIVO = 'inactivo'
}