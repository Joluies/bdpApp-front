import React from 'react';
import { useRouter } from 'next/router';
import { RutasList } from '@/components/rutas';
import { useAuth } from '@/context/auth.context';
import { Text } from '@nextui-org/react';
import { Flex } from '@/components/styles/flex';

export default function RutasPage() {
  const router = useRouter();
  const { usuario, cargando } = useAuth();

  // Proteger acceso solo para admin
  const esAdmin = usuario?.roles?.[0]?.nombre === 'admin';
  if (!cargando && !esAdmin) {
    return (
      <Flex direction="column" justify="center" align="center" css={{ minHeight: '400px', gap: '$8' }}>
        <Text h3 color="error">
          Acceso denegado
        </Text>
        <Text>
          Solo los administradores pueden gestionar rutas
        </Text>
      </Flex>
    );
  }

  if (cargando) {
    return (
      <Flex justify="center" align="center" css={{ minHeight: '400px' }}>
        <Text>Cargando...</Text>
      </Flex>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900">Gestión de Rutas de Despacho</h1>
        <p className="text-gray-600 mt-2">
          Crea y administra rutas de despacho agrupando clientes por proximidad geográfica
        </p>
      </div>

      <RutasList />
    </div>
  );
}
