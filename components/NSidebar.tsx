import { ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Heading, Text, VStack } from "@gluestack-ui/themed";

const sidebarItems = [
  {
    type: "header",
    label: "Events",
  },
  {
    type: "route",
    label: "Event 1",
    destination: "new-design/?e=1",
  },
  {
    type: "route",
    label: "Event 2",
    destination: "new-design/?e=2",
  },
  {
    type: "route",
    label: "Event 3",
    destination: "new-design/?e=3",
  },
  {
    type: "header",
    label: "Account",
  },
  {
    type: "route",
    label: "Settings",
    destination: "new-design/?e=settings",
  },
  {
    type: "route",
    label: "Profile",
    destination: "new-design/?e=profile",
  },
];

export default function NSidebar() {
  return (
    <ScrollView>
      <VStack px="$4" py="$6">
        {sidebarItems.map((item, index) => {
          switch (item.type) {
            case "header":
              return (
                <Heading
                  pb="$1"
                  pt={index !== 0 ? "$3" : "$0"}
                  key={index}
                  size="sm"
                >
                  {item.label}
                </Heading>
              );

            case "route":
              return (
                <Pressable
                  key={index}
                  onPress={() => router.push(item.destination)}
                >
                  <Text size="sm" color="$textLight900">
                    {item.label}
                  </Text>
                </Pressable>
              );
          }
        })}
      </VStack>
    </ScrollView>
  );
}
