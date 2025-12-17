import React from 'react';
import { Link } from 'react-router-dom';

const ServicesCard = ({ service }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="overflow-hidden">
        <img 
          src={service.image} 
          alt={service.title} 
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <i className={`${service.icon} text-blue-600 text-2xl mr-3 bg-blue-100 p-3 rounded-full`}></i>
          <div>
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              {service.category}
            </span>
            <h3 className="text-xl font-semibold text-gray-800 mt-2">{service.title}</h3>
          </div>
        </div>
        <p className="text-gray-600 mb-4">{service.description}</p>
        <div className="mb-6">
          <ul className="space-y-2">
            {service.features.map((feature, index) => (
              <li key={index} className="flex items-start">
                <i className="fa fa-check-circle text-green-500 mt-1 mr-3 text-sm"></i>
                <span className="text-gray-700 text-sm">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-800">{service.price}</span>
          <Link 
            to={`/service/${service.id}`} 
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center"
          >
            Learn More 
            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ServicesCard;