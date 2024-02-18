import React, { useEffect, useState } from 'react';
// import GoogleMapReact from 'google-map-react';
import GoogleMap from 'google-maps-react-markers'
import MarkerComponent from './MarkerComponent.js';
import axios from 'axios';

export default function MapComponent({ onUserClick, requestingMode }) {
  const [userLocation, setUserLocation] = useState(null);
  const [clickedMarker, setClickedMarker] = useState(null);
  const [nearbyDonators, setNearbyDonators] = useState(null);
  const [nearbyRestaurants, setNearbyRestaurants] = useState(null);
  const [nearbyRequesters, setNearbyRequesters] = useState(null);
  const donatorsUrl = 'http://127.0.0.1:8000/nearby-donators/';
  const restaurantsUrl = 'http://127.0.0.1:8000/nearby-restaurants/';
  const requestersUrl = 'http://127.0.0.1:8000/nearby-requesters/';

  const handleMarkerClick = marker => {
    onUserClick(marker);
  };

  const fetchNearbyDonators = async (latitude, longitude) => {
    try {
      const response = await axios.get(donatorsUrl, {
        params: { latitude: latitude, longitude: longitude, radius: 1000 },
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
          // yesIWantToUseGoogleMapApiInternals
        >
          <MarkerComponent
            lat={userLocation.lat}
            lng={userLocation.lng}
            name={'Benson Ngai'}
            color={'gray'}
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
          {requestingMode && nearbyRestaurants.map(restaurant => {
            console.log("mapping restaurants");
            return (
              <MarkerComponent
                key={restaurant.id}
                lat={restaurant.location.lat}
                lng={restaurant.location.lng}
                name={restaurant.name}
                color={'blue'}
                onClick={handleMarkerClick}
                isSelf={false}
              />
            );
          })}
          {nearbyRequesters && nearbyRequesters.map(requester => (
            <MarkerComponent
              key={requester.id}
              lat={requester.delivery_lat}
              lng={requester.delivery_lng}
              name={"Q"}
              color={'red'}
              onClick={handleMarkerClick}
              isSelf={false}
            />
          ))}
        </GoogleMap>
      )}
    </div>
  );
}
