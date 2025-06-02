import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { Platform } from "react-native";
import { ErrorBoundary } from "./error-boundary";
import { StatusBar } from "expo-status-bar";

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) {
      console.error(error);
      throw error;
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ErrorBoundary>
      <StatusBar style="light" />
      <RootLayoutNav />
    </ErrorBoundary>
  );
}

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ 
      headerStyle: { backgroundColor: "#1E1A2E" },
      headerTintColor: "#E6E1F9",
      contentStyle: { backgroundColor: "#1E1A2E" }
    }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen 
        name="battle/[enemyId]" 
        options={{ 
          title: "Битва",
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="character/create" 
        options={{ 
          title: "Создание героя",
          animation: "slide_from_bottom"
        }} 
      />
      <Stack.Screen 
        name="character/details" 
        options={{ 
          title: "Герой",
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="shop" 
        options={{ 
          title: "Лавка",
          animation: "slide_from_right"
        }} 
      />
      <Stack.Screen 
        name="inventory" 
        options={{ 
          title: "Инвентарь",
          animation: "slide_from_right"
        }} 
      />
    </Stack>
  );
}