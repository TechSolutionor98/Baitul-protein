const origin = (typeof window !== 'undefined' && window.location && window.location.origin)
  ? window.location.origin
  : 'http://localhost:3000'

const config = {
  // API Configuration - Prefer env; fallback to current origin (Vite proxy will forward /api to backend)
  API_URL: import.meta.env.VITE_API_URL || origin,

  // Payment Gateway Configuration
  TAMARA_API_KEY: import.meta.env.VITE_TAMARA_API_KEY,
  TABBY_MERCHANT_CODE: import.meta.env.VITE_TABBY_MERCHANT_CODE,
  TABBY_SECRET_KEY: import.meta.env.VITE_TABBY_SECRET_KEY,
  NGENIUS_API_KEY: import.meta.env.VITE_NGENIUS_API_KEY,

  // App Configuration
  APP_NAME: "WatchCraft",
  APP_VERSION: "1.0.0",
}

export default config
  