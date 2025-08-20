// types/auth.ts
import { ObjectId } from 'mongodb'

export interface User {
  _id?: ObjectId
  email: string
  passwordHash: string
  role: 'admin' | 'user'
  name: string
  createdAt: Date
  lastLoginAt?: Date
  isActive: boolean
}

export interface AuthUser {
  id: string
  email: string
  role: 'admin' | 'user'
  name: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  user?: AuthUser
}

export interface SessionData {
  userId: string
  email: string
  role: 'admin' | 'user'
  name: string
  loginTime: number
  expiresAt: number
}

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => Promise<void>
  checkSession: () => Promise<void>
}