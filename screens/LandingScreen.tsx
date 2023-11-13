import React from "react";
import {
  Box,
  VStack,
  Button,
  Image,
  Center,
  ButtonText,
} from "@gluestack-ui/themed";

import GuestLayout from "../layouts/GuestLayout";
import { router } from "expo-router";

import { styled } from "@gluestack-style/react";

// to render login and sign up buttons
function ActionButtons() {
  return (
    <VStack
      space="xs"
      mt="$10"
      sx={{
        "@md": {
          mt: "$12",
        },
      }}
    >
      <Button
        sx={{
          ":hover": {
            bg: "$backgroundLight100",
          },
        }}
        size="md"
        variant="solid"
        action="primary"
        isDisabled={false}
        isFocusVisible={false}
        backgroundColor="$backgroundLight0"
        onPress={() => router.push("/login")}
      >
        <ButtonText
          fontWeight="$bold"
          textDecorationLine="none"
          color="$primary500"
        >
          LOGIN
        </ButtonText>
      </Button>

      <Button
        sx={{
          ":hover": {
            bg: "$backgroundLight0",
            _text: {
              color: "$primary500",
            },
          },
        }}
        my="$4"
        size="md"
        variant="outline"
        borderColor="$borderLight0"
        action="primary"
        isDisabled={false}
        isFocusVisible={false}
        onPress={() => router.push("/signup")}
      >
        <ButtonText textDecorationLine="none" color="$textLight50">
          SIGN UP
        </ButtonText>
      </Button>
    </VStack>
  );
}

export default function LandingScreen() {
  return (
    // Wrapper component includes the <GluestackUIProvider></GluestackUIProvider>
    // place GluestackUIProvider in your app root accordingly
    // remove Wrapper tag from here in your codebase
    <GuestLayout>
      <Center w="$full" flex={1}>
        <Box
          maxWidth="$508"
          w="$full"
          minHeight="$authcard"
          sx={{
            "@md": {
              // h: '$authcard',
              px: "$8",
              bg: "$primary500",
            },
          }}
          px="$4"
          justifyContent="center"
        >
          <ActionButtons />
        </Box>
      </Center>
    </GuestLayout>
  );
}
