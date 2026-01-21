import React, { useState, useEffect } from 'react';
import bonificacionesAplicadasApi from '../../services/bonificaciones-aplicadas-api.service';

export const BonificacionesAplicadasContent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [bonificacionesAplicadas, setBonificacionesAplicadas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBonificacion, setSelectedBonificacion] = useState<any>(null);
  const [filters, setFilters] = useState({
    idPedido: '',
    tipo_bonificacion: '',
    aplicada: '',
  });

  useEffect(() => {
    cargarBonificacionesAplicadas();
  }, []);

  const cargarBonificacionesAplicadas = async () => {
    try {
      setLoading(true);
      const response = await bonificacionesAplicadasApi.listarBonificacionesAplicadas();
      setBonificacionesAplicadas(response.data.data || []);
    } catch (error) {
      console.error('Error cargando bonificaciones aplicadas:', error);
    } finally {
      setLoading(false);
    }
  };

  const bonificacionesFiltradas = bonificacionesAplicadas.filter((b) => {
    if (filters.idPedido && !b.idPedido.toString().includes(filters.idPedido)) return false;
    if (filters.tipo_bonificacion && b.tipo_bonificacion !== filters.tipo_bonificacion) return false;
    if (filters.aplicada && ((filters.aplicada === 'si' && !b.aplicada) || (filters.aplicada === 'no' && b.aplicada))) return false;
    return true;
  });

  const getTipoBonificacionLabel = (tipo: string) => {
    const labels: any = {
      cantidad: 'Por Cantidad',
      producto: 'Por Producto',
      precio: 'Por Precio',
      periodo: 'Por Período',
    };
    return labels[tipo] || tipo;
  };

  const totalAmount = bonificacionesFiltradas.reduce((sum, b) => sum + (b.monto || 0), 0);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">📋 Bonificaciones Aplicadas</h1>
        <p className="text-blue-100 text-sm">Historial completo de bonificaciones aplicadas a los pedidos</p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md border-l-4 border-blue-500 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Total Registros</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{bonificacionesFiltradas.length}</p>
            </div>
            <div className="text-4xl text-blue-500">📊</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border-l-4 border-green-500 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Aplicadas</p>
              <p className="text-3xl font-bold text-green-600 mt-1">
                {bonificacionesFiltradas.filter((b) => b.aplicada).length}
              </p>
            </div>
            <div className="text-4xl text-green-500">✓</div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md border-l-4 border-purple-500 p-6 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Monto Total (S/)</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">S/ {totalAmount.toFixed(2)}</p>
            </div>
            <div className="text-4xl text-purple-500">💵</div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
        <h3 className="font-bold text-lg text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-blue-600">🔍</span> Filtros de Búsqueda
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">ID Pedido</label>
            <input
              type="text"
              placeholder="Filtrar por pedido"
              value={filters.idPedido}
              onChange={(e) => setFilters({ ...filters, idPedido: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Tipo de Bonificación</label>
            <select
              value={filters.tipo_bonificacion}
              onChange={(e) => setFilters({ ...filters, tipo_bonificacion: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
            >
              <option value="">Todos</option>
              <option value="cantidad">Por Cantidad</option>
              <option value="producto">Por Producto</option>
              <option value="precio">Por Precio</option>
              <option value="periodo">Por Período</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-gray-700">Estado</label>
            <select
              value={filters.aplicada}
              onChange={(e) => setFilters({ ...filters, aplicada: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
            >
              <option value="">Todos</option>
              <option value="si">Aplicadas</option>
              <option value="no">No Aplicadas</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
              <tr>
                <th className="text-left px-6 py-4 font-semibold text-sm">ID PEDIDO</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">TIPO</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">CANTIDAD COMPRADA</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">CANTIDAD BONIFICADA</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">MONTO (S/)</th>
                <th className="text-left px-6 py-4 font-semibold text-sm">ESTADO</th>
                <th className="text-center px-6 py-4 font-semibold text-sm">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-gray-500">
                    <div className="flex justify-center items-center gap-2">
                      <span className="animate-spin">⏳</span> Cargando bonificaciones...
                    </div>
                  </td>
                </tr>
              ) : bonificacionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12">
                    <div className="flex flex-col items-center gap-2">
                      <span className="text-4xl">📭</span>
                      <p className="text-gray-500 font-medium">No hay bonificaciones aplicadas</p>
                    </div>
                  </td>
                </tr>
              ) : (
                bonificacionesFiltradas.map((bonif, index) => (
                  <tr key={bonif.idBonificacionAplicada} className={`border-b border-gray-200 hover:bg-blue-50 transition ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                    <td className="px-6 py-4 font-semibold text-gray-900">#{bonif.idPedido}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                        {getTipoBonificacionLabel(bonif.tipo_bonificacion)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{bonif.cantidad_comprada}</td>
                    <td className="px-6 py-4 text-gray-900 font-medium">{bonif.cantidad_bonificada}</td>
                    <td className="px-6 py-4 font-bold text-purple-600">S/ {bonif.monto?.toFixed(2) || '0.00'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${bonif.aplicada ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {bonif.aplicada ? '✓ Aplicada' : '⏳ Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedBonificacion(bonif);
                          setIsOpen(true);
                        }}
                        className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
                      >
                        👁️ Ver
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Ver Detalles */}
      {isOpen && selectedBonificacion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full max-h-screen overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 text-white">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>📋</span> Detalles de Bonificación
              </h2>
            </div>
            <div className="p-6 space-y-5">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium">ID Pedido</p>
                <p className="font-bold text-gray-900 text-lg mt-1">#{selectedBonificacion.idPedido}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium">Tipo de Bonificación</p>
                <p className="font-bold text-gray-900 text-lg mt-1">
                  {getTipoBonificacionLabel(selectedBonificacion.tipo_bonificacion)}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Cantidad Comprada</p>
                  <p className="font-bold text-gray-900 text-lg mt-1">{selectedBonificacion.cantidad_comprada}</p>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600 font-medium">Cantidad Bonificada</p>
                  <p className="font-bold text-gray-900 text-lg mt-1">{selectedBonificacion.cantidad_bonificada}</p>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium">Monto (S/)</p>
                <p className="font-bold text-orange-600 text-2xl mt-1">S/ {selectedBonificacion.monto?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium mb-2">Estado</p>
                <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold ${selectedBonificacion.aplicada ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  {selectedBonificacion.aplicada ? '✓ Aplicada' : '⏳ Pendiente'}
                </span>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-sm text-gray-600 font-medium">Fecha de Registro</p>
                <p className="font-bold text-gray-900 mt-1">
                  {new Date(selectedBonificacion.created_at).toLocaleDateString('es-PE', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-semibold"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
