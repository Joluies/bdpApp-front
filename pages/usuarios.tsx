import type { NextPage } from 'next';
import { UsuariosContent } from '../components/usuarios';
import { useAdminRoute } from '../hooks/useProtectedRoute';

const Usuarios: NextPage = () => {
   useAdminRoute();
   return (
      <UsuariosContent />
   );
};

export default Usuarios;
