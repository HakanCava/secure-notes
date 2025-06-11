import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

interface ForgotPasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ForgotPasswordModal({
  visible,
  onClose,
}: ForgotPasswordModalProps) {
  const [securityAnswer, setSecurityAnswer] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const handleVerifyAnswer = async () => {
    try {
      setLoading(true);
      const storedAnswer = await SecureStore.getItemAsync("security_answer");

      if (storedAnswer?.toLowerCase() === securityAnswer.toLowerCase()) {
        setStep(2);
        Toast.show({
          type: "success",
          text1: "Doğrulama başarılı",
          text2: "Yeni şifrenizi belirleyebilirsiniz",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Hatalı cevap",
          text2: "Güvenlik sorusu cevabı yanlış",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Bir sorun oluştu",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setLoading(true);
      await SecureStore.setItemAsync("secure_user_pin", newPassword);

      Toast.show({
        type: "success",
        text1: "Başarılı",
        text2: "Şifreniz başarıyla güncellendi",
      });

      onClose();
      setStep(1);
      setSecurityAnswer("");
      setNewPassword("");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Hata",
        text2: "Şifre güncellenirken bir sorun oluştu",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-[#112240] p-6 rounded-xl w-[90%]">
          <Text className="text-[#64FFDA] text-xl font-bold mb-4">
            Şifre Sıfırlama
          </Text>

          {step === 1 && (
            <>
              <Text className="text-[#64FFDA] mb-2">
                İlk evcil hayvanınızın adı nedir?
              </Text>
              <TextInput
                placeholder="Güvenlik Sorusu Cevabı"
                placeholderTextColor="#64FFDA"
                value={securityAnswer}
                onChangeText={setSecurityAnswer}
                className="bg-[#0A192F] text-[#64FFDA] p-3 rounded-lg mb-4"
              />
              <TouchableOpacity
                onPress={handleVerifyAnswer}
                disabled={loading || !securityAnswer}
                className={`bg-[#64FFDA] p-3 rounded-lg ${
                  loading || !securityAnswer ? "opacity-50" : ""
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#0A192F" />
                ) : (
                  <Text className="text-[#0A192F] text-center font-bold">
                    Doğrula
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          {step === 2 && (
            <>
              <TextInput
                placeholder="Yeni Şifre"
                placeholderTextColor="#64FFDA"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry
                className="bg-[#0A192F] text-[#64FFDA] p-3 rounded-lg mb-4"
              />
              <TouchableOpacity
                onPress={handleResetPassword}
                disabled={loading || !newPassword}
                className={`bg-[#64FFDA] p-3 rounded-lg ${
                  loading || !newPassword ? "opacity-50" : ""
                }`}
              >
                {loading ? (
                  <ActivityIndicator color="#0A192F" />
                ) : (
                  <Text className="text-[#0A192F] text-center font-bold">
                    Şifreyi Güncelle
                  </Text>
                )}
              </TouchableOpacity>
            </>
          )}

          <TouchableOpacity
            onPress={() => {
              onClose();
              setStep(1);
              setSecurityAnswer("");
              setNewPassword("");
            }}
            className="mt-4"
          >
            <Text className="text-[#64FFDA] text-center">Vazgeç</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
