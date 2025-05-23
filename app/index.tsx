import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MotiText } from "moti";
import { useEffect } from "react";
import { Image, View } from "react-native";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const checkUserPin = async () => {
      try {
        // Wait for 2 seconds for splash animation
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
        className="w-64 h-64 mb-8"
        resizeMode="contain"
      />

      <View className="flex-row">
        {"Secure Notes".split("").map((letter, index) => (
          <MotiText
            key={index}
            className="text-white text-3xl font-bold"
            from={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              type: "timing",
              duration: 1000,
              delay: index * 100,
              loop: true,
            }}
          >
            {letter}
          </MotiText>
        ))}
      </View>
    </View>
  );
}
