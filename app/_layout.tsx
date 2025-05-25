import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import "react-native-reanimated";
import "../app/global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Text, View } from "react-native";
import Toast from "react-native-toast-message";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Slot />
      <StatusBar style="auto" />
      <Toast
        config={{
          success: ({ text1, text2, ...rest }) => (
            <View
              style={{
                backgroundColor: "#64FFDA",
                padding: 16,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontWeight: "bold", color: "#0A192F" }}>
                {text1}
              </Text>
              <Text style={{ color: "#0A192F" }}>{text2}</Text>
            </View>
          ),
          error: ({ text1, text2, ...rest }) => (
            <View
              style={{
                backgroundColor: "#EF4444",
                padding: 16,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontWeight: "bold", color: "white" }}>
                {text1}
              </Text>
              <Text style={{ color: "white" }}>{text2}</Text>
            </View>
          ),
        }}
      />
    </ThemeProvider>
  );
}
