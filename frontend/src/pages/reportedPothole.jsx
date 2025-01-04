import React, { useState, useRef, useEffect } from 'react';
import PotholeDescriptionCard from '../components/potholeDescription';

export default function ReportedPothole() {
  const [potholes, setPotholes] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('reported'); // Changed default to 'reported'
  const dropdownRef = useRef(null);

  useEffect(() => {
    fetchPotholes(selectedStatus);
  }, [selectedStatus]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setIsOpen(false);
  };


  const fetchPotholes = async (status) => {
    try {
      const response = await fetch(`http://localhost:3000/photo/${status.toLowerCase()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log(data.reports)
      setPotholes(data.reports || []); 
      
    } catch (error) {
      console.error('Error fetching potholes:', error);
      setPotholes([]);
    }
  };

  const statusOptions = [
    { label: 'Reported Potholes', value: 'reported' },
    { label: 'In-progress Potholes', value: 'Work in Progress' },
    { label: 'Resolved Potholes', value: 'resolved' }
  ];

  const getStatusDisplayName = (status) => {
    const option = statusOptions.find(opt => opt.value === status);
    return option ? option.label : status;
  };

  return (
    <div className="space-y-4 p-2">
      <div className="flex justify-between items-center">
        <div className="text-3xl text-gray-500 font-bold pb-4">
          {getStatusDisplayName(selectedStatus)}
        </div>
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            type="button"
          >
            Filter
            <svg
              className="w-2.5 h-2.5 ms-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 10 6"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 4 4 4-4"
              />
            </svg>
          </button>

          {isOpen && (
            <div className="absolute right-0 z-10 mt-2 w-44 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700">
              <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                {statusOptions.map((option) => (
                  <li key={option.value}>
                    <button
                      onClick={() => handleStatusChange(option.value)}
                      className="block w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      {option.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {potholes.length === 0 ? (
        <div className="text-center text-gray-500 py-8">
          No potholes found for this status
        </div>
      ) : (
        potholes.map((pothole) => (
          <PotholeDescriptionCard
            key={pothole.id}
            place={pothole.place}
            description={pothole.comment}
            priority={pothole.severity}
            status={pothole.status}
            image={`http://localhost:3000${pothole.photoUrl}`}
          />
        ))
      )}
    </div>
  );
}