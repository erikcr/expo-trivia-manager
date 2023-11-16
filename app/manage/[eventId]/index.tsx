import { useContext, useState, useEffect } from "react";
import { StatusBar, Platform, ScrollView } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Box,
  HStack,
  VStack,
  Heading,
  Text,
  useToast,
  Toast,
  ToastTitle,
  Icon,
} from "@gluestack-ui/themed";
import {
  ChevronRight,
  PlusCircleIcon,
  SettingsIcon,
} from "lucide-react-native";

import { supabase } from "../../../utils/supabase";
import { SessionContext } from "../../../utils/SessionContext";

import UserProfile from "../../../components/header/UserProfile";

export default function ManageEvent() {
  const { eventId } = useLocalSearchParams();
  const session = useContext(SessionContext);
  const [event, setEvent] = useState({});
  const [eventRounds, setEventRounds] = useState([]);
  const [activeRound, setActiveRound] = useState(null);

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
        console.log(data);
        setEventRounds(data);
        setActiveRound(data[0]);
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
          _dark: { bg: "$backgroundDark950" },
        }}
      >
        <Box flex={1}>
          <Box w="100%" borderBottomWidth={1}>
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

          <HStack w="100%" display="none" sx={{ "@md": { display: "flex" } }}>
            <Box
              flex={1}
              display="none"
              maxWidth={340}
              w="100%"
              pl="$12"
              borderEndWidth={1}
              sx={{
                "@md": {
                  display: "flex",
                  _web: {
                    maxHeight: "calc(100vh - 144px)",
                  },
                },
              }}
            >
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
                    </HStack>
                    <VStack w="100%">
                      <HStack space="lg" w="100%">
                        <VStack flex={1}>
                          {eventRounds.map((round, rIndex) => (
                            <VStack
                              key={rIndex}
                              alignContent="center"
                              justifyContent="space-between"
                              pb="$2"
                            >
                              <Text
                                size="sm"
                                color="$textLight900"
                                pb="$1"
                                sx={{ _dark: { color: "$textDark100" } }}
                              >
                                {round.name}
                              </Text>

                              {round[
                                process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME
                              ].map((question, qIndex) => (
                                <VStack
                                  key={qIndex}
                                  alignContent="center"
                                  justifyContent="space-between"
                                  pl="$2"
                                  px="$1"
                                >
                                  <Text
                                    size="sm"
                                    color="$textLight900"
                                    isTruncated={true}
                                    sx={{ _dark: { color: "$textDark100" } }}
                                  >
                                    {qIndex + 1}. {question.question}
                                  </Text>
                                </VStack>
                              ))}
                            </VStack>
                          ))}
                        </VStack>
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              </ScrollView>
            </Box>
          </HStack>
        </Box>
      </Box>
    </>
  );
}
