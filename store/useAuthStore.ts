'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  email: string
  nickname: string
  inviteCode: string
  partnerId: string | null
  reminderTime: string
}

interface AuthState {
  currentUser: User | null
  setUser: (user: User | null) => void
  clearUser: () => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      currentUser: null,

      setUser: (user) => set({ currentUser: user }),

      clearUser: () => set({ currentUser: null }),

      updateUser: (updates) => {
        const { currentUser } = get()
        if (currentUser) {
          set({ currentUser: { ...currentUser, ...updates } })
        }
      },
    }),
    {
      name: 'love-letter-auth',
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
)
