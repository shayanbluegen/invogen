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
    symbol: 'MX$',
    locale: 'es-MX',
    decimalPlaces: 2,
  },
  {
    code: 'PKR',
    name: 'Pakistani Rupee',
    symbol: '₨',
    locale: 'ur-PK',
    decimalPlaces: 2,
  },
  {
    code: 'CNY',
    name: 'Chinese Yuan',
    symbol: '¥',
    locale: 'zh-CN',
    decimalPlaces: 2,
  },
  {
    code: 'KRW',
    name: 'South Korean Won',
    symbol: '₩',
    locale: 'ko-KR',
    decimalPlaces: 0,
  },
  {
    code: 'THB',
    name: 'Thai Baht',
    symbol: '฿',
    locale: 'th-TH',
    decimalPlaces: 2,
  },
  {
    code: 'MYR',
    name: 'Malaysian Ringgit',
    symbol: 'RM',
    locale: 'ms-MY',
    decimalPlaces: 2,
  },
  {
    code: 'PHP',
    name: 'Philippine Peso',
    symbol: '₱',
    locale: 'en-PH',
    decimalPlaces: 2,
  },
  {
    code: 'IDR',
    name: 'Indonesian Rupiah',
    symbol: 'Rp',
    locale: 'id-ID',
    decimalPlaces: 0,
  },
  {
    code: 'VND',
    name: 'Vietnamese Dong',
    symbol: '₫',
    locale: 'vi-VN',
    decimalPlaces: 0,
  },
  {
    code: 'TRY',
    name: 'Turkish Lira',
    symbol: '₺',
    locale: 'tr-TR',
    decimalPlaces: 2,
  },
  {
    code: 'RUB',
    name: 'Russian Ruble',
    symbol: '₽',
    locale: 'ru-RU',
    decimalPlaces: 2,
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'د.إ',
    locale: 'ar-AE',
    decimalPlaces: 2,
  },
  {
    code: 'SAR',
    name: 'Saudi Riyal',
    symbol: '﷼',
    locale: 'ar-SA',
    decimalPlaces: 2,
  },
  {
    code: 'QAR',
    name: 'Qatari Riyal',
    symbol: 'ر.ق',
    locale: 'ar-QA',
    decimalPlaces: 2,
  },
  {
    code: 'KWD',
    name: 'Kuwaiti Dinar',
    symbol: 'د.ك',
    locale: 'ar-KW',
    decimalPlaces: 3,
  },
  {
    code: 'BHD',
    name: 'Bahraini Dinar',
    symbol: '.د.ب',
    locale: 'ar-BH',
    decimalPlaces: 3,
  },
  {
    code: 'OMR',
    name: 'Omani Rial',
    symbol: 'ر.ع.',
    locale: 'ar-OM',
    decimalPlaces: 3,
  },
  {
    code: 'ILS',
    name: 'Israeli Shekel',
    symbol: '₪',
    locale: 'he-IL',
    decimalPlaces: 2,
  },
  {
    code: 'EGP',
    name: 'Egyptian Pound',
    symbol: 'ج.م',
    locale: 'ar-EG',
    decimalPlaces: 2,
  },
  {
    code: 'JOD',
    name: 'Jordanian Dinar',
    symbol: 'د.ا',
    locale: 'ar-JO',
    decimalPlaces: 3,
  },
  {
    code: 'LBP',
    name: 'Lebanese Pound',
    symbol: 'ل.ل',
    locale: 'ar-LB',
    decimalPlaces: 2,
  },
  {
    code: 'KES',
    name: 'Kenyan Shilling',
    symbol: 'KSh',
    locale: 'en-KE',
    decimalPlaces: 2,
  },
  {
    code: 'NGN',
    name: 'Nigerian Naira',
    symbol: '₦',
    locale: 'en-NG',
    decimalPlaces: 2,
  },
  {
    code: 'GHS',
    name: 'Ghanaian Cedi',
    symbol: '₵',
    locale: 'en-GH',
    decimalPlaces: 2,
  },
  {
    code: 'UGX',
    name: 'Ugandan Shilling',
    symbol: 'USh',
    locale: 'en-UG',
    decimalPlaces: 0,
  },
  {
    code: 'TZS',
    name: 'Tanzanian Shilling',
    symbol: 'TSh',
    locale: 'en-TZ',
    decimalPlaces: 2,
  },
  {
    code: 'ETB',
    name: 'Ethiopian Birr',
    symbol: 'Br',
    locale: 'am-ET',
    decimalPlaces: 2,
  },
  {
    code: 'MAD',
    name: 'Moroccan Dirham',
    symbol: 'د.م.',
    locale: 'ar-MA',
    decimalPlaces: 2,
  },
  {
    code: 'TND',
    name: 'Tunisian Dinar',
    symbol: 'د.ت',
    locale: 'ar-TN',
    decimalPlaces: 3,
  },
  {
    code: 'DZD',
    name: 'Algerian Dinar',
    symbol: 'د.ج',
    locale: 'ar-DZ',
    decimalPlaces: 2,
  },
  {
    code: 'LKR',
    name: 'Sri Lankan Rupee',
    symbol: 'Rs',
    locale: 'si-LK',
    decimalPlaces: 2,
  },
  {
    code: 'BDT',
    name: 'Bangladeshi Taka',
    symbol: '৳',
    locale: 'bn-BD',
    decimalPlaces: 2,
  },
  {
    code: 'NPR',
    name: 'Nepalese Rupee',
    symbol: 'रू',
    locale: 'ne-NP',
    decimalPlaces: 2,
  },
  {
    code: 'AFN',
    name: 'Afghan Afghani',
    symbol: '؋',
    locale: 'fa-AF',
    decimalPlaces: 2,
  },
  {
    code: 'IRR',
    name: 'Iranian Rial',
    symbol: '﷼',
    locale: 'fa-IR',
    decimalPlaces: 2,
  },
  {
    code: 'UZS',
    name: 'Uzbekistani Som',
    symbol: "so'm",
    locale: 'uz-UZ',
    decimalPlaces: 2,
  },
  {
    code: 'KZT',
    name: 'Kazakhstani Tenge',
    symbol: '₸',
    locale: 'kk-KZ',
    decimalPlaces: 2,
  },
  {
    code: 'AZN',
    name: 'Azerbaijani Manat',
    symbol: '₼',
    locale: 'az-AZ',
    decimalPlaces: 2,
  },
  {
    code: 'GEL',
    name: 'Georgian Lari',
    symbol: '₾',
    locale: 'ka-GE',
    decimalPlaces: 2,
  },
  {
    code: 'AMD',
    name: 'Armenian Dram',
    symbol: '֏',
    locale: 'hy-AM',
    decimalPlaces: 2,
  },
  {
    code: 'COP',
    name: 'Colombian Peso',
    symbol: 'COL$',
    locale: 'es-CO',
    decimalPlaces: 2,
  },
  {
    code: 'PEN',
    name: 'Peruvian Sol',
    symbol: 'S/',
    locale: 'es-PE',
    decimalPlaces: 2,
  },
  {
    code: 'CLP',
    name: 'Chilean Peso',
    symbol: 'CLP$',
    locale: 'es-CL',
    decimalPlaces: 0,
  },
  {
    code: 'ARS',
    name: 'Argentine Peso',
    symbol: 'AR$',
    locale: 'es-AR',
    decimalPlaces: 2,
  },
  {
    code: 'UYU',
    name: 'Uruguayan Peso',
    symbol: 'UY$',
    locale: 'es-UY',
    decimalPlaces: 2,
  },
  {
    code: 'BOB',
    name: 'Bolivian Boliviano',
    symbol: 'Bs',
    locale: 'es-BO',
    decimalPlaces: 2,
  },
  {
    code: 'PYG',
    name: 'Paraguayan Guarani',
    symbol: '₲',
    locale: 'es-PY',
    decimalPlaces: 0,
  },
  {
    code: 'VES',
    name: 'Venezuelan Bolívar',
    symbol: 'Bs.S',
    locale: 'es-VE',
    decimalPlaces: 2,
  },
  {
    code: 'GTQ',
    name: 'Guatemalan Quetzal',
    symbol: 'Q',
    locale: 'es-GT',
    decimalPlaces: 2,
  },
  {
    code: 'CRC',
    name: 'Costa Rican Colón',
    symbol: '₡',
    locale: 'es-CR',
    decimalPlaces: 2,
  },
  {
    code: 'HNL',
    name: 'Honduran Lempira',
    symbol: 'L',
    locale: 'es-HN',
    decimalPlaces: 2,
  },
  {
    code: 'NIO',
    name: 'Nicaraguan Córdoba',
    symbol: 'C$',
    locale: 'es-NI',
    decimalPlaces: 2,
  },
  {
    code: 'PAB',
    name: 'Panamanian Balboa',
    symbol: 'B/.',
    locale: 'es-PA',
    decimalPlaces: 2,
  },
  {
    code: 'DOP',
    name: 'Dominican Peso',
    symbol: 'RD$',
    locale: 'es-DO',
    decimalPlaces: 2,
  },
  {
    code: 'JMD',
    name: 'Jamaican Dollar',
    symbol: 'J$',
    locale: 'en-JM',
    decimalPlaces: 2,
  },
  {
    code: 'TTD',
    name: 'Trinidad and Tobago Dollar',
    symbol: 'TT$',
    locale: 'en-TT',
    decimalPlaces: 2,
  },
  {
    code: 'BBD',
    name: 'Barbadian Dollar',
    symbol: 'Bds$',
    locale: 'en-BB',
    decimalPlaces: 2,
  },
  {
    code: 'XCD',
    name: 'East Caribbean Dollar',
    symbol: 'EC$',
    locale: 'en-AG',
    decimalPlaces: 2,
  },
  {
    code: 'BSD',
    name: 'Bahamian Dollar',
    symbol: 'B$',
    locale: 'en-BS',
    decimalPlaces: 2,
  },
  {
    code: 'BZD',
    name: 'Belize Dollar',
    symbol: 'BZ$',
    locale: 'en-BZ',
    decimalPlaces: 2,
  },
  {
    code: 'GYD',
    name: 'Guyanese Dollar',
    symbol: 'G$',
    locale: 'en-GY',
    decimalPlaces: 2,
  },
  {
    code: 'SRD',
    name: 'Surinamese Dollar',
    symbol: 'Sr$',
    locale: 'nl-SR',
    decimalPlaces: 2,
  },
  {
    code: 'FJD',
    name: 'Fijian Dollar',
    symbol: 'FJ$',
    locale: 'en-FJ',
    decimalPlaces: 2,
  },
  {
    code: 'TOP',
    name: 'Tongan Paʻanga',
    symbol: 'T$',
    locale: 'to-TO',
    decimalPlaces: 2,
  },
  {
    code: 'WST',
    name: 'Samoan Tala',
    symbol: 'WS$',
    locale: 'sm-WS',
    decimalPlaces: 2,
  },
  {
    code: 'VUV',
    name: 'Vanuatu Vatu',
    symbol: 'VT',
    locale: 'bi-VU',
    decimalPlaces: 0,
  },
  {
    code: 'PGK',
    name: 'Papua New Guinean Kina',
    symbol: 'K',
    locale: 'en-PG',
    decimalPlaces: 2,
  },
  {
    code: 'SBD',
    name: 'Solomon Islands Dollar',
    symbol: 'SI$',
    locale: 'en-SB',
    decimalPlaces: 2,
  },

  {
    code: 'XPF',
    name: 'CFP Franc',
    symbol: '₣',
    locale: 'fr-PF',
    decimalPlaces: 0,
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
    // Format the number without currency symbol first
    const formattedNumber = new Intl.NumberFormat(locale, {
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(numericAmount)

    if (showSymbol) {
      // Use our custom currency symbols instead of Intl.NumberFormat's currency formatting
      // This ensures we show A$, C$, NZ$ etc. instead of generic $
      return `${currency.symbol}${formattedNumber}`
    } else {
      return formattedNumber
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
