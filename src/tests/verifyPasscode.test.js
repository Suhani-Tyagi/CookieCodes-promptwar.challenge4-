import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '../../api/verify-passcode.js';

function mockReqRes(method = 'POST', body = {}, headers = {}) {
  const req = {
    method,
    headers,
    body,
    socket: { remoteAddress: '127.0.0.1' }
  };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    setHeader: vi.fn(),
    end: vi.fn()
  };
  return { req, res };
}

describe('api/verify-passcode API handler', () => {
  beforeEach(() => {
    process.env.SECURITY_PASSCODE = 'secret123';
    process.env.ALLOWED_ORIGINS = '';
  });

  it('allows OPTIONS requests', async () => {
    const { req, res } = mockReqRes('OPTIONS');
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('rejects non-POST requests with 405', async () => {
    const { req, res } = mockReqRes('GET');
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Method not allowed' }));
  });

  it('rejects with 403 if origin is provided but ALLOWED_ORIGINS is not set', async () => {
    const { req, res } = mockReqRes('POST', { passcode: 'secret123' }, { origin: 'https://malicious.com' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('allows matching origin if ALLOWED_ORIGINS is configured', async () => {
    process.env.ALLOWED_ORIGINS = 'https://allowed.com, https://another.com';
    const { req, res } = mockReqRes('POST', { passcode: 'secret123' }, { origin: 'https://allowed.com' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'https://allowed.com');
  });

  it('rejects mismatching origin if ALLOWED_ORIGINS is configured', async () => {
    process.env.ALLOWED_ORIGINS = 'https://allowed.com';
    const { req, res } = mockReqRes('POST', { passcode: 'secret123' }, { origin: 'https://notallowed.com' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('returns 500 if SECURITY_PASSCODE env variable is missing', async () => {
    delete process.env.SECURITY_PASSCODE;
    const { req, res } = mockReqRes('POST', { passcode: 'secret123' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'SECURITY_PASSCODE environment variable is not configured' }));
  });

  it('returns 400 if passcode is missing in request body', async () => {
    const { req, res } = mockReqRes('POST', {});
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Passcode is required' }));
  });

  it('rejects non-string passcodes and advertises only supported methods', async () => {
    const invalid = mockReqRes('POST', { passcode: 1234 });
    await handler(invalid.req, invalid.res);
    expect(invalid.res.status).toHaveBeenCalledWith(400);

    const preflight = mockReqRes('OPTIONS');
    await handler(preflight.req, preflight.res);
    expect(preflight.res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'POST,OPTIONS');
    expect(preflight.res.setHeader).toHaveBeenCalledWith('Vary', 'Origin');
  });

  it('returns valid: true for correct passcode', async () => {
    const { req, res } = mockReqRes('POST', { passcode: 'secret123' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ valid: true });
  });

  it('returns valid: false for incorrect passcode', async () => {
    const { req, res } = mockReqRes('POST', { passcode: 'wrongpass' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ valid: false });
  });
});
