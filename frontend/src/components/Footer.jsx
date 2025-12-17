import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">HomeRepair</h3>
            <p className="text-gray-400">
              Your trusted partner for all home repair and maintenance services.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-white transition">Home</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition">Services</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-white transition">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-400 hover:text-white transition">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2">
              <li><Link to="/services" className="text-gray-400 hover:text-white transition">Plumbing</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition">Electrical</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition">Cleaning</Link></li>
              <li><Link to="/services" className="text-gray-400 hover:text-white transition">AC Repair</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: info@homerepair.com</li>
              <li>Phone: (123) 456-7890</li>
              <li>Address: 123 Main St, City, State</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} HomeRepair. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;