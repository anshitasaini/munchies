import React, { useState, useEffect } from 'react';
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
  TabPanels,
  VStack
} from '@chakra-ui/react';
import DonationForm from './DonationForm';
import { FaMap } from "react-icons/fa";


const InfoBox = ({ user, onClose }) => {
  const { name, address, lat, lng, isSelf } = user;

  return (
    <Box flex="1" padding="24px" boxSizing="border-box" style={{overflow: 'scroll', maxHeight: '700px'}}>
      <Heading size='lg'>{name}</Heading>

      {(address) && (
        <div>
          <div style={{padding: '6px'}}></div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#b5e2ff', borderRadius: 10 }}>
            <FaMap style={{ marginRight: '12px', color: 'white', fontSize: '24px' }} /> 
            <Heading size='sm'>{address}</Heading>
          </div>

          <div style={{padding: '6px'}}></div>
        </div>
      )}

      
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
