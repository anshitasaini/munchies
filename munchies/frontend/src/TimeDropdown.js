import React from 'react';
import { ChakraProvider, VStack, Select, extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  components: {
    Select: {
      baseStyle: {
        borderColor: 'gray.200',
        _focus: {
          borderColor: 'blue.400',
        },
      },
    },
  },
});

const TimeDropdown = () => {
  const generateTimeOptions = () => {
    const options = [];
    for (let period = 0; period < 2; period++) {
      for (let hour = 1; hour <= 12; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const formattedHour = hour.toString().padStart(2, '0');
          const formattedMinute = minute.toString().padStart(2, '0');
          const time = `${formattedHour}:${formattedMinute} ${period === 0 ? 'AM' : 'PM'}`;
          options.push({ value: time, label: time });
        }
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  return (
    <ChakraProvider theme={theme}>
      <VStack spacing={4} align="flex-start">
        <Select placeholder="Select time">
          {timeOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </VStack>
    </ChakraProvider>
  );
};

export default TimeDropdown;
