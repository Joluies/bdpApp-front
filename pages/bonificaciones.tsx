import type { NextPage } from 'next';
import { BonificacionesContent } from '../components/bonificaciones/content';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

const Bonificaciones: NextPage = () => {
   useProtectedRoute();
   return <BonificacionesContent />;
};

export default Bonificaciones;
