import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Flex,
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
import { FaCoins } from "react-icons/fa";

const InfoBox = ({ user, setRequestingMode, restaurantActive, restaurant, donatorActive, donator, requesterActive, requester }) => {
  const { name, address, lat, lng, isSelf } = user;
  const [points, setPoints] = useState(user.points);

  return (
    <Box flex="1" padding="24px" boxSizing="border-box" style={{overflow: 'scroll', maxHeight: '700px'}}>
      <Heading size='lg'>{name}</Heading>
      <Flex align="center" paddingTop={"6px"}>
        <FaCoins style={{ marginRight: '12px', color: 'gold', fontSize: '24px' }} />
        <Heading fontSize="sm">{`${points} ${points === 1 ? 'coin' : 'coins'}`}</Heading>
      </Flex>

      {/* {(address) && (
        <div>
          <div style={{padding: '4px'}}></div>

          <div style={{ display: 'flex', alignItems: 'center', padding: '12px', backgroundColor: '#b5e2ff', borderRadius: 10 }}>
            <FaMap style={{ marginRight: '12px', color: 'white', fontSize: '12px' }} /> 
            <Heading size='xxs' style={{ fontSize: '12px' }}>{address}</Heading>
          </div>

          <div style={{padding: '6px'}}></div>
        </div>
      )} */}

      
      {/* <Heading size='sm'>Latitude: {lat}</Heading> */}
      {/* <Heading size='sm'>Longitude: {lng}</Heading> */}
      
      {isSelf ? (
        <div style={{paddingTop: '20px'}}>
            <DonationForm user={user} lat={lat} lng={lng} setRequestingMode={setRequestingMode} restaurantActive={restaurantActive} restaurant={restaurant} donatorActive={donatorActive} donator={donator} requesterActive={requesterActive} requester={requester} points={points} setPoints={setPoints}/>
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
