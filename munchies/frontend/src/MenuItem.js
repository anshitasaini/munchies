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
    <VStack spacing={2} align="flex-start" borderBottom="1px solid #ddd" pb={2} mb={2}>
      <Heading size="sm">{itemName}</Heading>
      <Text>{category}</Text>
      <Text>{allergens ? `Allergens: ${allergens}` : 'No allergens'}</Text>
      <HStack justifyContent="space-between" width="100%">
        <Text>{price}</Text>
        <HStack>
          <IconButton icon={<FaMinus />} onClick={handleDecrement} />
          <Text>{quantity}</Text>
          <IconButton icon={<FaPlus />} onClick={handleIncrement} />
        </HStack>
      </HStack>
    </VStack>
  );
};

export default MenuItem;