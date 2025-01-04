import React, { useState } from 'react';
import axios from 'axios';

// Function to update the photo status
const updateReportStatus = async (id, status) => {
  try {
    const response = await axios.post(`http://localhost:3000/photo/getInProgress`, {
      _id: id, // Passing the photo ID to the backend
    });
    console.log(`Photo status updated to ${status}:`, response.data);
    // You can handle the response or update the UI as needed here
  } catch (error) {
    console.error(`Error updating photo status to ${status}:`, error);
    // alert(`Failed to update photo status to ${status}.`);
  }
};

const InProgressReportCard = ({ 
  id,
  image,
  location,
  description,
  priority,
  status 
}) => {
  const [reportStatus, setReportStatus] = useState(status); // Track the report status

  // Function to mark the pothole status as completed
  const markAsCompleted = async () => {
    setReportStatus('completed'); // Update the local state to 'completed'
    await updateReportStatus(id, 'completed'); // Send the request to the backend
  };

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
            {description}
          </p>
          
        

          {reportStatus === 'in-progress' && (
            <div className="mb-4">
            
              <button 
                onClick={markAsCompleted}
                className="inline-flex items-center px-4 py-2 text-sm font-medium text-center text-white bg-green-500 rounded-lg hover:bg-green-600 focus:ring-4 focus:outline-none focus:ring-green-300"
              >
                Progress
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
          )}
        </div>
      </div>
    </div>
  );
};

export default InProgressReportCard;
