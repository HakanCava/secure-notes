import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";
import TextScramble from "./components/TextScramble";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkUserPin = async () => {
      try {
        // Wait for 3 seconds for splash animation
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const userPin = await AsyncStorage.getItem("userPin");
        if (userPin) {
          router.push("/login");
        } else {
          //router.push("/register");
        }
      } catch (error) {
        console.error("Error checking user pin:", error);
        router.push("/register");
      }
    };

    checkUserPin();
  }, [router]);

  return (
    <View className="flex-1 bg-black items-center justify-center">
      <Image
        source={require("../assets/images/splash-icon.jpg")}
        className="w-80 h-80 mb-8"
        resizeMode="contain"
      />

      <TextScramble text="Secure Notes" duration={2} speed={0.05} />
    </View>
  );
}
