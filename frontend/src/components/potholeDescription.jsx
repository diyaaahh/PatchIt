import React from 'react'

const PotholeDescriptionCard = ({ 
    image,
    place,
    description,
    priority,
    status }) => {
  return (
    <div className="max-w-6xl bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-100 dark:border-gray-100">
      <div className="flex flex-row">

        <div className="w-1/3">
          <img 
            className="h-full w-full rounded-l-lg object-cover"
            src={image}
            alt="Pothole image" 
          />
        </div>
        
        <div className="w-2/3 p-5">
          <div className="flex justify-between mb-4">
            <div className="text-lg font-semibold text-gray-600">
              Place: {place}
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-full">
                Priority: {priority}
              </span>
            </div>
          </div>
          
          <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
            {description}
          </p>
          
          <button 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 focus:ring-4 focus:outline-none focus:ring-yellow-300"
          >
            {status}
            <svg 
              className="w-4 h-4 ms-2"
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