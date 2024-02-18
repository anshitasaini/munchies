import React from 'react';
import PropTypes from 'prop-types';

const ContainerComponent = ({
  width,
  height,
  borderRadius,
  borderColor,
  children,
}) => {
  const containerStyle = {
    width: width || '100%',
    height: height || '200px',
    borderRadius: borderRadius || '10px',
    border: '2px solid #ccc',
    borderColor: `2px solid ${borderColor || 'rgba(0, 0, 0, 0)'}`,
    boxSizing: 'border-box',
  };

  return <div style={containerStyle}>{children}</div>;
};

ContainerComponent.propTypes = {
  width: PropTypes.string, // You can specify more specific prop types based on your needs
  height: PropTypes.string,
  borderRadius: PropTypes.string,
  children: PropTypes.node, // To render child components
};

export default ContainerComponent;
