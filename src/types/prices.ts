export interface PriceData {
  ticker: string;
  price: number; // current price in USD
  change24h: number | null; // 24h percent change, null if unavailable
  currency: string; // always 'USD'
}

export interface EquityPoint {
  date: string; // ISO date string YYYY-MM-DD
  value: number; // cumulative return as percentage (0 = start, 10 = +10%)
}

export interface PriceResponse {
  prices: Record<string, PriceData>; // keyed by ticker
  cachedAt: number; // Unix timestamp ms
}

export interface EquityResponse {
  curve: EquityPoint[];
  cachedAt: number;
}
