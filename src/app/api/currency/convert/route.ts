import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '~/lib/auth'
import { convertCurrency, convertMultipleCurrencies, validateCurrencyCode } from '~/lib/currency'

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { amount, fromCurrency, toCurrency, amounts } = body

    // Handle single currency conversion
    if (amount !== undefined && fromCurrency && toCurrency) {
      if (!validateCurrencyCode(fromCurrency) || !validateCurrencyCode(toCurrency)) {
        return NextResponse.json(
          { error: 'Invalid currency code' },
          { status: 400 }
        )
      }

      if (typeof amount !== 'number' || amount < 0) {
        return NextResponse.json(
          { error: 'Invalid amount' },
          { status: 400 }
        )
      }

      const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency)
      
      return NextResponse.json({
        originalAmount: amount,
        fromCurrency,
        toCurrency,
        convertedAmount,
        timestamp: new Date().toISOString(),
      })
    }

    // Handle multiple currency conversion
    if (amounts && Array.isArray(amounts) && toCurrency) {
      if (!validateCurrencyCode(toCurrency)) {
        return NextResponse.json(
          { error: 'Invalid target currency code' },
          { status: 400 }
        )
      }

      // Validate amounts array
      for (const item of amounts) {
        if (!item.amount || !item.currency || typeof item.amount !== 'number' || item.amount < 0) {
          return NextResponse.json(
            { error: 'Invalid amounts array format' },
            { status: 400 }
          )
        }
        if (!validateCurrencyCode(item.currency)) {
          return NextResponse.json(
            { error: `Invalid currency code: ${item.currency}` },
            { status: 400 }
          )
        }
      }

      const totalConverted = await convertMultipleCurrencies(amounts, toCurrency)
      
      return NextResponse.json({
        amounts,
        toCurrency,
        totalConverted,
        timestamp: new Date().toISOString(),
      })
    }

    return NextResponse.json(
      { error: 'Invalid request format. Provide either (amount, fromCurrency, toCurrency) or (amounts, toCurrency)' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Currency conversion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const amount = searchParams.get('amount')

    if (!from || !to) {
      return NextResponse.json(
        { error: 'Missing required parameters: from, to' },
        { status: 400 }
      )
    }

    if (!validateCurrencyCode(from) || !validateCurrencyCode(to)) {
      return NextResponse.json(
        { error: 'Invalid currency code' },
        { status: 400 }
      )
    }

    const numericAmount = amount ? parseFloat(amount) : 1
    if (isNaN(numericAmount) || numericAmount < 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }

    const convertedAmount = await convertCurrency(numericAmount, from, to)
    
    return NextResponse.json({
      originalAmount: numericAmount,
      fromCurrency: from,
      toCurrency: to,
      convertedAmount,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Currency conversion API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
