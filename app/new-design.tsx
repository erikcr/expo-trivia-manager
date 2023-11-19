import { useContext, useState, useEffect } from "react";
import { ScrollView, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed";

const sidebarItems = [
  {
    type: "header",
    label: "Events",
  },
  {
    type: "route",
    label: "Event 1",
    destination: "new-design/?e=1",
  },
  {
    type: "route",
    label: "Event 2",
    destination: "new-design/?e=2",
  },
  {
    type: "route",
    label: "Event 3",
    destination: "new-design/?e=3",
  },
  {
    type: "header",
    label: "Account",
  },
  {
    type: "route",
    label: "Settings",
    destination: "new-design/?e=settings",
  },
  {
    type: "route",
    label: "Profile",
    destination: "new-design/?e=profile",
  },
];

const events = [
  {
    name: "Event 1",
    description: "Short form desc",
    venue: "Best Bar",
  },
  {
    name: "Event 1",
    description: "Short form desc",
    venue: "Best Bar",
  },
  {
    name: "Event 1",
    description: "Short form desc",
    venue: "Best Bar",
  },
  {
    name: "Event 1",
    description: "Short form desc",
    venue: "Best Bar",
  },
  {
    name: "Event 1",
    description: "Short form desc",
    venue: "Best Bar",
  },
];

export default function NewDesign() {
  return (
    <Box
      h="$full"
      sx={{
        _dark: { bg: "$backgroundDark950" },
      }}
    >
      <HStack h="$full" flex={1}>
        <VStack
          w="$1/6"
          h="100%"
          borderRightWidth={1}
          sx={{
            _light: { borderColor: "$borderLight400" },
            _dark: { borderColor: "$borderDark900" },
          }}
        >
          {/**
           * Primary header
           */}
          <Box
            w="$full"
            py="$2"
            alignItems="center"
            borderBottomWidth={1}
            sx={{
              _light: { borderColor: "$borderLight400" },
              _dark: { borderColor: "$borderDark900" },
            }}
          >
            <Text
              sx={{
                _light: { color: "$textLight800" },
                _dark: { borderColor: "$borderDark900" },
              }}
            >
              Brainy Brawls
            </Text>
          </Box>

          {/**
           * Sidebar
           */}
          <ScrollView>
            <VStack px="$4" py="$6">
              {sidebarItems.map((item, index) => {
                switch (item.type) {
                  case "header":
                    return (
                      <Heading
                        pb="$1"
                        pt={index !== 0 ? "$3" : "$0"}
                        key={index}
                        size="sm"
                      >
                        {item.label}
                      </Heading>
                    );

                  case "route":
                    return (
                      <Pressable
                        key={index}
                        onPress={() => router.push(item.destination)}
                      >
                        <Text size="sm" color="$textLight900">
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                }
              })}
            </VStack>
          </ScrollView>
        </VStack>

        {/**
         * Main content header
         */}
        <VStack flexGrow={1} h="100%">
          <Box
            w="$full"
            py="$2"
            px="$8"
            borderBottomWidth={1}
            sx={{
              _light: { borderColor: "$borderLight400" },
              _dark: { borderColor: "$borderDark900" },
            }}
          >
            <Text
              sx={{
                _light: { color: "$textLight800" },
                _dark: { borderColor: "$borderDark900" },
              }}
            >
              Content header
            </Text>
          </Box>

          <Box w="$full" py="$6" px="$8">
            <HStack>
              <Button size="sm">New event</Button>
            </HStack>

            <HStack
              display="flex"
              flexWrap="wrap"
              pt="$4"
              sx={{ "@md": { px: "$0" } }}
            >
              {events.map((item, index) => (
                <Box key={index} w="23%" mb="$4" mr="2%">
                  <Pressable>
                    <Box w="$full" pl="$2" pt="$2" pb="$10" borderWidth={1} borderRadius="$md">
                      <Heading>{item.name}</Heading>
                      <Text>{item.description}</Text>
                      <Text>{item.venue}</Text>
                    </Box>
                  </Pressable>
                </Box>
              ))}
            </HStack>
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}
