import React, { useState } from 'react';
import { VStack, HStack, Text, Button, Heading, IconButton } from '@chakra-ui/react';
import { FaPlus, FaMinus } from 'react-icons/fa';

const MenuItem = ({ itemName, price, category, allergens }) => {
  const [quantity, setQuantity] = useState(0);

  const handleIncrement = () => {
    setQuantity((prevQuantity) => prevQuantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 0) {
      setQuantity((prevQuantity) => prevQuantity - 1);
    }
  };

  return (
    <VStack spacing={1} align="flex-start" width="100%" borderBottom="1px solid #ddd" pb={2} mb={4}>
      <Heading size="sm">{itemName}</Heading>
      <Text style={{ fontSize: '14px' }}>{category}</Text>
      <Text style={{ fontSize: '14px' }}>{allergens ? `Allergens: ${allergens}` : 'No allergens'}</Text>
      <HStack justifyContent="space-between" width="100%">
        <Text style={{ fontSize: '14px' }}>{price}</Text>
        <HStack>
          <IconButton icon={<FaMinus style={{ fontSize: '10px' }} />} onClick={handleDecrement} p={1}  size="sm" /> 
          <Text style={{ fontSize: '14px' }}>{quantity}</Text>
          <IconButton icon={<FaPlus style={{ fontSize: '10px' }} />} onClick={handleDecrement} p={1} size="sm" /> 
        </HStack>
      </HStack>
    </VStack>
  );
};

export default MenuItem;