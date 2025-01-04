import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PotholeDescriptionCard from '../components/ReportedReport';

export default function ReportedPothole() {
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
    // Make an API call to fetch the reported potholes
    axios.get('http://localhost:3000/photo/reported')
      .then(async (response) => {
        console.log(response.data);
        if (response.data.reports) {
          const potholesWithLocation = await Promise.all(
            response.data.reports.map(async (pothole) => {
              // Fetch the address for each pothole based on latitude and longitude
              const address = await fetchAddress(pothole.latitude, pothole.longitude);
              return { ...pothole, address };  // Add the fetched address to pothole data
            })
          );
          setPotholes(potholesWithLocation);
        } else {
          setError('No reports found');
        }
      })
      .catch((error) => {
        console.error('Error fetching potholes:', error);
        setError('Failed to fetch potholes. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading potholes...</p>;
  }

  return (
    <div className="space-y-4 p-4">
        <h1 className='text-3xl text-gray-600 font-bold pb-4'>Reported Potholes</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : potholes.length > 0 ? (
        potholes.map((pothole) => (
          <PotholeDescriptionCard
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
