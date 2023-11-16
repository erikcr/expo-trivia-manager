import { useContext, useState, useEffect } from "react";
import { ScrollView, Pressable } from "react-native";
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
import { ChevronRight, Hash, Plus } from "lucide-react-native";

import { supabase } from "../../../../../utils/supabase";
import { SessionContext } from "../../../../../utils/SessionContext";

import UserProfile from "../../../../../components/header/UserProfile";

export default function ManageRound() {
  const { eventId, roundId } = useLocalSearchParams();
  const session = useContext(SessionContext);
  const [event, setEvent] = useState({});
  const [round, setRound] = useState({});
  const [roundQuestions, setRoundQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const toast = useToast();

  const getRoundQuestions = async () => {
    if (session) {
      const { data, error } = await supabase
        .from(process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME)
        .select()
        .eq("round_id", roundId);

      console.log("questions");
      console.log(data);
      if (data) {
        setRoundQuestions(data);
      }
    }
  };

  const getRound = async () => {
    if (session) {
      const { data, error } = await supabase
        .from(process.env.EXPO_PUBLIC_ROUNDS_TABLE_NAME)
        .select()
        .limit(1)
        .eq("event_id", eventId)
        .eq("id", roundId)
        .eq("owner", session.user.id);

      if (!data?.length) {
        toast.show({
          placement: "bottom right",
          render: ({ id }: any) => {
            return (
              <Toast nativeID={id} variant="accent" action="error">
                <ToastTitle>Round does not exist.</ToastTitle>
              </Toast>
            );
          },
        });

        router.replace(`/manage/${eventId}`);
      } else {
        setRound(data[0]);
        getRoundQuestions();
      }
    }
  };

  const getEvent = async () => {
    if (session) {
      const { data, error } = await supabase
        .from(process.env.EXPO_PUBLIC_EVENTS_TABLE_NAME)
        .select("id, name")
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
        getRound();
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
          {/* Header */}
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
                    <Heading size="sm">Round</Heading>
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
                      <ButtonText>Add</ButtonText>
                    </Button>
                  </HStack>
                </Box>

                <VStack
                  space="md"
                  width="100%"
                  px="$4"
                  sx={{ "@md": { px: "$0" } }}
                >
                  {roundQuestions.map((item, index) => (
                    <Pressable
                      key={index}
                      onPress={() => {
                        setActiveQuestion(item);
                      }}
                    >
                      <VStack
                        alignContent="center"
                        justifyContent="space-between"
                        px="$2"
                      >
                        <Text
                          pb="$2"
                          size="sm"
                          color="$textLight900"
                          sx={{ _dark: { color: "$textDark100" } }}
                        >
                          {index + 1}. {item.question}
                        </Text>
                      </VStack>
                    </Pressable>
                  ))}
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
                    <Heading size="xl">Edit</Heading>
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
                      <ButtonText>Save</ButtonText>
                    </Button>
                  </HStack>

                  {activeQuestion ? (
                    <VStack
                      alignContent="center"
                      justifyContent="space-between"
                      px="$2"
                      pb="$4"
                    >
                      <Text
                        pb="$2"
                        size="sm"
                        color="$textLight900"
                        sx={{ _dark: { color: "$textDark100" } }}
                      >
                        {activeQuestion.question}
                      </Text>

                      <Input w="$full" size="sm">
                        <InputField
                          placeholder="The answer"
                          value={activeQuestion.answer}
                        />
                      </Input>

                      <HStack pt="$1">
                        <Input size="sm">
                          <InputSlot pl="$3">
                            <InputIcon as={Hash} />
                          </InputSlot>
                          <InputField
                            placeholder="Points"
                            value={activeQuestion.points}
                          />
                        </Input>
                      </HStack>
                    </VStack>
                  ) : (
                    <VStack
                      alignContent="center"
                      justifyContent="space-between"
                      px="$2"
                      pb="$4"
                    >
                      <Text
                        pb="$2"
                        size="sm"
                        color="$textLight900"
                        sx={{ _dark: { color: "$textDark100" } }}
                      >
                        Select question to edit.
                      </Text>
                    </VStack>
                  )}
                </Box>
              </Box>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </>
  );
}
