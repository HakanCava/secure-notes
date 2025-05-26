import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { MotiView } from "moti";
import { SafeAreaView, Text, TouchableOpacity, View } from "react-native";

export default function SettingsScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // Tüm güvenli depolanmış verileri temizle
      await SecureStore.deleteItemAsync("secure_user_pin");
      await SecureStore.deleteItemAsync("secure_username");
      await SecureStore.deleteItemAsync("security_question");
      await SecureStore.deleteItemAsync("security_answer");

      // Login sayfasına yönlendir
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Çıkış yapılırken hata oluştu:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#0A192F]">
      {/* Header */}
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: "timing", duration: 500 }}
        className="bg-[#112240] px-4 py-4 flex-row items-center shadow-lg"
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="w-10 h-10 items-center justify-center"
        >
          <Ionicons name="arrow-back" size={24} color="#64FFDA" />
        </TouchableOpacity>
        <Text className="text-[#64FFDA] text-xl font-semibold ml-2">
          Ayarlar
        </Text>
      </MotiView>

      {/* Settings Content */}
      <View className="flex-1 p-4">
        <MotiView
          from={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: "timing", duration: 500 }}
          className="bg-[#112240] rounded-xl overflow-hidden shadow-xl"
        >
          {/* Profile Section */}
          <View className="items-center py-8 border-b border-[#1E3A8A]">
            <View className="w-24 h-24 rounded-full bg-[#1E3A8A] items-center justify-center mb-4">
              <Ionicons name="lock-closed" size={40} color="#64FFDA" />
            </View>
            <Text className="text-[#64FFDA] text-2xl font-semibold mb-2">
              Hesap Bilgileri
            </Text>
          </View>

          {/* Settings Options */}
          <View className="p-4 space-y-2">
            <TouchableOpacity className="flex-row items-center bg-[#1E3A8A] p-4 rounded-lg">
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

            <TouchableOpacity className="flex-row items-center bg-[#1E3A8A] p-4 rounded-lg">
              <View className="w-10 h-10 rounded-full bg-[#0A192F] items-center justify-center">
                <Ionicons name="shield-outline" size={24} color="#64FFDA" />
              </View>
              <Text className="text-white text-lg ml-4">
                Güvenlik Sorusu Değiştir
              </Text>
              <Ionicons
                name="chevron-forward"
                size={24}
                color="#64FFDA"
                style={{ marginLeft: "auto" }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/login")}
              className="flex-row items-center bg-[#FF4747]/10 p-4 rounded-lg mt-6"
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
              onPress={handleLogout}
              className="flex-row items-center bg-[#FF4747]/10 p-4 rounded-lg mt-6"
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
    </SafeAreaView>
  );
}
