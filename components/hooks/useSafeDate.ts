import { useClientSide } from './useClientSide';

/**
 * Hook para formatear fechas de manera segura, evitando problemas de hidratación
 */
export const useSafeDate = () => {
   const isClient = useClientSide();

   const formatDate = (dateString: string, options?: Intl.DateTimeFormatOptions) => {
      if (!isClient) return '';
      
      try {
         const date = new Date(dateString);
         return date.toLocaleDateString('es-PE', options);
      } catch (error) {
         return '';
      }
   };

   const formatCurrency = (amount: number) => {
      if (!isClient) return 'S/ 0.00';
      
      try {
         return new Intl.NumberFormat('es-PE', {
            style: 'currency',
            currency: 'PEN',
         }).format(amount);
      } catch (error) {
         return 'S/ 0.00';
      }
   };

   return {
      isClient,
      formatDate,
      formatCurrency
   };
};