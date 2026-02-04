'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Letter } from './types'

function generateId(): string {
  return Math.random().toString(36).substring(2, 15)
}

interface LetterState {
  letters: Letter[]

  // Actions
  createLetter: (senderId: string, receiverId: string, content: string, themeId?: string, scheduledAt?: Date | null) => Letter
  getLettersForUser: (userId: string) => Letter[]
  getReceivedLetters: (userId: string) => Letter[]
  getSentLetters: (userId: string) => Letter[]
  getLetterById: (id: string) => Letter | undefined
  markAsRead: (id: string) => void
}

export const useLetterStore = create<LetterState>()(
  persist(
    (set, get) => ({
      letters: [],

      createLetter: (senderId, receiverId, content, themeId = 'default', scheduledAt = null) => {
        const newLetter: Letter = {
          id: generateId(),
          senderId,
          receiverId,
          content,
          themeId,
          scheduledAt,
          isOpened: false,
          openedAt: null,
          createdAt: new Date(),
        }

        set(state => ({ letters: [...state.letters, newLetter] }))
        return newLetter
      },

      getLettersForUser: (userId) => {
        return get().letters.filter(
          l => l.senderId === userId || l.receiverId === userId
        )
      },

      getReceivedLetters: (userId) => {
        const now = new Date()
        return get()
          .letters.filter(l => {
            if (l.receiverId !== userId) return false
            // 예약 편지는 예약 시간이 지났을 때만 표시
            if (l.scheduledAt && new Date(l.scheduledAt) > now) return false
            return true
          })
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      getSentLetters: (userId) => {
        return get()
          .letters.filter(l => l.senderId === userId)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      },

      getLetterById: (id) => {
        return get().letters.find(l => l.id === id)
      },

      markAsRead: (id) => {
        set(state => ({
          letters: state.letters.map(l =>
            l.id === id
              ? { ...l, isOpened: true, openedAt: new Date() }
              : l
          ),
        }))
      },
    }),
    {
      name: 'love-letter-letters',
    }
  )
)
