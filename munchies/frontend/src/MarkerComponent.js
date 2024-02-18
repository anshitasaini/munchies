// MarkerComponent.js
import React from 'react';

const MarkerComponent = ({ lat, lng, text, onClick }) => {
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
        cursor: 'pointer', // Add cursor style for indicating it's clickable
      }}
      onClick={() => onClick({ lat, lng, text })}
    >
      <h1>{text}</h1>
    </div>
  );
};

export default MarkerComponent;
