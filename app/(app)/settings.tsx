import { ChangePasswordModal } from "@/components/ChangePasswordModal";
import { useAuth } from "@/store/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MotiView } from "moti";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function SettingsScreen() {
  const router = useRouter();
  const { username } = useAuth();
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);

  const handleDeleteAccount = async () => {
    try {
      await SecureStore.deleteItemAsync("secure_user_pin");
      await SecureStore.deleteItemAsync("secure_username");
      await SecureStore.deleteItemAsync("security_question");
      await SecureStore.deleteItemAsync("security_answer");
      await SecureStore.deleteItemAsync("notes");

      router.replace("/register");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A192F]">
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        className="bg-[#112240] px-4 py-3 flex-row items-center justify-between"
      >
        <TouchableOpacity>
          <Image
            source={require("../../assets/images/splash-icon.jpg")}
            style={{ width: 40, height: 40 }}
            className="rounded-full"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View>
          <Text className="text-[#64FFDA] text-xl font-semibold">
            Hesap Bilgileri
          </Text>
        </View>

        <View className="flex w-10 h-10 rounded-full bg-[#112240] border border-[#64FFDA] items-center justify-center">
          <Text className="text-[#64FFDA]  text-xl font-semibold">
            {username?.charAt(0).toUpperCase()}
          </Text>
        </View>
      </MotiView>

      <View className="flex-1 p-4 justify-evenly gap-8">
        <View className="flex-row items-center justify-center">
          <Ionicons name="person-circle-sharp" size={100} color="#64FFDA" />
        </View>
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 500 }}
          className="bg-[#112240] rounded-xl overflow-hidden shadow-xl"
        >
          <View className="p-4 space-y-2 gap-4">
            <TouchableOpacity
              onPress={() => setIsPasswordModalVisible(true)}
              className="flex-row items-center bg-[#1E3A8A] p-4 rounded-lg"
            >
              <View className="w-10 h-10 rounded-full bg-[#0A192F] items-center justify-center">
                <Ionicons
                  name="lock-closed-outline"
                  size={24}
                  color="#64FFDA"
                />
              </View>
              <Text className="text-white text-lg ml-4">Şifre Değiştir</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="#64FFDA"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/login")}
              className="flex-row items-center bg-[#FF4747]/10 p-4 rounded-lg"
            >
              <View className="w-10 h-10 rounded-full bg-[#FF4747]/20 items-center justify-center">
                <Ionicons name="log-out-outline" size={24} color="#FF4747" />
              </View>
              <Text className="text-[#FF4747] text-lg ml-4">Çıkış Yap</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="#FF4747"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="flex-row items-center bg-[#FF4747]/10 p-4 rounded-lg"
            >
              <View className="w-10 h-10 rounded-full bg-[#FF4747]/20 items-center justify-center">
                <Ionicons name="trash" size={24} color="#FF4747" />
              </View>
              <Text className="text-[#FF4747] text-lg ml-4">Hesabı Sil</Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="#FF4747"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>
          </View>
        </MotiView>
      </View>

      <ChangePasswordModal
        visible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
      />
    </SafeAreaView>
  );
}
