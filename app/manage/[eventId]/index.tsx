import { useContext, useState, useEffect } from "react";
import { StatusBar, Platform, ScrollView, Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import {
  Box,
  Button,
  ButtonText,
  ButtonIcon,
  HStack,
  VStack,
  Heading,
  Text,
  useToast,
  Toast,
  ToastTitle,
  Icon,
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "@gluestack-ui/themed";
import {
  ArrowUp01,
  ChevronRight,
  Hash,
  Plus,
  PlusCircleIcon,
  SettingsIcon,
} from "lucide-react-native";

import { supabase } from "../../../utils/supabase";
import { SessionContext } from "../../../utils/SessionContext";
import { DbResult, Tables } from "../../../types/database.types";

import UserProfile from "../../../components/header/UserProfile";

export default function ManageEvent() {
  const { eventId } = useLocalSearchParams();
  const session = useContext(SessionContext);
  const [event, setEvent] = useState<Tables<"v001_events_stag"> | undefined>(
    undefined
  );
  const [eventRounds, setEventRounds] = useState<Tables<"v001_rounds_stag">[]>(
    []
  );
  const [activeRound, setActiveRound] = useState<
    Tables<"v001_rounds_stag"> | undefined
  >(undefined);

  const toast = useToast();

  const getEventRounds = async () => {
    if (session) {
      const query = supabase
        .from(process.env.EXPO_PUBLIC_ROUNDS_TABLE_NAME)
        .select(`id, name, description, status,
          v001_questions_stag (id, question, answer, points, status,
            v001_responses_stag (id)
          )`
        )
        .order("order_num")
        .eq("event_id", eventId)
        .eq("owner", session.user.id);

      const events: DbResult<typeof query> = await query;

      if (events) {
        console.log(events);
        setEventRounds(events);
        setActiveRound(events[0]);
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
            {/* Left-hand navigation */}
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
                              <Pressable
                                onPress={() => {
                                  setActiveRound(round);
                                }}
                              >
                                <HStack justifyContent="space-between">
                                  <Text
                                    size="sm"
                                    color="$textLight900"
                                    pb="$1"
                                    sx={{ _dark: { color: "$textDark100" } }}
                                  >
                                    {round.name} (
                                    {
                                      round[
                                        process.env
                                          .EXPO_PUBLIC_QUESTIONS_TABLE_NAME
                                      ].length
                                    }
                                    )
                                  </Text>

                                  <Icon size="sm" as={ChevronRight} />
                                </HStack>
                              </Pressable>
                            </VStack>
                          ))}
                        </VStack>
                      </HStack>
                    </VStack>
                  </VStack>
                </VStack>
              </ScrollView>
            </Box>

            <HStack style={{ flex: 1 }}>
              {/* Center content */}
              <Box
                sx={{
                  "@md": {
                    maxHeight: "calc(100vh - 144px)",
                    pl: "$8",
                  },
                }}
                flex={1}
              >
                <Box pt="$6" pb="$2.5" px="$4" sx={{ "@md": { px: 0 } }}>
                  <HStack
                    px="$2"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Heading size="xl">Questions</Heading>
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
                      size="sm"
                    >
                      <ButtonIcon as={Plus} />
                    </Button>
                  </HStack>
                </Box>

                <VStack
                  space="md"
                  width="100%"
                  px="$4"
                  sx={{ "@md": { px: "$0" } }}
                >
                  {activeRound &&
                    activeRound[
                      process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME
                    ].map((question, qIndex) => (
                      <VStack
                        key={qIndex}
                        alignContent="center"
                        justifyContent="space-between"
                        px="$2"
                        pb="$4"
                      >
                        <Text
                          pb="$2"
                          size="sm"
                          color="$textLight900"
                          isTruncated={true}
                          sx={{ _dark: { color: "$textDark100" } }}
                        >
                          {qIndex + 1}. {question.question}
                        </Text>

                        <Input w="$full" size="sm">
                          <InputField
                            placeholder="The answer"
                            value={question.answer}
                          />
                        </Input>

                        <HStack pt="$1">
                          <Input size="sm">
                            <InputSlot pl="$3">
                              <InputIcon as={Hash} />
                            </InputSlot>
                            <InputField
                              placeholder="Points"
                              value={question.points}
                            />
                          </Input>
                        </HStack>
                      </VStack>
                    ))}

                  {activeRound &&
                    !activeRound[process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME]
                      .length && (
                      <Text px="$2">No questions in the round.</Text>
                    )}
                </VStack>
              </Box>

              {/* Right content */}
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
                <Box pt="$6" pb="$2.5" pl="$4" sx={{ "@md": { px: 0 } }}>
                  <HStack
                    w="100%"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Heading size="xl">Responses</Heading>
                  </HStack>
                </Box>
              </Box>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </>
  );
}
