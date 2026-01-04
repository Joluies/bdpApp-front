'use client';

import { useState } from 'react';
import RutaService, { RutaCluster } from '@/services/RutaService';
import { Button, Input, Loading } from '@nextui-org/react';
import { Loader, MapPin } from 'lucide-react';

interface AgruparClientesProps {
  idVendedor: number;
  onRutasCreadas?: () => void;
}

export function AgruparClientes({ idVendedor, onRutasCreadas }: AgruparClientesProps) {
  const [radioKm, setRadioKm] = useState(2);
  const [maxClientesRuta, setMaxClientesRuta] = useState(10);
  const [crearRutas, setCrearRutas] = useState(true);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clusters, setClusters] = useState<RutaCluster[] | null>(null);
  const [rutasCreadas, setRutasCreadas] = useState(0);

  const handleAgrupar = async () => {
    try {
      setCargando(true);
      setError(null);
      setClusters(null);

      const resultado = await RutaService.agruparClientes({
        idVendedor,
        radio_km: radioKm,
        max_clientes_ruta: maxClientesRuta,
        crear_rutas: crearRutas,
      });

      setClusters(resultado.clusters);
      setRutasCreadas(resultado.rutas_creadas.length);

      if (crearRutas && onRutasCreadas) {
        onRutasCreadas();
      }
    } catch (err: any) {
      setError(err.message || 'Error al agrupar clientes');
      console.error('Error:', err);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg border space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Agrupar Clientes por Ubicación</h2>
        <p className="text-gray-600">
          Agrupa automáticamente tus clientes por proximidad geográfica para crear rutas optimizadas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Radio */}
        <div>
          <label className="block text-sm font-medium mb-2">Radio de Agrupamiento (km)</label>
          <Input
            type="number"
            value={radioKm}
            onChange={(e) => setRadioKm(Number(e.target.value))}
            min="0.1"
            max="50"
            step="0.5"
            disabled={cargando}
          />
          <p className="text-xs text-gray-500 mt-1">
            Clientes dentro de {radioKm}km serán agrupados juntos
          </p>
        </div>

        {/* Máx Clientes por Ruta */}
        <div>
          <label className="block text-sm font-medium mb-2">Máx Clientes por Ruta</label>
          <Input
            type="number"
            value={maxClientesRuta}
            onChange={(e) => setMaxClientesRuta(Number(e.target.value))}
            min="1"
            max="100"
            disabled={cargando}
          />
          <p className="text-xs text-gray-500 mt-1">
            Máximo de {maxClientesRuta} clientes por grupo
          </p>
        </div>

        {/* Crear Rutas */}
        <div className="flex items-end">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={crearRutas}
              onChange={(e) => setCrearRutas(e.target.checked)}
              disabled={cargando}
              className="w-4 h-4"
            />
            <span className="text-sm font-medium">Crear rutas automáticamente</span>
          </label>
        </div>
      </div>

      {/* Botón de Agrupamiento */}
      <Button
        onClick={handleAgrupar}
        disabled={cargando}
        size="lg"
        className="w-full"
      >
        {cargando ? (
          <>
            <Loader className="animate-spin mr-2" size={18} />
            Agrupando clientes...
          </>
        ) : (
          <>
            <MapPin size={18} className="mr-2" />
            Agrupar Clientes
          </>
        )}
      </Button>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Resultados */}
      {clusters && clusters.length > 0 && (
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded">
            <p className="font-semibold text-green-800">
              ✓ Agrupamiento completado exitosamente
            </p>
            <p className="text-sm text-green-700 mt-1">
              Se encontraron {clusters.length} cluster(s) de clientes
              {crearRutas && ` y se crearon ${rutasCreadas} ruta(s) automáticamente`}
            </p>
          </div>

          {/* Detalle de Clusters */}
          <div className="space-y-3">
            <h3 className="font-bold text-lg">Clusters Generados:</h3>
            {clusters.map((cluster, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 bg-blue-50 border-blue-200"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">
                      Centro: {cluster.centro.lat.toFixed(4)}, {cluster.centro.lng.toFixed(4)}
                    </p>
                    <p className="text-sm text-gray-700 mt-1">
                      {cluster.clientes.length} cliente(s) en este grupo:
                    </p>
                    <ul className="mt-2 space-y-1">
                      {cluster.clientes.map((cliente) => (
                        <li key={cliente.idCliente} className="text-sm text-gray-600">
                          • {cliente.nombre} {cliente.apellidos} - {cliente.direccion}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
