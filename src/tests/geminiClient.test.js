import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateText, verifyPasscode } from '../services/geminiClient.js';

describe('geminiClient API Service', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    global.fetch = vi.fn();
    // Suppress console.error inside tests
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  describe('generateText', () => {
    it('returns generated text on successful 200 HTTP response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ text: 'Mocked Gemini response text' })
      });

      const result = await generateText('Hello Gemini');
      expect(result).toBe('Mocked Gemini response text');
      expect(global.fetch).toHaveBeenCalledWith('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'Hello Gemini' })
      });
    });

    it('throws error when response payload is malformed (no text property)', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ notText: 'oop' })
      });

      await expect(generateText('Hello Gemini')).rejects.toThrow(
        'Invalid response payload from serverless function'
      );
    });

    it('throws error when response.json() fails with malformed JSON', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Unexpected token < in JSON');
        }
      });

      await expect(generateText('Hello Gemini')).rejects.toThrow();
    });

    it('throws HTTP status error on non-200 without error JSON', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => {
          throw new Error('Not JSON');
        }
      });

      await expect(generateText('Hello Gemini')).rejects.toThrow('HTTP Error 403');
    });

    it('throws custom error message returned by server on non-200 JSON', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Passcode verification required' })
      });

      await expect(generateText('Hello Gemini')).rejects.toThrow(
        'Passcode verification required'
      );
    });

    it('throws when fetch itself fails (network error)', async () => {
      global.fetch.mockRejectedValue(new Error('Network offline'));

      await expect(generateText('Hello Gemini')).rejects.toThrow('Network offline');
    });
  });

  describe('verifyPasscode', () => {
    it('returns true on valid passcode response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ valid: true })
      });

      const result = await verifyPasscode('VALID_PW');
      expect(result).toBe(true);
      expect(global.fetch).toHaveBeenCalledWith('/api/verify-passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: 'VALID_PW' })
      });
    });

    it('returns false on invalid passcode response', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => ({ valid: false })
      });

      const result = await verifyPasscode('WRONG_PW');
      expect(result).toBe(false);
    });

    it('returns false on non-200 HTTP code', async () => {
      global.fetch.mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal Error' })
      });

      const result = await verifyPasscode('PW');
      expect(result).toBe(false);
    });

    it('returns false when response.json() throws on malformed JSON', async () => {
      global.fetch.mockResolvedValue({
        ok: true,
        status: 200,
        json: async () => {
          throw new SyntaxError('Malformed JSON');
        }
      });

      const result = await verifyPasscode('PW');
      expect(result).toBe(false);
    });

    it('returns false when fetch itself fails', async () => {
      global.fetch.mockRejectedValue(new Error('Network offline'));

      const result = await verifyPasscode('PW');
      expect(result).toBe(false);
    });
  });
});
