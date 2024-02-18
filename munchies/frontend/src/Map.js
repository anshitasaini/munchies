import React, { useEffect, useState } from "react";
import GoogleMapReact from 'google-map-react';
import MarkerComponent from "./MarkerComponent.js";


export default function MapComponent({ children }) {
  const [userLocation, setUserLocation] = useState(null);
  const [clickedMarker, setClickedMarker] = useState(null);

  const handleMarkerClick = (marker) => {
    setClickedMarker(marker);
    alert(`Marker Information:\nLatitude: ${marker.lat}\nLongitude: ${marker.lng}\nText: ${marker.text}`);
  };


  useEffect(() => {
    // Request user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          console.log("Set Location to: " + latitude + ", " + longitude)
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

  // Conditionally render the map only when userLocation is available
  const renderMap = userLocation !== null;

  return (
    <div style={{ height: '100%', width: '100%', margin: 0, padding: 0, borderRadius: '20px', overflow: 'hidden' }}>
      {renderMap && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDmKOqWCNapS3k2aAHMQmq0btM3-cNnDKM" }}
          center={userLocation || defaultCenter}
          defaultZoom={15}
          yesIWantToUseGoogleMapApiInternals
        >
          <MarkerComponent lat={userLocation.lat} lng={userLocation.lng} text={'BN'} onClick={handleMarkerClick}/>
        </GoogleMapReact>
      )}

    </div>
  );
}


