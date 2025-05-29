import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

interface NotesStore {
  notes: Note[];
  addNote: (note: Omit<Note, "id" | "createdAt">) => Promise<void>;
  updateNote: (
    id: string,
    note: Partial<Omit<Note, "id" | "createdAt">>
  ) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  loadNotes: () => Promise<void>;
}

export const useNotes = create<NotesStore>((set) => ({
  notes: [],

  addNote: async (note) => {
    const newNote: Note = {
      id: Date.now().toString(),
      ...note,
      createdAt: new Date().toISOString(),
    };

    set((state) => {
      const updatedNotes = [newNote, ...state.notes];
      SecureStore.setItemAsync("notes", JSON.stringify(updatedNotes));
      return { notes: updatedNotes };
    });
  },

  updateNote: async (id, note) => {
    set((state) => {
      const updatedNotes = state.notes.map((n) =>
        n.id === id ? { ...n, ...note } : n
      );
      SecureStore.setItemAsync("notes", JSON.stringify(updatedNotes));
      return { notes: updatedNotes };
    });
  },

  deleteNote: async (id) => {
    set((state) => {
      const updatedNotes = state.notes.filter((n) => n.id !== id);
      SecureStore.setItemAsync("notes", JSON.stringify(updatedNotes));
      return { notes: updatedNotes };
    });
  },

  loadNotes: async () => {
    try {
      const storedNotes = await SecureStore.getItemAsync("notes");
      if (storedNotes) {
        set({ notes: JSON.parse(storedNotes) });
      }
    } catch (error) {
      console.error("Notlar yüklenirken hata oluştu:", error);
    }
  },
}));
