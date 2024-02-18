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
import axios from 'axios';

const DonationForm = ({user, lat, lng, setRequestingMode, restaurantActive, restaurant, donatorActive, donator, requesterActive, requester, points, setPoints }) => {
  const [activeTab, setActiveTab] = useState('Pickup');
  const [itemList, setItemList] = useState([]);
  const [address, setAddress] = useState(user.address);
  const [newItemName, setNewItemName] = useState('');
  const [newItemDescription, setNewItemDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toLocaleDateString('en-US'));
  const [restaurants, setRestaurants] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [menu, setMenu] = useState([{item_name: 'Loading...', price: 'Loading...', category: 'Loading...', allergens: 'Loading...'}]);

  const donatorsUrl = 'http://127.0.0.1:8000/nearby-donators/';
  const restaurantsUrl = `http://127.0.0.1:8000/nearby-restaurants/?latitude=${lat}&longitude=${lng}`;
  const menuUrl = `http://127.0.0.1:8000/restaurant-details/?name=`;
  const pointsUrl = `http://127.0.0.1:8000/update-points/`; 

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
    setActiveTab(index === 0 ? 'Pickup' : 'Request');
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

  const updatePoints = async (amount) => {
    axios.post(pointsUrl, {
      id: user.id,
      amount: amount
    })
    .then((response) => { console.log(response); })
    .catch((error) => { console.log(error); });
  };


  const handleSubmit = () => {
    if (requesterActive || (!donatorActive && !restaurantActive && !requesterActive)) {
      updatePoints(1);
      setPoints(points + 1);
    } else {
      updatePoints(-1);
      setPoints(points - 1);
    }

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
        {!(requesterActive || donatorActive || restaurantActive) && (
        <Tabs variant="soft-rounded" colorScheme="gray" onChange={handleTabChange}>
          <TabList>
            <Tab>Donate</Tab>
            <Tab>Request</Tab>
          </TabList>
        </Tabs>
        )}
        
        {(activeTab === 'Pickup') && !donatorActive && !requesterActive && !restaurantActive && (<Heading size="sm">Add items to donate:</Heading>)}

        {(activeTab === 'Pickup' && !donatorActive && !requesterActive && !restaurantActive && itemList.length > 0) && (
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

        
        {/* List of Restaurants */}
        {activeTab === 'Request' && !restaurantActive && !requesterActive && !donatorActive && (
          <div style={{width:"100%"}}>
            <VStack spacing={4} align="flex-start">
              <Heading size="sm">Select a restaurant on the map to order.</Heading>
            </VStack>
          </div>
        )}

        {/* Restaurant Details */}
        {restaurantActive && !donatorActive && !requesterActive && (
          <div>
            <Heading style={{ fontSize: '20px' }}>{restaurant.name}</Heading>
            <div style={{ overflow: 'scroll', width: "100%", maxWidth: '100%', maxHeight: '500px', boxSizing: 'border-box' }}>
            <div style={{ padding: '4px' }}></div>
            <div style={{ paddingTop: '8px', paddingBottom: '12px', width: "100%"}}>
              <MenuList menuItems={menu} />
            </div>
          </div>
        </div>
        )}

        {/* Donator Details */}
        {donatorActive && !restaurantActive && !requesterActive && (
          <div style={{overflow: 'scroll', width:'100%', maxHeight: '300px'}}>
            <div style={{padding: '6px'}}></div>

            <VStack spacing={4} align="flex-start">
              <Heading size="sm">Donator details</Heading>
              <Text>{donator.name}</Text>
              <Text>{donator.items}</Text>
              <Text>{donator.expiry}</Text>
              </VStack>

              <div style={{padding: '12px'}}></div>
          </div>
        )}

        {/* Requester Details */}
        {requesterActive && !donatorActive && !restaurantActive && (
          <div style={{overflow: 'scroll', width:'100%', maxHeight: '300px'}}>
            <div style={{padding: '6px'}}></div>

            <VStack spacing={4} align="flex-start">
              <Heading size="sm">Requester details</Heading>
              <Text>{requester.name}</Text>
              <Text>{requester.restaurant_name}</Text>
              <Text>{requester.order}</Text>
              <Text>{requester.expiry}</Text>
            </VStack>

            <div style={{padding: '12px'}}></div>
          </div>
        )}

        {/* Donation Form */}
        {activeTab === 'Pickup' && !donatorActive && !requesterActive && !restaurantActive && (
          <div>
            <VStack spacing={4} align={'flex-start'}>
              {/* Your form elements for donation */}
              <Input
                placeholder="Item name (e.g. Cookies)"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
              />
              <Textarea
                placeholder="Optional: Item Description (e.g. Chocolate Chip)"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
              />
              {/* Add more form elements as needed */}
              <Button style={{fontSize: '14px', color: 'white', backgroundColor: '#Dcab80'}} onClick={handleAddItem}>Add Item</Button>
            </VStack>
          
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
          </div> 
        )}

        {/* Submit */}
        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Success! ({(activeTab === "Pickup" ? ("+") : ("-"))}1 Coin)</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              We've received your {(activeTab === "Pickup" ? ("donation") : ("request"))}!
            </ModalBody>
            <ModalFooter>
            <Button style={{color: 'white', backgroundColor: '#b06b44'}} onClick={handleCloseModal}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <div style={{ padding: '2px' }}></div>

        {!(activeTab === 'Request' && !restaurantActive && !requesterActive && !donatorActive) && <Button style={{color: 'white', backgroundColor: '#b06b44'}} onClick={handleSubmit}>Submit</Button>}
          
      </VStack>
    </div>
  );
};

export default DonationForm;
