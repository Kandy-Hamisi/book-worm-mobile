import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  register: async ({ username, email, password }: User) => {
    set({ isLoading: true });
    try {
      const response = await fetch(
        "http://localhost:5000/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Something Went wrong");
      await AsyncStorage.setItem("user", JSON.stringify(data.user));
      await AsyncStorage.setItem("token", JSON.stringify(data.token));

      set({ token: data.token, user: data.user, isLoading: false });
    } catch (error: any) {
      set({ isLoading: false });
      return { success: false, error: error.message };
    }
  },
}));
