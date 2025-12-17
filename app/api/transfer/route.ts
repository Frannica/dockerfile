import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'edge'

// Mock transactions database
const mockTransactions: any[] = []

export async function POST(request: NextRequest) {
  try {
    const { senderId, recipientId, amount, currency } = await request.json()

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
    // For now, we'll accept any recipient ID
    if (recipientId === senderId) {
      return NextResponse.json(
        { error: 'Cannot send money to yourself' },
        { status: 400 }
      )
    }

    // Create transaction records
    const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const timestamp = new Date().toISOString()

    const senderTransaction = {
      id: transactionId,
      type: 'send',
      amount,
      currency,
      from: senderId,
      to: recipientId,
      date: timestamp,
      status: 'completed',
    }

    const receiverTransaction = {
      id: transactionId,
      type: 'receive',
      amount,
      currency,
      from: senderId,
      to: recipientId,
      date: timestamp,
      status: 'completed',
    }

    mockTransactions.push(senderTransaction, receiverTransaction)

    return NextResponse.json({
      transaction: senderTransaction,
      message: 'Transfer successful',
    })
  } catch (error) {
    console.error('Transfer error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
