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