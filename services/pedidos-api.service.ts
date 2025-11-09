import { Venta, VentaForm, DocumentoVenta, Vendedor, EstadisticasVentas } from '../types/ventas';
import { Cliente } from '../types/clientes';

// Configuración base de la API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export class VentasApiService {
   // Obtener todas las ventas con filtros opcionales
   static async getVentas(filtros?: {
      fechaInicio?: string;
      fechaFin?: string;
      vendedorId?: string;
      clienteId?: string;
      estado?: string;
   }): Promise<Venta[]> {
      try {
         const params = new URLSearchParams();
         if (filtros) {
            Object.entries(filtros).forEach(([key, value]) => {
               if (value) params.append(key, value);
            });
         }
         
         const response = await fetch(`${API_BASE_URL}/ventas?${params}`);
         if (!response.ok) throw new Error('Error al obtener las ventas');
         
         return await response.json();
      } catch (error) {
         console.error('Error en getVentas:', error);
         throw error;
      }
   }

   // Obtener una venta por ID
   static async getVentaById(id: string): Promise<Venta> {
      try {
         const response = await fetch(`${API_BASE_URL}/ventas/${id}`);
         if (!response.ok) throw new Error('Error al obtener la venta');
         
         return await response.json();
      } catch (error) {
         console.error('Error en getVentaById:', error);
         throw error;
      }
   }

   // Crear una nueva venta
   static async createVenta(ventaData: VentaForm): Promise<Venta> {
      try {
         const response = await fetch(`${API_BASE_URL}/ventas`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
         });

         if (!response.ok) throw new Error('Error al crear la venta');
         
         return await response.json();
      } catch (error) {
         console.error('Error en createVenta:', error);
         throw error;
      }
   }

   // Actualizar una venta existente
   static async updateVenta(id: string, ventaData: Partial<VentaForm>): Promise<Venta> {
      try {
         const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(ventaData),
         });

         if (!response.ok) throw new Error('Error al actualizar la venta');
         
         return await response.json();
      } catch (error) {
         console.error('Error en updateVenta:', error);
         throw error;
      }
   }

   // Cambiar estado de una venta (completar, cancelar, etc.)
   static async cambiarEstadoVenta(id: string, nuevoEstado: string): Promise<Venta> {
      try {
         const response = await fetch(`${API_BASE_URL}/ventas/${id}/estado`, {
            method: 'PATCH',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ estado: nuevoEstado }),
         });

         if (!response.ok) throw new Error('Error al cambiar el estado de la venta');
         
         return await response.json();
      } catch (error) {
         console.error('Error en cambiarEstadoVenta:', error);
         throw error;
      }
   }

   // Eliminar una venta
   static async deleteVenta(id: string): Promise<void> {
      try {
         const response = await fetch(`${API_BASE_URL}/ventas/${id}`, {
            method: 'DELETE',
         });

         if (!response.ok) throw new Error('Error al eliminar la venta');
      } catch (error) {
         console.error('Error en deleteVenta:', error);
         throw error;
      }
   }

   // Generar documento de venta (boleta o factura)
   static async generarDocumento(ventaId: string, tipoDocumento: 'boleta' | 'factura'): Promise<DocumentoVenta> {
      try {
         const response = await fetch(`${API_BASE_URL}/ventas/${ventaId}/documento`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tipoDocumento }),
         });

         if (!response.ok) throw new Error('Error al generar el documento');
         
         return await response.json();
      } catch (error) {
         console.error('Error en generarDocumento:', error);
         throw error;
      }
   }

   // Descargar PDF del documento
   static async descargarDocumentoPDF(documentoId: string): Promise<Blob> {
      try {
         const response = await fetch(`${API_BASE_URL}/documentos/${documentoId}/pdf`);
         if (!response.ok) throw new Error('Error al descargar el documento');
         
         return await response.blob();
      } catch (error) {
         console.error('Error en descargarDocumentoPDF:', error);
         throw error;
      }
   }

   // Obtener estadísticas de ventas
   static async getEstadisticasVentas(): Promise<EstadisticasVentas> {
      try {
         const response = await fetch(`${API_BASE_URL}/ventas/estadisticas`);
         if (!response.ok) throw new Error('Error al obtener estadísticas');
         
         return await response.json();
      } catch (error) {
         console.error('Error en getEstadisticasVentas:', error);
         throw error;
      }
   }

   // Obtener ventas por vendedor
   static async getVentasPorVendedor(periodo?: string): Promise<any[]> {
      try {
         const params = periodo ? `?periodo=${periodo}` : '';
         const response = await fetch(`${API_BASE_URL}/ventas/por-vendedor${params}`);
         if (!response.ok) throw new Error('Error al obtener ventas por vendedor');
         
         return await response.json();
      } catch (error) {
         console.error('Error en getVentasPorVendedor:', error);
         throw error;
      }
   }

   // Obtener ventas por día
   static async getVentasPorDia(fechaInicio?: string, fechaFin?: string): Promise<any[]> {
      try {
         const params = new URLSearchParams();
         if (fechaInicio) params.append('fechaInicio', fechaInicio);
         if (fechaFin) params.append('fechaFin', fechaFin);
         
         const response = await fetch(`${API_BASE_URL}/ventas/por-dia?${params}`);
         if (!response.ok) throw new Error('Error al obtener ventas por día');
         
         return await response.json();
      } catch (error) {
         console.error('Error en getVentasPorDia:', error);
         throw error;
      }
   }

   // Obtener lista de vendedores
   static async getVendedores(): Promise<Vendedor[]> {
      try {
         const response = await fetch(`${API_BASE_URL}/vendedores`);
         if (!response.ok) throw new Error('Error al obtener vendedores');
         
         return await response.json();
      } catch (error) {
         console.error('Error en getVendedores:', error);
         throw error;
      }
   }

   // Obtener vendedor por ID
   static async getVendedorById(id: string): Promise<Vendedor> {
      try {
         const response = await fetch(`${API_BASE_URL}/vendedores/${id}`);
         if (!response.ok) throw new Error('Error al obtener el vendedor');
         
         return await response.json();
      } catch (error) {
         console.error('Error en getVendedorById:', error);
         throw error;
      }
   }

   // Crear nuevo vendedor
   static async createVendedor(vendedorData: Omit<Vendedor, 'id'>): Promise<Vendedor> {
      try {
         const response = await fetch(`${API_BASE_URL}/vendedores`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(vendedorData),
         });

         if (!response.ok) throw new Error('Error al crear el vendedor');
         
         return await response.json();
      } catch (error) {
         console.error('Error en createVendedor:', error);
         throw error;
      }
   }

   // Actualizar vendedor
   static async updateVendedor(id: string, vendedorData: Partial<Vendedor>): Promise<Vendedor> {
      try {
         const response = await fetch(`${API_BASE_URL}/vendedores/${id}`, {
            method: 'PUT',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify(vendedorData),
         });

         if (!response.ok) throw new Error('Error al actualizar el vendedor');
         
         return await response.json();
      } catch (error) {
         console.error('Error en updateVendedor:', error);
         throw error;
      }
   }

   // Obtener productos disponibles para ventas
   static async getProductosParaVenta(): Promise<any[]> {
      try {
         const response = await fetch(`${API_BASE_URL}/productos/disponibles`);
         if (!response.ok) throw new Error('Error al obtener productos');
         
         return await response.json();
      } catch (error) {
         console.error('Error en getProductosParaVenta:', error);
         throw error;
      }
   }

   // Validar stock de productos antes de crear venta
   static async validarStockProductos(items: { idProducto: number; cantidad: number }[]): Promise<{ valido: boolean; errores?: string[] }> {
      try {
         const response = await fetch(`${API_BASE_URL}/productos/validar-stock`, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items }),
         });

         if (!response.ok) throw new Error('Error al validar stock');
         
         return await response.json();
      } catch (error) {
         console.error('Error en validarStockProductos:', error);
         throw error;
      }
   }
}