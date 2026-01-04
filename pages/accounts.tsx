import React from 'react';
import {Accounts} from '../components/accounts';
import { useProtectedRoute } from '../hooks/useProtectedRoute';

const accounts = () => {
   useProtectedRoute();
   return <Accounts />;
};

export default accounts;
