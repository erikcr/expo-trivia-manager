import React, { useEffect, useState, useContext } from "react";
import { StatusBar, Platform, ScrollView } from "react-native";
import {
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
} from "@gluestack-ui/themed";
import {
  Plus,
  Home,
  MessageCircle,
  User,
  SlidersHorizontal,
} from "lucide-react-native";
import { useNavigation, useRouter, useLocalSearchParams } from "expo-router";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../utils/SessionContext";
import Header from "../components/Header";
// import MobileBottomTabs from '../components/MobileBottomTabs';
// import MobileProfilePage from '../components/MobileProfilePage';
import WebSidebar from "../components/WebSidebar";
import MainContent from "../components/main-content/MainContent";

const EventScreen = () => {
  const params = useLocalSearchParams();
  const session = useContext(SessionContext);
  const [activeEvent, setActiveEvent] = useState(null);
  const [allRounds, setAllRounds] = useState(null);

  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    }
  }, []);

  const getActiveEvent = async () => {
    if (params) {
      const { data, error } = await supabase
        .from(process.env.EXPO_PUBLIC_EVENTS_TABLE_NAME)
        .select();

      if (data?.length) setActiveEvent(data[0]);
    }
  };

  const getAllRounds = async (eventId: string) => {
    const { data, error } = await supabase
      .from(process.env.EXPO_PUBLIC_ROUNDS_TABLE_NAME)
      .select(
        `
      id,
      name,
      status,
      ${process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME} (
        id,
        question,
        points,
        status,
        ${process.env.EXPO_PUBLIC_RESPONSES_TABLE_NAME} (
          id
        )
      )
      `
      )
      .order("order_num")
      .eq("event_id", eventId);
    if (data) {
      setAllRounds(data);
    } else if (error) {
      throw error;
    }
  };
  useEffect(() => {
    getActiveEvent();
  }, [session]);

  return (
    <>
      <Box
        sx={{
          _light: { bg: "white" },
          _dark: { bg: "$backgroundDark950" },
        }}
      >
        <StatusBar />

        <Box flex={1}>
          {/* <MobileProfilePage isActive={activeTab === 'Profile'} /> */}

          <Box
            w="100%"
            sx={
              {
                //   display: activeTab !== "Profile" ? "flex" : "none",
              }
            }
          >
            {/* header */}
            <Header />
          </Box>

          <ScrollView>
            <Box
              sx={{
                // display: activeTab !== "Profile" ? "flex" : "none",

                "@md": { display: "none" },
              }}
            >
              {/* <MainContent
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                events={myEvents}
              /> */}
            </Box>
          </ScrollView>

          <HStack w="100%" display="none" sx={{ "@md": { display: "flex" } }}>
            <Box
              flex={1}
              display="none"
              sx={{
                "@md": {
                  display: "flex",
                  _web: {
                    maxHeight: "calc(100vh - 144px)",
                  },
                },
              }}
              maxWidth={340}
              w="100%"
              pl="$12"
            >
              {/* common sidebar contents for web and mobile */}
              <ScrollView
                style={{ flex: 1 }}
                contentContainerStyle={{ flex: 1 }}
              >
                <VStack space="xl" py="$6" px="$4">
                  <VStack space="md">
                    <Heading size="sm">Event</Heading>
                    <VStack w="100%">
                      <HStack space="lg" w="100%">
                        <VStack flex={1}>
                          <Text
                            size="sm"
                            color="$textLight900"
                            sx={{ _dark: { color: "$textDark100" } }}
                          >
                            Settings
                          </Text>
                        </VStack>
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              </ScrollView>
            </Box>

            <ScrollView style={{ flex: 1 }}>
              <Box
                sx={{
                  "@md": {
                    maxHeight: "calc(100vh - 144px)",
                    pr: "$16",
                    pl: "$8",
                  },
                }}
                flex={1}
              >
                <Box>
                  <Box pt="$6" pb="$2.5" px="$4" sx={{ "@md": { px: 0 } }}>
                    <HStack
                      w="100%"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Heading size="xl">{activeEvent.name}</Heading>
                      {/* Hidden for mobile screens */}
                      <Button
                        display="none"
                        sx={{
                          "@md": {
                            display: "flex",
                          },
                        }}
                        ml="auto"
                        variant="outline"
                        action="secondary"
                      >
                        <ButtonIcon as={Plus} />
                        <ButtonText
                          pl="$2"
                          sx={{
                            _light: {
                              color: "$textLight800",
                            },
                            _dark: {
                              color: "$textDark300",
                            },
                          }}
                        >
                          Create new event
                        </ButtonText>
                      </Button>
                    </HStack>
                  </Box>

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
                      ></HStack>
                    </ScrollView>
                  </Box>
                </Box>
              </Box>
            </ScrollView>
          </HStack>

          {/* <MobileModeChangeButton /> */}
        </Box>

        {/* mobile bottom tabs */}
        <Box
          h={72}
          alignItems="center"
          w="100%"
          sx={{
            "@md": {
              display: "none",
            },
            _dark: { borderColor: "$borderDark900" },
          }}
          borderTopWidth="$1"
          borderColor="$borderLight50"
        >
          {/* <MobileBottomTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            bottomTabs={bottomTabs}
          /> */}
        </Box>
      </Box>
      {/* )} */}
    </>
  );
};
export default EventScreen;
