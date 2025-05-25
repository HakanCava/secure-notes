import { create } from "zustand";

type AuthState = {
  username: string | null;
  setUsername: (username: string | null) => void;
};

export const useAuth = create<AuthState>((set) => ({
  username: null,
  setUsername: (username) => set({ username }),
}));
