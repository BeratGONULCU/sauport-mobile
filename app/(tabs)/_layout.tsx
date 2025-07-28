import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import { Pressable } from "react-native";
import { MenuProvider, useMenu } from "@/context/MenuContext";
import { AuthProvider } from "@/context/AuthContext"; // <-- EKLENDİ
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import SideMenu from "@/components/sideMenu";
import FlashMessage from "react-native-flash-message";
import Colors from "@/constants/Colors";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <AuthProvider> 
      <MenuProvider>
        <TabLayoutContent />
        <FlashMessage position="top" />
      </MenuProvider>
    </AuthProvider>
  );
}

function TabLayoutContent() {
  const colorScheme = useColorScheme();
  const { toggleMenu } = useMenu();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <SideMenu />
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
          headerShown: useClientOnlyValue(true, true),
          headerRight: () => (
            <Pressable
              onPress={toggleMenu}
              onHoverIn={() => setIsHovered(true)}
              onHoverOut={() => setIsHovered(false)}
              style={{ marginRight: 15 }}
            >
              <FontAwesome
                name="bars"
                size={36}
                color={
                  isHovered ? "#294cd8ff" : Colors[colorScheme ?? "dark"].text
                }
              />
            </Pressable>
          ),
        }}
      >
        <Tabs.Screen
          name="education"
          options={{
            title: "Eğitim",
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="communication"
          options={{
            title: "İletişim",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="envelope" color={color} />
            ),
          }}
        />
      </Tabs>
    </>
  );
}
