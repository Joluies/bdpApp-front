import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AgruparClientes } from '@/components/rutas';
import { Input, Button } from '@nextui-org/react';

export default function AgruparClientesPage() {
  const router = useRouter();
  const [idVendedor, setIdVendedor] = useState<number | null>(null);
  const [vendedores, setVendedores] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    cargarVendedores();
  }, []);

  const cargarVendedores = async () => {
    try {
      // Aquí deberías cargar los usuarios con rol de vendedor
      // por ahora usaremos un servicio genérico
      setCargando(false);
    } catch (err) {
      console.error('Error al cargar vendedores:', err);
      setCargando(false);
    }
  };

  if (cargando) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="container mx-auto py-8 px-4">
        <button
          onClick={() => router.push('/rutas')}
          className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
        >
          ← Volver a Rutas
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Agrupar Clientes por Ubicación</h1>
          <p className="text-gray-600 mt-2">
            Agrupa automáticamente tus clientes según su proximidad geográfica y crea rutas optimizadas
          </p>
        </div>

        {idVendedor ? (
          <AgruparClientes
            idVendedor={idVendedor}
            onRutasCreadas={() => {
              alert('Rutas creadas exitosamente');
              router.push('/rutas');
            }}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg border">
            <h2 className="text-xl font-bold mb-4">Seleccionar Vendedor</h2>
            <p className="text-gray-600 mb-4">
              Selecciona el vendedor para el cual deseas agrupar los clientes
            </p>
            
            <div className="max-w-xs">
              <label className="block text-sm font-medium mb-2">Vendedor</label>
              <select
                value={idVendedor || ''}
                onChange={(e) => setIdVendedor(Number(e.target.value))}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Seleccionar vendedor</option>
                {vendedores.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.nombre} {v.apellido}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-2">
                Nota: Asegúrate que los clientes tengan coordenadas registradas
              </p>
            </div>
          </div>
        )}
      </div>
    );
  }
