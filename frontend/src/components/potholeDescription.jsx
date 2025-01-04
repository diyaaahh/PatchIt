import React from 'react';

const PotholeDescriptionCard = ({ 
    image,
    location,
    description,
    priority,
    status 
}) => {
  return (
    <div className="max-w-full sm:max-w-6xl bg-white border border-gray-300 rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl p-6">
      <div className="flex flex-col sm:flex-row space-x-0 sm:space-x-6">

        <div className="w-full sm:w-1/3 flex justify-center mb-4 sm:mb-0">
          <img 
            className="h-40 w-40 rounded-lg object-cover shadow-md"  // Increased image size
            src={image}
            alt="Pothole image" 
          />
        </div>

        <div className="w-full sm:w-2/3 p-4">
          <div className="flex justify-between mb-4 items-center">
            <div className="text-xl font-semibold text-gray-800">
              {location}
            </div>
            <div className="flex items-center">
              <span className={`px-4 py-2 text-sm font-medium text-white rounded-full ${priority === 'High' ? 'bg-red-600' : priority === 'Medium' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                {priority}
              </span>
            </div>
          </div>
          
          <p className="text-base font-normal text-gray-800 mb-6">
            {description}
          </p>
          
          <button 
            className="inline-flex items-center px-6 py-2 text-sm font-medium text-center text-white bg-blue-500 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            <span className="mr-2">Reported</span>
            <svg 
              className="w-4 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PotholeDescriptionCard;
