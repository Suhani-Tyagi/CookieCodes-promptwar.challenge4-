/**
 * @fileoverview Tests for sanitize utility — sanitizeText, validateText, maskSecret.
 */
import { describe, it, expect } from 'vitest';
import { sanitizeText, validateText, maskSecret } from '../utils/sanitize.js';

describe('sanitizeText', () => {
  it('returns empty string for non-string input', () => {
    expect(sanitizeText(null)).toBe('');
    expect(sanitizeText(undefined)).toBe('');
    expect(sanitizeText(42)).toBe('');
  });

  it('encodes HTML angle brackets', () => {
    expect(sanitizeText('<script>alert(1)</script>')).not.toContain('<script>');
    expect(sanitizeText('<b>bold</b>')).toContain('&lt;');
    expect(sanitizeText('<b>bold</b>')).toContain('&gt;');
  });

  it('encodes double quotes', () => {
    expect(sanitizeText('"quoted"')).toContain('&quot;');
  });

  it('encodes single quotes', () => {
    expect(sanitizeText("it's")).toContain('&#x27;');
  });

  it('encodes ampersands', () => {
    expect(sanitizeText('cats & dogs')).toContain('&amp;');
  });

  it('passes clean text through unchanged (other than forward slash)', () => {
    const clean = 'Hello World 2026';
    expect(sanitizeText(clean)).toBe(clean);
  });
});

describe('validateText', () => {
  it('rejects empty string', () => {
    const result = validateText('   ');
    expect(result.valid).toBe(false);
    expect(result.message).toBeTruthy();
  });

  it('accepts valid text', () => {
    const result = validateText('My report about section C');
    expect(result.valid).toBe(true);
  });

  it('rejects strings that exceed maxLength', () => {
    const longStr = 'a'.repeat(2001);
    const result = validateText(longStr, 2000);
    expect(result.valid).toBe(false);
    expect(result.message).toContain('2000');
  });

  it('rejects script injection patterns', () => {
    expect(validateText('<script>evil()</script>').valid).toBe(false);
    expect(validateText('onclick=doEvil()').valid).toBe(false);
    expect(validateText('javascript:alert(1)').valid).toBe(false);
  });

  it('accepts normal long text under limit', () => {
    const text = 'a'.repeat(500);
    expect(validateText(text, 2000).valid).toBe(true);
  });

  it('rejects non-string input', () => {
    expect(validateText(null).valid).toBe(false);
  });
});

describe('maskSecret', () => {
  it('masks a long API key showing only last 4 chars', () => {
    const key = 'AIzaSyAbCdEfGhIjKlMn';
    const masked = maskSecret(key);
    expect(masked).toContain('lMn'.slice(-3));
    expect(masked).toContain('●');
    expect(masked).not.toContain('AIzaSy');
  });

  it('returns placeholder for empty or short keys', () => {
    expect(maskSecret('')).toBe('●●●●●●●●');
    expect(maskSecret(null)).toBe('●●●●●●●●');
    expect(maskSecret('abc')).toBe('●●●●●●●●');
  });
});
