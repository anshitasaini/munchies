// DateInput.js
import React from 'react';
import { Input, InputGroup, InputLeftAddon } from '@chakra-ui/react';

const DateInput = ({ value, onChange }) => {
  return (
    <InputGroup size="sm">
      <InputLeftAddon children="MM/DD/YYYY" />
      <Input
        placeholder="MM/DD/YYYY"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </InputGroup>
  );
};

export default DateInput;
