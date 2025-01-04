// import React, { useState } from "react";

// const PotholeDetectionApp = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [detectionResult, setDetectionResult] = useState(null);

//   // Handle file selection
//   const handleFileChange = (event) => {
//     const file = event.target.files[0];
//     setSelectedFile(file);
//     setDetectionResult(null); // Reset previous results
//   };

//   // Handle file upload and detection
//   const handleDetectPothole = async () => {
//     if (!selectedFile) {
//       alert("Please select a file first!");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", selectedFile);

//     try {
//       const response = await fetch("http://127.0.0.1:5000/detect", {
//         method: "POST",
//         body: formData,
//       });

//       if (!response.ok) {
//         throw new Error("Failed to detect pothole. Check the backend server.");
//       }

//       const result = await response.json();
//       setDetectionResult(result); // Assuming the backend returns a JSON object
//     } catch (error) {
//       console.error("Error during pothole detection:", error);
//       alert("An error occurred while detecting the pothole.");
//     }
//   };

//   return (
//     <div className="p-4 max-w-md mx-auto">
//       <h1 className="text-xl font-bold mb-4">Pothole Detection</h1>

//       {/* File Input */}
//       <input
//         type="file"
//         accept="image/*"
//         onChange={handleFileChange}
//         style={{ marginBottom: "1rem" }}
//       />

//       {/* Display Selected File */}
//       {selectedFile && (
//         <div>
//           <p>Selected File: {selectedFile.name}</p>
//           <img
//             src={URL.createObjectURL(selectedFile)}
//             alt="Preview"
//             style={{ width: "100%", maxHeight: "300px", margin: "1rem 0", objectFit: "contain" }}
//           />
//         </div>
//       )}

//       {/* Detect Button */}
//       <button
//         onClick={handleDetectPothole}
//         style={{
//           padding: "0.5rem 1rem",
//           backgroundColor: "#3b82f6",
//           color: "white",
//           borderRadius: "0.5rem",
//           cursor: "pointer",
//           marginBottom: "1rem",
//         }}
//       >
//         Detect Pothole
//       </button>

//       {/* Display Detection Result */}
//       {detectionResult && (
//         <div
//           style={{
//             marginTop: "1rem",
//             padding: "1rem",
//             borderRadius: "0.5rem",
//             backgroundColor: detectionResult.pothole_detected ? "#f87171" : "#4ade80",
//             color: "white",
//           }}
//         >
//           {detectionResult.pothole_detected ? "Pothole Detected!" : "No Pothole Detected."}
//         </div>
//       )}
//     </div>
//   );
// };

// export default PotholeDetectionApp;


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
                src={`http://127.0.0.1:3000/stream?url=${encodeURIComponent(stream.url)}`}
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
