import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CompletedReport from '../components/completeReport';

// Helper function to calculate time difference
const timeDifference = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffInMs = end - start;
  const hours = Math.floor(diffInMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffInMs % (1000 * 60)) / 1000);
  return `${hours} hours, ${minutes} minutes, and ${seconds} seconds`;
};

export default function CompletedPothole() {
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get('http://localhost:3000/photo/getAddress', {
        params: { latitude, longitude }
      });
      
      if (response.data && response.data.address) {
        return response.data.address;
      }
      console.warn('Address not found in response:', response.data);
      return 'Location not available';
    } catch (error) {
      console.error('Error fetching address:', error);
      return 'Location not available';
    }
  };

  useEffect(() => {
    const fetchPotholes = async () => {
      try {
        const response = await axios.get('http://localhost:3000/photo/resolved');
        
        if (!response.data.reports) {
          setError('No reports found');
          return;
        }

        const potholesWithLocation = await Promise.all(
          response.data.reports.map(async (pothole) => {
            // Add validation for latitude and longitude
            if (!pothole.latitude || !pothole.longitude) {
              console.warn('Missing coordinates for pothole:', pothole._id);
              return { ...pothole, address: 'Invalid coordinates' };
            }

            const address = await fetchAddress(pothole.latitude, pothole.longitude);
            return { ...pothole, address };
          })
        );

        setPotholes(potholesWithLocation);
      } catch (error) {
        console.error('Error fetching potholes:', error);
        setError('Failed to fetch potholes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPotholes();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading potholes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      <h1 className='text-3xl text-gray-600 font-bold pb-4'>Completed Potholes Report</h1>
      {error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : potholes.length > 0 ? (
        potholes.map((pothole) => {
          const duration = pothole.timeStamp?.length >= 3 
            ? timeDifference(pothole.timeStamp[0], pothole.timeStamp[2])
            : 'Duration not available';

          return (
            <CompletedReport
              key={pothole._id}
              description={pothole.comment}
              priority={pothole.severity}
              status={pothole.status}
              id={pothole._id}
              time={pothole.timeStamp?.[1]}
              image={`http://localhost:3000${pothole.photoUrl}`}
              location={pothole.address}
              duration={duration}
            />
          );
        })
      ) : (
        <p className="text-center">No potholes reported yet.</p>
      )}
    </div>
  );
}