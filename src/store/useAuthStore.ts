import { create } from 'zustand';

export type UserRole = 'patient' | 'doctor' | 'caseManager' | null;

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

interface AuthState {
  currentUser: User | null;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  login: (user) => set({ currentUser: user }),
  logout: () => set({ currentUser: null }),
}));
