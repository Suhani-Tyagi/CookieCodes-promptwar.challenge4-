import { GoogleGenerativeAI } from '@google/generative-ai';

// In-memory IP rate limiter
// NOTE: Production deployments should use a durable store (e.g. Redis/Vercel KV) instead of in-memory state.
const rateLimitMap = new Map();
const LIMIT = 20; // max 20 requests per minute
const WINDOW = 60 * 1000; // 1 minute
const MAX_PROMPT_LENGTH = 8_000;

function isRateLimited(ip) {
  const now = Date.now();
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + WINDOW });
    return false;
  }
  const entry = rateLimitMap.get(ip);
  if (now > entry.resetTime) {
    entry.count = 1;
    entry.resetTime = now + WINDOW;
    return false;
  }
  entry.count++;
  if (entry.count > LIMIT) {
    return true;
  }
  return false;
}

export default async function handler(req, res) {
  // CORS & Origin Verification
  const allowedOriginsEnv = process.env.ALLOWED_ORIGINS || '';
  const allowedOrigins = allowedOriginsEnv ? allowedOriginsEnv.split(',').map(o => o.trim()) : [];
  const origin = req.headers.origin || '';

  if (allowedOrigins.length > 0) {
    if (!allowedOrigins.includes(origin)) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
    res.setHeader('Access-Control-Allow-Origin', origin);
  } else {
    // If ALLOWED_ORIGINS is not set, we default to rejecting the request if there is an origin
    if (origin) {
      return res.status(403).json({ error: 'Origin not allowed' });
    }
  }

  res.setHeader('Vary', 'Origin');
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Rate Limiter check
  const forwardedFor = req.headers['x-forwarded-for'];
  const ip = (Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0])?.trim()
    || req.socket.remoteAddress
    || 'unknown';
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please try again later.' });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body || {};
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return res.status(413).json({ error: `Prompt must be ${MAX_PROMPT_LENGTH} characters or fewer` });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY environment variable is not configured' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return res.status(200).json({ text });
  } catch (error) {
    console.error('Error in api/gemini:', error);
    return res.status(500).json({ error: error.message || 'Error generating content' });
  }
}
