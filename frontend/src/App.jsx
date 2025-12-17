import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

const App = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 mt-8 md:mt-10">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;