import type { NextPage } from 'next';
import { VentasContent } from '../components/ventas';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

const Ventas: NextPage = () => {
   useProtectedRoute();
   return <VentasContent />;
};

export default Ventas;