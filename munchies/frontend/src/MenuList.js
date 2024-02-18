import MenuItem from './MenuItem.js';
import {
    VStack
  } from '@chakra-ui/react';

const MenuList = ({ menuItems }) => {
    return (
        // <VStack spacing={4} align="flex-start" width="100%" maxWidth="500px">
        <div>
            {menuItems.map(({item_name, price, category, allergens}, index) => (
                <MenuItem key={index} itemName={item_name} price={price} category={category} allergens={allergens} />
            ))}
        </div>
        // </VStack>
    );
};

export default MenuList;