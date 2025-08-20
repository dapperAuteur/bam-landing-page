'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { AuthContextType, AuthUser, LoginResponse } from './../types/auth'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check session on mount
  useEffect(() => {
    checkSession()
  }, [])

  const checkSession = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.authenticated && data.user) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch (error) {
      console.error('Session check failed:', error)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data: LoginResponse = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        return { success: true, message: data.message, user: data.user }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      return { 
        success: false, 
        message: 'Network error. Please try again.' 
      }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error)
      // Still clear user state even if request fails
      setUser(null)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isLoading,
    login,
    logout,
    checkSession
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}