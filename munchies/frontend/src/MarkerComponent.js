// // MarkerComponent.js
// import React from 'react';

// const MarkerComponent = ({ name, address, lat, lng, color, onClick, isSelf }) => {
//   const initials = name
//     .split(' ')
//     .map(word => word[0])
//     .join('');

//   return (
//     <div
//       style={{
//         width: '40px',
//         height: '40px',
//         borderRadius: '50%',
//         backgroundColor: color,
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         color: '#fff',
//         fontWeight: 'bold',
//         cursor: 'pointer',
//         borderColor: 'white',
//         borderWidth: '2px',
//         transition: 'transform 0.3s ease-in-out'
//       }}
//       onClick = {() => onClick({ name, lat, lng, isSelf, address })}
//       onMouseEnter={(e) => {
//         e.currentTarget.style.transform = 'scale(1.2)'; // Grow on hover
//       }}
//       onMouseLeave={(e) => {
//         e.currentTarget.style.transform = 'scale(1)'; // Shrink on leave
//       }}
      
//     >
//       <h1>{initials}</h1>
//     </div>
//   );
// };

// export default MarkerComponent;


// MarkerComponent.js
import React from 'react';

const MarkerComponent = ({ name, address, lat, lng, color, onClick, isSelf, imageSrc }) => {
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
        backgroundColor: color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontWeight: 'bold',
        cursor: 'pointer',
        borderColor: 'white',
        borderWidth: '2px',
        transition: 'transform 0.3s ease-in-out',
        position: 'relative', // Added for positioning the image correctly
      }}
      onClick={() => onClick({ name, lat, lng, isSelf, address })}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.2)'; // Grow on hover
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)'; // Shrink on leave
      }}
    >
      {imageSrc && (
        <img src={imageSrc} alt="Marker" style={{
          width: '100%', // Make the image fill the container
          height: '100%', // Make the image fill the container
          borderRadius: '50%', // Make the image circular
          position: 'absolute', // Position it over the background
          top: 0,
          left: 0,
          border: '3px solid white' // Add a thin white border
        }} />
      )}
      {!imageSrc && <h1 style={{ position: 'relative', zIndex: 1 }}>{initials}</h1>}
    </div>
  );
};

export default MarkerComponent;