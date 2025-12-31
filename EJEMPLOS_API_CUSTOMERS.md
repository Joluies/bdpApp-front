# 📚 Guía de Uso: API de Customers

## 🚀 Crear Cliente (Mayorista)

### Forma Básica (sin fotos ni coordenadas):
```typescript
const crearMayorista = async () => {
   const formData = new FormData();
   
   // Datos del cliente
   formData.append('tipoCliente', 'Mayorista');
   formData.append('nombre', 'Juan');
   formData.append('apellidos', 'Pérez García');
   formData.append('ruc', '20123456789');
   formData.append('razonSocial', 'Distribuidora ABC S.A.C.');
   formData.append('dni', '12345678');
   formData.append('direccion', 'Av. Grau 1234, Lima, Perú');
   
   // Teléfonos
   formData.append('telefonos[0][number]', '987654321');
   formData.append('telefonos[0][description]', 'Número de Casa');
   
   formData.append('telefonos[1][number]', '998765432');
   formData.append('telefonos[1][description]', 'Número Personal');
   
   try {
      const response = await clientesApiService.crearClienteConFotosYCoordenadas(formData);
      console.log('✅ Cliente creado:', response);
   } catch (error) {
      console.error('❌ Error:', error);
   }
};
```

---

## 📸 Crear Cliente con Foto de Fachada

```typescript
const crearConFoto = async (fotoFile: File) => {
   const formData = new FormData();
   
   // Datos del cliente
   formData.append('tipoCliente', 'Mayorista');
   formData.append('nombre', 'Juan');
   formData.append('apellidos', 'Pérez García');
   formData.append('ruc', '20123456789');
   formData.append('razonSocial', 'Distribuidora ABC');
   formData.append('dni', '12345678');
   formData.append('direccion', 'Av. Grau 1234, Lima');
   
   // Teléfonos
   formData.append('telefonos[0][number]', '987654321');
   formData.append('telefonos[0][description]', 'Casa');
   
   // Fotos (máximo 3)
   formData.append('fotosFachada', fotoFile);
   
   const response = await clientesApiService.crearClienteConFotosYCoordenadas(formData);
   return response;
};

// Usar con input file:
const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
   const file = e.target.files?.[0];
   if (file) {
      await crearConFoto(file);
   }
};

// En JSX:
// <input type="file" accept="image/*" onChange={handleFileChange} />
```

---

## 📍 Crear Cliente con Coordenadas (Google Maps)

```typescript
const crearConCoordenadas = async (lat: number, lng: number) => {
   const formData = new FormData();
   
   // Datos del cliente
   formData.append('tipoCliente', 'Mayorista');
   formData.append('nombre', 'Juan');
   formData.append('apellidos', 'Pérez García');
   formData.append('ruc', '20123456789');
   formData.append('razonSocial', 'Distribuidora ABC');
   formData.append('dni', '12345678');
   formData.append('direccion', 'Av. Grau 1234, Lima');
   
   // Teléfonos
   formData.append('telefonos[0][number]', '987654321');
   formData.append('telefonos[0][description]', 'Casa');
   
   // Coordenadas de Google Maps
   formData.append('coordenadas[latitud]', lat.toString());
   formData.append('coordenadas[longitud]', lng.toString());
   
   const response = await clientesApiService.crearClienteConFotosYCoordenadas(formData);
   return response;
};

// Usar con Google Maps:
const handleMapClick = (lat: number, lng: number) => {
   crearConCoordenadas(lat, lng);
};
```

---

## 📸 + 📍 Crear Cliente con FOTO y COORDENADAS

```typescript
const crearClienteCompleto = async (
   fotoFile: File,
   lat: number,
   lng: number
) => {
   const formData = new FormData();
   
   // Datos del cliente
   formData.append('tipoCliente', 'Mayorista');
   formData.append('nombre', 'Juan');
   formData.append('apellidos', 'Pérez García');
   formData.append('ruc', '20123456789');
   formData.append('razonSocial', 'Distribuidora ABC');
   formData.append('dni', '12345678');
   formData.append('direccion', 'Av. Grau 1234, Lima');
   
   // Teléfonos (puedes agregar múltiples)
   formData.append('telefonos[0][number]', '987654321');
   formData.append('telefonos[0][description]', 'Casa');
   
   formData.append('telefonos[1][number]', '998765432');
   formData.append('telefonos[1][description]', 'Oficina');
   
   // Foto de fachada
   formData.append('fotosFachada', fotoFile);
   
   // Coordenadas GPS
   formData.append('coordenadas[latitud]', lat.toString());
   formData.append('coordenadas[longitud]', lng.toString());
   
   const response = await clientesApiService.crearClienteConFotosYCoordenadas(formData);
   return response;
};
```

---

## ✏️ Actualizar Cliente

### Actualizar solo datos:
```typescript
const actualizarCliente = async (idCliente: number) => {
   const formData = new FormData();
   
   formData.append('nombre', 'Juan Carlos');
   formData.append('apellidos', 'Pérez García');
   formData.append('direccion', 'Av. Nueva 456, Lima');
   
   const response = await clientesApiService.actualizarClienteConFotosYCoordenadas(
      idCliente.toString(),
      formData
   );
   return response;
};
```

### Actualizar con nuevas fotos:
```typescript
const actualizarConFotos = async (
   idCliente: number,
   nuevosFotoFiles: File[]
) => {
   const formData = new FormData();
   
   formData.append('nombre', 'Juan Carlos');
   formData.append('apellidos', 'Pérez García');
   
   // Agregar nuevas fotos
   nuevosFotoFiles.forEach(file => {
      formData.append('fotosFachada', file);
   });
   
   // Opcionalmente, eliminar fotos anteriores
   // formData.append('fotosEliminar[0]', '123'); // ID de foto a eliminar
   
   const response = await clientesApiService.actualizarClienteConFotosYCoordenadas(
      idCliente.toString(),
      formData
   );
   return response;
};
```

### Actualizar coordenadas:
```typescript
const actualizarUbicacion = async (
   idCliente: number,
   newLat: number,
   newLng: number
) => {
   const formData = new FormData();
   
   formData.append('coordenadas[latitud]', newLat.toString());
   formData.append('coordenadas[longitud]', newLng.toString());
   
   const response = await clientesApiService.actualizarClienteConFotosYCoordenadas(
      idCliente.toString(),
      formData
   );
   return response;
};
```

---

## 📋 Obtener Clientes

### Listar solo mayoristas:
```typescript
const obtenerMayoristas = async () => {
   try {
      const clientes = await clientesApiService.obtenerClientesPorTipo('Mayorista');
      console.log('Mayoristas:', clientes);
      return clientes;
   } catch (error) {
      console.error('Error:', error);
   }
};
```

### Listar solo minoristas:
```typescript
const obtenerMinoristas = async () => {
   const clientes = await clientesApiService.obtenerClientesPorTipo('Minorista');
   return clientes;
};
```

### Obtener un cliente específico:
```typescript
const obtenerCliente = async (idCliente: number) => {
   const cliente = await clientesApiService.makeRequest(
      `/customers/${idCliente}`,
      'GET'
   );
   return cliente;
};
```

---

## 🗑️ Eliminar Cliente

```typescript
const eliminarCliente = async (idCliente: number) => {
   try {
      const response = await clientesApiService.makeRequest(
         `/customers/${idCliente}`,
         'DELETE'
      );
      console.log('✅ Cliente eliminado');
      return response;
   } catch (error) {
      console.error('❌ Error:', error);
   }
};
```

---

## 🔍 Formato de FormData para Teléfonos

```typescript
// Para un teléfono:
formData.append('telefonos[0][number]', '987654321');
formData.append('telefonos[0][description]', 'Casa');

// Para dos teléfonos:
formData.append('telefonos[0][number]', '987654321');
formData.append('telefonos[0][description]', 'Casa');

formData.append('telefonos[1][number]', '998765432');
formData.append('telefonos[1][description]', 'Oficina');

// Para tres teléfonos:
formData.append('telefonos[0][number]', '987654321');
formData.append('telefonos[0][description]', 'Casa');

formData.append('telefonos[1][number]', '998765432');
formData.append('telefonos[1][description]', 'Oficina');

formData.append('telefonos[2][number]', '912345678');
formData.append('telefonos[2][description]', 'Personal');
```

---

## 🛡️ Validaciones del Backend

El backend valida automáticamente:

✅ **DNI:** Exactamente 8 dígitos (Perú)
✅ **RUC:** Exactamente 11 dígitos (Perú)
✅ **Teléfono:** Formato peruano válido
✅ **Dirección:** Mínimo 10 caracteres
✅ **Nombre:** Mínimo 2 caracteres
✅ **Fotos:** Máximo 3 imágenes de 2MB cada una
✅ **Coordenadas:** Latitud (-90 a 90), Longitud (-180 a 180)

---

## 💡 Consejos

1. **Siempre validar localmente** antes de enviar
2. **Usar FormData** para enviar datos complejos (archivos, arrays)
3. **Manejar errores** correctamente para UX better
4. **Mostrar spinner** mientras carga
5. **Validar campos** en tiempo real en los inputs
6. **Usar índices secuenciales** para teléfonos: [0], [1], [2]
7. **Máximo 3 fotos** por cliente
8. **Máximo 3 teléfonos** por cliente

---

## 🧪 Ejemplo Completo en un Componente

```typescript
const [formData, setFormData] = useState({
   tipoCliente: 'Mayorista',
   nombre: '',
   apellidos: '',
   ruc: '',
   razonSocial: '',
   dni: '',
   direccion: '',
   telefonos: [{ number: '', description: 'Casa' }],
   foto: null as File | null,
   lat: null as number | null,
   lng: null as number | null,
});

const [loading, setLoading] = useState(false);

const handleSubmit = async () => {
   setLoading(true);
   try {
      const fd = new FormData();
      
      // Datos
      fd.append('tipoCliente', formData.tipoCliente);
      fd.append('nombre', formData.nombre);
      // ... más campos ...
      
      // Teléfonos
      formData.telefonos.forEach((tel, i) => {
         fd.append(`telefonos[${i}][number]`, tel.number);
         fd.append(`telefonos[${i}][description]`, tel.description);
      });
      
      // Foto
      if (formData.foto) {
         fd.append('fotosFachada', formData.foto);
      }
      
      // Coordenadas
      if (formData.lat && formData.lng) {
         fd.append('coordenadas[latitud]', formData.lat.toString());
         fd.append('coordenadas[longitud]', formData.lng.toString());
      }
      
      const response = await clientesApiService
         .crearClienteConFotosYCoordenadas(fd);
      
      if (response.success) {
         alert('Cliente creado exitosamente');
         // Limpiar formulario o navegar
      }
   } catch (error: any) {
      alert(`Error: ${error.message}`);
   } finally {
      setLoading(false);
   }
};

return (
   <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
      {/* Inputs del formulario */}
      <button type="submit" disabled={loading}>
         {loading ? 'Guardando...' : 'Guardar'}
      </button>
   </form>
);
```

