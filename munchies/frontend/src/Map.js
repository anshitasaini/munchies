import React, { useEffect, useState } from 'react';
import GoogleMap from 'google-maps-react-markers'
import MarkerComponent from './MarkerComponent.js';
import axios from 'axios';

export default function MapComponent({ requestingMode, setRestaurantActive, setRestaurant, setDonatorActive, setDonator, setRequesterActive, setRequester, userId, openModal, closeModal, user, setUser}) {
  const [userLocation, setUserLocation] = useState(null);
  const [nearbyDonators, setNearbyDonators] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState(null);
  const [nearbyRequesters, setNearbyRequesters] = useState(null);
  const [previousClick, setPreviousClick] = useState(null);
  const donatorsUrl = 'http://127.0.0.1:8000/nearby-donators/';
  const restaurantsUrl = 'http://127.0.0.1:8000/nearby-restaurants/';
  const requestersUrl = 'http://127.0.0.1:8000/nearby-requesters/';
  const addressUrl = 'http://127.0.0.1:8000/get-address/';

  const trackDoubleClick = marker => {
    if (previousClick === marker) {
      setPreviousClick(null);
      closeModal();
    } else {
      setPreviousClick(marker);
      openModal();
    }
  };

  const handleMarkerClick = marker => {
    user.isSelf = true;
    setUser(user);
    trackDoubleClick(marker);
    setRestaurantActive(false);
    setDonatorActive(false);
    setRequesterActive(false);
  };

  const handleRestaurantClick = restaurant => {
    console.log('Restaurant clicked: ', restaurant);
    trackDoubleClick(restaurant);
    setRestaurantActive(true);
    setDonatorActive(false);
    setRequesterActive(false);
    setRestaurant(restaurant);
  };

  const handleDonatorClick = donator => {
    console.log('Donator clicked: ', donator);
    trackDoubleClick(donator);
    setRestaurantActive(true);
    setDonatorActive(true);
    setRestaurantActive(false);
    setRequesterActive(false);
    setDonator(donator);
  };

  const handleRequesterClick = requester => {
    console.log('Requester clicked: ', requester);
    trackDoubleClick(requester);
    setRequesterActive(true);
    setRestaurantActive(false);
    setDonatorActive(false);
    setRequester(requester);
  };

  const fetchNearbyDonators = async (latitude, longitude) => {
    try {
      const response = await axios.get(donatorsUrl, {
        params: { latitude: latitude, longitude: longitude, radius: 5000 },
      });
      // console.log("Nearby donators: ", response.data.nearby_donators);
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
      // console.log("Nearby restaurants: ", response.data.nearby_restaurants);
      setNearbyRestaurants(response.data.nearby_restaurants);
    } catch (error) {
      console.error('Failed to fetch nearby restaurants:', error);
    }
  };

  const fetchNearbyRequesters = async (latitude, longitude) => {
    try {
      const response = await axios.get(requestersUrl, {
        params: { latitude: latitude, longitude: longitude, radius: 5000 },
      });
      // console.log("Nearby requesters: ", response.data.nearby_requesters);
      setNearbyRequesters(response.data.nearby_requesters);
    } catch (error) {
      console.error('Failed to fetch nearby requesters:', error);
    }
  };

  const fetchUserAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(addressUrl, {
        params: { lat: latitude, lng: longitude },
      });
      user.address = response.data;
      user.lat = latitude;
      user.lng = longitude;
      setUser(user);
    } catch (error) {
      console.error('Failed to fetch address:', error);
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
          fetchNearbyRequesters(latitude, longitude)
          console.log('Set Location to: ' + latitude + ', ' + longitude);
        },
        error => {
          console.error(error.message);
          // Handle error or set a default location if geolocation is not available
          setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
          fetchNearbyDonators(37.7749, -122.4194);
          fetchNearbyRestaurants(37.7749, -122.4194);
          fetchNearbyRequesters(37.7749, -122.4194);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      // Handle error or set a default location if geolocation is not supported
      setUserLocation({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
      fetchNearbyDonators(37.7749, -122.4194);
      fetchNearbyRestaurants(37.7749, -122.4194);
      fetchNearbyRequesters(37.7749, -122.4194);
    }
  }, []);

  useEffect(() => {
    if (userLocation) {
      fetchUserAddress(userLocation.lat, userLocation.lng);
    }
  }, [userLocation]);

  // print requesting mode whenever it is changed
  useEffect(() => {
    console.log("Requesting mode: ", requestingMode);
  }, [requestingMode]);


  const defaultCenter = { lat: 37.7749, lng: -122.4194 }; // Default center

  // Conditionally render the map only when userLocation is available
  const renderMap = nearbyRequesters !== null;

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
        <GoogleMap
          apiKey='AIzaSyDmKOqWCNapS3k2aAHMQmq0btM3-cNnDKM'
          defaultCenter={userLocation || defaultCenter}
          defaultZoom={15}
          options={{
            clickableIcons: false,
            styles: [
              {
                  "featureType": "landscape.natural",
                  "elementType": "geometry",
                  "stylers": [
                      {
                          "color": "#dde2e3"
                      },
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                  "featureType": "poi.park",
                  "elementType": "all",
                  "stylers": [
                      {
                          "color": "#c6e8b3"
                      },
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                  "featureType": "poi.park",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#c6e8b3"
                      },
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                "featureType": "poi.business",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
              "featureType": "poi.place_of_worship",
              "elementType": "all",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
          {
              "featureType": "poi.school",
              "elementType": "all",
              "stylers": [
                  {
                      "visibility": "off"
                  }
              ]
          },
            {
                "featureType": "poi.government",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
              {
                  "featureType": "road",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                  "featureType": "road",
                  "elementType": "geometry.stroke",
                  "stylers": [
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {
                  "featureType": "road",
                  "elementType": "labels",
                  "stylers": [
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                "featureType": "all",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#7c93a3"
                    },
                    {
                        "lightness": "-10"
                    }
                ]
            },
              {
                  "featureType": "road",
                  "elementType": "labels.text.fill",
                  "stylers": [
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                  "featureType": "road",
                  "elementType": "labels.text.stroke",
                  "stylers": [
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                  "featureType": "road.highway",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#c1d1d6"
                      },
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                  "featureType": "road.highway",
                  "elementType": "geometry.stroke",
                  "stylers": [
                      {
                          "color": "#a9b8bd"
                      },
                      {
                          "visibility": "on"
                      }
                  ]
              },
              {
                  "featureType": "road.local",
                  "elementType": "all",
                  "stylers": [
                      {
                          "color": "#f8fbfc"
                      }
                  ]
              },
              {
                  "featureType": "road.local",
                  "elementType": "labels.text",
                  "stylers": [
                      {
                          "color": "#979a9c"
                      },
                      {
                          "visibility": "on"
                      },
                      {
                          "weight": 0.5
                      }
                  ]
              },
              {
                  "featureType": "road.local",
                  "elementType": "labels.text.fill",
                  "stylers": [
                      {
                          "visibility": "on"
                      },
                      {
                          "color": "#827e7e"
                      }
                  ]
              },
              {
                  "featureType": "road.local",
                  "elementType": "labels.text.stroke",
                  "stylers": [
                      {
                          "color": "#3b3c3c"
                      },
                      {
                          "visibility": "off"
                      }
                  ]
              },
              {
                  "featureType": "water",
                  "elementType": "geometry.fill",
                  "stylers": [
                      {
                          "color": "#a6cbe3"
                      },
                      {
                          "visibility": "on"
                      }
                  ]
              }
          ]
          }}
        >
          <MarkerComponent
            lat={userLocation.lat}
            lng={userLocation.lng}
            name={user.name}
            color={'gray'}
            onClick={() => handleMarkerClick(user)}
            isSelf={true}
          />
          {nearbyDonators && nearbyDonators.map(donator => (
            <MarkerComponent
              key={donator.id}
              lat={donator.lat}
              lng={donator.lng}
              name={donator.name}
              color={'green'}
              onClick={() => handleDonatorClick(donator)}
              isSelf={false}
            />
          ))}
          {requestingMode && nearbyRestaurants.map(restaurant => {
            return (
              <MarkerComponent
                key={restaurant.id}
                lat={restaurant.location.lat}
                lng={restaurant.location.lng}
                name={restaurant.name}
                color={'blue'}
                onClick={() => handleRestaurantClick(restaurant)}
                isSelf={false}
                imageSrc={restaurant.img}
              />
            );
          })}
          {nearbyRequesters && nearbyRequesters.map(requester => (
            <MarkerComponent
              key={requester.id}
              lat={requester.delivery_lat}
              lng={requester.delivery_lng}
              name={requester.name}
              color={'red'}
              onClick={() => handleRequesterClick(requester)}
              isSelf={false}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
}
