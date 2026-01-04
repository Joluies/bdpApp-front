import type { NextPage } from 'next';
import { PedidosContent } from '../components/pedidos';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

const Pedidos: NextPage = () => {
   useProtectedRoute();
   return <PedidosContent />;
};

export default Pedidos;