import React, { useState, useEffect } from 'react';
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
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image
} from '@chakra-ui/react';
import { FaTimes } from 'react-icons/fa';
import TimeDropdown from './TimeDropdown';
import DateInput from './DateInput';
import MenuList from './MenuList.js';

const DonationForm = ({lat, lng, setRequestingMode, restaurantActive, restaurant, donatorActive, donator }) => {
  const [activeTab, setActiveTab] = useState('Donate');
  const [itemList, setItemList] = useState([]);
  const [address, setAddress] = useState("" + lat + ", " + lng);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menu, setMenu] = useState([{item_name: 'Loading...', price: 'Loading...', category: 'Loading...', allergens: 'Loading...'}]);

  const donatorsUrl = 'http://127.0.0.1:8000/nearby-donators/';
  const restaurantsUrl = `http://127.0.0.1:8000/nearby-restaurants/?latitude=${lat}&longitude=${lng}`;
  const menuUrl = `http://127.0.0.1:8000/restaurant-details/?name=`;

  useEffect(() => {
    if (restaurantActive) {
      // Fetch restaurant data when the activeTab is 'Request'
      fetch(menuUrl + restaurant.name)
        .then((response) => response.json())
        .then((data) => {
          setMenu(data.menu_items);
          console.log(data.menu_items);
        })
        .catch((error) => {
          console.error('Error fetching restaurant details:', error);
        });
    }
  }, [restaurantActive, restaurant]);

  useEffect(() => {
    if (activeTab === 'Request') {
      // Fetch restaurant data when the activeTab is 'Request'
      fetch(restaurantsUrl)
        .then((response) => response.json())
        .then((data) => {
          setRestaurants(data.nearby_restaurants);
        })
        .catch((error) => {
          console.error('Error fetching restaurant data:', error);
        });
    }
  }, [activeTab, restaurantsUrl]);


  const handleDateChange = (value) => {
    // Ensure value is a valid date format (MM/DD/YYYY or MM/DD/YY)
    setSelectedDate(value);
  };

  const handleTabChange = (index) => {
    setRequestingMode(index === 1);
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

    // Open the modal
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    // Close the modal
    setIsModalOpen(false);
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

          {activeTab === 'Request' && !restaurantActive && (
            <div>
              <VStack spacing={4} align="flex-start">
                <Heading size="sm">Select a restaurant:</Heading>
                <Text>Restaurant details:</Text>
                <ul>
                  {restaurants.map((restaurant, index) => (
                    <li key={index}>{`${restaurant.name}, ${restaurant.address}`}</li>
                  ))}
                </ul>
              </VStack>
            </div>
          )}


        {restaurantActive && (
          <div style={{overflow: 'scroll', width:'100%', maxHeight: '300px'}}>
            <div style={{padding: '6px'}}></div>

            <VStack spacing={4} align="flex-start">
              <Heading size="sm">Menu</Heading>
              <MenuList menuItems={menu} />
            </VStack>

            <div style={{padding: '12px'}}></div>
          </div>
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

          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Success! {(activeTab === "Donate" ? ("+") : ("-"))} 1 Coins</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                We've received your {(activeTab === "Donate" ? ("Donation") : ("Request"))}!
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleCloseModal}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          

          <div style={{ padding: '12px' }}></div>

          <Button style={{color: 'white', backgroundColor: 'green'}} onClick={handleSubmit}>Submit</Button>
        </div>
      </VStack>
    </div>
  );
};

export default DonationForm;
