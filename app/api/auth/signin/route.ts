import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Mock user database (in production, use a real database)
const mockUsers = [
  {
    id: "EGW-001",
    email: "demo@egwallet.com",
    password: "demo123",
    name: "Demo User",
    balance: {
      USD: 5230.50,
      EUR: 4810.20,
      CNY: 15420.00,
      NGN: 3200000.00,
      XAF: 2500000.00,
      XOF: 1800000.00,
      GHS: 48000.00,
      ZAR: 92000.00,
    },
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user (in production, hash and compare passwords properly)
    const user = mockUsers.find(
      (u) => u.email === email && u.password === password
    )

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Return user without password
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Sign in successful',
    })
  } catch (error) {
    console.error('Sign in error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
