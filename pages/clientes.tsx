import type { NextPage } from 'next';
import { ClientesContent } from '../components/clientes';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

const Clientes: NextPage = () => {
   useProtectedRoute();
   return (
      <ClientesContent />
   );
};

export default Clientes;