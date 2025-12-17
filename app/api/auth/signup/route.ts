import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Mock user database (in production, use a real database)
const mockUsers: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = mockUsers.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 409 }
      )
    }

    // Create new user
    const newUser = {
      id: `EGW-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      email,
      name,
      password, // In production, hash this!
      balance: {
        USD: 1000.00, // Starting bonus
        EUR: 0,
        CNY: 0,
        NGN: 0,
        XAF: 0,
        XOF: 0,
        GHS: 0,
        ZAR: 0,
      },
    }

    mockUsers.push(newUser)

    // Return user without password
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json({
      user: userWithoutPassword,
      message: 'Account created successfully',
    })
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
