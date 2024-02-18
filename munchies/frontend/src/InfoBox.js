import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
} from '@chakra-ui/react';

const InfoBox = ({ user, onClose }) => {
  const { text, lat, lng, isSelf } = user;

  return (
    <Box flex="1" padding="24px" boxSizing="border-box">
      <Heading size='md'>Information</Heading>
      <Text>Name: {text} </Text>
      <Text>Latitude: {lat}</Text>
      <Text>Longitude: {lng}</Text>
      
      {isSelf ? (
        <div>
          {/* Display additional fields and choices for self */}
          <Text>Additional information for self...</Text>
          {/* Example buttons for self */}
          <Button colorScheme="teal" mr={3} onClick={() => console.log('Donate clicked')}>
            Donate
          </Button>
          <Button onClick={() => console.log('Request food clicked')}>
            Request Food
          </Button>
        </div>
      ) : (
        <div>
          {/* Display information for other users */}
          <Text>More information..</Text>
        </div>
      )}

      <Button mt={4} onClick={onClose}>
        Close Info
      </Button>
    </Box>
  );
};

export default InfoBox;
