const ROLES = {
  TOURIST: 'tourist',
  GUIDE: 'guide',
  AGENCY: 'agency',
  ADMIN: 'admin',
}

const USER_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
}

const GUIDE_STATUS = {
  PENDING: 'pending',
  CERTIFIED: 'certified',
  REJECTED: 'rejected',
}

const AGENCY_STATUS = {
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
}

const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
}

const BOOKING_TYPE = {
  GUIDE_HOURLY: 'guide_hourly',
  GUIDE_DAILY: 'guide_daily',
  GUIDE_TOUR: 'guide_tour',
  AGENCY_PACKAGE: 'agency_package',
  AGENCY_TRIP: 'agency_trip',
  ACTIVITY: 'activity',
  COMBO: 'combo',
}

const PAYMENT_METHOD = {
  MVOLA: 'mvola',
  ORANGE_MONEY: 'orange_money',
  AIRTEL_MONEY: 'airtel_money',
  VISA: 'visa',
  MASTERCARD: 'mastercard',
  PAYPAL: 'paypal',
  STRIPE: 'stripe',
}

const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESS: 'success',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

const LANGUAGES = [
  'malagasy', 'french', 'english', 'spanish',
  'italian', 'german', 'chinese', 'portuguese',
  'russian', 'arabic', 'japanese', 'korean',
]

const CURRENCIES = {
  MGA: 'MGA',
  EUR: 'EUR',
  USD: 'USD',
}

const COMMISSION_RATES = {
  GUIDE: 0.10,
  AGENCY: 0.08,
}

const MODULE_ACCESS = {
  PROFILE: 'profile',
  MESSAGING: 'messaging',
  BOOKING: 'booking',
  MARKETPLACE: 'marketplace',
  SOCIAL: 'social',
  DASHBOARD: 'dashboard',
  AI_PLANNING: 'ai_planning',
  QR_CODE: 'qr_code',
  REVIEWS: 'reviews',
  MAP: 'map',
}

const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  GUIDE_PREMIUM: 'guide_premium',
  AGENCY_PREMIUM: 'agency_premium',
}

module.exports = {
  ROLES,
  USER_STATUS,
  GUIDE_STATUS,
  AGENCY_STATUS,
  BOOKING_STATUS,
  BOOKING_TYPE,
  PAYMENT_METHOD,
  PAYMENT_STATUS,
  LANGUAGES,
  CURRENCIES,
  COMMISSION_RATES,
  MODULE_ACCESS,
  SUBSCRIPTION_TIERS,
}
