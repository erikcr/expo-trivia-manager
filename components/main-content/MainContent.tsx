import React from "react";
import { Box, HStack, ScrollView, Text, Heading } from "@gluestack-ui/themed";
import MainContentHeader from "./MainContentHeader";

const MainContent = ({
  modalVisible,
  setModalVisible,
  setActiveTab,
  activeTab,
  events,
}: any) => {
  return (
    <Box
      sx={{ "@md": { maxHeight: "calc(100vh - 144px)", pr: "$16", pl: "$8" } }}
      flex={1}
    >
      <Box>
        {/* explore page main content header */}
        <MainContentHeader
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          setActiveTab={setActiveTab}
          activeTab={activeTab}
        />

        <Box w="100%">
          <ScrollView
            horizontal
            style={{ width: "100%" }}
            showsHorizontalScrollIndicator={false}
            scrollEventThrottle={50}
          >
            <HStack
              space="md"
              width="100%"
              px="$4"
              sx={{ "@md": { px: "$0" } }}
            >
              {events.map((item, index) => {
                return (
                  <Box key={index} borderWidth={1} borderRadius="$md" p="$12" m="$2">
                    <Heading>{item.name}</Heading>
                    <Text>{item.location}</Text>
                    <Text>{item.venue}</Text>
                  </Box>
                );
              })}
            </HStack>
          </ScrollView>
        </Box>
      </Box>
    </Box>
  );
};
export default MainContent;
