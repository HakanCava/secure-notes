import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { Controller, useForm } from "react-hook-form";
import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

// Form validation schema
const registerSchema = z
  .object({
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
      .regex(
        /[^A-Za-z0-9]/,
        "Password must contain at least one special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await AsyncStorage.setItem("secure_user_pin", data.password);
      await AsyncStorage.setItem("secure_username", data.username);
      router.push("/login");
    } catch (error) {
      console.error("Error saving user data:", error);
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-[#0A192F]"
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: "center",
        paddingHorizontal: 24,
        paddingTop: screenHeight * 0.1, // 10% from top
        paddingBottom: 40,
      }}
    >
      {/* Header */}
      <View className="flex-row items-center mb-12">
        <Image
          source={require("../../assets/images/splash-icon.jpg")}
          style={{ width: 60, height: 60 }}
          className="rounded-full"
          resizeMode="cover"
        />
        <View className="ml-4 flex-1">
          <TextGenerateEffect
            text="Register"
            typingSpeed={100}
            erasingSpeed={75}
            delayBeforeErasing={2000}
          />
        </View>
      </View>

      {/* Form */}
      <MotiView
        from={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "timing", duration: 800, delay: 300 }}
        className="bg-[#112240] p-8 rounded-xl shadow-lg"
      >
        <View className="mb-8">
          <Text className="text-[#64FFDA] mb-3 text-lg">Username</Text>
          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="bg-[#1E3A8A] text-white p-4 rounded-lg border border-[#64FFDA]"
                placeholder="Enter username"
                placeholderTextColor="#f1f1f1"
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.username && (
            <Text className="text-red-500 mt-2">{errors.username.message}</Text>
          )}
        </View>

        <View className="mb-8">
          <Text className="text-[#64FFDA] mb-3 text-lg">Password</Text>
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="bg-[#1E3A8A] text-white p-4 rounded-lg border border-[#64FFDA]"
                placeholder="Enter password"
                placeholderTextColor="#f1f1f1"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.password && (
            <Text className="text-red-500 mt-2">{errors.password.message}</Text>
          )}
        </View>

        <View className="mb-10">
          <Text className="text-[#64FFDA] mb-3 text-lg">Confirm Password</Text>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <TextInput
                className="bg-[#1E3A8A] text-white p-4 rounded-lg border border-[#64FFDA]"
                placeholder="Confirm password"
                placeholderTextColor="#f1f1f1"
                secureTextEntry
                value={value}
                onChangeText={onChange}
              />
            )}
          />
          {errors.confirmPassword && (
            <Text className="text-red-500 mt-2">
              {errors.confirmPassword.message}
            </Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleSubmit(onSubmit)}
          className="bg-[#64FFDA] py-5 rounded-lg"
        >
          <Text className="text-[#0A192F] text-center font-bold text-lg">
            Create Account
          </Text>
        </TouchableOpacity>
      </MotiView>
    </ScrollView>
  );
}
