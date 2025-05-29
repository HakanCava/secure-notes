import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Image, View } from "react-native";
import TextScramble from "../components/ui/text-scramble";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkUserPin = async () => {
      try {
        // Wait for 3 seconds for splash animation
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const userPin = await AsyncStorage.getItem("secure_user_pin");
        if (userPin) {
          router.push("/login");
        } else {
          router.push("/register");
        }
      } catch (error) {
        console.error("Error checking user pin:", error);
        router.push("/register");
      }
    };

    checkUserPin();
  }, [router]);

  return (
    <View className="flex-1 items-center justify-center bg-[#0A192F]">
      <View className="absolute w-full h-full opacity-10">
        <Image
          source={require("../assets/images/splash-icon.jpg")}
          className="w-full h-full"
          resizeMode="cover"
          blurRadius={10}
        />
      </View>
      <Image
        source={require("../assets/images/splash-icon.jpg")}
        style={{ width: 350, height: 350 }}
        className="mb-12 rounded-full"
        resizeMode="cover"
      />

      <TextScramble
        text="Secure Notes"
        duration={2}
        speed={0.05}
        className="text-4xl text-[#64FFDA]"
      />
    </View>
  );
}
