// MarkerComponent.js
import React from 'react';

const MarkerComponent = ({ name, lat, lng, onClick, isSelf }) => {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('');

  return (
    <div
      style={{
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        backgroundColor: 'rgba(256, 0, 0, 1)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderColor: 'white',
        borderWidth: '2px'
      }}
      onClick = {() => onClick({ name, lat, lng, isSelf })}
      
    >
      <h1>{initials}</h1>
    </div>
  );
};

export default MarkerComponent;
