import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: '📊' },
    { name: 'Users', path: '/users', icon: '👥' },
    { name: 'Services', path: '/services', icon: '🛠️' },
    { name: 'Bookings', path: '/bookings', icon: '📅' },
    { name: 'Reviews', path: '/reviews', icon: '⭐' },
    { name: 'Categories', path: '/categories', icon: '📂' },
    { name: 'Technicians', path: '/technicians', icon: '👨‍🔧' },
    { name: 'Reports', path: '/reports', icon: '📈' },
  ];

  return (
    <div className="w-64 bg-blue-800 text-white min-h-screen">
      <div className="p-4 border-b border-blue-700">
        <h1 className="text-xl font-bold">Admin Panel</h1>
        <p className="text-blue-200 text-sm">HomeRepair Management</p>
      </div>
      <nav className="mt-4">
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-900 text-white border-l-4 border-blue-400'
                    : 'text-blue-100 hover:bg-blue-700'
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;