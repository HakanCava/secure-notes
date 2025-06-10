import { Ionicons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MotiView } from "moti";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import * as z from "zod";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Mevcut şifre zorunludur"),
    newPassword: z
      .string()
      .min(8, "Şifre en az 8 karakter olmalı")
      .regex(/[A-Z]/, "En az bir büyük harf içermeli")
      .regex(/[a-z]/, "En az bir küçük harf içermeli")
      .regex(/[0-9]/, "En az bir sayı içermeli")
      .regex(/[^A-Za-z0-9]/, "En az bir özel karakter içermeli"),
    confirmPassword: z.string().min(1, "Şifre tekrarı zorunludur"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Şifreler eşleşmiyor",
    path: ["confirmPassword"],
  });

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChangePasswordModal({
  visible,
  onClose,
}: ChangePasswordModalProps) {
  const router = useRouter();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    try {
      const storedPin = await SecureStore.getItemAsync("secure_user_pin");

      if (storedPin !== data.currentPassword) {
        Toast.show({
          type: "error",
          text1: "Hata",
          text2: "Mevcut şifre yanlış",
        });
        return;
      }

      await SecureStore.setItemAsync("secure_user_pin", data.newPassword);

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Şifreniz başarıyla değiştirildi",
      });
      router.push("/login");

      reset();
      onClose();
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Şifre değiştirme işlemi başarısız",
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-1 bg-black/50 justify-end">
          <MotiView
            from={{ translateY: 1000 }}
            animate={{ translateY: 0 }}
            transition={{ type: "spring", damping: 20 }}
            className="bg-[#112240] rounded-t-3xl p-6"
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-[#64FFDA] text-xl font-semibold">
                Şifre Değiştir
              </Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#64FFDA" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-[#64FFDA] mb-2">Mevcut Şifre</Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="currentPassword"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-[#1E3A8A] text-white p-4 rounded-lg border border-[#64FFDA] pr-12"
                      placeholder="Mevcut şifrenizi girin"
                      placeholderTextColor="#f1f1f1"
                      secureTextEntry={!showCurrentPassword}
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      style={{ color: "white" }}
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowCurrentPassword((prev) => !prev)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showCurrentPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#64FFDA"
                  />
                </TouchableOpacity>
              </View>
              {errors.currentPassword && (
                <Text className="text-red-500 mt-2">
                  {errors.currentPassword.message}
                </Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="text-[#64FFDA] mb-2">Yeni Şifre</Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="newPassword"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-[#1E3A8A] text-white p-4 rounded-lg border border-[#64FFDA] pr-12"
                      placeholder="Yeni şifrenizi girin"
                      placeholderTextColor="#f1f1f1"
                      secureTextEntry={!showNewPassword}
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      style={{ color: "white" }}
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowNewPassword((prev) => !prev)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showNewPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#64FFDA"
                  />
                </TouchableOpacity>
              </View>
              {errors.newPassword && (
                <Text className="text-red-500 mt-2">
                  {errors.newPassword.message}
                </Text>
              )}
            </View>

            <View className="mb-6">
              <Text className="text-[#64FFDA] mb-2">Yeni Şifre Tekrar</Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      className="bg-[#1E3A8A] text-white p-4 rounded-lg border border-[#64FFDA] pr-12"
                      placeholder="Yeni şifrenizi tekrar girin"
                      placeholderTextColor="#f1f1f1"
                      secureTextEntry={!showConfirmPassword}
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="none"
                      style={{ color: "white" }}
                    />
                  )}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showConfirmPassword ? "eye-off" : "eye"}
                    size={24}
                    color="#64FFDA"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 mt-2">
                  {errors.confirmPassword.message}
                </Text>
              )}
            </View>

            <TouchableOpacity
              onPress={handleSubmit(onSubmit)}
              className="bg-[#64FFDA] p-4 rounded-lg"
            >
              <Text className="text-[#0A192F] text-center font-semibold">
                Şifreyi Değiştir
              </Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
