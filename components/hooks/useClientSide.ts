import { useEffect, useState } from 'react';

/**
 * Hook para asegurar que el componente se renderiza solo en el cliente
 * Evita problemas de hidratación de Next.js
 */
export const useClientSide = () => {
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      setIsClient(true);
   }, []);

   return isClient;
};