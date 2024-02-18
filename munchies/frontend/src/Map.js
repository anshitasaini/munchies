import React, { useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import MarkerComponent from './MarkerComponent.js';
import axios from 'axios';

export default function MapComponent({ onUserClick }) {
  const [userLocation, setUserLocation] = useState(null);
  const [clickedMarker, setClickedMarker] = useState(null);
  const [nearbyDonators, setNearbyDonators] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState(null);
  const donatorsUrl = 'http://127.0.0.1:8000/nearby-donators/';
  const restaurantsUrl = 'http://127.0.0.1:8000/nearby-restaurants/';

  const handleMarkerClick = marker => {
    onUserClick(marker);
  };

  const fetchNearbyDonators = async (latitude, longitude) => {
    try {
      const response = await axios.get(donatorsUrl, {
        params: { latitude: latitude, longitude: longitude, radius: 1000 },
      });
      console.log("Nearby donators: ", response.data.nearby_donators);
      setNearbyDonators(response.data.nearby_donators);
    } catch (error) {
      console.error('Failed to fetch nearby donators:', error);
    }
  };

  const fetchNearbyRestaurants = async (latitude, longitude) => {
    try {
      const response = await axios.get(restaurantsUrl, {
        params: { latitude: latitude, longitude: longitude, radius: 1000 },
      });
      console.log("Nearby restaurants: ", response.data.nearby_restaurants);
      setNearbyRestaurants(response.data.nearby_restaurants);
    } catch (error) {
      console.error('Failed to fetch nearby restaurants:', error);
    }
  };

  useEffect(() => {
    // Request user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          let { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          fetchNearbyDonators(latitude, longitude)
          fetchNearbyRestaurants(latitude, longitude)
          console.log('Set Location to: ' + latitude + ', ' + longitude);
        },
        error => {
          console.error(error.message);
          // Handle error or set a default location if geolocation is not available
          setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
          fetchNearbyDonators(37.7749, -122.4194);
          fetchNearbyRestaurants(37.7749, -122.4194);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle error or set a default location if geolocation is not supported
      setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
      fetchNearbyDonators(37.7749, -122.4194);
      fetchNearbyRestaurants(37.7749, -122.4194);
    }
  }, []);

  const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default center

  // Conditionally render the map only when userLocation is available
  const renderMap = nearbyRestaurants !== null;

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
            color={'red'}
            onClick={handleMarkerClick}
            isSelf={true}
          />
          {nearbyDonators && nearbyDonators.map(donator => (
            <MarkerComponent
              key={donator.id}
              lat={donator.lat}
              lng={donator.lng}
              name={"D"}
              color={'green'}
              onClick={handleMarkerClick}
              isSelf={false}
            />
          ))}
          {nearbyRestaurants && nearbyRestaurants.map(restaurant => (
            <MarkerComponent
              key={restaurant.id}
              address={restaurant.address}
              lat={restaurant.location.lat}
              lng={restaurant.location.lng}
              name={restaurant.name}
              color={'blue'}
              onClick={handleMarkerClick}
              isSelf={false}
            />
          ))}

        </GoogleMapReact>
      )}
    </div>
  );
}
