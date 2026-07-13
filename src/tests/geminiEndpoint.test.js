import { describe, it, expect, vi, beforeEach } from 'vitest';
import handler from '../../api/gemini.js';

const mockGenerateContent = vi.fn();
const mockGetGenerativeModel = vi.fn().mockReturnValue({
  generateContent: mockGenerateContent
});

vi.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: vi.fn().mockImplementation(() => {
      return {
        getGenerativeModel: mockGetGenerativeModel
      };
    })
  };
});

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

describe('api/gemini API handler', () => {
  beforeEach(() => {
    process.env.GEMINI_API_KEY = 'test-gemini-key';
    process.env.ALLOWED_ORIGINS = '';
    mockGenerateContent.mockReset();
    mockGetGenerativeModel.mockClear();
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
    const { req, res } = mockReqRes('POST', { prompt: 'hello' }, { origin: 'https://attacker.com' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(403);
  });

  it('allows matching origin if ALLOWED_ORIGINS is configured', async () => {
    process.env.ALLOWED_ORIGINS = 'https://portal.fifa.com';
    const { req, res } = mockReqRes('POST', { prompt: 'hello' }, { origin: 'https://portal.fifa.com' });
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'Mocked response'
      }
    });

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'https://portal.fifa.com');
  });

  it('returns 400 if prompt is missing in request body', async () => {
    const { req, res } = mockReqRes('POST', {});
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Prompt is required' }));
  });

  it('rejects non-string and oversized prompts before calling Gemini', async () => {
    const invalid = mockReqRes('POST', { prompt: { text: 'hello' } });
    await handler(invalid.req, invalid.res);
    expect(invalid.res.status).toHaveBeenCalledWith(400);

    const oversized = mockReqRes('POST', { prompt: 'a'.repeat(8001) });
    await handler(oversized.req, oversized.res);
    expect(oversized.res.status).toHaveBeenCalledWith(413);
    expect(mockGenerateContent).not.toHaveBeenCalled();
  });

  it('advertises only the HTTP methods the endpoint supports', async () => {
    const { req, res } = mockReqRes('OPTIONS');
    await handler(req, res);
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'POST,OPTIONS');
    expect(res.setHeader).toHaveBeenCalledWith('Vary', 'Origin');
  });

  it('returns 500 if GEMINI_API_KEY env variable is missing', async () => {
    delete process.env.GEMINI_API_KEY;
    const { req, res } = mockReqRes('POST', { prompt: 'hello' });
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'GEMINI_API_KEY environment variable is not configured' }));
  });

  it('successfully returns generated text from Gemini API', async () => {
    const { req, res } = mockReqRes('POST', { prompt: 'What is the capital of France?' });
    mockGenerateContent.mockResolvedValue({
      response: {
        text: () => 'The capital of France is Paris.'
      }
    });

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ text: 'The capital of France is Paris.' });
    expect(mockGetGenerativeModel).toHaveBeenCalledWith({ model: 'gemini-1.5-flash' });
  });

  it('returns 500 if the Gemini API call throws an error', async () => {
    const { req, res } = mockReqRes('POST', { prompt: 'hello' });
    mockGenerateContent.mockRejectedValue(new Error('API quota exceeded'));

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'API quota exceeded' }));
  });
});
