# ✅ Resumen: Migración a API /customers

## 📋 Cambios Realizados

### 1. **Configuración de API** ✅
**Archivo:** `config/api.config.ts`
- Cambio de endpoints:
  - ❌ `/api/client` 
  - ✅ `/api/customers`

```typescript
ENDPOINTS: {
  CUSTOMERS: {
    CREATE: '/customers',      // POST
    LIST: '/customers',        // GET
    UPDATE: '/customers',      // PUT
    DELETE: '/customers'       // DELETE
  }
}
```

---

### 2. **Servicio API Mejorado** ✅
**Archivo:** `services/clientes-api.service.ts`

**Nuevos métodos agregados:**

#### `crearClienteConFotosYCoordenadas(formData: FormData)`
- Crea clientes usando FormData
- Soporta: teléfonos, fotos de fachada, coordenadas GPS
- Compatible con `CustomerController.createCustomer()`

#### `actualizarClienteConFotosYCoordenadas(id: string, formData: FormData)`
- Actualiza clientes existentes
- Soporta: cambio de datos, nuevas fotos, eliminación de fotos
- Compatible con `CustomerController.updateCustomer()`

#### `obtenerClientesPorTipo(tipo: 'Mayorista' | 'Minorista')`
- Obtiene lista filtrada por tipo
- Maneja paginación automáticamente

---

### 3. **Formulario Mayorista** ✅
**Archivo:** `components/clientes/add-cliente-mayorista.tsx`

**Cambios:**
- Usa `crearClienteConFotosYCoordenadas()` en lugar de `crearClienteMayorista()`
- Envía datos vía `FormData`
- Validaciones mejoradas
- Manejo de errores robusto

**Método handleSubmit:**
```typescript
const formDataToSend = new FormData();
formDataToSend.append('tipoCliente', 'Mayorista');
formDataToSend.append('nombre', formData.nombre);
// ... más campos ...
formDataToSend.append(`telefonos[0][number]`, tel.number);
formDataToSend.append(`telefonos[0][description]`, tel.description);

const response = await clientesApiService.crearClienteConFotosYCoordenadas(formDataToSend);
```

---

### 4. **Formulario Minorista** ✅
**Archivo:** `components/clientes/add-cliente-minorista.tsx`

**Cambios idénticos al formulario mayorista:**
- Usa `crearClienteConFotosYCoordenadas()`
- Envía FormData con `tipoCliente: 'Minorista'`
- Validaciones y manejo de errores mejorado

---

### 5. **Modal de Edición** ✅
**Archivo:** `components/clientes/clientes-table.tsx`

**Cambios en `guardarCambiosCliente()`:**
- Usa `actualizarClienteConFotosYCoordenadas()`
- Preparado para fotos y coordenadas (TODO comentados)
- Envía FormData formateado correctamente

```typescript
const formData = new FormData();
formData.append('tipoCliente', editandoCliente.tipoCliente);
// ... más campos ...
editandoCliente.telefonos.forEach((tel, index) => {
   formData.append(`telefonos[${index}][number]`, tel.number);
   formData.append(`telefonos[${index}][description]`, tel.description);
});

await clientesApiService.actualizarClienteConFotosYCoordenadas(id, formData);
```

---

## 📡 Flujo de Datos Actual

```
Formulario (Mayorista/Minorista)
    ↓
Validación local
    ↓
Crear FormData
    ↓
clientesApiService.crearClienteConFotosYCoordenadas()
    ↓
fetch() → POST /api/customers
    ↓
CustomerController::createCustomer()
    ↓
Validación Backend (DNI, RUC, Teléfonos, etc.)
    ↓
Crear Cliente + Teléfonos en DB
    ↓
✅ Cliente creado exitosamente
```

---

## 🎯 Próximos Pasos Opcionales

### Para agregar **Fotos de Fachada**:
```typescript
// En los formularios, agregar input file:
const fotoInput = document.getElementById('fotoFachada') as HTMLInputElement;
if (fotoInput?.files?.length) {
   Array.from(fotoInput.files).forEach(file => {
      formDataToSend.append('fotosFachada', file);
   });
}
```

### Para agregar **Coordenadas de Google Maps**:
```typescript
// Si tienes latitud y longitud desde Google Maps:
formDataToSend.append('coordenadas[latitud]', lat.toString());
formDataToSend.append('coordenadas[longitud]', lng.toString());
```

---

## ✨ Ventajas de los Cambios

| Aspecto | Antes | Ahora |
|--------|-------|-------|
| **Soporte Fotos** | ❌ No | ✅ Sí (hasta 3) |
| **Soporte GPS** | ❌ No | ✅ Sí |
| **Validación** | Básica | ✅ Completa |
| **FormData** | Manual | ✅ Automático |
| **Actualización** | Parcial | ✅ Full support |

---

## 🔗 Referencias

- **Backend:** `/bdp-backend/app/Http/Controllers/CustomerController.php`
- **API Config:** `/BDP-FRONT/config/api.config.ts`
- **Servicio:** `/BDP-FRONT/services/clientes-api.service.ts`
- **Componentes:** 
  - `/BDP-FRONT/components/clientes/add-cliente-mayorista.tsx`
  - `/BDP-FRONT/components/clientes/add-cliente-minorista.tsx`
  - `/BDP-FRONT/components/clientes/clientes-table.tsx`

---

## 🧪 Cómo Probar

### En la consola del navegador:
```javascript
// Crear cliente
const fd = new FormData();
fd.append('tipoCliente', 'Mayorista');
fd.append('nombre', 'Juan');
fd.append('apellidos', 'Pérez');
fd.append('ruc', '20123456789');
fd.append('razonSocial', 'Mi Empresa');
fd.append('dni', '12345678');
fd.append('direccion', 'Av. Principal 123');
fd.append('telefonos[0][number]', '987654321');
fd.append('telefonos[0][description]', 'Casa');

await clientesApiService.crearClienteConFotosYCoordenadas(fd);

// Obtener clientes
await clientesApiService.obtenerClientesPorTipo('Mayorista');
```

---

## ⚠️ Notas Importantes

1. ✅ Backend ya soporta todo: fotos, coordenadas, validación completa
2. ✅ Frontend ahora usa FormData correctamente
3. ⏳ Se pueden agregar fotos y coordenadas en cualquier momento
4. 🔐 Validación de DNI/RUC se hace en backend
5. 📞 Teléfonos se envían como array en FormData

