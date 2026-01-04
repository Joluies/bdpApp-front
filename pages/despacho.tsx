import type { NextPage } from 'next';
import { DespachoContent } from '../components/despacho';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

const Despacho: NextPage = () => {
   useProtectedRoute();
   return (
      <DespachoContent />
   );
};

export default Despacho;