import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { RutaDetalle, AgruparClientes } from '@/components/rutas';

export default function DetalleRutaPage() {
  const router = useRouter();
  const { id } = router.query;
  const [activeTab, setActiveTab] = useState('detalle');
  const [refrescando, setRefrescando] = useState(false);

  if (!id) {
    return <div>Cargando...</div>;
  }

  const handleRutasCreadas = () => {
    setRefrescando(true);
    setTimeout(() => setRefrescando(false), 1000);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <button
        onClick={() => router.push('/rutas')}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Volver a Rutas
      </button>

      <div key={refrescando ? 'refresh' : 'normal'}>
        <RutaDetalle idRuta={Number(id)} />
      </div>
    </div>
  );
}
