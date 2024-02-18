import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import MarkerComponent from './MarkerComponent.js';
import axios from 'axios';

export default function MapComponent({ onUserClick }) {
  const [userLocation, setUserLocation] = useState(null);
  const [clickedMarker, setClickedMarker] = useState(null);
  const donatorsUrl = 'http://127.0.0.1:8000/nearby-restaurants/';

  const handleMarkerClick = marker => {
    onUserClick(marker);
  };

  const fetchNearbyDonators = async (latitude, longitude) => {
    try {
      const response = await axios.get(donatorsUrl, {
        params: { lat: latitude, lng: longitude, radius: 1000 },
      });
      console.log(response);
    //   setNearbyDonators(response.data.donators);
    } catch (error) {
      console.error('Failed to fetch nearby donators:', error);
    }
  };

  useEffect(() => {
    // Request user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          let { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          console.log('Set Location to: ' + latitude + ', ' + longitude);
        },
        error => {
          console.error(error.message);
          // Handle error or set a default location if geolocation is not available
          setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle error or set a default location if geolocation is not supported
      setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
    }
  }, []);

  const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default center

  // Conditionally render the map only when userLocation is available
  const renderMap = userLocation !== null;

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        margin: 0,
        padding: 0,
        borderRadius: '20px',
        overflow: 'hidden',
      }}
    >
      {renderMap && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: 'AIzaSyDmKOqWCNapS3k2aAHMQmq0btM3-cNnDKM' }}
          center={userLocation || defaultCenter}
          defaultZoom={15}
          yesIWantToUseGoogleMapApiInternals
        >
          <MarkerComponent
            lat={userLocation.lat}
            lng={userLocation.lng}
            name={'Benson Ngai'}
            onClick={handleMarkerClick}
            isSelf={true}
          />
          <MarkerComponent
            lat={userLocation.lat + 0.01}
            lng={userLocation.lng + 0.01}
            name={'Anshita Saini'}
            onClick={handleMarkerClick}
            isSelf={false}
          />
          {/* {nearbyDonators.map(donator => (
            <MarkerComponent
              key={donator.id}
              lat={donator.lat}
              lng={donator.lng}
            />
          ))} */}
        </GoogleMapReact>
      )}
    </div>
  );
}
