'use client';

import { useEffect, useState } from 'react';
import RutaService, { Ruta, ClienteRuta } from '@/services/RutaService';
import { Button, Input, Loading } from '@nextui-org/react';
import { Loader, Map, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { clientesApiService } from '@/services/clientes-api.service';

interface RutaDetalleProp {
  idRuta: number;
}

export function RutaDetalle({ idRuta }: RutaDetalleProp) {
  const [ruta, setRuta] = useState<Ruta | null>(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [clientesDisponibles, setClientesDisponibles] = useState<any[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<number | ''>('');
  const [tiempoEstimado, setTiempoEstimado] = useState<number>(0);
  const [agregando, setAgregando] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [rutaData, clientesData] = await Promise.all([
        RutaService.obtenerRuta(idRuta),
        clientesApiService.obtenerClientesPorTipo('Mayorista').then(mayoristas => ({ 
          data: mayoristas 
        })).catch(() => ({ 
          data: [] 
        })),
      ]);

      setRuta(rutaData);
      
      // Filtrar clientes que no estén en la ruta
      const clientesEnRuta = rutaData.clientes?.map((c: any) => c.idCliente) || [];
      const clientesFiltrados = clientesData.data.filter(
        (c: any) => !clientesEnRuta.includes(c.idCliente)
      );
      setClientesDisponibles(clientesFiltrados);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarCliente = async () => {
    if (!clienteSeleccionado) {
      alert('Seleccione un cliente');
      return;
    }

    try {
      setAgregando(true);
      await RutaService.agregarClienteARuta(
        idRuta,
        Number(clienteSeleccionado),
        undefined,
        tiempoEstimado || undefined
      );

      setClienteSeleccionado('');
      setTiempoEstimado(0);
      cargarDatos();
      alert('Cliente agregado correctamente');
    } catch (err: any) {
      alert('Error: ' + (err.message || 'No se pudo agregar el cliente'));
    } finally {
      setAgregando(false);
    }
  };

  const handleRemoverCliente = async (idCliente: number) => {
    if (!confirm('¿Está seguro de que desea remover este cliente?')) {
      return;
    }

    try {
      await RutaService.removerClienteDERuta(idRuta, idCliente);
      cargarDatos();
      alert('Cliente removido correctamente');
    } catch (err: any) {
      alert('Error: ' + (err.message || 'No se pudo remover el cliente'));
    }
  };

  const handleOptimizarOrden = async () => {
    if (!ruta?.clientes || ruta.clientes.length < 2) {
      alert('Se necesitan al menos 2 clientes para optimizar la ruta');
      return;
    }

    try {
      setCargando(true);
      await RutaService.optimizarOrdenRuta(idRuta);
      cargarDatos();
      alert('Orden optimizado correctamente');
    } catch (err: any) {
      alert('Error: ' + (err.message || 'No se pudo optimizar la ruta'));
    }
  };

  if (cargando) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="animate-spin text-blue-500" size={32} />
      </div>
    );
  }

  if (!ruta) {
    return <div className="text-red-600">Ruta no encontrada</div>;
  }

  return (
    <div className="space-y-6">
      {/* Encabezado */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{ruta.nombre}</h1>
            <p className="text-gray-600 mt-1">{ruta.descripcion}</p>
          </div>
          <div className="text-right">
            <span className={`px-3 py-1 rounded-full text-white text-sm font-semibold ${
              ruta.estado === 'Activa' ? 'bg-green-500' :
              ruta.estado === 'Completada' ? 'bg-blue-500' :
              'bg-red-500'
            }`}>
              {ruta.estado}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <div>
            <p className="text-gray-600 text-sm">Vendedor</p>
            <p className="font-semibold">
              {ruta.vendedor ? `${ruta.vendedor.nombre} ${ruta.vendedor.apellido}` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Despacho</p>
            <p className="font-semibold">
              {ruta.despacho ? `${ruta.despacho.nombre} ${ruta.despacho.apellido}` : 'Sin asignar'}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total Clientes</p>
            <p className="font-semibold text-2xl">{ruta.total_clientes}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Prioridad</p>
            <p className={`font-semibold ${
              ruta.prioridad === 'Alta' ? 'text-red-600' :
              ruta.prioridad === 'Media' ? 'text-yellow-600' :
              'text-green-600'
            }`}>
              {ruta.prioridad}
            </p>
          </div>
        </div>
      </div>

      {/* Sección: Agregar Cliente */}
      {ruta.estado === 'Activa' && (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-xl font-bold mb-4">Agregar Cliente a la Ruta</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Cliente</label>
              <select
                value={clienteSeleccionado}
                onChange={(e) => setClienteSeleccionado(e.target.value as any)}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Seleccionar cliente</option>
                {clientesDisponibles.map((cliente) => (
                  <option key={cliente.idCliente} value={cliente.idCliente}>
                    {cliente.nombre} {cliente.apellidos}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Tiempo Estimado (min)</label>
              <Input
                type="number"
                value={tiempoEstimado}
                onChange={(e) => setTiempoEstimado(Number(e.target.value))}
                min="0"
                placeholder="0"
              />
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleAgregarCliente}
                disabled={agregando || !clienteSeleccionado}
                className="w-full"
              >
                {agregando ? <Loader className="animate-spin mr-2" size={16} /> : null}
                Agregar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Sección: Clientes en la Ruta */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Clientes en la Ruta</h2>
          {ruta.clientes && ruta.clientes.length > 1 && (
            <Button
              flat
              size="sm"
              onClick={handleOptimizarOrden}
            >
              <Map size={16} className="mr-2" />
              Optimizar Orden
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {!ruta.clientes || ruta.clientes.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            No hay clientes en esta ruta
          </p>
        ) : (
          <div className="space-y-2">
            {ruta.clientes.map((cliente, index) => (
              <div
                key={cliente.idCliente}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <p className="font-semibold">
                        {cliente.nombre} {cliente.apellidos}
                      </p>
                      <p className="text-sm text-gray-600">{cliente.direccion}</p>
                      <p className="text-xs text-gray-500">
                        📍 {cliente.coordenadas?.latitud.toFixed(4)}, {cliente.coordenadas?.longitud.toFixed(4)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-sm font-medium text-gray-600">
                    {cliente.tipoCliente}
                  </p>
                  <p className="text-sm text-gray-500">{cliente.telefono}</p>
                </div>

                {ruta.estado === 'Activa' && (
                  <Button
                    color="error"
                    size="sm"
                    onClick={() => handleRemoverCliente(cliente.idCliente)}
                    className="ml-4"
                  >
                    <Trash2 size={16} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
