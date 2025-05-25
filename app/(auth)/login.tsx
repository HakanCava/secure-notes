import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { useAuth } from "@/store/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";

const loginSchema = z.object({
  password: z.string().min(1, "Şifre zorunludur"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;
  const [showPassword, setShowPassword] = useState(false);

  const { username, setUsername } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      password: "",
    },
  });

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem("secure_username");
      setUsername(storedUsername);
    };
    fetchUsername();
  }, []);

  const onSubmit = async (data: LoginForm) => {
    try {
      const userPin = await AsyncStorage.getItem("secure_user_pin");
      if (userPin === data.password) {
        Toast.show({
          type: "success",
          text1: "Giriş başarılı",
          text2: `Hoşgeldin ${username}`,
        });
        router.push("/");
      } else {
        Toast.show({
          type: "error",
          text1: "Hatalı şifre",
          text2: "Lütfen tekrar deneyin",
        });
      }

      router.push("/");
    } catch (error) {
      console.error("Giriş hatası:", error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      className="flex-1 bg-[#0A192F]"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          paddingHorizontal: 24,
          paddingTop: screenHeight * 0.1,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center mb-12">
          <Image
            source={require("../../assets/images/splash-icon.jpg")}
            style={{ width: 60, height: 60 }}
            className="rounded-full"
            resizeMode="cover"
          />
          <View className="ml-4 flex-1">
            <TextGenerateEffect
              text="Login"
              typingSpeed={100}
              erasingSpeed={75}
              delayBeforeErasing={2000}
            />
          </View>
        </View>

        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 800, delay: 300 }}
          className="bg-[#112240] p-8 rounded-xl shadow-lg"
        >
          <Text className="text-[#64FFDA] mb-3 text-3xl font-bold">
            Hoşgeldin {username}
          </Text>
          <View className="mb-8">
            <Text className="text-[#64FFDA] mb-3 text-xl">Şifre</Text>
            <View className="relative">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="bg-[#1E3A8A] text-white p-4 rounded-lg border border-[#64FFDA] pr-12"
                    placeholder="Şifrenizi girin"
                    placeholderTextColor="#f1f1f1"
                    secureTextEntry={!showPassword}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="none"
                    style={{ color: "white" }}
                    autoCorrect={false}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-4"
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#64FFDA"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 mt-2">
                {errors.password.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="bg-[#64FFDA] py-5 rounded-lg"
          >
            <Text className="text-[#0A192F] text-center font-bold text-lg">
              Giriş Yap
            </Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
