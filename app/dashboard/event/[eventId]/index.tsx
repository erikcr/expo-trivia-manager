import { useContext, useState, useEffect } from "react";
import { Pressable } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import {
  Box,
  Button,
  ButtonText,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  Heading,
  HStack,
  Text,
  VStack,
} from "@gluestack-ui/themed";

import { supabase } from "../../../../utils/supabase";
import { SessionContext } from "../../../../utils/SessionContext";
import { DbResult, Tables } from "../../../../types/database.types";

import NHeader from "../../../../components/NHeader";
import NSidebar from "../../../../components/NSidebar";
import NContentHeader from "../../../../components/NContentHeader";

const pageTitle = "Event > Questions";
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

export default function AllEventsPage() {
  const { eventId } = useLocalSearchParams();
  const session = useContext(SessionContext);

  const [eventRounds, setEventRounds] = useState<
    Tables<"v001_rounds_stag">[] | null
  >([]);

  const getEventRounds = async () => {
    if (session) {
      const { data, error } = await supabase
        .from("v001_rounds_stag")
        .select()
        .order("order_num")
        .eq("event_id", Number(eventId))
        .eq("owner", session.user.id);

      if (events) {
        console.log(events);
        setEventRounds(data);
      }
    }
  };

  useEffect(() => {
    if (session) {
      getEventRounds();
    }
  }, [session]);

  const PageContent = () => {
    return (
      <VStack>
        <HStack>
          <Button size="sm">
            <ButtonText>New question</ButtonText>
          </Button>
        </HStack>

        <HStack
          display="flex"
          flexWrap="wrap"
          pt="$4"
          sx={{ "@md": { px: "$0" } }}
        >
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
                activeRound[process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME].map(
                  (question, qIndex) => (
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
                  )
                )}

              {activeRound &&
                !activeRound[process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME]
                  .length && <Text px="$2">No questions in the round.</Text>}
            </VStack>
          </Box>
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
            {PageContent()}
          </Box>
        </VStack>
      </HStack>
    </Box>
  );
}
