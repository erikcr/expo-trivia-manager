import { useEffect, useState } from "react";
import { ScrollView, Pressable } from "react-native";
import { router } from "expo-router";
import { Heading, Text, VStack } from "@gluestack-ui/themed";

import { SidebarList } from "../types/app.types";

export default function NSidebar({
  dynamicSidebarItems,
}: {
  dynamicSidebarItems: SidebarList;
}) {
  const [sidebarItems, setSidebarItems] = useState<SidebarList>();

  useEffect(() => {
    if (dynamicSidebarItems) {
      setSidebarItems(dynamicSidebarItems);
    }
  }, [dynamicSidebarItems]);

  return (
    <ScrollView>
      <VStack px="$4" py="$6">
        {sidebarItems?.map((item, index) => {
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
                  onPress={() => router.push(item.destination || "/dashboard")}
                >
                  <Text size="sm" color="$textLight900">
                    {item.label}
                  </Text>
                </Pressable>
              );

            case "rounds":
              return item.rounds?.map((round, rIndex) => (
                <Pressable
                  key={rIndex}
                  onPress={() => router.push(`round/${round.id}`)}
                >
                  <Text size="sm" color="$textLight900">
                    {round.name}
                  </Text>
                </Pressable>
              ));
          }
        })}
      </VStack>
    </ScrollView>
  );
}
