import React from 'react';

const MarkerComponent = ({text}) => {
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
      }}
    >
      <h1>{text}</h1>
      
    </div>
  );
};

export default MarkerComponent;
