import React, { useState } from 'react';
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
  const [clickedUser, setClickedUser] = useState(null);
  const [mapWidth, setMapWidth] = useState('100%');
  const [requestingMode, setRequestingMode] = useState(false);
  const [mapMarginLeft, setMapMarginLeft] = useState('0px');
  const [restaurantActive, setRestaurantActive] = useState(false);
  const [restaurant, setRestaurant] = useState([]);
  const [donatorActive, setDonatorActive] = useState(false);
  const [donator, setDonator] = useState([]);

  const handleUserClick = (user) => {
    // Toggle the info box visibility if the same user is clicked again
    if (clickedUser && clickedUser.id === user.id) {
      handleMapClose();
    } else {
      setClickedUser(user);
      // Adjust the map width when a user is clicked
      setMapWidth('50%');
    }
  };

  const handleMapClose = () => {
    setClickedUser(null);
    // Reset the map width and margin-left when closing the info box
    setMapWidth('100%');
  };

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
          
          {clickedUser && (
            <div style={{ flex: 1, padding: '12px'}}>
              <ContainerComponent
                height="100%">
                <InfoBox user={clickedUser} onClose={handleMapClose} setRequestingMode={setRequestingMode} restaurantActive={restaurantActive} restaurant={restaurant} />
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
              <MapComponent onUserClick={handleUserClick} requestingMode={requestingMode} setRestaurantActive={setRestaurantActive} setRestaurant={setRestaurant} setDonatorActive={setDonatorActive} setDonator={setDonator} />
            </ContainerComponent>
          </div>
        </div>
      </div>
    </ChakraProvider>
  );
}

export default App;
