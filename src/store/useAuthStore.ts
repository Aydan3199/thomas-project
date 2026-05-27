import { create } from 'zustand';

export type UserRole = 'patient' | 'doctor' | 'caseManager' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
  age?: number;
  gender?: string;
  phone?: string;
  email?: string;
}

interface AuthState {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
  updateUserFields: (fields: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
  updateUserFields: (fields) => set((state) => ({
    currentUser: state.currentUser ? { ...state.currentUser, ...fields } : null
  })),
}));
