import type {NextPage} from 'next';
import {ProductsContent} from '../components/products/content';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

const Products: NextPage = () => {
   useProtectedRoute();
   return <ProductsContent />;
};

export default Products;