import React, { useState, useEffect } from 'react';
import {
  Button,
  Input,
  Card,
  Text,
  Textarea,
  Checkbox,
  Loading,
} from '@nextui-org/react';
import { Flex } from '../styles/flex';
import { Box } from '../styles/box';
import bonificacionesApi from '../../services/bonificaciones-api.service';
import { productsApiService as productsApi } from '../../services/products-api.service';

interface EscalaPrecio {
  id: string;
  precio_acordado: number;
  bonificacion: number;
  paquetes: number;
}

interface EscalaCantidad {
  id: string;
  cantidad_minima: number;
  bonificacion: number;
  paquetes: number;
  tipo_unidad?: 'paquetes' | 'botellas'; // Tipo de unidad: paquetes o botellas
}

interface BonificacionFormProps {
  bonificacion?: any;
  isEditMode?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const BonificacionForm: React.FC<BonificacionFormProps> = ({
  bonificacion,
  isEditMode = false,
  onSuccess,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo_bonificacion: 'cantidad',
    idProducto_requerido: '',
    idProducto_bonificacion: '',
    productosRequeridos: [] as number[], // Múltiples productos a comprar
    productosRequeridosCantidad: [] as number[], // Múltiples productos para "Por Cantidad"
    productoGratis: '' as string | number, // Un solo producto gratis
    cantidad_minima: null as number | null,
    unidad_minima: 'unidades', // Unidad para cantidad mínima
    precio_minimo: null as number | null,
    cantidad_bonificacion: '',
    unidad: 'unidades',
    fecha_inicio: '',
    fecha_fin: '',
    activo: true,
    // Campos para Por Precio
    precio_base: null as number | null,
    escalas_precio: [] as EscalaPrecio[],
    // Campos para Por Cantidad
    escalas_cantidad: [] as EscalaCantidad[],
  });

  const [productos, setProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const [mostrarProductosCheckbox, setMostrarProductosCheckbox] = useState(false);
  const [precioAcordadoTemp, setPrecioAcordadoTemp] = useState<number | null>(null);
  const [cantidadPaquetesTemp, setCantidadPaquetesTemp] = useState<number | null>(500);

  useEffect(() => {
    cargarProductos();
    if (isEditMode && bonificacion) {
      setFormData({
        nombre: bonificacion.nombre || '',
        descripcion: bonificacion.descripcion || '',
        tipo_bonificacion: bonificacion.tipo_bonificacion || 'cantidad',
        idProducto_requerido: bonificacion.idProducto_requerido || '',
        idProducto_bonificacion: bonificacion.idProducto_bonificacion || '',
        productosRequeridos: bonificacion.productosRequeridos || [],
        productosRequeridosCantidad: bonificacion.productosRequeridos || [], // Para edición modo cantidad
        productoGratis: bonificacion.productoGratis || '',
        cantidad_minima: bonificacion.cantidad_minima || null,
        unidad_minima: bonificacion.unidad_minima || 'unidades',
        precio_minimo: bonificacion.precio_minimo || null,
        cantidad_bonificacion: bonificacion.cantidad_bonificacion?.toString() || '',
        unidad: bonificacion.unidad || 'unidades',
        fecha_inicio: bonificacion.fecha_inicio?.split('T')[0] || '',
        fecha_fin: bonificacion.fecha_fin?.split('T')[0] || '',
        activo: bonificacion.activo || true,
        precio_base: bonificacion.precio_base || null,
        escalas_precio: bonificacion.escalas_precio || [],
        escalas_cantidad: bonificacion.escalas_cantidad || [],
      });
    }
  }, []);

  useEffect(() => {
    console.log('👀 Estado de productos actualizado:', { cantidad: productos.length, productos });
  }, [productos]);

  // Sincronizar precio_minimo con precioAcordadoTemp en la calculadora
  useEffect(() => {
    if (formData.tipo_bonificacion === 'precio' && formData.precio_minimo !== null) {
      setPrecioAcordadoTemp(formData.precio_minimo);
    }
  }, [formData.precio_minimo, formData.tipo_bonificacion]);

  const cargarProductos = async () => {
    try {
      setLoading(true);
      console.log('📦 Iniciando carga de productos...');
      const response = await productsApi.getProducts();
      console.log('📦 Respuesta de productos:', response);
      
      // Asegurar que extrae el array de productos
      let productosArray: any[] = [];
      const respData = response as any;
      
      if (Array.isArray(respData)) {
        productosArray = respData;
      } else if (respData && respData.products && Array.isArray(respData.products)) {
        productosArray = respData.products;
      } else if (respData && respData.data && Array.isArray(respData.data)) {
        productosArray = respData.data;
      }
      
      console.log('📦 Productos extraídos:', { cantidad: productosArray.length, primero: productosArray[0] });
      console.log('📦 Productos a establecer:', productosArray);
      
      setProductos(productosArray);
    } catch (error) {
      console.error('❌ Error cargando productos:', error);
      setProductos([]);
    } finally {
      setLoading(false);
    }
  };

  // Manejar selección/deselección de productos requeridos
  const handleProductoRequeridoToggle = (idProducto: number) => {
    setFormData((prev) => {
      const nuevosProductos = prev.productosRequeridos.includes(idProducto)
        ? prev.productosRequeridos.filter((id) => id !== idProducto)
        : [...prev.productosRequeridos, idProducto];
      return { ...prev, productosRequeridos: nuevosProductos };
    });
  };

  // Manejar selección/deselección de productos para "Por Cantidad"
  const handleProductoCantidadToggle = (idProducto: number) => {
    setFormData((prev) => {
      const nuevosProductos = prev.productosRequeridosCantidad.includes(idProducto)
        ? prev.productosRequeridosCantidad.filter((id) => id !== idProducto)
        : [...prev.productosRequeridosCantidad, idProducto];
      return { ...prev, productosRequeridosCantidad: nuevosProductos };
    });
  };

  // Funciones para manejar escalas de precio
  const agregarEscalaPrecio = () => {
    const nuevaEscala: EscalaPrecio = {
      id: Date.now().toString(),
      precio_acordado: 0,
      bonificacion: 0,
      paquetes: 0,
    };
    setFormData((prev) => ({
      ...prev,
      escalas_precio: [...prev.escalas_precio, nuevaEscala],
    }));
  };

  const eliminarEscalaPrecio = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      escalas_precio: prev.escalas_precio.filter((e) => e.id !== id),
    }));
  };

  const actualizarEscalaPrecio = (id: string, campo: keyof EscalaPrecio, valor: any) => {
    setFormData((prev) => ({
      ...prev,
      escalas_precio: prev.escalas_precio.map((e) =>
        e.id === id ? { ...e, [campo]: campo === 'precio_acordado' ? parseFloat(valor) || 0 : parseInt(valor) || 0 } : e
      ),
    }));
  };

  // Funciones para manejar escalas de cantidad
  const agregarEscalaCantidad = () => {
    const nuevaEscala: EscalaCantidad = {
      id: Date.now().toString(),
      cantidad_minima: 0,
      bonificacion: 0,
      paquetes: 0,
      tipo_unidad: 'paquetes', // Por defecto "paquetes"
    };
    setFormData((prev) => ({
      ...prev,
      escalas_cantidad: [...prev.escalas_cantidad, nuevaEscala],
    }));
  };

  const eliminarEscalaCantidad = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      escalas_cantidad: prev.escalas_cantidad.filter((e) => e.id !== id),
    }));
  };

  const actualizarEscalaCantidad = (id: string, campo: keyof EscalaCantidad, valor: any) => {
    setFormData((prev) => ({
      ...prev,
      escalas_cantidad: prev.escalas_cantidad.map((e) =>
        e.id === id ? { ...e, [campo]: campo === 'tipo_unidad' ? valor : parseInt(valor) || 0 } : e
      ),
    }));
  };

  const validarFormulario = () => {
    const newErrors: any = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }

    // Validar según el tipo de bonificación
    if (formData.tipo_bonificacion === 'producto') {
      // Para "Por Producto": validar productos requeridos y producto gratis
      if (formData.productosRequeridos.length === 0) {
        newErrors.productosRequeridos = 'Debe seleccionar al menos un producto requerido';
      }
      if (!formData.productoGratis) {
        newErrors.productoGratis = 'Debe seleccionar un producto a llevar gratis';
      }
    } else if (formData.tipo_bonificacion === 'cantidad') {
      // Para "Por Cantidad": validar selección múltiple de productos
      if (formData.productosRequeridosCantidad.length === 0) {
        newErrors.idProducto_requerido = 'Debe seleccionar al menos un producto';
      }
      if (!formData.idProducto_bonificacion) {
        newErrors.idProducto_bonificacion = 'Debe seleccionar el producto a bonificar';
      }
      // Validar que haya al menos una escala con cantidad_minima válida
      if (formData.escalas_cantidad.length === 0 || !formData.escalas_cantidad.some((e) => e.cantidad_minima > 0)) {
        newErrors.escalas_cantidad = 'Debe agregar al menos una escala de bonificación con cantidad mínima mayor a 0';
      }
    } else {
      // Para otros tipos: validar producto requerido
      if (!formData.idProducto_requerido) {
        newErrors.idProducto_requerido = 'Debe seleccionar un producto requerido';
      }
    }

    if (formData.tipo_bonificacion === 'cantidad' || formData.tipo_bonificacion === 'periodo' || formData.tipo_bonificacion === 'producto') {
      if (!formData.cantidad_bonificacion) {
        newErrors.cantidad_bonificacion = 'La cantidad a bonificar es requerida';
      }
    }

    if (!formData.fecha_inicio) {
      newErrors.fecha_inicio = 'La fecha de inicio es requerida';
    }
    if (!formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin es requerida';
    }
    if (formData.fecha_inicio && formData.fecha_fin && formData.fecha_inicio > formData.fecha_fin) {
      newErrors.fecha_fin = 'La fecha de fin debe ser posterior a la fecha de inicio';
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    console.log('🔵 CLIC EN GUARDAR - Iniciando handleSubmit');
    e.preventDefault();
    
    console.log('📋 Estado del formulario actual:', formData);
    console.log('📋 Tipo de bonificación:', formData.tipo_bonificacion);
    console.log('📋 Productos "Por Cantidad":', formData.productosRequeridosCantidad);
    
    const newErrors = validarFormulario();
    console.log('✔️ Errores de validación:', newErrors);

    // Validar específicamente para "Por Producto"
    if (formData.tipo_bonificacion === 'producto' && formData.productosRequeridos.length === 0) {
      console.log('❌ Error: No hay productos requeridos para "Por Producto"');
      setErrors({ ...newErrors, submit: 'Selecciona al menos un producto requerido a comprar' });
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      console.log('❌ Validación fallida - retornando con errores:', newErrors);
      setErrors(newErrors);
      return;
    }

    console.log('✅ Validación exitosa - procediendo a guardar');
    setSubmitting(true);

    try {
      // Convertir fechas al formato Y-m-d H:i:s que espera el backend
      const formatearFecha = (fechaString: string, tipo: 'inicio' | 'fin') => {
        if (!fechaString) return '';
        // Si el valor viene como YYYY-MM-DD (input date), tratar como fecha sin hora
        if (/^\d{4}-\d{2}-\d{2}$/.test(fechaString)) {
          if (tipo === 'inicio') return `${fechaString} 00:00:00`;
          return `${fechaString} 23:59:59`;
        }
        const fecha = new Date(fechaString);
        const año = fecha.getFullYear();
        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const día = String(fecha.getDate()).padStart(2, '0');
        const hora = String(fecha.getHours()).padStart(2, '0');
        const minuto = String(fecha.getMinutes()).padStart(2, '0');
        const segundo = String(fecha.getSeconds()).padStart(2, '0');
        return `${año}-${mes}-${día} ${hora}:${minuto}:${segundo}`;
      };

      const datosEnvio: any = {
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        tipo_bonificacion: formData.tipo_bonificacion as any,
        fecha_inicio: formatearFecha(formData.fecha_inicio, 'inicio'),
        fecha_fin: formatearFecha(formData.fecha_fin, 'fin'),
        activo: formData.activo,
      };

      // Agregar campos según el tipo de bonificación
      if (formData.tipo_bonificacion === 'producto') {
        // Para "Por Producto": guardar todos los productos requeridos
        datosEnvio.idProducto_requerido = formData.productosRequeridos[0]; // Principal
        datosEnvio.productosRequeridos = formData.productosRequeridos; // Todos
        datosEnvio.idProducto_bonificacion = parseInt(formData.productoGratis.toString());
        datosEnvio.cantidad_bonificacion = parseInt(formData.cantidad_bonificacion);
        datosEnvio.unidad = formData.unidad;
        if (formData.cantidad_minima !== null && formData.cantidad_minima !== undefined) {
          datosEnvio.cantidad_minima = formData.cantidad_minima;
          datosEnvio.unidad_minima = formData.unidad_minima;
        }
      } else if (formData.tipo_bonificacion === 'cantidad') {
        // Para "Por Cantidad": guardar múltiples productos requeridos y producto a bonificar
        // NO enviamos idProducto_requerido porque causa conflicto con validación backend
        datosEnvio.productosRequeridos = formData.productosRequeridosCantidad; // Todos los seleccionados
        datosEnvio.idProducto_bonificacion = parseInt(formData.idProducto_bonificacion); // Producto específico a bonificar
        // Enviar las escalas de cantidad
        datosEnvio.escalas_cantidad = formData.escalas_cantidad.map((escala) => ({
          cantidad_minima: escala.cantidad_minima,
          bonificacion: escala.bonificacion,
          paquetes: escala.paquetes,
          tipo_unidad: escala.tipo_unidad || 'paquetes',
        }));
      } else {
        // Para otros tipos (precio, periodo)
        datosEnvio.idProducto_requerido = parseInt(formData.idProducto_requerido);
        datosEnvio.idProducto_bonificacion = parseInt(formData.idProducto_bonificacion);
        
        // Para "precio", enviamos campos específicos requeridos
        if (formData.tipo_bonificacion === 'precio') {
          datosEnvio.precio_minimo = formData.precio_minimo;
          datosEnvio.cantidad_bonificacion = parseInt(formData.cantidad_bonificacion) || 0;
        }
      }

      // Omitir campos opcionales si son null/undefined para evitar que Laravel los considere "presentes" y falle la validación
      if (formData.cantidad_minima !== null && formData.cantidad_minima !== undefined) {
        datosEnvio.cantidad_minima = formData.cantidad_minima;
      }
      // Solo agregar precio_minimo si no es "precio" (ya lo agregamos arriba para ese tipo)
      if (formData.tipo_bonificacion !== 'precio' && formData.precio_minimo !== null && formData.precio_minimo !== undefined) {
        datosEnvio.precio_minimo = formData.precio_minimo;
      }

      // cantidad_bonificacion: solo para otros tipos (para "precio" ya está arriba)
      if (formData.tipo_bonificacion !== 'precio' && formData.cantidad_bonificacion) {
        datosEnvio.cantidad_bonificacion = parseInt(formData.cantidad_bonificacion);
      }

      console.log('📤 Datos a enviar:', JSON.stringify(datosEnvio, null, 2));
      console.log('📦 Escalas en el estado:', JSON.stringify(formData.escalas_cantidad, null, 2));
      console.log('� Escalas EN DATOS ENVIO:', JSON.stringify(datosEnvio.escalas_cantidad, null, 2));
      console.log('�📋 Tipo de bonificación:', formData.tipo_bonificacion);

      try {
        if (isEditMode) {
          console.log('🔄 Actualizando bonificación...');
          const response = await bonificacionesApi.actualizarBonificacion(bonificacion.idBonificacion, datosEnvio);
          console.log('✅ Respuesta actualización:', response);
          alert('Bonificación actualizada exitosamente');
        } else {
          console.log('➕ Creando bonificación nueva...');
          const response = await bonificacionesApi.crearBonificacion(datosEnvio);
          console.log('✅ Respuesta creación:', response);
          alert('Bonificación creada exitosamente');
        }

        if (onSuccess) {
          console.log('📞 Ejecutando callback onSuccess');
          onSuccess();
        }
      } catch (apiError) {
        console.error('❌ Error específico de API:', apiError);
        throw apiError;
      }
    } catch (error: any) {
      console.error('❌ Error COMPLETO al guardar:', error);
      console.error('❌ Error.response:', error?.response);
      console.error('❌ Error.message:', error?.message);
      console.error('❌ Error.stack:', error?.stack);
      
      // Extraer errores de validación del backend si existen
      const serverData = error?.response?.data;
      console.error('Error al guardar bonificación - respuesta servidor:', serverData || error);

      if (serverData) {
        // Laravel suele devolver { message, errors }
        if (serverData.errors) {
          // Mapear errores del servidor al estado local
          const mapped: any = {};
          Object.keys(serverData.errors).forEach((key) => {
            mapped[key] = serverData.errors[key].join(' ');
          });
          // También poner un mensaje general si existe
          if (serverData.message) mapped.submit = serverData.message;
          setErrors(mapped);
          console.error('❌ Errores mapeados:', mapped);
        } else if (serverData.message) {
          setErrors({ submit: serverData.message });
          console.error('❌ Error del servidor:', serverData.message);
        } else {
          setErrors({ submit: JSON.stringify(serverData) });
          console.error('❌ Respuesta del servidor:', serverData);
        }
      } else {
        const errorMsg = error?.message || 'Error al guardar la bonificación';
        setErrors({ submit: errorMsg });
        console.error('❌ Error sin respuesta del servidor:', errorMsg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" css={{ minHeight: '300px' }}>
        <Loading type="points" color="success" size="lg" />
      </Flex>
    );
  }

  console.log('🎨 Renderizando formulario con productos:', { cantidad: productos.length, productos });

  return (
    <form onSubmit={handleSubmit} style={{ width: '100%' }}>
      <Box css={{ gap: '$6', display: 'flex', flexDirection: 'column' }}>
        {/* Nombre */}
        <Box>
          <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
            Nombre
          </Text>
          <Input
            type="text"
            placeholder="Ej: Bonificación por cantidad"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            disabled={submitting}
            status={errors.nombre ? 'error' : 'default'}
            helperText={errors.nombre}
            fullWidth
          />
        </Box>

        {/* Descripción */}
        <Box>
          <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
            Descripción
          </Text>
          <Textarea
            placeholder="Descripción de la bonificación"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            disabled={submitting}
            status={errors.descripcion ? 'error' : 'default'}
            helperText={errors.descripcion}
            fullWidth
            rows={3}
          />
        </Box>

        {/* Tipo de Bonificación */}
        <Box>
          <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
            Tipo de Bonificación
          </Text>
          <select
            value={formData.tipo_bonificacion}
            onChange={(e) => {
              console.log('🔄 Cambiando tipo de bonificación a:', e.target.value);
              setFormData({ ...formData, tipo_bonificacion: e.target.value });
            }}
            disabled={submitting}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '8px',
              border: '1px solid #E5E7EB',
              fontSize: '16px',
              fontFamily: 'inherit',
              backgroundColor: 'white',
            }}
          >
            <option value="cantidad">Por Cantidad (Escalas por volumen)</option>
            <option value="producto">Por Producto (Compra X lleva Y gratis)</option>
            <option value="precio">Por Precio (Descuento en precio)</option>
            <option value="periodo">Por Período (Promoción de tiempo)</option>
          </select>
          {errors.tipo_bonificacion && (
            <Text size="$xs" color="error" css={{ mt: '$2' }}>
              {errors.tipo_bonificacion}
            </Text>
          )}
        </Box>

        {/* SECCIÓN: POR CANTIDAD (Escalas por volumen) */}
        {formData.tipo_bonificacion === 'cantidad' && (
          <>
            {/* Productos Requeridos - MÚLTIPLE SELECT */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Productos Requeridos (Compra estos - pueden ser variantes del mismo)
              </Text>
              {productos.length === 0 && (
                <Card css={{ bgColor: '$yellow50', p: '$3', mb: '$2' }}>
                  <Text size="$xs" color="#92400E">
                    ⚠️ No se encontraron productos. Verifica la conexión a la API.
                  </Text>
                </Card>
              )}
              
              {/* Checkboxes para múltiple selección */}
              <Box
                css={{
                  border: errors.idProducto_requerido ? '1px solid #F31260' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  p: '$4',
                  bgColor: errors.idProducto_requerido ? '#FEF2F2' : '#F9FAFB',
                  maxHeight: '350px',
                  overflowY: 'auto',
                }}
              >
                {productos && Array.isArray(productos) && productos.length > 0 ? (
                  <Box css={{ display: 'flex', flexDirection: 'column', gap: '$2' }}>
                    {productos.map((producto) => (
                      <Box
                        key={producto.idProducto}
                        css={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '$2',
                          p: '$2',
                          bgColor: formData.productosRequeridosCantidad.includes(producto.idProducto)
                            ? '#E0F2FE'
                            : 'transparent',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgColor: '#F3F4F6',
                          },
                        }}
                        onClick={() => handleProductoCantidadToggle(producto.idProducto)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.productosRequeridosCantidad.includes(producto.idProducto)}
                          onChange={() => handleProductoCantidadToggle(producto.idProducto)}
                          disabled={submitting}
                          aria-label={`Seleccionar ${producto.nombre}`}
                          style={{
                            cursor: 'pointer',
                            width: '18px',
                            height: '18px',
                          }}
                        />
                        <Text size="$sm" color="#1F2937">
                          {producto.nombre}
                          {producto.presentacion && (
                            <Text as="span" size="$xs" color="#6B7280" css={{ ml: '$2' }}>
                              ({producto.presentacion})
                            </Text>
                          )}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Text size="$xs" color="#6B7280">
                    No hay productos disponibles
                  </Text>
                )}

                {/* Resumen de productos seleccionados */}
                {formData.productosRequeridosCantidad.length > 0 && (
                  <Box css={{ mt: '$3', pt: '$3', borderTop: '1px solid #E5E7EB' }}>
                    <Text weight="bold" size="$xs" color="#034F32" css={{ mb: '$2' }}>
                      Seleccionados ({formData.productosRequeridosCantidad.length}):
                    </Text>
                    <Box css={{ display: 'flex', flexWrap: 'wrap', gap: '$2' }}>
                      {formData.productosRequeridosCantidad.map((idProducto) => {
                        const producto = productos.find((p) => p.idProducto === idProducto);
                        return (
                          <Box
                            key={idProducto}
                            css={{
                              bgColor: '#034F32',
                              color: 'white',
                              px: '$2',
                              py: '$1',
                              borderRadius: '4px',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '$1',
                            }}
                          >
                            {producto?.nombre}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductoCantidadToggle(idProducto);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '16px',
                              }}
                            >
                              ✕
                            </button>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>

              {errors.idProducto_requerido && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.idProducto_requerido}
                </Text>
              )}
            </Box>

            {/* Cantidad a Bonificar */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Cantidad a Bonificar
              </Text>
              <Input
                type="number"
                label="Cantidad de productos a bonificar"
                placeholder="Ej: 1 (llevan 1 gratis), 2 (llevan 2 gratis)"
                value={formData.cantidad_bonificacion}
                onChange={(e) => setFormData({ ...formData, cantidad_bonificacion: e.target.value })}
                disabled={submitting}
                status={errors.cantidad_bonificacion ? 'error' : 'default'}
                helperText={errors.cantidad_bonificacion}
                fullWidth
                min="1"
              />
            </Box>

            {/* Producto a Bonificar */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Producto a Bonificar (Sabor/Marca específica)
              </Text>
              <select
                value={formData.idProducto_bonificacion}
                onChange={(e) => setFormData({ ...formData, idProducto_bonificacion: e.target.value })}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: errors.idProducto_bonificacion ? '1px solid #F31260' : '1px solid #E5E7EB',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                  backgroundColor: 'white',
                }}
              >
                <option value="">-- Selecciona un producto --</option>
                {productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              {errors.idProducto_bonificacion && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.idProducto_bonificacion}
                </Text>
              )}
            </Box>

            {/* Tabla de Escalas por Cantidad */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Escalas de Bonificación por Cantidad
              </Text>
              <Box
                css={{
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  mb: '$3',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#034F32', color: 'white' }}>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Cantidad Mínima</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Bonificación (S/)</th>
                      <th style={{ padding: '12px', textAlign: 'left' }}>Paquetes</th>
                      <th style={{ padding: '12px', textAlign: 'center', width: '50px' }}>Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.escalas_cantidad.map((escala, index) => (
                      <tr
                        key={escala.id}
                        style={{
                          backgroundColor: index % 2 === 0 ? '#F9FAFB' : 'white',
                          borderBottom: '1px solid #E5E7EB',
                        }}
                      >
                        <td style={{ padding: '12px' }}>
                          <Input
                            type="number"
                            placeholder="Ej: 100"
                            value={escala.cantidad_minima.toString()}
                            onChange={(e) =>
                              actualizarEscalaCantidad(escala.id, 'cantidad_minima', e.target.value)
                            }
                            disabled={submitting}
                            fullWidth
                            size="sm"
                          />
                        </td>
                        <td style={{ padding: '12px' }}>
                          <Input
                            type="number"
                            placeholder="Ej: 500"
                            step="0.01"
                            value={escala.bonificacion.toString()}
                            onChange={(e) =>
                              actualizarEscalaCantidad(escala.id, 'bonificacion', e.target.value)
                            }
                            disabled={submitting}
                            fullWidth
                            size="sm"
                          />
                        </td>
                        <td style={{ padding: '12px' }}>
                          <Box css={{ display: 'flex', gap: '$2', alignItems: 'center' }}>
                            <Input
                              type="number"
                              placeholder="Ej: 46"
                              value={escala.paquetes.toString()}
                              onChange={(e) =>
                                actualizarEscalaCantidad(escala.id, 'paquetes', e.target.value)
                              }
                              disabled={submitting}
                              fullWidth
                              size="sm"
                            />
                            <select
                              value={escala.tipo_unidad || 'paquetes'}
                              onChange={(e) =>
                                actualizarEscalaCantidad(escala.id, 'tipo_unidad', e.target.value)
                              }
                              disabled={submitting}
                              style={{
                                padding: '8px',
                                borderRadius: '6px',
                                border: '1px solid #E5E7EB',
                                fontSize: '14px',
                                minWidth: '120px',
                                backgroundColor: 'white',
                              }}
                            >
                              <option value="paquetes">Paquetes</option>
                              <option value="botellas">Botellas</option>
                            </select>
                          </Box>
                        </td>
                        <td style={{ padding: '12px', textAlign: 'center' }}>
                          <Button
                            auto
                            size="sm"
                            flat
                            color="error"
                            onClick={() => eliminarEscalaCantidad(escala.id)}
                            disabled={submitting}
                          >
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Box>
              <Button
                auto
                flat
                color="success"
                onClick={agregarEscalaCantidad}
                disabled={submitting}
                css={{ mb: '$4' }}
              >
                + Agregar Escala
              </Button>
              {errors.escalas_cantidad && (
                <Box css={{ mt: '$2', p: '$3', bgColor: '#FEF2F2', borderRadius: '6px', border: '1px solid #F31260' }}>
                  <Text size="$xs" color="#991B1B">
                    ⚠️ {errors.escalas_cantidad}
                  </Text>
                </Box>
              )}
            </Box>
          </>
        )}

        {/* SECCIÓN: POR PRECIO (Descuento en precio) */}
        {formData.tipo_bonificacion === 'precio' && (
          <>
            {/* Producto Requerido */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Producto Requerido
              </Text>
              {productos.length === 0 && (
                <Card css={{ bgColor: '$yellow50', p: '$3', mb: '$2' }}>
                  <Text size="$xs" color="#92400E">
                    ⚠️ No se encontraron productos. Verifica la conexión a la API.
                  </Text>
                </Card>
              )}
              <select
                value={formData.idProducto_requerido}
                onChange={(e) => {
                  const idProducto = e.target.value;
                  // Buscar el producto para cargar su precio mayorista
                  const productoSeleccionado = productos.find(
                    (p) => p.idProducto.toString() === idProducto
                  );
                  const precioMayorista = productoSeleccionado?.precio_mayorista || productoSeleccionado?.precioMayorista || 0;
                  
                  setFormData({
                    ...formData,
                    idProducto_requerido: idProducto,
                    precio_base: precioMayorista ? parseFloat(precioMayorista.toString()) : null,
                  });
                }}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: errors.idProducto_requerido ? '1px solid #F31260' : '1px solid #E5E7EB',
                  backgroundColor: errors.idProducto_requerido ? '#FEF2F2' : 'white',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Seleccione el producto ({productos.length} disponibles)</option>
                {productos && Array.isArray(productos) && productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto.toString()}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              {errors.idProducto_requerido && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.idProducto_requerido}
                </Text>
              )}
            </Box>

            {/* Precio Base */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Precio Base (S/)
              </Text>
              <Input
                type="number"
                placeholder="Ej: 10.50"
                step="0.01"
                value={formData.precio_base?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    precio_base: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                disabled={submitting}
                fullWidth
              />
              <Text size="$xs" color="#6B7280" css={{ mt: '$2' }}>
                💡 Se carga automáticamente del precio mayorista del producto. Puedes modificarlo si es necesario.
              </Text>
              <Text size="$xs" color="#034F32" css={{ mt: '$1', fontWeight: 'bold' }}>
                📌 En cada pedido, la bonificación se calcula: (Precio Base - Precio Acordado) × Cantidad ÷ Precio Base (redondeado hacia abajo)
              </Text>
            </Box>

            {/* Precio Mínimo */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Precio Mínimo (S/)
              </Text>
              <Input
                type="number"
                placeholder="Ej: 8.50"
                step="0.01"
                value={formData.precio_minimo?.toString() || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    precio_minimo: e.target.value ? parseFloat(e.target.value) : null,
                  })
                }
                disabled={submitting}
                fullWidth
              />
              <Text size="$xs" color="#6B7280" css={{ mt: '$2' }}>
                💡 Precio mínimo a partir del cual se aplica la bonificación. Si el precio acordado es menor, no aplica el descuento.
              </Text>
              {errors.precio_minimo && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.precio_minimo}
                </Text>
              )}
            </Box>

            {/* Cantidad a Bonificar */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Cantidad a Bonificar (por cada compra)
              </Text>
              <Input
                type="number"
                placeholder="Ej: 1"
                min="1"
                step="1"
                value={formData.cantidad_bonificacion}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    cantidad_bonificacion: e.target.value,
                  })
                }
                disabled={submitting}
                fullWidth
              />
              <Text size="$xs" color="#6B7280" css={{ mt: '$2' }}>
                💡 Cantidad del producto a regalar por cada compra que cumpla la bonificación.
              </Text>
              {errors.cantidad_bonificacion && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.cantidad_bonificacion}
                </Text>
              )}
            </Box>

            {/* Producto a Bonificar */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Producto a Bonificar (Regalo)
              </Text>
              <select
                value={formData.idProducto_bonificacion}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    idProducto_bonificacion: e.target.value,
                  });
                }}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: errors.idProducto_bonificacion ? '1px solid #F31260' : '1px solid #E5E7EB',
                  backgroundColor: errors.idProducto_bonificacion ? '#FEF2F2' : 'white',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Seleccione el producto a regalar ({productos.length} disponibles)</option>
                {productos && Array.isArray(productos) && productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto.toString()}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              {errors.idProducto_bonificacion && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.idProducto_bonificacion}
                </Text>
              )}
            </Box>

            {/* Calculadora de Bonificación por Precio Acordado */}
            <Box css={{ bgColor: '#F0FDF4', p: '$4', borderRadius: '8px', border: '2px solid #034F32' }}>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                🧮 Calculadora de Bonificación
              </Text>
              
              <Flex css={{ gap: '$4', mb: '$3' }}>
                <Box css={{ flex: 1 }}>
                  <Text weight="bold" size="$sm" color="#034F32" css={{ mb: '$2' }}>
                    Precio Acordado (S/)
                  </Text>
                  <Input
                    type="number"
                    placeholder={`Ej: ${formData.precio_base ? (formData.precio_base - 0.5).toFixed(2) : '20.50'}`}
                    step="0.01"
                    value={precioAcordadoTemp?.toString() || ''}
                    disabled={true}
                    fullWidth
                    css={{ bgColor: '#F3F4F6' }}
                  />
                  <Text size="$xs" color="#6B7280" css={{ mt: '$1' }}>
                    Se sincroniza automáticamente con Precio Mínimo
                  </Text>
                </Box>

                <Box css={{ flex: 1 }}>
                  <Text weight="bold" size="$sm" color="#034F32" css={{ mb: '$2' }}>
                    Cantidad (paquetes)
                  </Text>
                  <Input
                    type="number"
                    placeholder="Ej: 500"
                    step="1"
                    value={cantidadPaquetesTemp?.toString() || ''}
                    onChange={(e) => setCantidadPaquetesTemp(e.target.value ? parseInt(e.target.value) : null)}
                    disabled={submitting}
                    fullWidth
                  />
                </Box>
              </Flex>

              {/* Resultado de la Bonificación */}
              {precioAcordadoTemp !== null && formData.precio_base && precioAcordadoTemp > 0 && cantidadPaquetesTemp && cantidadPaquetesTemp > 0 && (
                <Box css={{ bgColor: 'white', p: '$3', borderRadius: '6px', border: '1px solid #034F32' }}>
                  <Text weight="bold" size="$sm" color="#034F32" css={{ mb: '$2' }}>
                    📊 Resultado (para {cantidadPaquetesTemp} paquetes):
                  </Text>
                  
                  {precioAcordadoTemp < formData.precio_base ? (
                    <>
                      <Box css={{ display: 'flex', justifyContent: 'space-between', mb: '$2', pb: '$2', borderBottom: '1px solid #E5E7EB' }}>
                        <Text size="$sm">Diferencia por paquete:</Text>
                        <Text weight="bold" size="$sm" color="#059669">
                          S/ {(formData.precio_base - precioAcordadoTemp).toFixed(2)}
                        </Text>
                      </Box>

                      <Box css={{ display: 'flex', justifyContent: 'space-between', mb: '$2', pb: '$2', borderBottom: '1px solid #E5E7EB' }}>
                        <Text size="$sm">Monto total ahorrado ({cantidadPaquetesTemp} × diferencia):</Text>
                        <Text weight="bold" size="$sm" color="#059669">
                          S/ {((formData.precio_base - precioAcordadoTemp) * cantidadPaquetesTemp).toFixed(2)}
                        </Text>
                      </Box>

                      <Box css={{ display: 'flex', justifyContent: 'space-between', bgColor: '#DBEAFE', p: '$2', borderRadius: '4px', mb: '$3' }}>
                        <Text weight="bold" size="$sm" color="#034F32">
                          Paquetes de Bonificación:
                        </Text>
                        <Text weight="bold" size="$lg" color="#059669">
                          {formData.precio_base && precioAcordadoTemp && cantidadPaquetesTemp ? Math.floor(((formData.precio_base - precioAcordadoTemp) * cantidadPaquetesTemp) / formData.precio_base) : 0} paquetes
                        </Text>
                      </Box>

                      {/* Botón para aplicar resultado a Cantidad a Bonificar */}
                      <Box>
                        <button
                          onClick={() => {
                            if (!formData.precio_base || !precioAcordadoTemp || !cantidadPaquetesTemp) {
                              return;
                            }
                            const resultadoBonificacion = Math.floor(
                              ((formData.precio_base - precioAcordadoTemp) * cantidadPaquetesTemp) / formData.precio_base
                            );
                            setFormData({
                              ...formData,
                              cantidad_bonificacion: resultadoBonificacion.toString(),
                            });
                          }}
                          style={{
                            width: '100%',
                            padding: '10px 16px',
                            backgroundColor: '#059669',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                          }}
                        >
                          ✓ Aplicar {formData.precio_base && precioAcordadoTemp && cantidadPaquetesTemp ? Math.floor(((formData.precio_base - precioAcordadoTemp) * cantidadPaquetesTemp) / formData.precio_base) : 0} paquetes a Cantidad a Bonificar
                        </button>
                      </Box>
                    </>
                  ) : (
                    <Text size="$sm" color="#DC2626">
                      ⚠️ El precio acordado debe ser menor que el precio base para tener bonificación
                    </Text>
                  )}
                </Box>
              )}

              {precioAcordadoTemp === null && (
                <Text size="$xs" color="#6B7280" css={{ fontStyle: 'italic' }}>
                  Ingresa un precio acordado y cantidad de paquetes para ver la bonificación que le corresponde
                </Text>
              )}
            </Box>
          </>
        )}

        {/* SECCIÓN: POR PRODUCTO (Compra X lleva Y gratis) */}
        {formData.tipo_bonificacion === 'producto' && (
          <>
            {/* Productos Requeridos (Compra estos) - MÚLTIPLE SELECT */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Productos Requeridos (Compra estos)
              </Text>
              {productos.length === 0 && (
                <Card css={{ bgColor: '$yellow50', p: '$3', mb: '$2' }}>
                  <Text size="$xs" color="#92400E">
                    ⚠️ No se encontraron productos. Verifica la conexión a la API.
                  </Text>
                </Card>
              )}
              
              {/* Checkboxes para múltiple selección */}
              <Box
                css={{
                  border: errors.productosRequeridos ? '1px solid #F31260' : '1px solid #E5E7EB',
                  borderRadius: '8px',
                  p: '$4',
                  bgColor: errors.productosRequeridos ? '#FEF2F2' : '#F9FAFB',
                  maxHeight: '300px',
                  overflowY: 'auto',
                }}
              >
                {productos && Array.isArray(productos) && productos.length > 0 ? (
                  <Box css={{ display: 'flex', flexDirection: 'column', gap: '$2' }}>
                    {productos.map((producto) => (
                      <Box
                        key={producto.idProducto}
                        css={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '$2',
                          p: '$2',
                          bgColor: formData.productosRequeridos.includes(producto.idProducto)
                            ? '#E0F2FE'
                            : 'transparent',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          '&:hover': {
                            bgColor: '#F3F4F6',
                          },
                        }}
                        onClick={() => handleProductoRequeridoToggle(producto.idProducto)}
                      >
                        <input
                          type="checkbox"
                          checked={formData.productosRequeridos.includes(producto.idProducto)}
                          onChange={() => handleProductoRequeridoToggle(producto.idProducto)}
                          disabled={submitting}
                          aria-label={`Seleccionar ${producto.nombre}`}
                          style={{
                            cursor: 'pointer',
                            width: '18px',
                            height: '18px',
                          }}
                        />
                        <Text size="$sm" color="#1F2937">
                          {producto.nombre}
                        </Text>
                      </Box>
                    ))}
                  </Box>
                ) : (
                  <Text size="$xs" color="#6B7280">
                    No hay productos disponibles
                  </Text>
                )}

                {/* Resumen de productos requeridos seleccionados */}
                {formData.productosRequeridos.length > 0 && (
                  <Box css={{ mt: '$3', pt: '$3', borderTop: '1px solid #E5E7EB' }}>
                    <Text weight="bold" size="$xs" color="#034F32" css={{ mb: '$2' }}>
                      Seleccionados ({formData.productosRequeridos.length}):
                    </Text>
                    <Box css={{ display: 'flex', flexWrap: 'wrap', gap: '$2' }}>
                      {formData.productosRequeridos.map((idProducto) => {
                        const producto = productos.find((p) => p.idProducto === idProducto);
                        return (
                          <Box
                            key={idProducto}
                            css={{
                              bgColor: '#034F32',
                              color: 'white',
                              px: '$2',
                              py: '$1',
                              borderRadius: '4px',
                              fontSize: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '$1',
                            }}
                          >
                            {producto?.nombre}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleProductoRequeridoToggle(idProducto);
                              }}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: 'white',
                                cursor: 'pointer',
                                fontSize: '16px',
                              }}
                            >
                              ✕
                            </button>
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                )}
              </Box>

              {errors.productosRequeridos && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.productosRequeridos}
                </Text>
              )}
            </Box>

            {/* Producto a Llevar Gratis - SINGLE SELECT */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Producto a Llevar Gratis (Lleva esto)
              </Text>
              {productos.length === 0 && (
                <Card css={{ bgColor: '$yellow50', p: '$3', mb: '$2' }}>
                  <Text size="$xs" color="#92400E">
                    ⚠️ No se encontraron productos. Verifica la conexión a la API.
                  </Text>
                </Card>
              )}
              <select
                value={formData.productoGratis}
                onChange={(e) => setFormData({ ...formData, productoGratis: e.target.value })}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: errors.productoGratis ? '1px solid #F31260' : '1px solid #E5E7EB',
                  backgroundColor: errors.productoGratis ? '#FEF2F2' : 'white',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Seleccione el producto a llevar gratis ({productos.length} disponibles)</option>
                {productos && Array.isArray(productos) && productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto.toString()}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              {errors.productoGratis && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.productoGratis}
                </Text>
              )}
            </Box>

            {/* Cantidad Mínima Requerida (opcional) */}
            <Flex css={{ gap: '$4' }}>
              <Box css={{ flex: 2 }}>
                <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                  Cantidad Mínima Requerida (Opcional)
                </Text>
                <Input
                  type="number"
                  placeholder="Ej: 2 (si dejan vacío, no hay mínimo)"
                  min="1"
                  step="1"
                  value={formData.cantidad_minima?.toString() || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cantidad_minima: e.target.value ? parseInt(e.target.value) : null,
                    })
                  }
                  disabled={submitting}
                  fullWidth
                />
              </Box>
              <Box css={{ flex: 1 }}>
                <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                  Unidad
                </Text>
                <select
                  value={formData.unidad_minima}
                  onChange={(e) => setFormData({ ...formData, unidad_minima: e.target.value })}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="unidades">Unidades</option>
                  <option value="botellas">Botellas</option>
                  <option value="paquetes">Paquetes</option>
                  <option value="cajas">Cajas</option>
                </select>
              </Box>
            </Flex>
            <Text size="$xs" color="#6B7280" css={{ mt: '$2' }}>
              💡 Si se especifica, el cliente debe comprar mínimo esta cantidad del producto requerido para obtener el regalo.
            </Text>

            {/* Cantidad a Bonificar y Unidad */}
            <Flex css={{ gap: '$4' }}>
              <Box css={{ flex: 1 }}>
                <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                  Cantidad a Bonificar
                </Text>
                <Input
                  type="number"
                  placeholder="Ej: 1"
                  value={formData.cantidad_bonificacion}
                  onChange={(e) => setFormData({ ...formData, cantidad_bonificacion: e.target.value })}
                  disabled={submitting}
                  status={errors.cantidad_bonificacion ? 'error' : undefined}
                  helperText={errors.cantidad_bonificacion}
                  fullWidth
                />
              </Box>
              <Box css={{ flex: 1 }}>
                <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                  Unidad
                </Text>
                <select
                  value={formData.unidad}
                  onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    backgroundColor: 'white',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                  }}
                >
                  <option value="unidades">Unidades</option>
                  <option value="botellas">Botellas</option>
                  <option value="paquetes">Paquetes</option>
                  <option value="cajas">Cajas</option>
                </select>
              </Box>
            </Flex>
          </>
        )}

        {/* SECCIÓN: POR PERÍODO (Promoción de tiempo) */}
        {formData.tipo_bonificacion === 'periodo' && (
          <>
            {/* Producto Requerido */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Producto Requerido
              </Text>
              {productos.length === 0 && (
                <Card css={{ bgColor: '$yellow50', p: '$3', mb: '$2' }}>
                  <Text size="$xs" color="#92400E">
                    ⚠️ No se encontraron productos. Verifica la conexión a la API.
                  </Text>
                </Card>
              )}
              <select
                value={formData.idProducto_requerido}
                onChange={(e) => setFormData({ ...formData, idProducto_requerido: e.target.value })}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: errors.idProducto_requerido ? '1px solid #F31260' : '1px solid #E5E7EB',
                  backgroundColor: errors.idProducto_requerido ? '#FEF2F2' : 'white',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Seleccione el producto ({productos.length} disponibles)</option>
                {productos && Array.isArray(productos) && productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto.toString()}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              {errors.idProducto_requerido && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.idProducto_requerido}
                </Text>
              )}
            </Box>

            {/* Producto a Bonificar */}
            <Box>
              <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                Producto a Bonificar
              </Text>
              {productos.length === 0 && (
                <Card css={{ bgColor: '$yellow50', p: '$3', mb: '$2' }}>
                  <Text size="$xs" color="#92400E">
                    ⚠️ No se encontraron productos. Verifica la conexión a la API.
                  </Text>
                </Card>
              )}
              <select
                value={formData.idProducto_bonificacion}
                onChange={(e) => setFormData({ ...formData, idProducto_bonificacion: e.target.value })}
                disabled={submitting}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  border: errors.idProducto_bonificacion ? '1px solid #F31260' : '1px solid #E5E7EB',
                  backgroundColor: errors.idProducto_bonificacion ? '#FEF2F2' : 'white',
                  fontSize: '16px',
                  fontFamily: 'inherit',
                }}
              >
                <option value="">Seleccione el producto ({productos.length} disponibles)</option>
                {productos && Array.isArray(productos) && productos.map((producto) => (
                  <option key={producto.idProducto} value={producto.idProducto.toString()}>
                    {producto.nombre}
                  </option>
                ))}
              </select>
              {errors.idProducto_bonificacion && (
                <Text size="$xs" color="error" css={{ mt: '$2' }}>
                  {errors.idProducto_bonificacion}
                </Text>
              )}
            </Box>

            {/* Cantidad a Bonificar y Unidad */}
            <Flex css={{ gap: '$4' }}>
              <Box css={{ flex: 1 }}>
                <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                  Cantidad a Bonificar
                </Text>
                <Input
                  type="number"
                  placeholder="Ej: 1"
                  value={formData.cantidad_bonificacion}
                  onChange={(e) => setFormData({ ...formData, cantidad_bonificacion: e.target.value })}
                  disabled={submitting}
                  status={errors.cantidad_bonificacion ? 'error' : 'default'}
                  helperText={errors.cantidad_bonificacion}
                  fullWidth
                />
              </Box>

              <Box css={{ flex: 1 }}>
                <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
                  Unidad
                </Text>
                <select
                  value={formData.unidad}
                  onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                  disabled={submitting}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid #E5E7EB',
                    fontSize: '16px',
                    fontFamily: 'inherit',
                    backgroundColor: 'white',
                  }}
                >
                  <option value="unidades">Unidades</option>
                  <option value="paquetes">Paquetes</option>
                  <option value="botellas">Botellas</option>
                  <option value="cajas">Cajas</option>
                </select>
              </Box>
            </Flex>
          </>
        )}

        {/* Fechas (Aplicables a todos los tipos) */}
        <Flex css={{ gap: '$4' }}>
          <Box css={{ flex: 1 }}>
            <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
              Fecha Inicio
            </Text>
            <Input
              type="date"
              value={formData.fecha_inicio}
              onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
              disabled={submitting}
              status={errors.fecha_inicio ? 'error' : 'default'}
              helperText={errors.fecha_inicio}
              fullWidth
            />
          </Box>

          <Box css={{ flex: 1 }}>
            <Text weight="bold" size="$lg" color="#034F32" css={{ mb: '$3' }}>
              Fecha Fin
            </Text>
            <Input
              type="date"
              value={formData.fecha_fin}
              onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
              disabled={submitting}
              status={errors.fecha_fin ? 'error' : 'default'}
              helperText={errors.fecha_fin}
              fullWidth
            />
          </Box>
        </Flex>

        {/* Activo */}
        <Card css={{ bgColor: '$green50', borderColor: '$green200', border: '2px solid', p: '$4' }}>
          <Checkbox
            isSelected={formData.activo}
            onChange={(checked) => setFormData({ ...formData, activo: checked })}
            isDisabled={submitting}
            color="success"
            size="lg"
          >
            <Text weight="semibold" color="#034F32">
              ✓ Bonificación Activa
            </Text>
          </Checkbox>
        </Card>

        {/* Error General */}
        {errors.submit && (
          <Card css={{ bgColor: '$red50', borderColor: '$red200', border: '2px solid', p: '$4' }}>
            <Flex align="center" css={{ gap: '$3' }}>
              <Text size="$xl">❌</Text>
              <Text color="error" size="$sm">
                {errors.submit}
              </Text>
            </Flex>
          </Card>
        )}

        {/* Botones */}
        <Flex css={{ gap: '$4', justifyContent: 'flex-end', pt: '$4', borderTop: '1px solid #E5E7EB' }}>
          <Button
            auto
            flat
            color="default"
            onClick={onCancel}
            disabled={submitting}
          >
            Cancelar
          </Button>
          <Button
            auto
            flat
            color="success"
            type="submit"
            disabled={submitting}
            css={{ minWidth: '150px' }}
          >
            {submitting ? '⏳ Guardando...' : isEditMode ? '✓ Actualizar Bonificación' : '✓ Crear Bonificación'}
          </Button>
        </Flex>
      </Box>
    </form>
  );
};
