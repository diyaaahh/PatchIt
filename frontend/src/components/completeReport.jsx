import React from 'react'
import axios from 'axios';
// import { updateToInProgress } from '../../../backend/Controllers/photoController';

const CompletedReport = ({ 
    id,
    image,
    location,
    description,
    time,
    duration,
    priority,
    status }) => {
  return (
    <div className="max-w-6xl bg-white max-h-42 border border-gray-200 rounded-lg shadow dark:bg-gray-100 dark:border-gray-100">
    <div className="flex flex-row">
    <div className="w-1/3">
<img 
  className="max-h-25  max-w-25 p-5 rounded-l-lg "
  src={image}
  alt="Pothole image" 
/>
</div>
        
        <div className="w-2/3 p-5">
          <div className="flex justify-between mb-4">
            <div className="text-lg font-semibold text-gray-700 dark:text-gray-400">
          {location}
            </div>
            <div className="flex items-center">
              <span className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-full">
                Priority: {priority}
              </span>
            </div>
          </div>
          
          <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
            Description:{description}
          </p>
          
          <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
            Time: {time}
          </p>

          <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
            Duration: {duration}  
          </p>

        
        </div>
      </div>
    </div>
  );
};

export default CompletedReport; 