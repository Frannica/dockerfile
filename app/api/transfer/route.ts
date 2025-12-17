import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Mock transactions database
const mockTransactions: any[] = []

function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0
    const v = c === 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

export async function POST(request: NextRequest) {
  try {
    const { senderId, recipientId, amount, currency, senderKycStatus } = await request.json()

    if (!senderId || !recipientId || !amount || !currency) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be greater than zero' },
        { status: 400 }
      )
    }

    // Validate that recipient exists (in production, check against database)
    if (recipientId === senderId) {
      return NextResponse.json(
        { error: 'Cannot send money to yourself' },
        { status: 400 }
      )
    }

    // Web Beta: Check KYC requirement
    if (senderKycStatus !== 'approved') {
      return NextResponse.json(
        { error: 'KYC verification required before you can send money' },
        { status: 403 }
      )
    }

    // Web Beta: Check max balance limit ($250,000)
    const MAX_BALANCE = 250000
    if (amount > MAX_BALANCE) {
      return NextResponse.json(
        { error: `Maximum wallet balance is $${MAX_BALANCE.toLocaleString()}` },
        { status: 400 }
      )
    }

    // Create transaction records with UUID and pending status
    const transactionId = generateUUID()
    const timestamp = new Date().toISOString()

    // Web Beta: Transactions start as "pending" and require admin approval
    const senderTransaction = {
      id: transactionId,
      user_id: senderId,
      type: 'send',
      amount,
      currency,
      from: senderId,
      to: recipientId,
      status: 'pending', // Web Beta: requires admin approval
      source: 'web',
      created_at: timestamp,
      approved_at: null,
      completed_at: null,
    }

    const receiverTransaction = {
      id: transactionId,
      user_id: recipientId,
      type: 'receive',
      amount,
      currency,
      from: senderId,
      to: recipientId,
      status: 'pending', // Web Beta: requires admin approval
      source: 'web',
      created_at: timestamp,
      approved_at: null,
      completed_at: null,
    }

    mockTransactions.push(senderTransaction, receiverTransaction)

    return NextResponse.json({
      transaction: senderTransaction,
      message: 'Web Beta: Transfer request submitted. Pending admin approval for execution.',
      note: 'Instant transfers will be available when the mobile app launches.',
    })
  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
