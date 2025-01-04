import React, { useState } from 'react';
import 'tailwindcss/tailwind.css';

const LiveStream = () => {
  const [streams, setStreams] = useState([
    { id: 1, url: 0 },
    { id: 2, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4' },
    { id: 3, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
    { id: 4, url: 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
  ]);
  const [loading, setLoading] = useState({});

  const handleResetDetection = async (url) => {
    setLoading((prev) => ({ ...prev, [url]: true }));
    try {
      const response = await fetch('http://127.0.0.1:3000/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (response.ok) {
        alert(`Pothole detection reset successfully for stream: ${url}`);
      } else {
        alert(`Failed to reset detection for stream: ${url}`);
      }
    } catch (err) {
      console.error(`Error resetting detection for stream ${url}:`, err);
    } finally {
      setLoading((prev) => ({ ...prev, [url]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 text-blue-900 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Live Stream Pothole Detection</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {streams.map((stream) => (
          <div
            key={stream.id}
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform transform hover:scale-105"
          >
            <div className="relative">
              <img
                src={`http://127.0.0.1:5000/stream?url=${encodeURIComponent(stream.url)}`}
                alt={`Stream ${stream.id}`}
                className="w-full h-64 object-cover"
              />
              <div className="absolute top-2 left-2 bg-blue-500 text-sm font-bold py-1 px-3 rounded-full text-white">
                Live
              </div>
            </div>
            <div className="p-4 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-blue-700">Stream {stream.id}</h2>
              <button
                onClick={() => handleResetDetection(stream.url)}
                className={`px-4 py-2 text-sm font-semibold text-white rounded-md shadow-md transition-all duration-300 ${
                  loading[stream.url] ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
                }`}
                disabled={loading[stream.url]}
              >
                {loading[stream.url] ? 'Resetting...' : 'Reset'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LiveStream;
