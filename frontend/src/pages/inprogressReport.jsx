import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InProgressReportCard from '../components/InProgress';



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
        const response = await axios.get('http://localhost:3000/photo/getInProgress');
        
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
            <h1 className='text-3xl text-gray-600 font-bold pb-4'>Inprogress Potholes Report</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : potholes.length > 0 ? (
        potholes.map((pothole) => (
          <InProgressReportCard
            key={pothole.userId}
            description={pothole.comment}
            priority={pothole.severity}
            status={pothole.status}
            id={pothole._id}
            image={`http://localhost:3000${pothole.photoUrl}`}
            location={pothole.address || 'Location not available'}  // Display the address or fallback to default message
          />
        ))
      ) : (
        <p>No potholes reported yet.</p>
      )}
    </div>
  );
}