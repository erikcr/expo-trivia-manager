import { useContext, useState, useEffect } from "react";
import { StatusBar, Platform, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  Button,
  ButtonText,
  ButtonIcon,
  useToast,
  Toast,
  ToastTitle,
  Icon,
} from "@gluestack-ui/themed";
import {
  PlusCircleIcon,
  Settings,
  Settings2,
  SettingsIcon,
} from "lucide-react-native";

import { supabase } from "../../utils/supabase";
import { SessionContext } from "../../utils/SessionContext";

import UserProfile from "../../components/header/UserProfile";
import Header from "../../components/Header";

export default function ManageEvent() {
  const { eventId } = useLocalSearchParams();
  const session = useContext(SessionContext);
  const [event, setEvent] = useState({});
  const [eventRounds, setEventRounds] = useState([]);

  const toast = useToast();

  const getEventRounds = async () => {
    if (session) {
      const { data, error } = await supabase
        .from(process.env.EXPO_PUBLIC_ROUNDS_TABLE_NAME)
        .select(
          `
      id,
      name,
      description,
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
        .eq("event_id", eventId)
        .eq("owner", session.user.id);

      if (data) {
        setEventRounds(data);
      } else if (error) {
        throw error;
      }
    }
  };

  const getEvent = async () => {
    if (session) {
      const { data, error } = await supabase
        .from(process.env.EXPO_PUBLIC_EVENTS_TABLE_NAME)
        .select()
        .limit(1)
        .eq("id", eventId)
        .eq("owner", session.user.id);

      if (!data?.length) {
        toast.show({
          placement: "bottom right",
          render: ({ id }: any) => {
            return (
              <Toast nativeID={id} variant="accent" action="error">
                <ToastTitle>Event does not exist.</ToastTitle>
              </Toast>
            );
          },
        });

        router.replace("/manage");
      } else {
        setEvent(data[0]);
        getEventRounds();
      }
    }
  };

  useEffect(() => {
    getEvent();
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
            <Box>
              {/* big screen */}
              <Box
                px="$16"
                w="100%"
                borderBottomWidth={1}
                display="none"
                sx={{
                  "@md": {
                    display: "flex",
                  },
                  _light: { borderColor: "$borderLight100" },
                  _dark: { borderColor: "$borderDark900" },
                }}
              >
                <HStack
                  alignItems="center"
                  justifyContent="space-between"
                  mx="auto"
                  w="100%"
                  my="$2"
                >
                  <Text>Brainy Brawls</Text>

                  <Text>{event.name}</Text>

                  <HStack space="lg" alignItems="center" pr="$1.5">
                    {/* <ToggleMode /> */}
                    <UserProfile />
                  </HStack>
                </HStack>
              </Box>
            </Box>
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

                  <VStack space="md">
                    <HStack
                      alignContent="center"
                      justifyContent="space-between"
                    >
                      <Heading size="sm">Rounds</Heading>
                      <Icon as={PlusCircleIcon} />
                    </HStack>
                    <VStack w="100%">
                      <HStack space="lg" w="100%">
                        <VStack flex={1}>
                          {eventRounds.map((item, index) => (
                            <HStack
                              key={index}
                              alignContent="center"
                              justifyContent="space-between"
                            >
                              <Text
                                size="sm"
                                color="$textLight900"
                                sx={{ _dark: { color: "$textDark100" } }}
                              >
                                {item.name}
                              </Text>
                              <Icon as={SettingsIcon} />
                            </HStack>
                          ))}
                        </VStack>
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              </ScrollView>
            </Box>

            <ScrollView style={{ flex: 1 }}></ScrollView>
          </HStack>

          {/* <MobileModeChangeButton /> */}
        </Box>

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
    </>
  );
}
