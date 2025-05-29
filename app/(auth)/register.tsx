import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MotiView } from "moti";
import { useState } from "react";
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
import * as z from "zod";

const registerSchema = z.object({
  username: z.string().min(3, "Kullanıcı adı en az 3 karakter olmalı"),
  password: z
    .string()
    .min(8, "Şifre en az 8 karakter olmalı")
    .regex(/[A-Z]/, "En az bir büyük harf içermeli")
    .regex(/[a-z]/, "En az bir küçük harf içermeli")
    .regex(/[0-9]/, "En az bir sayı içermeli")
    .regex(/[^A-Za-z0-9]/, "En az bir özel karakter içermeli"),
  securityQuestion: z.string().min(1, "Lütfen bir güvenlik sorusu seçin"),
  securityAnswer: z.string().min(1, "Cevap zorunludur"),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const screenHeight = Dimensions.get("window").height;
  const [showPassword, setShowPassword] = useState(false);

  const securityQuestions = [
    "İlk evcil hayvanınızın adı nedir?",
    "Annenizin kızlık soyadı nedir?",
    "İlk gittiğiniz okulun adı nedir?",
    "En sevdiğiniz öğretmenin adı nedir?",
    "Doğduğunuz şehir neresidir?",
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      securityQuestion: "",
      securityAnswer: "",
    },
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await SecureStore.setItemAsync("secure_user_pin", data.password);
      await SecureStore.setItemAsync("secure_username", data.username);
      await SecureStore.setItemAsync(
        "security_question",
        data.securityQuestion
      );
      await SecureStore.setItemAsync("security_answer", data.securityAnswer);
      router.push("/login");
    } catch (error) {
      console.error("Kayıt hatası:", error);
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
              text="Register"
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
          <View className="mb-8">
            <Text className="text-[#64FFDA] mb-3 text-lg">Kullanıcı Adı</Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-[#1E3A8A] text-white p-4 rounded-lg border border-[#64FFDA]"
                  placeholder="Kullanıcı adı giriniz"
                  placeholderTextColor="#f1f1f1"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.username && (
              <Text className="text-red-500 mt-2">
                {errors.username.message}
              </Text>
            )}
          </View>

          <View className="mb-8">
            <Text className="text-[#64FFDA] mb-3 text-lg">Şifre</Text>
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

          <View className="mb-8">
            <Text className="text-[#64FFDA] mb-3 text-lg">Güvenlik Sorusu</Text>
            <Controller
              control={control}
              name="securityQuestion"
              render={({ field: { onChange, value } }) => (
                <View className="bg-[#1E3A8A] rounded-lg border border-[#64FFDA] overflow-hidden">
                  <Picker
                    selectedValue={value}
                    onValueChange={(itemValue) => onChange(itemValue)}
                    dropdownIconColor="#64FFDA"
                    style={{
                      color: "white",
                      height: Platform.OS === "ios" ? 150 : 50,
                      width: "100%",
                    }}
                    itemStyle={{
                      color: "white",
                      height: Platform.OS === "ios" ? 150 : 50,
                      fontSize: 16,
                    }}
                  >
                    <Picker.Item
                      label="Bir soru seçin..."
                      value=""
                      color={Platform.OS === "ios" ? "white" : "#f1f1f1"}
                    />
                    {securityQuestions.map((question, index) => (
                      <Picker.Item
                        key={index}
                        label={question}
                        value={question}
                        color={Platform.OS === "ios" ? "white" : "#f1f1f1"}
                      />
                    ))}
                  </Picker>
                </View>
              )}
            />
            {errors.securityQuestion && (
              <Text className="text-red-500 mt-2">
                {errors.securityQuestion.message}
              </Text>
            )}
          </View>

          <View className="mb-8">
            <Text className="text-[#64FFDA] mb-3 text-lg">Cevabınız</Text>
            <Controller
              control={control}
              name="securityAnswer"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  className="bg-[#1E3A8A] text-white p-4 rounded-lg border border-[#64FFDA]"
                  placeholder="Cevabınızı giriniz"
                  placeholderTextColor="#f1f1f1"
                  value={value}
                  onChangeText={onChange}
                />
              )}
            />
            {errors.securityAnswer && (
              <Text className="text-red-500 mt-2">
                {errors.securityAnswer.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            onPress={handleSubmit(onSubmit)}
            className="bg-[#64FFDA] p-4 rounded-lg"
          >
            <Text className="text-[#0A192F] text-center font-bold text-lg">
              Hesap Oluştur
            </Text>
          </TouchableOpacity>
        </MotiView>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
