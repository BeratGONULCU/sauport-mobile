import React, { useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { router, Tabs } from "expo-router";
import { Pressable, Image, View } from "react-native";
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
  return <FontAwesome size={25} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <AuthProvider>
      <MenuProvider>
        <TabLayoutContent />
        <FlashMessage 
          position="top" 
          style={{ 
            height: 105,  // Mesaj yüksekliği
            marginTop: 0,  // Üstten boşluk
          }}
        />
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
          headerStyle: {
            height: 105, 
            backgroundColor: '#060c24ff', // Header arka plan rengi #060c24ff
          },
          headerRight: () => (
            <Pressable
              onHoverIn={() => setIsHovered(true)}
              onHoverOut={() => setIsHovered(false)}
              style={{ marginRight: 15 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome onPress={toggleMenu}
                  name="bars"
                  size={32}
                  color={
                    isHovered ? "#294cd8ff" : "#9b9c9fff"
                  }
                  style={{ marginRight: 15 }}
                />
                <FontAwesome onPress={() => router.push('/')}
                  name="user"
                  size={32}
                  color={
                    isHovered ? "#294cd8ff" : "#9b9c9fff"
                  }
                />
              </View>
            </Pressable>
          ),
          headerLeft: () => (
            <Image 
              source={require('../../assets/images/saulogo_tr.png')} 
              style={{ width: 120, height: 45, marginLeft: 15 }}
              resizeMode="contain"
            />
          ),
        }}
      >
        <Tabs.Screen
          name="Courses"  //  Dosya adı
          options={{
            title: "",
            tabBarLabel: "Ders",
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          }}
        />        
        <Tabs.Screen
          name="DersDetay"  
          options={{
            title: "",
            tabBarLabel: "Detay",
            tabBarIcon: ({ color }) => <TabBarIcon name="book" color={color} />,
          }}
        />
        <Tabs.Screen
          name="iletisim"  
          options={{
            title: "",
            tabBarLabel: "İletişim",
            tabBarIcon: ({ color }) => <TabBarIcon name="envelope" color={color} />,
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            href: null,  // navbarda gizli olması için
            title: "",
            tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
          }}
        />
      </Tabs>
    </>
  );
}
