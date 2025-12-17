import React from 'react';
import { Link } from 'react-router-dom';

const TechnicianCard = ({ technician }) => {
  // Render stars based on rating
  const renderRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fas fa-star text-yellow-400"></i>);
    }
    
    if (hasHalfStar) {
      stars.push(<i key="half" className="fas fa-star-half-alt text-yellow-400"></i>);
    }
    
    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<i key={`empty-${i}`} className="far fa-star text-yellow-400"></i>);
    }
    
    return stars;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 group">
      <div className="overflow-hidden">
        <img 
          src={technician.image} 
          alt={technician.name} 
          className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="mr-4">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
              {technician.specialization}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800">{technician.name}</h3>
            <div className="flex items-center mt-1">
              <div className="flex">
                {renderRating(technician.rating)}
              </div>
              <span className="text-gray-600 text-sm ml-2">({technician.rating})</span>
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{technician.bio}</p>
        
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-700 mb-2">
            <i className="fas fa-briefcase mr-2 text-blue-600"></i>
            <span>{technician.experience} years of experience</span>
          </div>
          <div className="flex items-center text-sm text-gray-700">
            <i className="fas fa-phone-alt mr-2 text-blue-600"></i>
            <span>{technician.phone}</span>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex flex-wrap gap-1">
            {technician.skills.slice(0, 3).map((skill, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                {skill}
              </span>
            ))}
            {technician.skills.length > 3 && (
              <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                +{technician.skills.length - 3} more
              </span>
            )}
          </div>
          <Link 
            to={`/technician/${technician._id}`} 
            className="text-blue-600 font-medium hover:text-blue-800 transition-colors inline-flex items-center"
          >
            View Profile 
            <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TechnicianCard;