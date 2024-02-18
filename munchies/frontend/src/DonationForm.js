import React, { useState } from 'react';
import {
  Tabs,
  TabList,
  Tab,
  Text,
  VStack,
  Input,
  Textarea,
  Button,
  Heading,
  IconButton,
} from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import TimeDropdown from './TimeDropdown';
import DateInput from './DateInput';

const DonationForm = ({lat, lng}) => {
  const [activeTab, setActiveTab] = useState('Donate');
  const [itemList, setItemList] = useState([]);
  const [address, setAddress] = useState("" + lat + ", " + lng);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const handleDateChange = (value) => {
    // Ensure value is a valid date format (MM/DD/YYYY or MM/DD/YY)
    setSelectedDate(value);
  };



  const handleTabChange = (index) => {
    setActiveTab(index === 0 ? 'Donate' : 'Request');
  };

  const handleAddressChange = (newAddress) => {
    setAddress(newAddress);
  };

  const handleAddItem = () => {
    if (newItemName.trim() !== '' && newItemDescription.trim() !== '') {
      const newItem = {
        name: newItemName.trim(),
        description: newItemDescription.trim(),
      };
      setItemList((prevItems) => [...prevItems, newItem]);
      setNewItemName('');
      setNewItemDescription('');
    }
  };

  const handleDeleteItem = (index) => {
    setItemList((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    // Submit data to the backend for processing
    console.log('Submitting data:', { activeTab, itemList, address });
    // Add your backend submission logic here
  };

  return (
    <div style={{ display: 'flex' }}>
      <VStack spacing={4} align={'flex-start'}>
        <Tabs variant="soft-rounded" colorScheme="green" onChange={handleTabChange}>
          <TabList>
            <Tab>Donate</Tab>
            <Tab>Request</Tab>
          </TabList>
        </Tabs>

        {(activeTab === 'Donate') && (<Heading size="sm">Add items to donate:</Heading>)}

        {(activeTab === 'Donate' && itemList.length > 0) && (
          <VStack spacing={4} align="flex-start">
            {itemList.map((item, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '100%',
                  backgroundColor: '#dadada',
                  padding: '12px',
                  justifyContent: 'space-between',
                  borderRadius: '5px',
                }}
              >
                <VStack style={{ maxWidth: '250px' }} align="flex-start">
                  <Heading size="sm">{`${item.name}`}</Heading>
                  <Text style={{ paddingRight: '12px' }}>{`${item.description}`}</Text>
                </VStack>
                <div style={{paddingRight: '12px'}}></div>
                
                <IconButton
                  colorScheme="red"
                  icon={<FaTimes />}
                  onClick={() => handleDeleteItem(index)}
                  align={'flex-end'}
                />
              </div>
            ))}
          </VStack>
        
        )}

        <div>
          {activeTab === 'Donate' && (
            <VStack spacing={4} align={'flex-start'}>
              {/* Your form elements for donation */}
              <Input
                placeholder="Item name"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <Textarea
                placeholder="Optional: Item description"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
              {/* Add more form elements as needed */}
              <Button style={{color: 'white', backgroundColor: '#45b6fe'}} onClick={handleAddItem}>Add Item</Button>
            </VStack>
          )}

          <div style={{ padding: '12px' }}></div>

          <VStack spacing={4} align="flex-start">
            <Heading size="sm">Address:</Heading>
            <Input value={address} onChange={(e) => handleAddressChange(e.target.value)} />
          </VStack>

          <div style={{ padding: '12px' }}></div>

          <VStack spacing={4} align="flex-start">
            <Heading size="sm">Choose a Date:</Heading>
            <DateInput value={selectedDate} onChange={handleDateChange} />
            <Heading size="sm">Latest Time:</Heading>
            <TimeDropdown/>
          </VStack>

          

          <div style={{ padding: '12px' }}></div>

          <Button style={{color: 'white', backgroundColor: 'green'}} onClick={handleSubmit}>Submit</Button>
        </div>
      </VStack>
    </div>
  );
};

export default DonationForm;
