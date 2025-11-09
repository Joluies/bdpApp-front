# Ejemplos de Uso de la API de Clientes Actualizada

Este documento muestra cómo usar los métodos actualizados del servicio de clientes que ahora maneja la estructura completa de datos de la API con paginación y metadatos.

## Estructura de Datos de la API

### Respuesta de la API de Clientes
```typescript
{
  "data": [
    {
      "idCliente": 3,
      "nombre": "Scott",
      "apellidos": "Palomino",
      "tipoCliente": "Minorista",
      "dni": "80703969",
      "ruc": null,
      "razonSocial": null,
      "direccion": "Sector 2 Grupo 16 Manzana G Lote 20",
      "telefonos": [
        {
          "idTelefono": 1,
          "numero": "903089983",
          "description": "Número de Casa"
        }
      ],
      "created_at": "2025-11-08T20:27:04.000000Z",
      "updated_at": "2025-11-08T20:27:04.000000Z"
    }
  ],
  "links": {
    "first": "https://api.bebidasdelperu.name/api/customers?page=1",
    "last": "https://api.bebidasdelperu.name/api/customers?page=2",
    "prev": null,
    "next": "https://api.bebidasdelperu.name/api/customers?page=2"
  },
  "meta": {
    "current_page": 1,
    "from": 1,
    "last_page": 2,
    "path": "https://api.bebidasdelperu.name/api/customers",
    "per_page": 10,
    "to": 10,
    "total": 15
  },
  "success": true
}
```

## Métodos Disponibles

### 1. Obtener Clientes con Paginación

```typescript
import { clientesApiService } from '../services/clientes-api.service';

// Obtener primera página
const respuesta = await clientesApiService.obtenerClientes(1);
console.log('Clientes:', respuesta.data);
console.log('Página actual:', respuesta.meta.current_page);
console.log('Total páginas:', respuesta.meta.last_page);
console.log('Total clientes:', respuesta.meta.total);

// Navegación por páginas
const siguientePagina = respuesta.links.next ? 
  await clientesApiService.obtenerClientes(respuesta.meta.current_page + 1) : 
  null;
```

### 2. Obtener Solo la Lista de Clientes (sin metadatos)

```typescript
// Para mantener compatibilidad con código existente
const clientes = await clientesApiService.obtenerListaClientes(1);
console.log('Lista de clientes:', clientes);
```

### 3. Obtener Todos los Clientes (todas las páginas)

```typescript
// Este método obtiene automáticamente todas las páginas
const todosLosClientes = await clientesApiService.obtenerTodosLosClientes();
console.log('Total de clientes obtenidos:', todosLosClientes.length);
```

### 4. Búsqueda de Clientes

```typescript
// Buscar por nombre, apellidos, DNI o RUC
const resultadoBusqueda = await clientesApiService.buscarClientes('Scott');
console.log('Clientes encontrados:', resultadoBusqueda.data);

// Buscar por DNI específico
const clientePorDni = await clientesApiService.buscarClientes('80703969');
```

### 5. Filtrar por Tipo de Cliente

```typescript
// Obtener solo mayoristas
const mayoristas = await clientesApiService.obtenerClientesPorTipo('Mayorista');
console.log('Clientes mayoristas:', mayoristas);

// Obtener solo minoristas
const minoristas = await clientesApiService.obtenerClientesPorTipo('Minorista');
console.log('Clientes minoristas:', minoristas);
```

### 6. Obtener Estadísticas

```typescript
const estadisticas = await clientesApiService.obtenerEstadisticasClientes();
console.log('Estadísticas:', {
  total: estadisticas.total,
  mayoristas: estadisticas.mayoristas,
  minoristas: estadisticas.minoristas,
  porcentajeMayoristas: estadisticas.porcentajeMayoristas + '%',
  porcentajeMinoristas: estadisticas.porcentajeMinoristas + '%'
});
```

### 7. Crear Cliente Mayorista

```typescript
const nuevoMayorista = {
  tipoCliente: 'Mayorista' as const,
  ruc: '20123456789',
  razonSocial: 'Empresa Test',
  nombre: 'Juan',
  apellidos: 'Perez',
  dni: '12345678',
  direccion: 'Lima 123 distrito',
  telefonos: [
    {
      numero: '987654321',
      description: 'Numero de Casa'
    }
  ]
};

try {
  const resultado = await clientesApiService.crearClienteMayorista(nuevoMayorista);
  console.log('Cliente mayorista creado:', resultado.data);
} catch (error) {
  console.error('Error al crear cliente:', error.message);
}
```

### 8. Crear Cliente Minorista

```typescript
const nuevoMinorista = {
  dni: '87654321',
  nombres: 'María',
  apellidos: 'González',
  direccion: 'Av. Principal 456',
  telefonos: [
    {
      numero: '123456789',
      description: 'Celular'
    },
    {
      numero: '987654321',
      description: 'Casa'
    }
  ]
};

try {
  const resultado = await clientesApiService.crearClienteMinorista(nuevoMinorista);
  console.log('Cliente minorista creado:', resultado.data);
} catch (error) {
  console.error('Error al crear cliente:', error.message);
}
```

## Manejo de Errores y Validaciones

El servicio ahora incluye validaciones automáticas:

```typescript
// Ejemplo de validación automática
try {
  const clienteInvalido = {
    dni: '123', // DNI inválido (debe ser 8 dígitos)
    nombres: '', // Nombre vacío
    apellidos: 'Test',
    direccion: 'Test',
    telefonos: [] // Sin teléfonos
  };
  
  await clientesApiService.crearClienteMinorista(clienteInvalido);
} catch (error) {
  // Error: "Datos inválidos: El DNI debe tener 8 dígitos, El nombre es requerido, Debe proporcionar al menos un teléfono"
  console.error(error.message);
}
```

## Componente React de Ejemplo

```tsx
import React, { useState, useEffect } from 'react';
import { clientesApiService, RespuestaClientesAPI, ClienteAPIReal } from '../services/clientes-api.service';

const ClientesList: React.FC = () => {
  const [respuestaClientes, setRespuestaClientes] = useState<RespuestaClientesAPI | null>(null);
  const [paginaActual, setPaginaActual] = useState(1);
  const [terminoBusqueda, setTerminoBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  const cargarClientes = async (pagina: number = 1, termino: string = '') => {
    setCargando(true);
    try {
      const respuesta = termino.trim() 
        ? await clientesApiService.buscarClientes(termino, pagina)
        : await clientesApiService.obtenerClientes(pagina);
      
      setRespuestaClientes(respuesta);
      setPaginaActual(pagina);
    } catch (error) {
      console.error('Error al cargar clientes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarClientes(1, terminoBusqueda);
  }, [terminoBusqueda]);

  const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerminoBusqueda(e.target.value);
  };

  const irAPagina = (pagina: number) => {
    cargarClientes(pagina, terminoBusqueda);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por nombre, DNI o RUC..."
        value={terminoBusqueda}
        onChange={handleBusqueda}
      />
      
      {cargando ? (
        <div>Cargando...</div>
      ) : (
        <>
          <div>
            <h3>Clientes ({respuestaClientes?.meta.total || 0})</h3>
            {respuestaClientes?.data.map((cliente: ClienteAPIReal) => (
              <div key={cliente.idCliente}>
                <h4>{cliente.nombre} {cliente.apellidos}</h4>
                <p>Tipo: {cliente.tipoCliente}</p>
                <p>DNI: {cliente.dni}</p>
                {cliente.ruc && <p>RUC: {cliente.ruc}</p>}
                {cliente.razonSocial && <p>Razón Social: {cliente.razonSocial}</p>}
                <p>Dirección: {cliente.direccion}</p>
                <div>
                  <strong>Teléfonos:</strong>
                  {cliente.telefonos.map((tel, index) => (
                    <span key={index}>
                      {tel.numero} ({tel.description})
                      {index < cliente.telefonos.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Paginación */}
          {respuestaClientes?.meta && respuestaClientes.meta.last_page > 1 && (
            <div>
              <button 
                disabled={!respuestaClientes.links.prev}
                onClick={() => irAPagina(paginaActual - 1)}
              >
                Anterior
              </button>
              
              <span>
                Página {respuestaClientes.meta.current_page} de {respuestaClientes.meta.last_page}
              </span>
              
              <button 
                disabled={!respuestaClientes.links.next}
                onClick={() => irAPagina(paginaActual + 1)}
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ClientesList;
```

## Ventajas de la Nueva Implementación

1. **Paginación Completa**: Maneja automáticamente la paginación de la API
2. **Metadatos Disponibles**: Acceso a información de paginación y totales
3. **Validación Automática**: Valida datos antes de enviarlos a la API
4. **Búsqueda Mejorada**: Métodos de búsqueda y filtrado integrados
5. **Compatibilidad**: Mantiene compatibilidad con código existente
6. **Normalización**: Normaliza datos entre diferentes formatos de campo
7. **Estadísticas**: Métodos para obtener estadísticas rápidas
8. **Manejo de Errores**: Mejor manejo y reporting de errores

Esta implementación está lista para trabajar con los datos reales de tu API y proporciona una base sólida para el frontend.