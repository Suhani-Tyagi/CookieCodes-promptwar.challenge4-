/**
 * @fileoverview Input sanitization utilities to prevent XSS attacks.
 * All user-generated text should pass through these functions before rendering.
 */

/**
 * Strips HTML tags and encodes dangerous characters from user input.
 * @param {string} input - Raw user input string
 * @returns {string} Sanitized string safe for display
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validates that a string is within an acceptable length and contains no script injections.
 * @param {string} input - User text to validate
 * @param {number} [maxLength=2000] - Maximum allowed length
 * @returns {{ valid: boolean, message: string }}
 */
export function validateText(input, maxLength = 2000) {
  if (typeof input !== 'string') return { valid: false, message: 'Invalid input type' };
  if (input.trim().length === 0) return { valid: false, message: 'Field cannot be empty' };
  if (input.length > maxLength) return { valid: false, message: `Maximum ${maxLength} characters allowed` };

  // Detect obvious script injection patterns
  const dangerousPatterns = [/<script/i, /javascript:/i, /on\w+\s*=/i];
  for (const pattern of dangerousPatterns) {
    if (pattern.test(input)) return { valid: false, message: 'Invalid characters detected' };
  }

  return { valid: true, message: '' };
}

/**
 * Masks a sensitive string (e.g. API key) showing only the last 4 characters.
 * @param {string} secret - The secret string to mask
 * @returns {string} Masked representation like "●●●●●●●●AbCd"
 */
export function maskSecret(secret) {
  if (!secret || secret.length <= 4) return '●●●●●●●●';
  const visible = secret.slice(-4);
  return `●●●●●●●●${visible}`;
}
