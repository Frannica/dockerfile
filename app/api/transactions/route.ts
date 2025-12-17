import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Mock transactions - in production, fetch from database based on user ID
const mockTransactions = [
  {
    id: 'TXN-001',
    type: 'receive',
    amount: 500.00,
    currency: 'USD',
    from: 'EGW-999',
    to: 'EGW-001',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: 'TXN-002',
    type: 'send',
    amount: 1200.00,
    currency: 'EUR',
    from: 'EGW-001',
    to: 'EGW-888',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
  {
    id: 'TXN-003',
    type: 'receive',
    amount: 5000.00,
    currency: 'CNY',
    from: 'EGW-777',
    to: 'EGW-001',
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
  },
]

export async function GET(request: NextRequest) {
  try {
    // In production, get user ID from authentication and filter transactions
    // For now, return mock data

    return NextResponse.json({
      transactions: mockTransactions,
    })
  } catch (error) {
    console.error('Transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
