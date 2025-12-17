import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Mock transactions - in production, fetch from database based on user ID
const mockTransactions = [
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    type: 'receive',
    amount: 500.00,
    currency: 'USD',
    from: '550e8400-e29b-41d4-a716-446655440999',
    to: '550e8400-e29b-41d4-a716-446655440000',
    status: 'completed',
    source: 'web',
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    approved_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 7200000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440002',
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    type: 'send',
    amount: 1200.00,
    currency: 'EUR',
    from: '550e8400-e29b-41d4-a716-446655440000',
    to: '550e8400-e29b-41d4-a716-446655440888',
    status: 'completed',
    source: 'web',
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    approved_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 1800000).toISOString(),
    completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 3600000).toISOString(),
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440003',
    user_id: '550e8400-e29b-41d4-a716-446655440000',
    type: 'send',
    amount: 250.00,
    currency: 'USD',
    from: '550e8400-e29b-41d4-a716-446655440000',
    to: '550e8400-e29b-41d4-a716-446655440777',
    status: 'pending', // Web Beta: awaiting admin approval
    source: 'web',
    created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    approved_at: null,
    completed_at: null,
  },
]

export async function GET(request: NextRequest) {
  try {
    // In production, get user ID from authentication and filter transactions
    // For now, return mock data

    return NextResponse.json({
      transactions: mockTransactions,
      note: 'Web Beta: Some transactions may be pending admin approval',
    })
  } catch (error) {
    console.error('Transactions error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
