import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import AdminRoutes from './routes/AdminRoutes';
import { AdminAuthProvider } from './context/AdminAuthContext.jsx';
import './App.css';

function App() {
  return (
    <Router>
      <AdminAuthProvider>
        <div className="min-h-screen bg-gray-50">
          <AdminRoutes />
        </div>
      </AdminAuthProvider>
    </Router>
  );
}

export default App;