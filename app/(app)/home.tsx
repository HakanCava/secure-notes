import { useAuth } from "@/store/use-auth";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { MotiView } from "moti";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotes } from "../../store/use-notes";

export default function HomeScreen() {
  const router = useRouter();
  const { username } = useAuth();
  const { notes, addNote, loadNotes } = useNotes();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");

  useEffect(() => {
    loadNotes();
  }, []);

  const handleAddNote = async () => {
    if (noteTitle.trim() && noteContent.trim()) {
      await addNote({
        title: noteTitle,
        content: noteContent,
      });
      setNoteTitle("");
      setNoteContent("");
      setIsModalVisible(false);
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
          <Text className="text-[#64FFDA] text-xl font-semibold">Notlar</Text>
        </View>

        <View className="flex w-10 h-10 rounded-full bg-[#112240] border border-[#64FFDA] items-center justify-center">
          <Text className="text-[#64FFDA]  text-xl font-semibold">
            {username?.charAt(0).toUpperCase()}
          </Text>
        </View>
      </MotiView>

      <ScrollView className="flex-1 p-4">
        {notes.length === 0 ? (
          <View className="flex-1 items-center justify-center py-20">
            <Text className="text-white text-center mb-4">
              Henüz not eklenmemiş
            </Text>
            <TouchableOpacity
              onPress={() => setIsModalVisible(true)}
              className="bg-[#64FFDA] px-6 py-3 rounded-lg flex-row items-center"
            >
              <Ionicons name="add-circle-outline" size={24} color="#0A192F" />
              <Text className="text-[#0A192F] font-semibold ml-2">
                Not Ekle
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="space-y-4 gap-4">
            {notes.map((note) => (
              <MotiView
                key={note.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[#112240] p-4 rounded-lg"
              >
                <Text className="text-[#64FFDA] text-lg font-semibold mb-2">
                  {note.title}
                </Text>
                <Text className="text-white">{note.content}</Text>
                <Text className="text-gray-400 text-sm mt-2">
                  {new Date(note.createdAt).toLocaleDateString("tr-TR")}
                </Text>
              </MotiView>
            ))}
          </View>
        )}
      </ScrollView>

      {notes.length > 0 && (
        <TouchableOpacity
          onPress={() => setIsModalVisible(true)}
          className="absolute bottom-6 right-6 bg-[#64FFDA] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        >
          <Ionicons name="add" size={30} color="#0A192F" />
        </TouchableOpacity>
      )}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}
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
                  Yeni Not
                </Text>
                <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                  <Ionicons name="close" size={24} color="#64FFDA" />
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Başlık"
                placeholderTextColor="#64FFDA"
                value={noteTitle}
                onChangeText={setNoteTitle}
                className="bg-[#1E3A8A] text-white p-4 rounded-lg mb-4"
              />

              <TextInput
                placeholder="İçerik"
                placeholderTextColor="#64FFDA"
                value={noteContent}
                onChangeText={setNoteContent}
                multiline
                numberOfLines={5}
                className="bg-[#1E3A8A] text-white p-4 rounded-lg mb-6"
                textAlignVertical="top"
              />

              <TouchableOpacity
                onPress={handleAddNote}
                className="bg-[#64FFDA] p-4 rounded-lg"
              >
                <Text className="text-[#0A192F] text-center font-semibold">
                  Kaydet
                </Text>
              </TouchableOpacity>
            </MotiView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
}
