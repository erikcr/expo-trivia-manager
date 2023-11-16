import { useContext, useState, useEffect } from "react";
import { ScrollView, Pressable, Keyboard } from "react-native";
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
  Input,
  InputField,
  InputIcon,
  InputSlot,
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
} from "@gluestack-ui/themed";
import { AlertTriangle, ChevronRight, Hash, Plus } from "lucide-react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { supabase } from "../../../../../utils/supabase";
import { SessionContext } from "../../../../../utils/SessionContext";

import UserProfile from "../../../../../components/header/UserProfile";

const questionSchema = z.object({
  question: z.string().min(1, "Question in required"),
  answer: z.string().min(1, "Answer is required"),
  points: z.number(),
});

type QuestionSchemaType = z.infer<typeof questionSchema>;

const QuestionForm = ({
  questionId,
  crudAction,
  roundId,
  owner,
}: {
  questionId: string;
  crudAction: "UPDATE" | "INSERT";
  roundId: string;
  owner: string;
}) => {
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<QuestionSchemaType>({
    resolver: zodResolver(questionSchema),
  });
  const [isQuestionFocused, setIsQuestionFocused] = useState(false);

  const toast = useToast();

  const addQuestion = async (_data: QuestionSchemaType) => {
    const { data, error } = await supabase
      .from(process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME)
      .insert([{ question: _data.question, answer: _data.answer }])
      .select();

    if (error) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Question was not added.</ToastTitle>
            </Toast>
          );
        },
      });
    } else {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Question added successfully.</ToastTitle>
            </Toast>
          );
        },
      });
      reset();
    }
  };

  const saveQuestion = async (_data: QuestionSchemaType) => {
    const { data, error } = await supabase
      .from(process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME)
      .update([{ question: _data.question, answer: _data.answer }])
      .eq("id", questionId)
      .select();

    console.log(data);
    console.log(error);

    if (error) {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Question was not saved.</ToastTitle>
            </Toast>
          );
        },
      });
    } else {
      toast.show({
        placement: "bottom right",
        render: ({ id }) => {
          return (
            <Toast nativeID={id} variant="accent" action="success">
              <ToastTitle>Question saved successfully.</ToastTitle>
            </Toast>
          );
        },
      });
      reset();
    }
  };

  const onSubmit = async (_data: QuestionSchemaType) => {
    console.log(_data);
    if (crudAction === "INSERT") {
      addQuestion(_data);
    } else if (crudAction === "UPDATE") {
      saveQuestion(_data);
    }
  };

  const handleKeyPress = () => {
    Keyboard.dismiss();
    handleSubmit(onSubmit)();
  };

  return (
    <>
      <VStack
        alignContent="center"
        justifyContent="space-between"
        px="$2"
        pb="$4"
      >
        <FormControl
          isInvalid={
            (!!errors.question || isQuestionFocused) && !!errors.question
          }
          isRequired={true}
        >
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
                  placeholder="Question"
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

      <Button
        variant="solid"
        size="lg"
        mt="$5"
        mx="$2"
        onPress={() => console.log(handleSubmit(onSubmit))}
      >
        <ButtonText fontSize="$sm">
          {crudAction === "UPDATE" ? "Save" : "Add"}
        </ButtonText>
      </Button>
    </>
  );
};

export default function ManageRound() {
  const { eventId, roundId } = useLocalSearchParams();
  const session = useContext(SessionContext);
  const [event, setEvent] = useState({});
  const [round, setRound] = useState({});
  const [roundQuestions, setRoundQuestions] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [isUpdate, setIsUpdate] = useState(true);

  const toast = useToast();

  const getRoundQuestions = async () => {
    if (session) {
      const { data, error } = await supabase
        .from(process.env.EXPO_PUBLIC_QUESTIONS_TABLE_NAME)
        .select()
        .eq("round_id", roundId);

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
                    pr: "$16",
                    pl: "$8",
                  },
                }}
                flex={1}
              >
                {activeQuestion ? (
                  <Box pt="$6" pb="$2.5" pl="$4" sx={{ "@md": { px: 0 } }}>
                    <HStack
                      px="$2"
                      pb="$4"
                      alignItems="center"
                      justifyContent="center"
                    >
                      <Heading flex={1} size="xl">
                        Edit
                      </Heading>

                      <HStack flex={1}>
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
                          onPress={() => setActiveQuestion(null)}
                        >
                          <ButtonText>Cancel</ButtonText>
                        </Button>

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
                          <ButtonText>Submit</ButtonText>
                        </Button>
                      </HStack>
                    </HStack>

                    <QuestionForm
                      questionId={activeQuestion.id}
                      crudAction="UPDATE"
                      roundId={roundId}
                      owner={session?.user?.id}
                    />
                  </Box>
                ) : (
                  <Box pt="$6" pb="$2.5" px="$4" sx={{ "@md": { px: 0 } }}>
                    <HStack
                      px="$2"
                      pb="$4"
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
                )}
              </Box>

              {/* Right content */}
              <Box
                sx={{
                  "@md": {
                    maxHeight: "calc(100vh - 144px)",
                    pl: "$8",
                  },
                }}
                flex={1}
              ></Box>
            </HStack>
          </HStack>
        </Box>
      </Box>
    </>
  );
}
