import React, { useState } from 'react';
import {
  Box,
  HStack,
  Heading,
  Switch,
  Text,
  VStack,
} from '@gluestack-ui/themed';

const FilterEvents = () => {
  const [pastEvents, setPastEvents] = useState(true);

  return (
    <VStack space="md">
      <Heading size="sm">Filter Options</Heading>
      <VStack w="100%">
        <HStack space="lg" w="100%">
          <VStack flex={1}>
            <Text
              size="sm"
              color="$textLight900"
              sx={{ _dark: { color: '$textDark100' } }}
            >
              Exclude past events
            </Text>
            <Text size="xs" color="$textLight500">
              Hide previous events from list
            </Text>
          </VStack>
          <Switch
            size="sm"
            value={pastEvents}
            onValueChange={(val: any) => setPastEvents(val)}
          />
        </HStack>
      </VStack>
    </VStack>
  );
};
export default FilterEvents;
