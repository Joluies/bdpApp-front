import type {NextPage} from 'next';
import {Content} from '../components/home/content';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

const Home: NextPage = () => {
   useProtectedRoute();
   return <Content />;
};

export default Home;
