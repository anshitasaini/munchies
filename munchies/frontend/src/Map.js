import React, { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function MapComponent() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    // Request user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error(error.message);
          // Handle error or set a default location if geolocation is not available
          setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Handle error or set a default location if geolocation is not supported
      setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
    }
  }, []);

  const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default center

  return (
    <div style={{ height: '100%', width: '100%', margin: 0, padding: 0, borderRadius: '20px', overflow: 'hidden' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "AIzaSyDmKOqWCNapS3k2aAHMQmq0btM3-cNnDKM" }} // Replace with your actual API key
        center={userLocation || defaultCenter} // Use user's location if available, otherwise default
        defaultZoom={15}
      >
        <AnyReactComponent
          lat={defaultCenter.lat}
          lng={defaultCenter.lng}
          text="My Marker"
        />

        {userLocation && (
          <AnyReactComponent
            lat={userLocation.lat}
            lng={userLocation.lng}
            text="You are here"
          />
        )}
      </GoogleMapReact>
    </div>
  );
}
