# Implementación de Dropdown para Tipos de Teléfono

## Resumen de Cambios

Se ha implementado un sistema de dropdown para seleccionar el tipo de teléfono en el formulario de agregar cliente mayorista, permitiendo enviar la información con la estructura requerida por la API.

## Cambios Realizados

### 1. Actualización de Tipos (`types/clientes.ts`)

- **Nueva interfaz `TelefonoForm`:**
  ```typescript
  export interface TelefonoForm {
     number: string;
     description: string;
  }
  ```

- **Actualización de `ClienteMayoristaForm`:**
  ```typescript
  export interface ClienteMayoristaForm {
     ruc: string;
     razonSocial: string;
     nombre: string;
     apellidos: string;
     dni: string;
     direccion: string;
     telefonos: TelefonoForm[];  // Cambio principal
  }
  ```

### 2. Componente `add-cliente-mayorista.tsx`

#### Nuevas funcionalidades:
- **Dropdown de tipos de teléfono** con opciones:
  - Número de Casa
  - Número Personal
  - Número de la Oficina

- **Gestión dinámica de teléfonos:**
  - Agregar hasta 3 teléfonos
  - Eliminar teléfonos (mínimo 1)
  - Cada teléfono tiene su número y descripción

#### Estructura de datos de ejemplo:
```javascript
{
  "tipoCliente": "Mayorista",
  "nombre": "Scott",
  "apellidos": "Palomino",
  "ruc": "20706029597",
  "razonSocial": "DrompsDev",
  "dni": "80703969",
  "direccion": "Sector 2 Grupo 16 Manzana G Lote 20",
  "telefonos": [
    {
      "number": "903089983",
      "description": "Número de Casa"
    }
  ]
}
```

#### Nuevas funciones:
- `handleTelefonoChange()`: Maneja cambios en número y descripción
- `addTelefono()`: Agrega un nuevo teléfono (máximo 3)
- `removeTelefono()`: Elimina un teléfono (mínimo 1)

#### Validaciones actualizadas:
- Al menos un teléfono es requerido
- Validación de formato para cada teléfono (7-12 dígitos)
- Gestión de errores específica por teléfono

### 3. Servicio de API (`services/clientes-api.service.ts`)

- **Actualización de `crearClienteMayorista()`:**
  - Acepta el nuevo formato con array de `telefonos`
  - Compatible con la estructura requerida por la API
  - Mantiene compatibilidad con modo desarrollo

## Características del Dropdown

### Opciones disponibles:
1. **Número de Casa** (predeterminado)
2. **Número Personal**
3. **Número de la Oficina**

### Funcionalidad:
- Selección única por teléfono
- Interfaz consistente con el tema de la aplicación
- Fácil cambio entre tipos de teléfono

## Validaciones Implementadas

1. **Número de teléfono:**
   - Formato: 7-12 dígitos
   - Al menos un teléfono requerido

2. **Gestión de errores:**
   - Errores específicos por cada teléfono
   - Limpieza automática de errores al escribir
   - Mensajes descriptivos

## Compatibilidad

- ✅ Mantiene compatibilidad con la API existente
- ✅ Preserva todas las validaciones anteriores
- ✅ Interfaz de usuario consistente
- ✅ Responsive design para mobile y desktop

## Datos de Prueba

Para probar la funcionalidad, puedes usar estos datos de ejemplo:

```
RUC: 20706029597
Razón Social: DrompsDev
Nombre: Scott
Apellidos: Palomino
DNI: 80703969
Dirección: Sector 2 Grupo 16 Manzana G Lote 20
Teléfono: 903089983 - Número de Casa
```

El formulario generará la estructura JSON requerida automáticamente.