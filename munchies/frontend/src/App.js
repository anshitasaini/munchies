import React, { useState } from 'react';
import './App.css';
import MapComponent from './Map.js';
import ContainerComponent from './ContainerComponent.js';

function App() {
  const [clickedUser, setClickedUser] = useState(null);
  const [mapWidth, setMapWidth] = useState('100%');
  const [mapMarginLeft, setMapMarginLeft] = useState('0%');

  const handleUserClick = (user) => {
    setClickedUser(user);
    // Adjust the map width and margin-left when a user is clicked
    setMapWidth('50%');
    setMapMarginLeft('5%');
  };

  const handleMapClose = () => {
    setClickedUser(null);
    // Reset the map width and margin-left when closing the info box
    setMapWidth('100%');
    setMapMarginLeft('0%');
  };

  return (
    <div className="App">
      <h1>MUNCHIES</h1>
      {/* InfoBox and Map container */}
      <div style={{ display: 'flex'}}>
        {/* InfoBox (visible only when a user is clicked) */}
        {clickedUser && (
          <div style={{ flex: '1', padding: '24px', boxSizing: 'border-box' }}>
            <ContainerComponent
              height="100%">
              <div className="userInfo">
                <h2>User Information</h2>
                <p>Name: {clickedUser.text}</p>
                <p>Latitude: {clickedUser.lat}</p>
                <p>Longitude: {clickedUser.lng}</p>
                {/* Add more user information as needed */}
                <button onClick={handleMapClose}>Close Info</button>
              </div>
            </ContainerComponent>
          </div>
        )}
        {/* Map (width and margin-left controlled by state) */}
        <div
          style={{
            flex: '3',
            width: mapWidth,
            marginLeft: mapMarginLeft,
            transition: 'width 0.5s, margin-left 0.5s',
            padding: '24px',
            boxSizing: 'border-box',
          }}
        >
          <ContainerComponent
            width="100%"
            height="700px"
            borderRadius="20px"
            borderColor="rgba(52, 152, 219, 0.5)"
          >
            <MapComponent onUserClick={handleUserClick} />
          </ContainerComponent>
        </div>
      </div>
    </div>
  );
}

export default App;
