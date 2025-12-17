import React, { useState } from 'react';

const SelectServiceNames = () => {
  // Sample service data (in a real app, this would come from an API)
  const services = [
    { id: 1, name: "Plumbing Services", price: "$89 starting" },
    { id: 2, name: "Electrical Services", price: "$99 starting" },
    { id: 3, name: "Cleaning Services", price: "$79 starting" },
    { id: 4, name: "AC Repair & HVAC", price: "$129 starting" }
  ];

  const [selectedService, setSelectedService] = useState('');

  const handleServiceChange = (event) => {
    setSelectedService(event.target.value);
  };

  // Extract just the names
  const serviceNames = services.map(service => service.name);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Select Service Names</h1>
      
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Service Names Only</h2>
        <ul className="list-disc pl-6 space-y-2">
          {serviceNames.map((name, index) => (
            <li key={index} className="text-gray-700">{name}</li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Dropdown with Service Names</h2>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2" htmlFor="service-select">
            Choose a Service
          </label>
          <select
            id="service-select"
            value={selectedService}
            onChange={handleServiceChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select a service</option>
            {services.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} - {service.price}
              </option>
            ))}
          </select>
        </div>
        
        {selectedService && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-800">
              You selected: <strong>{services.find(s => s.id == selectedService)?.name}</strong>
            </p>
          </div>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">How It Works</h2>
        <p className="text-gray-700 mb-4">
          To select just the service names from a list of services, you can use the JavaScript <code className="bg-gray-200 px-1 rounded">map()</code> function:
        </p>
        <pre className="bg-gray-800 text-green-400 p-4 rounded-lg overflow-x-auto">
{`// Extract just the names
const serviceNames = services.map(service => service.name);

// This creates an array like:
// ["Plumbing Services", "Electrical Services", "Cleaning Services", "AC Repair & HVAC"]`}
        </pre>
      </div>
    </div>
  );
};

export default SelectServiceNames;