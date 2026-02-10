import crypto from 'crypto';

export function generateToken(bytes = 32) {
  // returns a URL-safe hex string (64 chars for 32 bytes)
  return crypto.randomBytes(bytes).toString('hex');
}

// Deterministic hash 
export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

// expiry timestamps
export function tokenExpiry(hours = 1) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

// current date and time
export function getCurrentDate() { 
  return new Date().toISOString().slice(0, 19).replace('Z', ''); 
}

export function generateOTP() {
  // Generates a cryptographically strong random 6-digit number
  return crypto.randomInt(100000, 999999).toString();
}

export function isTokenExpired(tokenExpiryDate) {
  return Date.now() > tokenExpiryDate.getTime();
}