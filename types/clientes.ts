// Interfaces para la gestión de clientes
export interface ClienteBase {
   id?: string;
   direccion: string;
   telefonos: string[]; // Hasta 3 números de teléfono
   fechaCreacion?: string;
   fechaActualizacion?: string;
   estado?: 'Activo' | 'Inactivo';
}

export interface ClienteMayorista extends ClienteBase {
   tipo: 'mayorista';
   ruc: string;
   razonSocial: string;
}

export interface ClienteMinorista extends ClienteBase {
   tipo: 'minorista';
   dni: string;
   nombres: string;
   apellidos: string;
}

export type Cliente = ClienteMayorista | ClienteMinorista;

// Interfaces para formularios
export interface TelefonoForm {
   number: string;           // Cambiar para consistencia con la API
   description: string;
}

// Interface específica para envío a la API
export interface TelefonoEnvio {
   number: string;
   description: string;
}

export interface ClienteMayoristaForm {
   ruc: string;
   razonSocial: string;
   nombre: string;           // Nombre del representante
   apellidos: string;        // Apellidos del representante
   dni: string;             // DNI del representante
   direccion: string;
   telefonos: TelefonoEnvio[];  // Usar formato correcto
}

export interface ClienteMinoristaForm {
   dni: string;
   nombres: string;
   apellidos: string;
   direccion: string;
   telefonos: TelefonoEnvio[];  // Usar formato correcto
}

// Interfaces para la respuesta de la API (actualizada con la estructura real)
export interface TelefonoAPI {
   idTelefono?: number;
   number?: string;          // Campo esperado en el frontend
   numero?: string;          // Campo que viene de la API
   description: string;
}

// Interface principal para un cliente de la API
export interface ClienteAPIReal {
   idCliente: number;
   nombre: string;
   apellidos: string;
   tipoCliente: "Minorista" | "Mayorista";
   dni: string;
   ruc: string | null;
   razonSocial: string | null;
   direccion: string;
   telefonos: TelefonoAPI[];
   created_at: string;
   updated_at: string;
}

// Interfaces para paginación
export interface ApiLink {
   url: string | null;
   label: string;
   page?: number | null;
   active: boolean;
}

export interface ApiMeta {
   current_page: number;
   from: number;
   last_page: number;
   links: ApiLink[];
   path: string;
   per_page: number;
   to: number;
   total: number;
}

export interface ApiLinks {
   first: string;
   last: string;
   prev: string | null;
   next: string | null;
}

// Interface para la respuesta paginada de clientes
export interface RespuestaClientesAPI {
   data: ClienteAPIReal[];
   links: ApiLinks;
   meta: ApiMeta;
   success: boolean;
}

// Enum para tipos de cliente
export enum TipoCliente {
   MAYORISTA = 'mayorista',
   MINORISTA = 'minorista'
}

// Interface para estadísticas
export interface EstadisticasClientes {
   totalClientes: number;
   clientesMayoristas: number;
   clientesMinoristas: number;
   clientesActivos: number;
}

// Interface para filtros
export interface FiltrosClientes {
   tipo?: TipoCliente;
   estado?: 'Activo' | 'Inactivo';
   busqueda?: string;
}