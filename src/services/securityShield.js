// src/services/securityShield.js

const RATE_LIMIT_BUCKET = new Map();

// 1. Strip malicious HTML/JS/SQL injection payloads from any user input
export function sanitizeInput(input, maxLength = 500) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<\/?[^>]+(>|$)/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/(--|;|\b(DROP|DELETE|INSERT|UPDATE|UNION|SELECT)\b)/gi, '')
    .trim()
    .slice(0, maxLength);
}

// 2. Validate email strictly
export function isValidEmail(email) {
  const clean = sanitizeInput(email, 120);
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean);
}

// 3. Validate phone strictly
export function isValidPhone(phone) {
  const clean = sanitizeInput(phone, 30);
  return /^[+\d\s().-]{6,25}$/.test(clean);
}

// 4. Rate Limiter (prevents brute-force login & automated form spam)
export function checkRateLimit(actionKey, maxAttempts = 5, windowMs = 60000) {
  const now = Date.now();
  const record = RATE_LIMIT_BUCKET.get(actionKey) || { count: 0, firstAttempt: now };

  if (now - record.firstAttempt > windowMs) {
    RATE_LIMIT_BUCKET.set(actionKey, { count: 1, firstAttempt: now });
    return { allowed: true, remaining: maxAttempts - 1, retryAfterSec: 0 };
  }

  if (record.count >= maxAttempts) {
    const retryAfterSec = Math.ceil((windowMs - (now - record.firstAttempt)) / 1000);
    return { allowed: false, remaining: 0, retryAfterSec };
  }

  record.count += 1;
  RATE_LIMIT_BUCKET.set(actionKey, record);
  return { allowed: true, remaining: maxAttempts - record.count, retryAfterSec: 0 };
}

// 5. Initialize Global Runtime Shield (Frame-busting & Tamper Guard)
export function initSecurityShield() {
  if (typeof window === 'undefined') return;

  // Prevent Clickjacking if loaded inside an unauthorized external iframe
  if (window.self !== window.top) {
    try {
      window.top.location = window.self.location;
    } catch {
      document.body.innerHTML = 'Security Policy Violation: Framing Disabled.';
    }
  }

  // Block drag-and-drop script injection into window
  window.addEventListener('dragover', (e) => e.preventDefault(), false);
  window.addEventListener('drop', (e) => e.preventDefault(), false);
}