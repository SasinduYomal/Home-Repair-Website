import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import ManageUsers from '../pages/ManageUsers';
import ManageServices from '../pages/ManageServices';
import ManageBookings from '../pages/ManageBookings';
import ManageReviews from '../pages/ManageReviews';
import ManageCategory from '../pages/ManageCatagory';
import ManageTechnician from '../pages/ManageTechnician';
import Reports from '../pages/Reports';
import Login from '../pages/Login';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import ProtectedRoute from '../components/ProtectedRoute';
import { CategoryProvider } from '../context/CategoryContext';

const AdminRoutes = () => {
  return (
    <CategoryProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100">
                  <Dashboard />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100">
                  <Dashboard />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100">
                  <ManageUsers />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100">
                  <ManageServices />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/bookings" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100">
                  <ManageBookings />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/reviews" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100">
                  <ManageReviews />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/categories" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100">
                  <ManageCategory />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/technicians" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100">
                  <ManageTechnician />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
        <Route path="/reports" element={
          <ProtectedRoute>
            <div className="flex">
              <Sidebar />
              <div className="flex-1 flex flex-col">
                <Topbar />
                <main className="flex-1 p-6 bg-gray-100">
                  <Reports />
                </main>
              </div>
            </div>
          </ProtectedRoute>
        } />
      </Routes>
    </CategoryProvider>
  );
};

export default AdminRoutes;