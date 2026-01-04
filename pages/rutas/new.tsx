import React from 'react';
import { useRouter } from 'next/router';
import { CreateEditRuta } from '@/components/rutas';

export default function NuevaRutaPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 px-4">
      <button
        onClick={() => router.back()}
        className="mb-6 text-blue-600 hover:text-blue-800 flex items-center gap-2"
      >
        ← Volver
      </button>

      <CreateEditRuta />
    </div>
  );
}
