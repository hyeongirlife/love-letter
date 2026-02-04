// 모킹 데이터 타입 정의

export interface User {
  id: string
  email: string
  nickname: string
  inviteCode: string
  partnerId: string | null
  reminderTime: string
  createdAt: Date
}

export interface Letter {
  id: string
  senderId: string
  receiverId: string
  content: string
  themeId: string
  scheduledAt: Date | null
  isOpened: boolean
  openedAt: Date | null
  createdAt: Date
}

export interface Anniversary {
  id: string
  userId: string
  title: string
  date: Date
  createdAt: Date
}
