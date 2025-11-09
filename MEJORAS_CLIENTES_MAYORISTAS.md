# Mejoras en Formulario de Clientes Mayoristas

## Problema Identificado
El formulario original de clientes mayoristas no capturaba los datos del representante legal (nombre, apellidos, DNI) que requiere la API, enviando valores genéricos en su lugar.

## Datos API Correctos para Cliente Mayorista
```json
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

## Cambios Realizados

### 1. Actualización de Types (`types/clientes.ts`)
- ✅ Agregado `nombre: string` - Nombre del representante legal
- ✅ Agregado `apellidos: string` - Apellidos del representante legal  
- ✅ Agregado `dni: string` - DNI del representante legal

### 2. Formulario (`components/clientes/add-cliente-mayorista.tsx`)
- ✅ Agregados campos en el estado del formulario
- ✅ Agregadas validaciones para los nuevos campos:
  - Nombre: mínimo 2 caracteres
  - Apellidos: mínimo 2 caracteres
  - DNI: exactamente 8 dígitos
- ✅ Agregada sección "Datos del Representante Legal" en la UI
- ✅ Mejorado manejo de errores con mensajes más específicos

### 3. Servicio API (`services/clientes-api.service.ts`)
- ✅ Actualizada interfaz del método `crearClienteMayorista`
- ✅ Uso de datos reales del representante en lugar de valores genéricos
- ✅ Modo desarrollo activado para pruebas sin conexión a API

## Estructura del Nuevo Formulario

### Datos de la Empresa
- **RUC**: 11 dígitos (requerido)
- **Razón Social**: mínimo 3 caracteres (requerido)

### Datos del Representante Legal
- **Nombre**: mínimo 2 caracteres (requerido)
- **Apellidos**: mínimo 2 caracteres (requerido) 
- **DNI**: exactamente 8 dígitos (requerido)

### Datos de Contacto
- **Dirección**: mínimo 5 caracteres (requerido)
- **Teléfono Principal**: 7-12 dígitos (requerido)
- **Teléfono Secundario**: 7-12 dígitos (opcional)
- **Teléfono Adicional**: 7-12 dígitos (opcional)

## Modo Desarrollo
- `DEV_MODE = true` en `clientes-api.service.ts`
- Simula respuestas exitosas sin conectar a la API real
- Para usar API real: cambiar a `DEV_MODE = false`

## Ejemplo de Datos de Prueba
```
RUC: 20706029597
Razón Social: DrompsDev
Nombre: Scott
Apellidos: Palomino
DNI: 80703969
Dirección: Sector 2 Grupo 16 Manzana G Lote 20
Teléfono: 903089983
```

## Estado del Servidor
- ✅ Servidor funcionando en: http://localhost:3002
- ✅ Compilación exitosa
- ✅ Formularios funcionales con validaciones
- ✅ Manejo de errores mejorado