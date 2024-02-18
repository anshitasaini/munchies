import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Select,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels
} from '@chakra-ui/react';
import DonationForm from './DonationForm';

const InfoBox = ({ user, onClose }) => {
  const { name, lat, lng, isSelf } = user;

  return (
    <Box flex="1" padding="24px" boxSizing="border-box" style={{overflow: 'scroll', maxHeight: '700px'}}>
      <Heading size='lg'>{name}</Heading>
      <Heading size='sm'>Latitude: {lat}</Heading>
      <Heading size='sm'>Longitude: {lng}</Heading>
      
      {isSelf ? (
        <div style={{paddingTop: '24px'}}>
            <DonationForm lat={lat} lng={lng}/>
        </div>
        
      ) : (
        <div>
          {/* Display information for other users */}
          <Text>More information..</Text>
        </div>
      )}

    </Box>
  );
};

export default InfoBox;
