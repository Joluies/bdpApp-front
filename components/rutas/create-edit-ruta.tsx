'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import RutaService, { Ruta } from '@/services/RutaService';
import { Button, Input, Loading } from '@nextui-org/react';
import { Loader } from 'lucide-react';

interface CreateEditRutaProps {
  idRuta?: number;
}

export function CreateEditRuta({ idRuta }: CreateEditRutaProps) {
  const router = useRouter();
  const [cargando, setCargando] = useState(!!idRuta);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ruta, setRuta] = useState<Partial<Ruta>>({
    nombre: '',
    descripcion: '',
    estado: 'Activa',
    prioridad: 'Media',
    idVendedor: undefined,
    idDespacho: undefined,
    fecha_programada: undefined,
  });
  const [vendedores, setVendedores] = useState<any[]>([]);
  const [usuariosDespacho, setUsuariosDespacho] = useState<any[]>([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      if (idRuta) {
        const data = await RutaService.obtenerRuta(idRuta);
        setRuta(data);
      }
      // Aquí cargaríamos usuarios para los selects (vendedores y despacho)
      // await cargarUsuarios();
    } catch (err: any) {
      setError(err.message || 'Error al cargar la ruta');
    } finally {
      setCargando(false);
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setRuta((prev) => ({
      ...prev,
      [name]: name === 'idVendedor' || name === 'idDespacho' ? 
        (value ? Number(value) : undefined) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ruta.nombre?.trim()) {
      setError('El nombre de la ruta es requerido');
      return;
    }

    try {
      setGuardando(true);
      setError(null);

      if (idRuta) {
        await RutaService.actualizarRuta(idRuta, ruta);
        alert('Ruta actualizada correctamente');
      } else {
        await RutaService.crearRuta(ruta);
        alert('Ruta creada correctamente');
      }

      router.push('/rutas');
    } catch (err: any) {
      setError(err.message || 'Error al guardar la ruta');
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {idRuta ? 'Editar Ruta' : 'Crear Nueva Ruta'}
      </h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-1">Nombre *</label>
          <Input
            type="text"
            name="nombre"
            value={ruta.nombre || ''}
            onChange={handleChange}
            placeholder="Ej: Ruta Centro Lima"
            required
          />
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea
            name="descripcion"
            value={ruta.descripcion || ''}
            onChange={handleChange}
            placeholder="Detalles adicionales sobre la ruta"
            className="w-full px-3 py-2 border rounded-md"
            rows={4}
          />
        </div>

        {/* Estado */}
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            name="estado"
            value={ruta.estado || 'Activa'}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Activa">Activa</option>
            <option value="Completada">Completada</option>
            <option value="Cancelada">Cancelada</option>
          </select>
        </div>

        {/* Prioridad */}
        <div>
          <label className="block text-sm font-medium mb-1">Prioridad</label>
          <select
            name="prioridad"
            value={ruta.prioridad || 'Media'}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>

        {/* Vendedor */}
        <div>
          <label className="block text-sm font-medium mb-1">Vendedor (Opcional)</label>
          <select
            name="idVendedor"
            value={ruta.idVendedor || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Seleccionar vendedor</option>
            {vendedores.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nombre} {v.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Despacho */}
        <div>
          <label className="block text-sm font-medium mb-1">Despacho (Opcional)</label>
          <select
            name="idDespacho"
            value={ruta.idDespacho || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md"
          >
            <option value="">Sin asignar</option>
            {usuariosDespacho.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre} {u.apellido}
              </option>
            ))}
          </select>
        </div>

        {/* Fecha Programada */}
        <div>
          <label className="block text-sm font-medium mb-1">Fecha Programada</label>
          <Input
            type="datetime-local"
            name="fecha_programada"
            value={ruta.fecha_programada || ''}
            onChange={handleChange}
          />
        </div>

        {/* Botones */}
        <div className="flex gap-2 pt-6">
          <Button type="submit" disabled={guardando}>
            {guardando ? (
              <>
                <Loader className="animate-spin mr-2" size={16} />
                Guardando...
              </>
            ) : idRuta ? (
              'Actualizar Ruta'
            ) : (
              'Crear Ruta'
            )}
          </Button>
          <Button type="button" flat onClick={() => router.push('/rutas')}>
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
