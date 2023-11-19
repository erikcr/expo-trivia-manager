import { Pressable } from "react-native";

import {
  Box,
  Button,
  Heading,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed";

import NHeader from "../components/NHeader";
import NSidebar from "../components/NSidebar";
import NContentHeader from "../components/NContentHeader";

const pageTitle = "Events";
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
        {/**
         * Left-side stack
         */}
        <VStack
          w="$1/6"
          h="100%"
          borderRightWidth={1}
          display="none"
          sx={{
            "@md": {
              display: "flex",
            },
            _light: { borderColor: "$borderLight400" },
            _dark: { borderColor: "$borderDark900" },
          }}
        >
          {/**
           * Left-side header
           */}
          <NHeader text="Brainy Brawls" />

          {/**
           * Left-side sidebar
           */}
          <NSidebar />
        </VStack>

        {/**
         * Main content stack
         */}
        <VStack flexGrow={1}>
          {/**
           * Main content header
           */}
          <NContentHeader>
            <Text
              sx={{
                _light: { color: "$textLight800" },
                _dark: { borderColor: "$borderDark900" },
              }}
            >
              {pageTitle}
            </Text>
          </NContentHeader>

          {/**
           * Main content body
           */}
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
                <Box
                  key={index}
                  w="$full"
                  mb="$4"
                  sx={{
                    "@md": { w: "31%", mr: "2%" },
                    "@lg": { w: "23%", mr: "2%" },
                  }}
                >
                  <Pressable>
                    <Box
                      w="$full"
                      pl="$2"
                      pt="$2"
                      pb="$10"
                      borderWidth={1}
                      borderRadius="$md"
                    >
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
