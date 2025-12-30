// Servicio para API de clientes
import { API_CONFIG, getCurrentConfig, buildApiUrl } from '@/config/api.config';

// Detectar entorno de desarrollo
const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';

// Obtener configuración actual
const currentConfig = getCurrentConfig();

// Interfaces para la API
export interface TelefonoAPI {
   idTelefono?: number;      // ID del teléfono (viene de la API al leer)
   number?: string;          // Campo para envío a la API
   numero?: string;          // Campo que viene al leer de la API
   description: string;      // Descripción del teléfono
}

// Interface específica para envío de teléfonos a la API
export interface TelefonoEnvio {
   number: string;           // Formato requerido por la API
   description: string;
}

// Interfaces para la respuesta real de la API con paginación
export interface ClienteAPIReal {
   idCliente: number;
   nombre: string;
   apellidos: string;
   tipoCliente: "Minorista" | "Mayorista";
   dni: string;
   ruc: string | null;
   razon_social?: string | null;  // Mantener para compatibilidad
   razonSocial: string | null;    // Nuevo campo de la API
   direccion: string;
   telefonos: TelefonoAPI[];      // Array de teléfonos
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

// Interface principal para la respuesta paginada de clientes
export interface RespuestaClientesAPI {
   data: ClienteAPIReal[];
   links: ApiLinks;
   meta: ApiMeta;
   success: boolean;
}

// Interface para respuesta simple (sin paginación)
export interface RespuestaClientesSinPaginacion {
   message: string;
   clientes: ClienteAPIReal[];
}

// Interface para la respuesta de la API
export interface ClienteResponse {
   success: boolean;
   message: string;
   data?: any;
}

class ClientesApiService {
   private async makeRequest(
      endpoint: string,
      method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
      body?: any
   ): Promise<any> {
      try {
         // Crear AbortController para timeout
         const controller = new AbortController();
         const timeoutId = setTimeout(() => controller.abort(), currentConfig.TIMEOUT);

         const config: RequestInit = {
            method,
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            },
            mode: 'cors', // Habilitar CORS explícitamente
            signal: controller.signal,
         };

         if (body) {
            config.body = JSON.stringify(body);
         }

         const url = buildApiUrl(endpoint);
         
         console.log(`🌐 API Request: ${method} ${url}`);
         console.log(`📤 Request Body:`, body || 'No body');
         console.log(`⚙️ Request Config:`, config);

         // Intentar la petición
         const response = await fetch(url, config);
         
         // Limpiar timeout
         clearTimeout(timeoutId);
         
         console.log(`📊 Response Status: ${response.status} ${response.statusText}`);
         console.log(`📊 Response Headers:`, Object.fromEntries(response.headers.entries()));
         console.log(`📊 Response OK:`, response.ok);
         
         // Obtener el contenido de la respuesta
         let responseData;
         const contentType = response.headers.get('content-type');
         console.log(`📊 Content-Type:`, contentType);
         
         if (contentType && contentType.includes('application/json')) {
            responseData = await response.json();
         } else {
            const textData = await response.text();
            console.log(`📝 Response Text:`, textData);
            
            // Si no es JSON, puede ser HTML de error o texto plano
            if (textData.includes('<!DOCTYPE html>') || textData.includes('<html>')) {
               throw new Error(`El servidor devolvió HTML en lugar de JSON. Posible error 404 o problema de CORS. URL: ${url}`);
            } else {
               throw new Error(`Respuesta inesperada del servidor: ${textData}`);
            }
         }
         
         console.log(`📝 API Response Data:`, responseData);
         
         if (!response.ok) {
            // Lanzar error con información más específica si está disponible
            console.error(`❌ API Error Response:`, responseData);
            
            // Si hay errores de validación específicos, construir mensaje detallado
            if (responseData?.errors && typeof responseData.errors === 'object') {
               const errorMessages = [];
               for (const [field, messages] of Object.entries(responseData.errors)) {
                  if (Array.isArray(messages)) {
                     errorMessages.push(`${field}: ${messages.join(', ')}`);
                  } else {
                     errorMessages.push(`${field}: ${messages}`);
                  }
               }
               const detailedError = `Errores de validación: ${errorMessages.join('; ')}`;
               throw new Error(detailedError);
            }
            
            const errorMessage = responseData?.message || responseData?.error || `HTTP error! status: ${response.status}`;
            throw new Error(`Error ${response.status}: ${errorMessage}`);
         }

         return responseData;
      } catch (error) {
         console.error(`❌ Error en ${method} ${endpoint}:`, error);
         console.error(`❌ Error type:`, error instanceof Error ? error.constructor.name : typeof error);
         console.error(`❌ Error message:`, error instanceof Error ? error.message : error);
         
         // Manejo de errores específicos
         if (error instanceof Error) {
            if (error.name === 'AbortError' || error.message.includes('timeout')) {
               throw new Error('La conexión tardó demasiado tiempo. Verifique su conexión a internet.');
            } else if (error.message.includes('Failed to fetch')) {
               throw new Error('No se pudo conectar con el servidor. Posible problema de CORS o servidor no disponible.');
            } else if (error.message.includes('NetworkError')) {
               throw new Error('Error de red. Verifique su conexión a internet.');
            }
         }
         
         throw error;
      }
   }

   // Crear cliente mayorista
   async crearClienteMayorista(data: {
      tipoCliente: 'Mayorista';
      ruc: string;
      razonSocial: string;
      nombre: string;
      apellidos: string;
      dni: string;
      direccion: string;
      telefonos: TelefonoEnvio[];  // Usar formato específico para envío
   }): Promise<ClienteResponse> {
      console.log('📤 Enviando datos a crearClienteMayorista:', data);
      console.log('🔧 Configuración actual:', currentConfig);
      
      // Validar datos antes de enviar
      const validacion = this.validarDatosCliente(data);
      if (!validacion.valido) {
         throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
      }

      // Adaptar datos al formato esperado por la API real
      const clienteData = {
         tipoCliente: 'mayorista',
         nombre: data.nombre,
         apellidos: data.apellidos,
         ruc: data.ruc,
         razonSocial: data.razonSocial,  // La API espera 'razonSocial' no 'razon_social'
         dni: data.dni,
         direccion: data.direccion,
         telefonos: this.normalizarTelefonos(data.telefonos)
      };

      console.log('📤 Datos enviados a API para mayorista:', clienteData);
      
      try {
         const result = await this.makeRequest(API_CONFIG.ENDPOINTS.CUSTOMERS.CREATE, 'POST', clienteData);
         console.log('✅ Respuesta exitosa de la API:', result);
         console.log('✅ Tipo de respuesta:', typeof result);
         console.log('✅ Success field:', result?.success);
         console.log('✅ Message field:', result?.message);
         console.log('✅ Data field:', result?.data);
         
         // Verificar si la respuesta indica éxito
         if (result && (result.success !== false)) {
            console.log('✅ Respuesta considerada exitosa');
            return {
               success: true,
               message: result.message || 'Cliente mayorista creado exitosamente',
               data: result.data || result
            };
         } else {
            console.log('❌ Respuesta considerada fallida');
            throw new Error(result?.message || 'Error desconocido al crear cliente');
         }
      } catch (error) {
         console.error('❌ Error en crearClienteMayorista:', error);
         console.error('❌ Error tipo:', typeof error);
         console.error('❌ Error mensaje:', error instanceof Error ? error.message : 'Error desconocido');
         throw error; // No usar fallback, lanzar el error directamente
      }
   }

   // Probar endpoint de creación con datos reales
   async probarCreacionReal(): Promise<void> {
      console.log('🧪 Probando creación real con datos de prueba...');
      
      const testMayorista = {
         tipoCliente: 'Mayorista',
         nombre: 'TestNombre',
         apellidos: 'TestApellidos',
         ruc: '12345678901',
         razonSocial: 'Empresa Test',
         dni: '12345678',
         direccion: 'Dirección de prueba 123',
         telefonos: [{ 
            number: '987654321', 
            description: 'Número de Casa' 
         }]
      };
      
      console.log('🧪 Datos de prueba:', testMayorista);
      
      try {
         const url = buildApiUrl(API_CONFIG.ENDPOINTS.CUSTOMERS.CREATE);
         console.log('🌐 URL de creación:', url);
         
         const response = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(testMayorista)
         });
         
         console.log('📊 Status:', response.status, response.statusText);
         console.log('📊 Headers:', Object.fromEntries(response.headers.entries()));
         
         const responseText = await response.text();
         console.log('📝 Response Text:', responseText);
         
         if (responseText) {
            try {
               const responseJson = JSON.parse(responseText);
               console.log('📦 Response JSON:', responseJson);
            } catch (parseError) {
               console.log('❌ No se pudo parsear como JSON');
            }
         }
         
         if (response.ok) {
            console.log('✅ Prueba de creación exitosa');
         } else {
            console.log('❌ Prueba de creación falló');
         }
         
      } catch (error) {
         console.error('❌ Error en prueba de creación:', error);
      }
   }
   async probarEndpointCreacion(): Promise<void> {
      console.log('🔍 Probando endpoint de creación...');
      try {
         const url = buildApiUrl(API_CONFIG.ENDPOINTS.CUSTOMERS.CREATE);
         console.log('🌐 URL a probar:', url);
         
         // Hacer una petición OPTIONS para ver si el endpoint acepta CORS
         const optionsResponse = await fetch(url, {
            method: 'OPTIONS',
            headers: {
               'Origin': window.location.origin,
               'Access-Control-Request-Method': 'POST',
               'Access-Control-Request-Headers': 'Content-Type',
            }
         });
         
         console.log('📊 OPTIONS Response:', optionsResponse.status, optionsResponse.statusText);
         console.log('📊 CORS Headers:', Object.fromEntries(optionsResponse.headers.entries()));
         
         // Probar una petición POST con datos de prueba
         const testData = {
            tipoCliente: 'Minorista',
            nombre: 'TestNombre',
            apellidos: 'TestApellidos',
            dni: '12345678',
            ruc: null,
            razonSocial: null,
            direccion: 'Dirección de prueba 123',
            telefonos: [{ number: '987654321', description: 'Número de Casa' }]
         };
         
         console.log('🧪 Enviando datos de prueba:', testData);
         
         const testResponse = await fetch(url, {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               'Accept': 'application/json',
            },
            mode: 'cors',
            body: JSON.stringify(testData)
         });
         
         console.log('📊 Test POST Response Status:', testResponse.status, testResponse.statusText);
         console.log('📊 Test POST Response Headers:', Object.fromEntries(testResponse.headers.entries()));
         
         const responseText = await testResponse.text();
         console.log('📝 Test POST Response Body:', responseText);
         
         // Intentar parsear como JSON
         try {
            const responseJson = JSON.parse(responseText);
            console.log('✅ Respuesta JSON parseada:', responseJson);
         } catch (parseError) {
            console.log('❌ No se pudo parsear como JSON:', parseError);
         }
         
      } catch (error) {
         console.error('❌ Error al probar endpoint:', error);
      }
   }
   async crearClienteMinorista(data: {
      dni: string;
      nombres: string;
      apellidos: string;
      direccion: string;
      telefonos: TelefonoEnvio[];  // Usar formato específico para envío
   }): Promise<ClienteResponse> {
      console.log('📤 Enviando datos a crearClienteMinorista:', data);
      console.log('🔧 Configuración actual:', currentConfig);
      
      // Validar datos antes de enviar
      const dataToValidate = {
         ...data,
         nombre: data.nombres,
         tipoCliente: 'Minorista'
      };
      const validacion = this.validarDatosCliente(dataToValidate);
      if (!validacion.valido) {
         throw new Error(`Datos inválidos: ${validacion.errores.join(', ')}`);
      }

      // Adaptar datos al formato esperado por la API real
      const clienteData = {
         tipoCliente: 'minorista',
         nombre: data.nombres,
         apellidos: data.apellidos,
         dni: data.dni,
         ruc: null,  // Minoristas no tienen RUC
         razonSocial: null,  // Minoristas no tienen razón social
         direccion: data.direccion,
         telefonos: this.normalizarTelefonos(data.telefonos)
      };

      console.log('📤 Datos enviados a API para minorista:', clienteData);
      
      try {
         const result = await this.makeRequest(API_CONFIG.ENDPOINTS.CUSTOMERS.CREATE, 'POST', clienteData);
         console.log('✅ Respuesta exitosa de la API:', result);
         console.log('✅ Tipo de respuesta:', typeof result);
         console.log('✅ Success field:', result?.success);
         console.log('✅ Message field:', result?.message);
         console.log('✅ Data field:', result?.data);
         
         // Verificar si la respuesta indica éxito
         if (result && (result.success !== false)) {
            console.log('✅ Respuesta considerada exitosa');
            return {
               success: true,
               message: result.message || 'Cliente minorista creado exitosamente',
               data: result.data || result
            };
         } else {
            console.log('❌ Respuesta considerada fallida');
            throw new Error(result?.message || 'Error desconocido al crear cliente');
         }
      } catch (error) {
         console.error('❌ Error en crearClienteMinorista:', error);
         console.error('❌ Error tipo:', typeof error);
         console.error('❌ Error mensaje:', error instanceof Error ? error.message : 'Error desconocido');
         throw error; // No usar fallback, lanzar el error directamente
      }
   }

   // Verificar estado de la API
   async verificarConexion(): Promise<boolean> {
      try {
         const controller = new AbortController();
         const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 segundos timeout
         
         const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.CUSTOMERS.LIST), {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
            signal: controller.signal
         });
         
         clearTimeout(timeoutId);
         
         // Aceptar códigos de estado 200-299 y también 404 (endpoint puede no tener datos pero existe)
         return response.status >= 200 && response.status < 500;
      } catch (error) {
         console.warn('Error al verificar conexión API:', error);
         return false;
      }
   }

   // Método alternativo de verificación usando solo el dominio base
   async verificarConexionAlternativa(): Promise<boolean> {
      try {
         const controller = new AbortController();
         const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 segundos timeout
         
         // Intentar conectar solo al dominio base
         const response = await fetch('https://bebidasdelperuapp.com', {
            method: 'GET',
            signal: controller.signal,
            mode: 'no-cors' // Permite verificar si el servidor responde
         });
         
         clearTimeout(timeoutId);
         return true; // Si llegamos aquí, el servidor responde
      } catch (error) {
         console.warn('Error en verificación alternativa:', error);
         return false;
      }
   }

   // Obtener todos los clientes con soporte para paginación
   async obtenerClientes(page: number = 1): Promise<RespuestaClientesAPI> {
      console.log('🌐 Realizando llamada a API real para obtener clientes - página:', page);
      
      try {
         const endpoint = `${API_CONFIG.ENDPOINTS.CUSTOMERS.LIST}?page=${page}`;
         console.log('🌐 Realizando llamada a API real:', endpoint);
         const response = await this.makeRequest(endpoint, 'GET');
         console.log('📦 Respuesta de API:', response);
         
         // Verificar que la respuesta tenga la estructura esperada
         if (response && response.data && Array.isArray(response.data)) {
            // Normalizar datos para mantener compatibilidad con campos anteriores
            const clientesNormalizados = response.data.map((cliente: any) => ({
               ...cliente,
               // Asegurar que tenemos ambos campos para compatibilidad
               razon_social: cliente.razonSocial || cliente.razon_social,
               razonSocial: cliente.razonSocial || cliente.razon_social,
               // Asegurar que siempre tenemos un array de teléfonos
               telefonos: cliente.telefonos || []
            }));
            
            const respuestaNormalizada: RespuestaClientesAPI = {
               data: clientesNormalizados,
               links: response.links || {
                  first: "",
                  last: "",
                  prev: null,
                  next: null
               },
               meta: response.meta || {
                  current_page: 1,
                  from: 1,
                  last_page: 1,
                  links: [],
                  path: "",
                  per_page: 10,
                  to: clientesNormalizados.length,
                  total: clientesNormalizados.length
               },
               success: response.success !== false
            };
            
            console.log('📦 Respuesta normalizada:', respuestaNormalizada);
            return respuestaNormalizada;
         } else if (response && response.clientes && Array.isArray(response.clientes)) {
            // Mantener compatibilidad con formato anterior (sin paginación)
            console.log('📦 Formato anterior detectado, adaptando...');
            return {
               data: response.clientes,
               links: {
                  first: "",
                  last: "",
                  prev: null,
                  next: null
               },
               meta: {
                  current_page: 1,
                  from: 1,
                  last_page: 1,
                  links: [],
                  path: "",
                  per_page: response.clientes.length,
                  to: response.clientes.length,
                  total: response.clientes.length
               },
               success: true
            };
         } else if (Array.isArray(response)) {
            // Por si acaso la API retorna directamente el array
            console.log('📦 Array directo detectado, adaptando...');
            return {
               data: response,
               links: {
                  first: "",
                  last: "",
                  prev: null,
                  next: null
               },
               meta: {
                  current_page: 1,
                  from: 1,
                  last_page: 1,
                  links: [],
                  path: "",
                  per_page: response.length,
                  to: response.length,
                  total: response.length
               },
               success: true
            };
         } else {
            console.warn('Formato de respuesta inesperado de la API:', response);
            throw new Error('Formato de respuesta inesperado de la API');
         }
      } catch (error) {
         console.error('Error al obtener clientes:', error);
         throw error;
      }
   }

   // Método auxiliar para obtener solo la lista de clientes (sin metadatos)
   async obtenerListaClientes(page: number = 1): Promise<ClienteAPIReal[]> {
      const respuesta = await this.obtenerClientes(page);
      return respuesta.data;
   }

   // Método para obtener todos los clientes de todas las páginas
   async obtenerTodosLosClientes(): Promise<ClienteAPIReal[]> {
      let todosLosClientes: ClienteAPIReal[] = [];
      let paginaActual = 1;
      let ultimaPagina = 1;

      try {
         do {
            const respuesta = await this.obtenerClientes(paginaActual);
            todosLosClientes = [...todosLosClientes, ...respuesta.data];
            ultimaPagina = respuesta.meta.last_page;
            paginaActual++;
         } while (paginaActual <= ultimaPagina);

         console.log(`📦 Total de clientes obtenidos: ${todosLosClientes.length}`);
         return todosLosClientes;
      } catch (error) {
         console.error('Error al obtener todos los clientes:', error);
         throw error;
      }
   }

   // Obtener cliente por ID
   async obtenerClientePorId(id: string): Promise<any> {
      return await this.makeRequest(`/client/${id}`, 'GET');
   }

   // Actualizar cliente
   async actualizarCliente(id: string, clienteData: any): Promise<any> {
      try {
         console.log(`📤 Actualizando cliente ID: ${id}`, clienteData);
         
         const result = await this.makeRequest(`/client/${id}`, 'PUT', clienteData);
         
         console.log('✅ Cliente actualizado exitosamente:', result);
         return {
            success: true,
            message: result?.message || 'Cliente actualizado exitosamente',
            data: result.data || result
         };
      } catch (error) {
         console.error('❌ Error al actualizar cliente:', error);
         throw error;
      }
   }

   // Eliminar cliente
   async eliminarCliente(id: string): Promise<any> {
      try {
         console.log(`📤 Eliminando cliente ID: ${id}`);
         
         const result = await this.makeRequest(`/client/${id}`, 'DELETE');
         
         console.log('✅ Cliente eliminado exitosamente:', result);
         return {
            success: true,
            message: result?.message || 'Cliente eliminado exitosamente',
            data: result.data || result
         };
      } catch (error) {
         console.error('❌ Error al eliminar cliente:', error);
         throw error;
      }
   }

   // Método de diagnóstico detallado
   async diagnosticarConexion(): Promise<{
      conectado: boolean;
      detalles: string;
      tiempo: number;
   }> {
      const startTime = Date.now();

      try {
         const controller = new AbortController();
         const timeoutId = setTimeout(() => controller.abort(), 5000);
         
         const response = await fetch(buildApiUrl('/client'), {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
            signal: controller.signal
         });
         
         clearTimeout(timeoutId);
         const tiempo = Date.now() - startTime;
         
         if (response.status >= 200 && response.status < 500) {
            return {
               conectado: true,
               detalles: `✅ Respuesta HTTP ${response.status} en ${tiempo}ms`,
               tiempo
            };
         } else {
            return {
               conectado: false,
               detalles: `❌ Error HTTP ${response.status}`,
               tiempo
            };
         }
      } catch (error: any) {
         const tiempo = Date.now() - startTime;
         
         if (error.name === 'AbortError') {
            return {
               conectado: false,
               detalles: '⏱️ Timeout - La API no responde en 5 segundos',
               tiempo
            };
         }
         
         return {
            conectado: false,
            detalles: `🚫 Error de conexión: ${error.message}`,
            tiempo
         };
      }
   }

   // Obtener clientes por tipo
   async obtenerClientesPorTipo(tipo: 'Mayorista' | 'Minorista'): Promise<ClienteAPIReal[]> {
      const todosLosClientes = await this.obtenerTodosLosClientes();
      return todosLosClientes.filter((cliente: ClienteAPIReal) => cliente.tipoCliente === tipo);
   }

   // Buscar clientes por nombre, apellidos o DNI
   async buscarClientes(termino: string, page: number = 1): Promise<RespuestaClientesAPI> {
      // Si tenemos un endpoint de búsqueda en la API, usarlo
      // Por ahora, obtenemos todos y filtramos localmente
      const respuesta = await this.obtenerClientes(page);
      
      if (!termino.trim()) {
         return respuesta;
      }

      const terminoLower = termino.toLowerCase();
      const clientesFiltrados = respuesta.data.filter(cliente => 
         cliente.nombre.toLowerCase().includes(terminoLower) ||
         cliente.apellidos.toLowerCase().includes(terminoLower) ||
         cliente.dni.includes(termino) ||
         (cliente.ruc && cliente.ruc.includes(termino)) ||
         (cliente.razonSocial && cliente.razonSocial.toLowerCase().includes(terminoLower))
      );

      return {
         ...respuesta,
         data: clientesFiltrados,
         meta: {
            ...respuesta.meta,
            total: clientesFiltrados.length,
            to: clientesFiltrados.length
         }
      };
   }

   // Obtener estadísticas de clientes
   async obtenerEstadisticasClientes(): Promise<{
      total: number;
      mayoristas: number;
      minoristas: number;
      porcentajeMayoristas: number;
      porcentajeMinoristas: number;
   }> {
      try {
         const clientes = await this.obtenerTodosLosClientes();
         const mayoristas = clientes.filter(c => c.tipoCliente === 'Mayorista').length;
         const minoristas = clientes.filter(c => c.tipoCliente === 'Minorista').length;
         const total = clientes.length;

         return {
            total,
            mayoristas,
            minoristas,
            porcentajeMayoristas: total > 0 ? Math.round((mayoristas / total) * 100) : 0,
            porcentajeMinoristas: total > 0 ? Math.round((minoristas / total) * 100) : 0
         };
      } catch (error) {
         console.error('Error al obtener estadísticas:', error);
         return {
            total: 0,
            mayoristas: 0,
            minoristas: 0,
            porcentajeMayoristas: 0,
            porcentajeMinoristas: 0
         };
      }
   }

   // Validar datos de cliente antes de enviar
   private validarDatosCliente(data: any): { valido: boolean; errores: string[] } {
      const errores: string[] = [];

      if (!data.nombre || data.nombre.trim().length === 0) {
         errores.push('El nombre es requerido');
      }

      if (!data.apellidos || data.apellidos.trim().length === 0) {
         errores.push('Los apellidos son requeridos');
      }

      if (!data.dni || data.dni.trim().length === 0) {
         errores.push('El DNI es requerido');
      } else if (data.dni.length !== 8) {
         errores.push('El DNI debe tener 8 dígitos');
      }

      if (!data.direccion || data.direccion.trim().length === 0) {
         errores.push('La dirección es requerida');
      }

      if (!data.telefonos || !Array.isArray(data.telefonos) || data.telefonos.length === 0) {
         errores.push('Debe proporcionar al menos un teléfono');
      } else {
         data.telefonos.forEach((tel: any, index: number) => {
            // Verificar ambos formatos: 'number' (API) y 'numero' (compatibilidad)
            const numeroTelefono = tel.number || tel.numero;
            if (!numeroTelefono || numeroTelefono.trim().length === 0) {
               errores.push(`El número de teléfono ${index + 1} es requerido`);
            }
            if (!tel.description || tel.description.trim().length === 0) {
               errores.push(`La descripción del teléfono ${index + 1} es requerida`);
            }
         });
      }

      // Validaciones específicas para mayoristas
      if (data.tipoCliente === 'Mayorista') {
         if (!data.ruc || data.ruc.trim().length === 0) {
            errores.push('El RUC es requerido para clientes mayoristas');
         } else if (data.ruc.length !== 11) {
            errores.push('El RUC debe tener 11 dígitos');
         }

         if (!data.razonSocial || data.razonSocial.trim().length === 0) {
            errores.push('La razón social es requerida para clientes mayoristas');
         }
      }

      return {
         valido: errores.length === 0,
         errores
      };
   }

   // Método de prueba para verificar que todo funciona
   async pruebaCompleta(): Promise<void> {
      console.log('🧪 === PRUEBA COMPLETA DEL SERVICIO ===');
      
      // 1. Verificar configuración
      console.log('1️⃣ Verificando configuración...');
      console.log('Config:', currentConfig);
      console.log('NODE_ENV:', process.env.NODE_ENV);
      
      // 2. Probar obtener clientes
      console.log('2️⃣ Probando obtener clientes...');
      try {
         const clientes = await this.obtenerClientes(1);
         console.log('✅ Clientes obtenidos:', clientes.data.length);
         console.log('📋 Primeros 3 clientes:', clientes.data.slice(0, 3));
      } catch (error) {
         console.error('❌ Error al obtener clientes:', error);
      }
      
      // 3. Probar creación
      console.log('3️⃣ Configuración de creación...');
      console.log('Endpoint CREATE:', API_CONFIG.ENDPOINTS.CUSTOMERS.CREATE);
      
      console.log('🧪 === FIN DE PRUEBA COMPLETA ===');
   }
   private normalizarTelefonos(telefonos: any[]): any[] {
      return telefonos.map(tel => ({
         number: tel.number || tel.numero,  // La API espera 'number'
         description: tel.description
      }));
   }
}

export const clientesApiService = new ClientesApiService();

// Hacer el servicio disponible globalmente para testing en desarrollo
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
   (window as any).clientesApiService = clientesApiService;
   console.log('🔧 clientesApiService disponible globalmente para testing');
   console.log('🔧 Ejecuta: clientesApiService.pruebaCompleta()');
}