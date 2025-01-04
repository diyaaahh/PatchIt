// geolocation.js (or any suitable file name)

export const getLocation = (setLocation, setLocationError) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          
          // Fetch address using OpenCage API
          const apiKey = 'e16d386bc84948ff9852f8fbf4bd67db';
          const url = `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${apiKey}`;
  
          fetch(url)
            .then((response) => response.json())
            .then((data) => {
              const address = data.results?.[0]?.formatted || 'Address not found';
  
              // Save both location (lat, lng) and formatted address in the location state
              setLocation({ latitude: lat, longitude: lng, address });
            })
            .catch(() => {
              setLocationError('Failed to fetch address');
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
  };
  
  export default getLocation;
  