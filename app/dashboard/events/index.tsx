import { useContext, useState, useEffect } from "react";
import { Pressable } from "react-native";
import { router } from "expo-router";

import {
  Box,
  Button,
  ButtonText,
  Heading,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed";

import { supabase } from "../../../utils/supabase";
import { SessionContext } from "../../../utils/SessionContext";
import { DbResult, Tables } from "../../../types/database.types";
import { SidebarList } from "../../../types/app.types";

import NHeader from "../../../components/NHeader";
import NSidebar from "../../../components/NSidebar";
import NContentHeader from "../../../components/NContentHeader";

const pageTitle = "All Events";
const DEFAULT_SIDEBAR: SidebarList = [
  {
    type: "header",
    label: "Dashboard",
  },
  {
    type: "route",
    label: "All events",
    destination: "/dashboard/events",
  },
];

export default function AllEventsPage() {
  const session = useContext(SessionContext);
  const [sidebarItems, setSidebarItems] = useState(DEFAULT_SIDEBAR);

  const [allEvents, setAllEvents] = useState<
    Tables<"v001_events_stag">[] | null
  >([]);

  const getAllEvents = async () => {
    const { data, error } = await supabase
      .from(process.env.EXPO_PUBLIC_EVENTS_TABLE_NAME)
      .select()
      .eq("owner", session?.user.id);

    if (data) {
      setAllEvents(data);
    }
  };

  useEffect(() => {
    if (session) {
      getAllEvents();
    }
  }, [session]);

  const PageContent = () => {
    return (
      <VStack>
        <HStack>
          <Button size="sm">
            <ButtonText>New event</ButtonText>
          </Button>
        </HStack>

        <HStack
          display="flex"
          flexWrap="wrap"
          pt="$4"
          sx={{ "@md": { px: "$0" } }}
        >
          {allEvents?.map((item, index) => (
            <Box
              key={index}
              w="$full"
              mb="$4"
              sx={{
                "@md": { w: "31%", mr: "2%" },
                "@lg": { w: "23%", mr: "2%" },
              }}
            >
              <Pressable
                onPress={() => router.push(`/dashboard/event/${item.id}`)}
              >
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
      </VStack>
    );
  };

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
          <NSidebar dynamicSidebarItems={sidebarItems} />
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
            {PageContent()}
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}
