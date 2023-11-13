import React from 'react';
import { ScrollView } from 'react-native';
import { Box, VStack } from '@gluestack-ui/themed';
import FilterEvents from './sidebar/FilterEvents';

const WebSidebar = () => {
  return (
    <Box
      flex={1}
      display="none"
      sx={{
        '@md': {
          display: 'flex',
          _web: {
            maxHeight: 'calc(100vh - 144px)',
          },
        },
      }}
      maxWidth={340}
      w="100%"
      pl="$12"
    >
      {/* common sidebar contents for web and mobile */}
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flex: 1 }}>
        <VStack space="xl" py="$6" px="$4">
          <FilterEvents />
        </VStack>
      </ScrollView>
    </Box>
  );
};
export default WebSidebar;
