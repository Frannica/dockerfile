"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

// Express backend URL - configure via environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://your-backend.onrender.com"

interface User {
  id: string // UUID user_id
  email: string
  phone: string
  name: string
  email_verified: boolean
  phone_verified: boolean
  kyc_status: "pending" | "approved" | "rejected"
  signup_source: "web" | "android" | "ios"
  balance: Record<string, number>
  created_at: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  token: string | null
  signIn: (email: string, password: string) => Promise<boolean>
  signUp: (email: string, password: string, name: string, phone: string) => Promise<boolean>
  signOut: () => void
  updateBalance: (currency: string, amount: number) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    // Check for stored user session and token
    const storedUser = localStorage.getItem("egwallet_user")
    const storedToken = localStorage.getItem("egwallet_token")
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
    }
  }, [])

  const signIn = async (email: string, password: string) => {
    try {
      // Call Express backend /auth/login endpoint
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        // Backend returns: { user, token }
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem("egwallet_user", JSON.stringify(data.user))
        localStorage.setItem("egwallet_token", data.token)
        return true
      }
      return false
    } catch (error) {
      console.error("Sign in error:", error)
      return false
    }
  }

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    try {
      // Call Express backend /auth/register endpoint
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email, 
          password, 
          name, 
          phone, 
          signup_source: "web" 
        }),
      })

      if (response.ok) {
        const data = await response.json()
        // Backend returns: { user, token }
        setUser(data.user)
        setToken(data.token)
        localStorage.setItem("egwallet_user", JSON.stringify(data.user))
        localStorage.setItem("egwallet_token", data.token)
        return true
      }
      return false
    } catch (error) {
      console.error("Sign up error:", error)
      return false
    }
  }

  const signOut = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("egwallet_user")
    localStorage.removeItem("egwallet_token")
  }

  const updateBalance = (currency: string, amount: number) => {
    if (user) {
      const updatedUser = {
        ...user,
        balance: {
          ...user.balance,
          [currency]: (user.balance[currency] || 0) + amount,
        },
      }
      setUser(updatedUser)
      localStorage.setItem("egwallet_user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        token,
        signIn,
        signUp,
        signOut,
        updateBalance,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Helper function to make authenticated API calls to Express backend
export async function apiCall(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("egwallet_token")
  
  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  return response
}
