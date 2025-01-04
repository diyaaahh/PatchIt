import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, RefreshCw, MapPin } from 'lucide-react';
import Webcam from 'react-webcam';
import potholesImage from '../assets/pothole.png';
import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';
import LogoutButton from '../components/logoutButton';

const PotholeReporter = () => {
  const {user,isAuthenticated} = useAuth0()
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [comment, setComment] = useState('');
  const [location, setLocation] = useState(null);
  const [formattedAddress, setFormattedAddress] = useState('');
  const [locationError, setLocationError] = useState('');
  const [userDetail, setUserDetail] = useState({
    name: 'xyz',
    profilePicture: potholesImage,
  });

  const webcamRef = useRef(null);

  // Get userDetail location and address using OpenCage API
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          setLocation({ latitude: lat, longitude: lng });
          setLocationError('');

          // Fetch address using OpenCage API
          const apiKey = 'e16d386bc84948ff9852f8fbf4bd67db';
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;

          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              const address = data.results?.[0]?.formatted || 'Address not found';
              setFormattedAddress(address);
            })
            .catch(() => {
              setFormattedAddress('Failed to fetch address');
            });
        },
        (error) => {
          const errorMessage =
            error.code === 1
              ? 'Location access denied. Enable location services.'
              : 'Unable to retrieve location.';
          setLocationError(errorMessage);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }
  }, []);

  const handleCapture = async () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    setCapturedImage(imageSrc);
    setIsCameraOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if there is an image, comment, and location
    if (!capturedImage || !comment || !location) {
      alert('Please fill in all fields before submitting.');
      return;
    }

    try {
      const formData = new FormData();

      // Convert base64 image to file
      const response = await fetch(capturedImage);
      const blob = await response.blob();
      const file = new File([blob], 'pothole.jpg', { type: 'image/jpeg' });

      formData.append('image', file);
      formData.append('userId', '6777ea0992f9a82a810af034'); // Replace with actual userId
      formData.append('comment', comment);
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);

      const res = await fetch('http://localhost:3000/photo/upload-photo', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = await res.json();
      if (res.ok) {
        console.log('Photo uploaded successfully:', data);
      } else {
        console.error('Error uploading photo:', data);
      }
    } catch (error) {
      console.error('Error during image upload:', error);
    }

    // Reset form after submission
    setCapturedImage(null);
    setComment('');
    setLocation(null);
    setFormattedAddress('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 p-6">
      {/* Header */}
      <header className="max-w-4xl mx-auto mb-8">
        <div className="flex items-center gap-4">
          <img
            src={user.picture}
            alt={userDetail.name}
            className="w-10 h-10 rounded-full"
          />
          <span className="text-lg font-semibold">Welcome, {user.name}</span>
          <span><LogoutButton/></span>
        </div>
        <div className="mt-4 bg-white p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold text-blue-600">Pothole Reporter</h1>
          <p className="text-gray-600">
            Help your community by reporting potholes in your area.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto space-y-8">
        {/* Camera Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-blue-600 flex items-center gap-2">
            <Camera className="w-6 h-6" />
            Capture Pothole
          </h2>
          {!isCameraOpen && !capturedImage && (
            <button
              onClick={() => setIsCameraOpen(true)}
              className="w-full h-64 flex flex-col items-center justify-center border-2 border-dashed border-blue-200 rounded-lg hover:border-blue-400 transition"
            >
              <Camera className="w-12 h-12 text-blue-400" />
              <span className="text-blue-600">Open Camera</span>
            </button>
          )}

          {isCameraOpen && (
            <div className="relative">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full rounded-lg"
              />
              <button
                onClick={() => setIsCameraOpen(false)}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
              <button
                onClick={handleCapture}
                className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg"
              >
                Capture Photo
              </button>
            </div>
          )}

          {capturedImage && (
            <div className="relative mt-4">
              <img
                src={capturedImage}
                alt="Captured pothole"
                className="w-full rounded-lg"
              />
              <button
                onClick={() => {
                  setCapturedImage(null);
                  setIsCameraOpen(true);
                }}
                className="absolute top-4 right-4 p-2 bg-gray-800 text-white rounded-full"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Comment Section */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-bold mb-6 text-purple-600 flex items-center gap-2">
            <Upload className="w-6 h-6" />
            Add Details
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Describe the location and severity of the pothole..."
              className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin className="w-8 h-8 sm:w-6 sm:h-6 text-purple-500" />
              {location ? (
                <span>{formattedAddress}</span>
              ) : (
                <span className="text-red-500">{locationError || 'Fetching location...'}</span>
              )}
            </div>
            <button
              type="submit"
              disabled={!capturedImage || !comment || !location}
              className="w-full py-3 bg-purple-600 text-white rounded-lg disabled:opacity-50"
            >
              Submit Report
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default PotholeReporter;
