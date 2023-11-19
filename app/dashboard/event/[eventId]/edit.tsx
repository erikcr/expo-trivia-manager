import { useContext, useState, useEffect } from "react";
import { Keyboard } from "react-native";
import { router, useLocalSearchParams } from "expo-router";

import {
  Box,
  Button,
  ButtonText,
  Heading,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  Input,
  InputField,
  InputIcon,
  InputSlot,
  HStack,
  Text,
  Toast,
  ToastTitle,
  useToast,
  VStack,
} from "@gluestack-ui/themed";
import { AlertTriangle } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { supabase } from "../../../../utils/supabase";
import { SessionContext } from "../../../../utils/SessionContext";
import { DbResult, Tables } from "../../../../types/database.types";

import NHeader from "../../../../components/NHeader";
import NSidebar from "../../../../components/NSidebar";
import NContentHeader from "../../../../components/NContentHeader";

const pageTitle = "Edit Event";

const questionSchema = z.object({
  question: z.string().min(1, "Event in required"),
  answer: z.string().min(1, "Answer is required"),
  points: z.number(),
});

type EventSchemaType = z.infer<typeof questionSchema>;

export default function EditEventPage() {
  const { eventId } = useLocalSearchParams();
  const session = useContext(SessionContext);

  const [event, setEvent] = useState<Tables<"v001_events_stag"> | undefined>(
    undefined
  );

  const toast = useToast();

  const getEvent = async () => {
    const { data, error } = await supabase
      .from("v001_events_stag")
      .select()
      .limit(1)
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
    }
  };

  useEffect(() => {
    getEvent();
  }, [session]);

  const PageContent = () => {
    const {
      control,
      formState: { errors },
      handleSubmit,
      reset,
    } = useForm<EventSchemaType>({
      resolver: zodResolver(questionSchema),
    });

    const onSubmit = async (_data: EventSchemaType) => {
      console.log(_data);
    };

    const handleKeyPress = () => {
      Keyboard.dismiss();
      handleSubmit(onSubmit)();
    };

    return (
      <VStack>
        <HStack>
          <Button size="sm" onPress={() => console.log(handleSubmit(onSubmit))}>
            <ButtonText fontSize="$sm">Save event</ButtonText>
          </Button>
        </HStack>

        <VStack pt="$4">
          <FormControl isInvalid={!!errors.question} isRequired={true}>
            <Controller
              name="question"
              defaultValue=""
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await questionSchema.parseAsync({
                      question: value,
                    });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    fontSize="$sm"
                    placeholder="Event"
                    type="text"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    enterKeyHint="done"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="md" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.question?.message}
              </FormControlErrorText>
            </FormControlError>
          </FormControl>

          <FormControl my="$6" isInvalid={!!errors.answer} isRequired={true}>
            <Controller
              name="answer"
              defaultValue=""
              control={control}
              rules={{
                validate: async (value) => {
                  try {
                    await questionSchema.parseAsync({
                      answer: value,
                    });
                    return true;
                  } catch (error: any) {
                    return error.message;
                  }
                },
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input>
                  <InputField
                    fontSize="$sm"
                    placeholder="Answer"
                    type="text"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    onSubmitEditing={handleKeyPress}
                    enterKeyHint="done"
                  />
                </Input>
              )}
            />
            <FormControlError>
              <FormControlErrorIcon size="sm" as={AlertTriangle} />
              <FormControlErrorText>
                {errors?.answer?.message}
              </FormControlErrorText>
            </FormControlError>

            <FormControlHelper></FormControlHelper>
          </FormControl>
        </VStack>
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
