import { NextResponse } from 'next/server'

export const runtime = 'edge'

export async function GET() {
  try {
    // Fetch exchange rates from frankfurter.app API
    const response = await fetch('https://api.frankfurter.app/latest?from=USD')
    
    if (!response.ok) {
      throw new Error('Failed to fetch exchange rates')
    }

    const data = await response.json()
    
    // Filter to only return the currencies we support
    const supportedCurrencies = ['XAF', 'XOF', 'NGN', 'GHS', 'ZAR', 'CNY', 'USD', 'EUR']
    const filteredRates: Record<string, number> = { USD: 1 }
    
    for (const currency of supportedCurrencies) {
      if (data.rates[currency]) {
        filteredRates[currency] = data.rates[currency]
      }
    }

    return NextResponse.json({
      base: 'USD',
      date: data.date,
      rates: filteredRates,
    })

  } catch (error) {
    console.error('Exchange rates API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch exchange rates',
        // Fallback rates
        base: 'USD',
        rates: {
          USD: 1,
          EUR: 0.92,
          CNY: 7.24,
          ZAR: 18.50,
          GHS: 12.00,
          NGN: 1550.00,
          XOF: 606.00,
          XAF: 606.00,
        }
      },
      { status: 200 }
    )
  }
}
