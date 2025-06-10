import { useNotes } from "@/store/use-notes";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { Modal, Text, TouchableOpacity, View } from "react-native";

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DeleteAccountModal({
  visible,
  onClose,
}: DeleteAccountModalProps) {
  const router = useRouter();
  const { deleteAllNotes } = useNotes();

  const handleDeleteAccount = async () => {
    try {
      await SecureStore.deleteItemAsync("secure_user_pin");
      await SecureStore.deleteItemAsync("secure_username");
      await SecureStore.deleteItemAsync("security_question");
      await SecureStore.deleteItemAsync("security_answer");
      await deleteAllNotes();

      onClose();
      router.replace("/register");
    } catch (error) {
      console.error("Hesap silinirken hata oluştu:", error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-center items-center p-4">
        <View className="bg-[#112240] w-full rounded-xl p-6 items-center">
          <Text className="text-[#FF4747] text-xl font-bold mb-4">
            Hesabı Sil
          </Text>
          <Text className="text-white text-center mb-6">
            Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri
            alınamaz ve tüm notlarınız silinecektir.
          </Text>
          <View className="flex-row gap-4">
            <TouchableOpacity
              onPress={onClose}
              className="flex-1 bg-[#64FFDA]/10 p-4 rounded-lg"
            >
              <Text className="text-[#64FFDA] text-center font-semibold">
                Vazgeç
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDeleteAccount}
              className="flex-1 bg-[#FF4747] p-4 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">
                Evet, Sil
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
