import React from "react";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { Home, Map, User, ShoppingBag } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#9D71EA",
        tabBarInactiveTintColor: "#8A8599",
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabBarLabel,
        headerStyle: styles.header,
        headerTintColor: "#E6E1F9",
        headerTitleStyle: styles.headerTitle,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Главная",
          tabBarIcon: ({ color }) => <Home size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Карта",
          tabBarIcon: ({ color }) => <Map size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="character"
        options={{
          title: "Герой",
          tabBarIcon: ({ color }) => <User size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="shop"
        options={{
          title: "Лавка",
          tabBarIcon: ({ color }) => <ShoppingBag size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#2A2440",
    borderTopWidth: 0,
    elevation: 0,
    height: 60,
    paddingBottom: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: "500",
  },
  header: {
    backgroundColor: "#1E1A2E",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
  headerTitle: {
    fontWeight: "600",
    fontSize: 18,
  },
});