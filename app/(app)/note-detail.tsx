import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MotiView } from "moti";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useNotes } from "../../store/useNotes";

export default function NoteDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { notes, updateNote, deleteNote } = useNotes();
  const note = notes.find((n) => n.id === id);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(note?.title || "");
  const [content, setContent] = useState(note?.content || "");

  const handleUpdate = async () => {
    if (note && title.trim() && content.trim()) {
      await updateNote(note.id, { title, content });
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (note) {
      await deleteNote(note.id);
      router.back();
    }
  };

  if (!note) return null;

  return (
    <SafeAreaView className="flex-1 bg-[#0A192F]">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: "timing", duration: 500 }}
          className="bg-[#112240] px-4 py-3 flex-row items-center justify-between"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center"
          >
            <Ionicons name="arrow-back" size={24} color="#64FFDA" />
          </TouchableOpacity>

          <View className="flex-row items-center space-x-4">
            <TouchableOpacity
              onPress={() => setIsEditing(!isEditing)}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons
                name={isEditing ? "checkmark" : "create-outline"}
                size={24}
                color="#64FFDA"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleDelete}
              className="w-10 h-10 items-center justify-center"
            >
              <Ionicons name="trash-outline" size={24} color="#FF4747" />
            </TouchableOpacity>
          </View>
        </MotiView>

        <ScrollView className="flex-1 p-4">
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "timing", duration: 500 }}
            className="bg-[#112240] rounded-xl overflow-hidden shadow-xl p-4"
          >
            {isEditing ? (
              <View>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Başlık"
                  placeholderTextColor="#64FFDA"
                  className="text-[#64FFDA] text-xl font-semibold mb-4 bg-[#1E3A8A] p-3 rounded-lg"
                />
                <TextInput
                  value={content}
                  onChangeText={setContent}
                  placeholder="İçerik"
                  placeholderTextColor="#64FFDA"
                  multiline
                  className="text-white bg-[#1E3A8A] p-3 rounded-lg min-h-[200px]"
                  textAlignVertical="top"
                />
                <TouchableOpacity
                  onPress={handleUpdate}
                  className="bg-[#64FFDA] p-3 rounded-lg mt-4"
                >
                  <Text className="text-[#0A192F] text-center font-semibold">
                    Güncelle
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text className="text-[#64FFDA] text-2xl font-semibold mb-4">
                  {note.title}
                </Text>
                <Text className="text-white text-lg mb-6">{note.content}</Text>
                <Text className="text-gray-400">
                  {new Date(note.createdAt).toLocaleDateString("tr-TR")}
                </Text>
              </View>
            )}
          </MotiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
