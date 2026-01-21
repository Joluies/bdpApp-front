import type { NextPage } from 'next';
import { BonificacionesAplicadasContent } from '../components/bonificaciones/bonificaciones-aplicadas';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

const BonificacionesAplicadas: NextPage = () => {
   useProtectedRoute();
   return <BonificacionesAplicadasContent />;
};

export default BonificacionesAplicadas;
