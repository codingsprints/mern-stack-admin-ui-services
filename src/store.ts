import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AuthState } from "./utils/types";

export const useAuthStore = create<AuthState>()(
  devtools((set) => ({
    user: null,
    setUser: (user) => set({ user }),
    logout: () => set({ user: null }),
  }))
);
