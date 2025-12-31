# 🔄 Implementación API Customers Mejorada

## ✅ Lo que ya se hizo

1. **Cambio de endpoints** de `/api/client` a `/api/customers`
   - Archivo: `config/api.config.ts`
   
2. **Nuevos métodos en el servicio**:
   - `crearClienteConFotosYCoordenadas(formData)` - Crea clientes con fotos y ubicación
   - `actualizarClienteConFotosYCoordenadas(id, formData)` - Actualiza clientes con fotos
   - `obtenerClientesPorTipo(tipo)` - Obtiene clientes filtrados por tipo

3. **Modal de edición actualizado** en `clientes-table.tsx`
   - Ahora usa `FormData` para enviar datos
   - Compatible con archivos

---

## 🎨 Pasos para mejorar el formulario de creación

### 1. **Actualizar `add-cliente-mayorista.tsx`**

Reemplaza la función `handleSubmit`:

```typescript
const handleSubmit = async () => {
   console.log('📝 Enviando formulario mayorista...');
   
   // Validaciones
   if (!formData.ruc || formData.ruc.length !== 11) {
      setApiError('RUC debe tener 11 dígitos');
      return;
   }
   // ... otras validaciones ...

   setLoading(true);
   setApiError('');

   try {
      // Crear FormData
      const formDataToSend = new FormData();
      
      // Datos básicos
      formDataToSend.append('tipoCliente', 'Mayorista');
      formDataToSend.append('nombre', formData.nombre);
      formDataToSend.append('apellidos', formData.apellidos);
      formDataToSend.append('ruc', formData.ruc);
      formDataToSend.append('razonSocial', formData.razonSocial);
      formDataToSend.append('dni', formData.dni);
      formDataToSend.append('direccion', formData.direccion);
      
      // Teléfonos
      const telefonosValidos = formData.telefonos.filter(tel => tel.number.trim());
      telefonosValidos.forEach((tel, index) => {
         formDataToSend.append(`telefonos[${index}][number]`, tel.number);
         formDataToSend.append(`telefonos[${index}][description]`, tel.description);
      });
      
      // TODO: Agregar fotos si existe input file
      // const fotoInput = document.getElementById('fotoFachada') as HTMLInputElement;
      // if (fotoInput?.files?.length) {
      //    formDataToSend.append('fotosFachada', fotoInput.files[0]);
      // }
      
      // TODO: Agregar coordenadas de Google Maps
      // if (coordenadas) {
      //    formDataToSend.append('coordenadas[latitud]', coordenadas.lat);
      //    formDataToSend.append('coordenadas[longitud]', coordenadas.lng);
      // }
      
      const response = await clientesApiService.crearClienteConFotosYCoordenadas(formDataToSend);
      
      if (response.success) {
         setFormData({...initialFormData});
         onSuccess?.();
         onClose();
      }
   } catch (error: any) {
      setApiError(error.message);
   } finally {
      setLoading(false);
   }
};
```

### 2. **Agregar campos de foto y ubicación**

En el JSX del formulario, agregar después de dirección:

```tsx
{/* Foto de Fachada */}
<Flex direction="column" css={{ gap: '$1' }}>
   <Text size={14} weight="bold">Foto de Fachada</Text>
   <Input
      id="fotoFachada"
      type="file"
      accept="image/*"
      onChange={(e) => {
         const file = e.target.files?.[0];
         if (file) console.log('Foto seleccionada:', file.name);
      }}
   />
</Flex>

{/* Ubicación Google Maps */}
<Flex direction="column" css={{ gap: '$1' }}>
   <Text size={14} weight="bold">Ubicación</Text>
   <Button
      auto
      flat
      onPress={() => {
         // Abrir modal con Google Maps
         console.log('Abrir selector de ubicación');
      }}
   >
      📍 Seleccionar ubicación en mapa
   </Button>
</Flex>
```

### 3. **Hacer lo mismo con `add-cliente-minorista.tsx`**

Los pasos son idénticos, solo cambiar `tipoCliente` a `'Minorista'` y adaptar los campos específicos.

---

## 📡 Estructura FormData esperada por API

```
POST /api/customers

FormData:
├── tipoCliente: "Mayorista"
├── nombre: "Juan"
├── apellidos: "Pérez"
├── ruc: "20123456789"
├── razonSocial: "Mi Empresa"
├── dni: "12345678"
├── direccion: "Av. Principal 123"
├── telefonos[0][number]: "987654321"
├── telefonos[0][description]: "Casa"
├── telefonos[1][number]: "998765432"
├── telefonos[1][description]: "Oficina"
├── fotosFachada: <File> (opcional, máximo 3)
├── coordenadas[latitud]: -12.0462
└── coordenadas[longitud]: -77.0372
```

---

## 🔑 Endpoints API disponibles

```
GET    /api/customers           # Listar con paginación
GET    /api/customers?tipo=Mayorista  # Filtrar por tipo
GET    /api/customers/{id}      # Ver un cliente
POST   /api/customers           # Crear cliente
PUT    /api/customers/{id}      # Actualizar cliente
DELETE /api/customers/{id}      # Eliminar cliente
```

---

## ⚠️ Importante

- El backend en `CustomerController.php` ya soporta:
  - ✅ Subida de fotos (máximo 3 por cliente)
  - ✅ Coordenadas de Google Maps
  - ✅ Validación completa de datos
  
- El frontend necesita:
  - 🔲 Input de archivo para fotos
  - 🔲 Integración con Google Maps API
  - 🔲 Pasar coordenadas en FormData

---

## 🧪 Probar la API

En la consola del navegador:
```javascript
// Crear cliente
const formData = new FormData();
formData.append('tipoCliente', 'Mayorista');
// ... agregar otros campos ...

await clientesApiService.crearClienteConFotosYCoordenadas(formData);

// Obtener clientes
await clientesApiService.obtenerClientesPorTipo('Mayorista');
```
