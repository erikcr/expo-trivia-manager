import React, { useEffect, useState, useContext } from "react";
import { StatusBar, Platform, ScrollView } from "react-native";
import { Box, HStack } from "@gluestack-ui/themed";
import {
  Plus,
  Home,
  MessageCircle,
  User,
  SlidersHorizontal,
} from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../utils/supabase";
import { SessionContext } from "../utils/SessionContext";
import Header from "../components/Header";
// import MobileBottomTabs from '../components/MobileBottomTabs';
// import MobileProfilePage from '../components/MobileProfilePage';
import WebSidebar from "../components/WebSidebar";
import MainContent from "../components/main-content/MainContent";

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

  const session = useContext(SessionContext);
  const [activeTab, setActiveTab] = useState("Home");
  const [myEvents, setMyEvents] = useState<Array<Object> | null>([]);

  useEffect(() => {
    if (session) {
      const getMyEvents = async () => {
        const { data, error } = await supabase
          .from(process.env.EXPO_PUBLIC_EVENTS_TABLE_NAME)
          .select()
          .eq("owner", session?.user.id);
        console.log(data);
        setMyEvents(data);
      };

      getMyEvents();
    }
  }, [session]);

  return (
    <>
      <Box
        sx={{
          _dark: { bg: "$backgroundDark950" },
        }}
      >
        <StatusBar />

        <Box flex={1}>
          {/* <MobileProfilePage isActive={activeTab === 'Profile'} /> */}

          <Box
            w="100%"
            sx={{
              display: activeTab !== "Profile" ? "flex" : "none",
            }}
          >
            {/* header */}
            <Header />
          </Box>

          <ScrollView>
            <Box
              sx={{
                display: activeTab !== "Profile" ? "flex" : "none",

                "@md": { display: "none" },
              }}
            >
              <MainContent
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                events={myEvents}
              />
            </Box>
          </ScrollView>

          <HStack w="100%" display="none" sx={{ "@md": { display: "flex" } }}>
            <WebSidebar />
            <ScrollView style={{ flex: 1 }}>
              <MainContent
                setActiveTab={setActiveTab}
                activeTab={activeTab}
                events={myEvents}
              />
            </ScrollView>
          </HStack>

          {/* <MobileModeChangeButton /> */}
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
        >
          {/* <MobileBottomTabs
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            bottomTabs={bottomTabs}
          /> */}
        </Box>
      </Box>
      {/* )} */}
    </>
  );
};
export default ManageScreen;
