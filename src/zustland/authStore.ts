import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  token: string;
  setToken: (value: string) => void;
  refreshToken: string;
  setRefreshToken: (value: string) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (value: boolean) => void;
  clear: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: '',
      setToken: (value: string) => {
        set({ token: value });
      },
      refreshToken:'',
      setRefreshToken: (value: string) => {
        set({ refreshToken: value });
      },
      clear: () => {
        set({ token: '', refreshToken: '', isLoggedIn: false });
      },
      isLoggedIn: false,
      setIsLoggedIn: (value: boolean) => {
        set({ isLoggedIn: value });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export default useAuthStore;
