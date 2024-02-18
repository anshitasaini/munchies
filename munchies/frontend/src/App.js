import React, { useEffect, useState } from 'react';
import {
  ChakraProvider,
  theme,
  Image,
  Heading
} from '@chakra-ui/react';
import './App.css';
import MapComponent from './Map.js';
import ContainerComponent from './ContainerComponent.js';
import InfoBox from './InfoBox.js';
import bear from './munchies_logo.png'


function App() {
  const currentUserId = 1;
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [mapWidth, setMapWidth] = useState('100%');
  const [requestingMode, setRequestingMode] = useState(false);
  const [mapMarginLeft, setMapMarginLeft] = useState('0px');
  const [restaurantActive, setRestaurantActive] = useState(false);
  const [restaurant, setRestaurant] = useState([]);
  const [donatorActive, setDonatorActive] = useState(false);
  const [donator, setDonator] = useState([]);
  const [requesterActive, setRequesterActive] = useState(false);
  const [requester, setRequester] = useState([]);
  const userUrl = `http://127.0.0.1:8000/get-user/?id=`;

  const fetchUser = (userId) => {
    return fetch(userUrl + userId)
      .then((response) => response.json())
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  };

  useEffect(() => {
    fetchUser(currentUserId);
  }, []);

  const openModal = () => {
    console.log('open modal');
    setOpen(true);
    setMapWidth('50%');
  }

  const closeModal = () => {
    console.log('close modal');
    setOpen(false);
    setMapWidth('100%');
  }

  return (
    <ChakraProvider theme={theme}>
      <div className="App">

        <div style={{ display: 'flex', marginLeft: '80px', marginTop: '24px'}}>
            <Image src={bear} boxSize='60px'></Image>
            <div style={{padding: '12px'}}></div>
            <Heading>munchies</Heading>
        </div>
        
        {/* InfoBox and Map container */}

        <div style={{ display: 'flex', height: '100%', marginTop: '12px', marginLeft: '60px', marginRight: '60px', marginBottom: '60px' }}>
          {/* InfoBox (visible only when a user is clicked) */}
          
          {open && (
            <div style={{ flex: 1, padding: '12px'}}>
              <ContainerComponent
                height="100%">
                <InfoBox user={user} userId={currentUserId} onClose={closeModal} setRequestingMode={setRequestingMode} restaurantActive={restaurantActive} restaurant={restaurant} donatorActive={donatorActive} donator={donator} requesterActive={requesterActive} requester={requester}/>
              </ContainerComponent>
            </div>
          )}
          {/* Map (width and margin-left controlled by state) */}
          <div
            style={{
              flex: '3',
              width: mapWidth,
              // marginLeft: mapMarginLeft,
              padding: '12px',
              boxSizing: 'border-box',
            }}>
            <ContainerComponent
              width="100%"
              height="700px"
              borderRadius="20px"
              borderColor="rgba(52, 152, 219, 0.5)"
            >
              <MapComponent requestingMode={requestingMode} setRestaurantActive={setRestaurantActive} setRestaurant={setRestaurant} setDonatorActive={setDonatorActive} setDonator={setDonator} setRequesterActive={setRequesterActive} setRequester={setRequester} userId={currentUserId} openModal={openModal} closeModal={closeModal} user={user} setUser={setUser}/>
            </ContainerComponent>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
