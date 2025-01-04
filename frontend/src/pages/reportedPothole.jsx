import React, { useState, useEffect } from 'react';  // Importing useState and useEffect
import axios from 'axios';
import PotholeDescriptionCard from '../components/potholeDescription';
import getLocation from "../components/locationdecode";  // Import the getLocation function

export default function ReportedPothole() {
  const [potholes, setPotholes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);

  const updateStatus = (id, newStatus) => {
    axios.put(`http://localhost:3000/photo/reported/${id}`, { status: newStatus })
      .then((response) => {
        console.log('Status updated:', response.data);
        setPotholes(potholes.map((pothole) =>
          pothole.id === id ? { ...pothole, status: newStatus } : pothole
        ));
      })
      .catch((error) => {
        console.error('Error updating status:', error);
      });
  };

  useEffect(() => {
    getLocation(setUserLocation, setLocationError);

    axios.get('http://localhost:3000/photo/reported')
      .then((response) => {
        console.log(response.data);
        if (response.data.reports) {
          setPotholes(response.data.reports);
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
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : potholes.length > 0 ? (
        potholes.map((pothole) => (
          <PotholeDescriptionCard
            key={pothole.userId}
            id={pothole.id}
            description={pothole.comment}
            status={pothole.status}
            priority={pothole.severity}
            image={`http://localhost:3000${pothole.photoUrl}`}
            location={userLocation ? userLocation.address : 'Location not available'}
            // updateStatus={updateStatus}
          />
        ))
      ) : (
        <p>No potholes reported yet.</p>
      )}

      {locationError && <p className="text-red-500">{locationError}</p>}
    </div>
  );
}
