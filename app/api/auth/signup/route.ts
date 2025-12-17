import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Mock user database (in production, use a real database)
const mockUsers: any[] = []

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name, phone, signup_source = 'web' } = await request.json()

    if (!email || !password || !name || !phone) {
      return NextResponse.json(
        { error: 'Email, password, name, and phone are required' },
        { status: 400 }
      )
    }

    // Check if user already exists (email or phone)
    const existingUser = mockUsers.find((u) => u.email === email || u.phone === phone)
    if (existingUser) {
      return NextResponse.json(
        { error: existingUser.email === email ? 'Email already in use' : 'Phone number already in use' },
        { status: 409 }
      )
    }

    // Create new user following the unified schema
    const newUser = {
      id: generateUUID(), // UUID user_id
      email,
      phone,
      name,
      password, // In production, hash this with bcrypt!
      email_verified: false,
      phone_verified: false,
      kyc_status: 'pending',
      signup_source,
      created_at: new Date().toISOString(),
      balance: {
        USD: 0, // Web Beta: no starting bonus, requires KYC first
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
      message: 'Account created successfully. Please complete KYC verification to start using EGWallet.',
      note: 'Your EGWallet account works on web and mobile. Web Beta: limited features until app launch.',
    })
  } catch (error) {
    console.error('Sign up error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
