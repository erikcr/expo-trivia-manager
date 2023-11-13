import React, { useState, useEffect } from "react";
import {
  Avatar,
  AvatarFallbackText,
  Menu,
  MenuItem,
  MenuItemLabel,
  Pressable,
} from "@gluestack-ui/themed";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../utils/supabase";
import LogoutAlertDialog from "../LogoutAlertDialog";
import { router } from "expo-router";

const userMenuItems = [
  {
    title: "Settings",
    action: () => {
      router.push("/settings");
    },
  },
  {
    title: "Log out",
    action: async () => {
      await supabase.auth.signOut();
      router.push("/");
    },
  },
];
const UserProfile = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [openLogoutAlertDialog, setOpenLogoutAlertDialog] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log(session);
    });
  }, []);

  return (
    <>
      <Menu
        offset={10}
        placement="bottom right"
        selectionMode="single"
        // @ts-ignore
        onSelectionChange={async (e: any) => {
          if (e.currentKey === "Log out") {
            await supabase.auth.signOut();
            router.replace("/");
          }
        }}
        trigger={({ ...triggerProps }) => {
          return (
            <Pressable {...triggerProps}>
              <Avatar size="sm" bg="$backgroundLight600">
                <AvatarFallbackText>{session?.user.email}</AvatarFallbackText>
              </Avatar>
            </Pressable>
          );
        }}
      >
        {userMenuItems.map((item) => (
          <MenuItem key={item.title} textValue={item.title}>
            <MenuItemLabel>{item.title}</MenuItemLabel>
          </MenuItem>
        ))}
      </Menu>
      <LogoutAlertDialog
        openLogoutAlertDialog={openLogoutAlertDialog}
        setOpenLogoutAlertDialog={setOpenLogoutAlertDialog}
      />
    </>
  );
};

export default UserProfile;
