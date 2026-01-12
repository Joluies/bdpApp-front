// Configuración de la API para diferentes entornos
const isDevelopment = process.env.NODE_ENV === 'development';

// Obtener URL desde variables de entorno o usar fallback
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_API_URL) {
    return `${process.env.NEXT_PUBLIC_API_URL}/api`;
  }
  return 'https://api.bebidasdelperuapp.com/api';
};

export const API_CONFIG = {
  // URL base de la API - dinámica según el entorno
  BASE_URL: getBaseUrl(),
  
  // Configuración por entorno
  DEVELOPMENT: {
    TIMEOUT: 30000,  // 30 segundos timeout (aumentado)
    LOG_REQUESTS: true
  },
  
  PRODUCTION: {
    TIMEOUT: 30000,  // 30 segundos timeout
    LOG_REQUESTS: false
  },
  
  // Endpoints disponibles
  ENDPOINTS: {
    CUSTOMERS: {
      CREATE: '/customers/create',      // ✅ Endpoint correcto para crear (POST)
      LIST: '/customers',               // ✅ Endpoint correcto para listar (GET)
      UPDATE: '/customers',             // ✅ Endpoint para actualizar (PUT)
      DELETE: '/customers'              // ✅ Endpoint para eliminar (DELETE)
    },
    PRODUCTS: {
      CREATE: '/products/create',       // ✅ Endpoint correcto para crear (POST)
      LIST: '/products',                // ✅ Endpoint correcto para listar (GET)
      UPDATE: '/products',              // ✅ Endpoint para actualizar (PUT)
      DELETE: '/products'               // ✅ Endpoint para eliminar (DELETE)
    }
  }
};

// Helper para obtener configuración actual
export const getCurrentConfig = () => {
  const isDev = process.env.NODE_ENV === 'development';
  return isDev ? API_CONFIG.DEVELOPMENT : API_CONFIG.PRODUCTION;
};

// Helper para construir URL completa
export const buildApiUrl = (endpoint: string) => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};