// geolocation.js (or any suitable file name)

// geolocation.js (or any suitable file name)

// export const getPlaceName = (latitude, longitude, setLocation, setLocationError) => {
//   if (latitude && longitude) {
//     // Fetch address using OpenCage API
//     const apiKey = 'e16d386bc84948ff9852f8fbf4bd67db';
//     const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

//     fetch(url)
//       .then((response) => response.json())
//       .then((data) => {
//         const address = data.results?.[0]?.formatted || 'Address not found';

//         // Save both location (lat, lng) and formatted address in the location state
//         setLocation({ latitude, longitude, address });
//       })
//       .catch(() => {
//         setLocationError('Failed to fetch address');
//       });
//   } else {
//     setLocationError('Invalid latitude and longitude.');
//   }
// };

// export default getPlaceName;

