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
  Toast,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { Hash } from "lucide-react-native";

import { supabase } from "../../../../utils/supabase";
import { SessionContext } from "../../../../utils/SessionContext";
import { DbResult, Tables } from "../../../../types/database.types";
import { SidebarList } from "../../../../types/app.types";

import NHeader from "../../../../components/NHeader";
import NSidebar from "../../../../components/NSidebar";
import NContentHeader from "../../../../components/NContentHeader";

const pageTitle = "Event > Questions";

export default function AllEventsPage() {
  const { eventId } = useLocalSearchParams();
  const session = useContext(SessionContext);

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
    {
      type: "header",
      label: "Event",
    },
    {
      type: "route",
      label: "Home",
      destination: `/dashboard/event/${eventId}`,
    },
  ];
  const [sidebarItems, setSidebarItems] = useState(DEFAULT_SIDEBAR);

  const [event, setEvent] = useState<Tables<"v001_events_stag"> | undefined>(
    undefined
  );
  const [eventRounds, setEventRounds] = useState<
    Tables<"v001_rounds_stag">[] | undefined
  >([]);
  const [roundQuestions, setRoundQuestions] = useState<
    Tables<"v001_questions_stag">[] | undefined
  >([]);

  const toast = useToast();

  const getEventRounds = async () => {
    if (session) {
      const { data, error } = await supabase
        .from("v001_rounds_stag")
        .select()
        .order("order_num")
        .eq("event_id", Number(eventId))
        .eq("owner", session?.user.id);

      if (data) {
        let newSidebar = DEFAULT_SIDEBAR.concat(
          {
            type: "header",
            label: "Rounds",
          },
          {
            type: "rounds",
            rounds: data,
          }
        );
        setSidebarItems(newSidebar);
      }
    }
  };

  const getEvent = async () => {
    if (session) {
      const { data, error } = await supabase
        .from("v001_events_stag")
        .select()
        .eq("id", Number(eventId))
        .eq("owner", session?.user.id);

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

        router.replace("/dashboard/events");
      } else {
        setEvent(data[0]);
        getEventRounds();
      }
    }
  };

  useEffect(() => {
    if (session) {
      getEvent();
    }
  }, [session]);

  const PageContent = () => {
    return (
      <VStack space="md" width="100%" px="$4" sx={{ "@md": { px: "$0" } }}>
        {roundQuestions?.map((item, index) => (
          <VStack
            key={index}
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
              {item.question}
            </Text>

            <Input w="$full" size="sm">
              <InputField placeholder="The answer" value={item.answer} />
            </Input>

            <HStack pt="$1">
              <Input size="sm">
                <InputSlot pl="$3">
                  <InputIcon as={Hash} />
                </InputSlot>
                <InputField placeholder="Points" value={item.points} />
              </Input>
            </HStack>
          </VStack>
        ))}

        {roundQuestions && roundQuestions?.length && (
          <Text px="$2">No questions in the round.</Text>
        )}
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
              {event?.name || "Loading..."}
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
