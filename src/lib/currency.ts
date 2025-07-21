// Currency utilities and constants for multi-currency support

export interface Currency {
  code: string
  name: string
  symbol: string
  locale: string
  decimalPlaces: number
}

// Supported currencies with their formatting information
export const SUPPORTED_CURRENCIES: Currency[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    locale: 'en-US',
    decimalPlaces: 2,
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    locale: 'de-DE',
    decimalPlaces: 2,
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    locale: 'en-GB',
    decimalPlaces: 2,
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'C$',
    locale: 'en-CA',
    decimalPlaces: 2,
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    locale: 'en-AU',
    decimalPlaces: 2,
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    locale: 'ja-JP',
    decimalPlaces: 0,
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF',
    locale: 'de-CH',
    decimalPlaces: 2,
  },
  {
    code: 'SEK',
    name: 'Swedish Krona',
    symbol: 'kr',
    locale: 'sv-SE',
    decimalPlaces: 2,
  },
  {
    code: 'NOK',
    name: 'Norwegian Krone',
    symbol: 'kr',
    locale: 'nb-NO',
    decimalPlaces: 2,
  },
  {
    code: 'DKK',
    name: 'Danish Krone',
    symbol: 'kr',
    locale: 'da-DK',
    decimalPlaces: 2,
  },
  {
    code: 'PLN',
    name: 'Polish Złoty',
    symbol: 'zł',
    locale: 'pl-PL',
    decimalPlaces: 2,
  },
  {
    code: 'CZK',
    name: 'Czech Koruna',
    symbol: 'Kč',
    locale: 'cs-CZ',
    decimalPlaces: 2,
  },
  {
    code: 'HUF',
    name: 'Hungarian Forint',
    symbol: 'Ft',
    locale: 'hu-HU',
    decimalPlaces: 0,
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    locale: 'en-IN',
    decimalPlaces: 2,
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    locale: 'en-SG',
    decimalPlaces: 2,
  },
  {
    code: 'HKD',
    name: 'Hong Kong Dollar',
    symbol: 'HK$',
    locale: 'en-HK',
    decimalPlaces: 2,
  },
  {
    code: 'NZD',
    name: 'New Zealand Dollar',
    symbol: 'NZ$',
    locale: 'en-NZ',
    decimalPlaces: 2,
  },
  {
    code: 'ZAR',
    name: 'South African Rand',
    symbol: 'R',
    locale: 'en-ZA',
    decimalPlaces: 2,
  },
  {
    code: 'BRL',
    name: 'Brazilian Real',
    symbol: 'R$',
    locale: 'pt-BR',
    decimalPlaces: 2,
  },
  {
    code: 'MXN',
    name: 'Mexican Peso',
    symbol: '$',
    locale: 'es-MX',
    decimalPlaces: 2,
  },
]

// Create a map for quick currency lookup
export const CURRENCY_MAP = new Map<string, Currency>(
  SUPPORTED_CURRENCIES.map(currency => [currency.code, currency])
)

// Default currency
export const DEFAULT_CURRENCY = 'USD'

/**
 * Get currency information by code
 */
export function getCurrency(code: string): Currency {
  const currency = CURRENCY_MAP.get(code.toUpperCase())
  if (!currency) {
    // Fallback to USD if currency not found
    return CURRENCY_MAP.get(DEFAULT_CURRENCY)!
  }
  return currency
}

/**
 * Format currency amount with proper localization
 */
export function formatCurrency(
  amount: number | string,
  currencyCode: string = DEFAULT_CURRENCY,
  options: {
    showSymbol?: boolean
    locale?: string
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  } = {}
): string {
  const currency = getCurrency(currencyCode)
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  // Handle invalid amounts
  if (isNaN(numericAmount)) {
    return currency.symbol + '0.00'
  }

  const {
    showSymbol = true,
    locale = currency.locale,
    minimumFractionDigits = currency.decimalPlaces,
    maximumFractionDigits = currency.decimalPlaces,
  } = options

  try {
    if (showSymbol) {
      return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.code,
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(numericAmount)
    } else {
      return new Intl.NumberFormat(locale, {
        minimumFractionDigits,
        maximumFractionDigits,
      }).format(numericAmount)
    }
  } catch (error) {
    // Fallback formatting if locale is not supported
    const formattedNumber = numericAmount.toFixed(currency.decimalPlaces)
    return showSymbol ? `${currency.symbol}${formattedNumber}` : formattedNumber
  }
}

/**
 * Get currency symbol
 */
export function getCurrencySymbol(currencyCode: string): string {
  const currency = getCurrency(currencyCode)
  return currency.symbol
}

/**
 * Get currency name
 */
export function getCurrencyName(currencyCode: string): string {
  const currency = getCurrency(currencyCode)
  return currency.name
}

/**
 * Check if a currency code is supported
 */
export function isSupportedCurrency(currencyCode: string): boolean {
  return CURRENCY_MAP.has(currencyCode.toUpperCase())
}

/**
 * Get all supported currency codes
 */
export function getSupportedCurrencyCodes(): string[] {
  return SUPPORTED_CURRENCIES.map(currency => currency.code)
}

/**
 * Get currency options for select components
 */
export function getCurrencyOptions(): Array<{ value: string; label: string }> {
  return SUPPORTED_CURRENCIES.map(currency => ({
    value: currency.code,
    label: `${currency.code} - ${currency.name} (${currency.symbol})`,
  }))
}

/**
 * Parse currency amount from string
 */
export function parseCurrencyAmount(value: string): number {
  // Remove currency symbols and formatting
  const cleanValue = value.replace(/[^\d.-]/g, '')
  const parsed = parseFloat(cleanValue)
  return isNaN(parsed) ? 0 : parsed
}

/**
 * Validate currency code
 */
export function validateCurrencyCode(code: string): boolean {
  return typeof code === 'string' &&
         code.length === 3 &&
         isSupportedCurrency(code)
}

// Exchange rate interfaces and types
export interface ExchangeRate {
  from: string
  to: string
  rate: number
  timestamp: number
}

export interface ExchangeRateResponse {
  success: boolean
  rates: Record<string, number>
  base: string
  date: string
}

// Cache for exchange rates (in-memory, could be moved to Redis in production)
const exchangeRateCache = new Map<string, ExchangeRate>()
const CACHE_DURATION = 60 * 60 * 1000 // 1 hour in milliseconds

/**
 * Get exchange rate from cache or fetch from API
 */
async function getExchangeRate(from: string, to: string): Promise<number> {
  // If same currency, return 1
  if (from === to) {
    return 1
  }

  const cacheKey = `${from}-${to}`
  const cached = exchangeRateCache.get(cacheKey)

  // Check if cached rate is still valid
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.rate
  }

  try {
    // Use exchangerate-api.com (free tier: 1500 requests/month)
    const response = await fetch(
      `https://api.exchangerate-api.com/v4/latest/${from}`,
      {
        headers: {
          'Accept': 'application/json',
        },
      }
    )

    if (!response.ok) {
      throw new Error(`Exchange rate API error: ${response.status}`)
    }

    const data = await response.json()

    // Check if the response has the expected structure
    if (!data.rates || typeof data.rates !== 'object') {
      throw new Error(`Invalid API response structure`)
    }

    if (!data.rates[to]) {
      throw new Error(`Exchange rate not found for ${from} to ${to}`)
    }

    const rate = data.rates[to]

    // Cache the rate
    exchangeRateCache.set(cacheKey, {
      from,
      to,
      rate,
      timestamp: Date.now(),
    })

    return rate
  } catch (error) {
    console.error('Failed to fetch exchange rate:', error)

    // Fallback: try reverse rate if available in cache
    const reverseCacheKey = `${to}-${from}`
    const reverseCached = exchangeRateCache.get(reverseCacheKey)

    if (reverseCached && Date.now() - reverseCached.timestamp < CACHE_DURATION) {
      const reverseRate = 1 / reverseCached.rate
      // Cache the calculated rate
      exchangeRateCache.set(cacheKey, {
        from,
        to,
        rate: reverseRate,
        timestamp: Date.now(),
      })
      return reverseRate
    }

    // Ultimate fallback: return 1 (no conversion)
    console.warn(`Using fallback rate of 1 for ${from} to ${to}`)
    return 1
  }
}

/**
 * Convert amount from one currency to another
 */
export async function convertCurrency(
  amount: number,
  fromCurrency: string,
  toCurrency: string
): Promise<number> {
  if (fromCurrency === toCurrency) {
    return amount
  }

  const rate = await getExchangeRate(fromCurrency, toCurrency)
  return amount * rate
}

/**
 * Convert multiple amounts with their currencies to a target currency
 */
export async function convertMultipleCurrencies(
  amounts: Array<{ amount: number; currency: string }>,
  targetCurrency: string
): Promise<number> {
  const conversions = await Promise.all(
    amounts.map(async ({ amount, currency }) => {
      return await convertCurrency(amount, currency, targetCurrency)
    })
  )

  return conversions.reduce((sum, convertedAmount) => sum + convertedAmount, 0)
}

/**
 * Clear exchange rate cache (useful for testing or manual refresh)
 */
export function clearExchangeRateCache(): void {
  exchangeRateCache.clear()
}
