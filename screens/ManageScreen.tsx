import React, { useEffect } from "react";
import { StatusBar, Platform, ScrollView } from "react-native";
import { Box, HStack } from "@gluestack-ui/themed";
import {
  Plus,
  Home,
  MessageCircle,
  User,
  SlidersHorizontal,
} from "lucide-react-native";

const bottomTabs = [
  {
    icon: Home,
    label: "Home",
  },
  {
    icon: SlidersHorizontal,
    label: "Filter",
  },
  {
    icon: Plus,
    label: "Listing",
  },
  {
    icon: MessageCircle,
    label: "Inbox",
    disabled: true,
  },
  {
    icon: User,
    label: "Profile",
  },
];

const ManageScreen = () => {
  useEffect(() => {
    if (Platform.OS === "web") {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100%";
    }
  }, []);

  const [activeTab, setActiveTab] = React.useState("Home");

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
          <Box
            w="100%"
            sx={{
              display: activeTab !== "Profile" ? "flex" : "none",
            }}
          >
            Manage
          </Box>

          <ScrollView>
            <Box
              sx={{
                display: activeTab !== "Profile" ? "flex" : "none",

                "@md": { display: "none" },
              }}
            >
              Main content
            </Box>
          </ScrollView>

          <HStack w="100%" display="none" sx={{ "@md": { display: "flex" } }}>
            Sidebar
            <ScrollView style={{ flex: 1 }}>Main content</ScrollView>
          </HStack>
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
        ></Box>
      </Box>
      {/* )} */}
    </>
  );
};
export default ManageScreen;
