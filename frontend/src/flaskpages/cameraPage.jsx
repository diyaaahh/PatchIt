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

const LiveStream = () => {
  const [isStreamVisible, setStreamVisible] = useState(false);

  const handleShowStream = () => {
    setStreamVisible(true);
  };

  const handleResetDetection = async () => {
    try {
      const response = await fetch('http://localhost:5000/reset', { method: 'POST' });
      if (response.ok) {
        alert('Pothole detection reset successfully.');
      } else {
        alert('Failed to reset detection.');
      }
    } catch (err) {
      console.error('Error resetting detection:', err);
    }
  };

  return (
    <div>
      <h1>Live Stream Pothole Detection</h1>
      <button onClick={handleShowStream}>Show Live Stream</button>
      <button onClick={handleResetDetection}>Reset Detection</button>
      {isStreamVisible && (
        <div>
          <h2>Live Stream:</h2>
          <img
            src="http://127.0.0.1:3000/stream"
            alt="Live Stream"
            style={{
              width: '100%',
              maxWidth: '640px',
              border: '1px solid black',
              display: 'block',
              marginTop: '10px',
            }}
          />
        </div>
      )}
    </div>
  );
};

export default LiveStream;
