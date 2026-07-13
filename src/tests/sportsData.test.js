import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { kv } from '@vercel/kv';
import handler, { resetCacheForTesting } from '../../api/sports-data.js';

// Prefixed with 'mock' so Vitest hoists it alongside vi.mock
const mockStore = {};

vi.mock('@vercel/kv', () => {
  return {
    kv: {
      get: async (key) => {
        const entry = mockStore[key];
        if (!entry) return null;
        if (entry.expireTime && Date.now() > entry.expireTime) {
          delete mockStore[key];
          return null;
        }
        return entry.value;
      },
      set: async (key, value, options) => {
        let expireTime = null;
        if (options && options.ex) {
          expireTime = Date.now() + options.ex * 1000;
        }
        mockStore[key] = { value, expireTime };
        return 'OK';
      },
      incr: async (key) => {
        const entry = mockStore[key];
        let currentVal = 0;
        let expireTime = null;
        if (entry) {
          if (entry.expireTime && Date.now() > entry.expireTime) {
            delete mockStore[key];
          } else {
            currentVal = parseInt(entry.value || '0', 10);
            expireTime = entry.expireTime;
          }
        }
        const val = currentVal + 1;
        mockStore[key] = { value: String(val), expireTime };
        return val;
      },
      expire: async (key, seconds) => {
        const entry = mockStore[key];
        if (entry) {
          entry.expireTime = Date.now() + seconds * 1000;
        }
        return 1;
      },
      del: async (key) => {
        delete mockStore[key];
        return 1;
      }
    }
  };
});

function mockReqRes(method = 'GET', headers = {}) {
  const req = {
    method,
    headers,
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

describe('api/sports-data API handler', () => {
  let originalFetch;
  let mockTime = 1781535600000; // fixed starting timestamp
  let dateNowSpy;

  beforeEach(async () => {
    for (const key in mockStore) {
      delete mockStore[key];
    }
    await resetCacheForTesting();
    originalFetch = global.fetch;
    process.env.SPORTS_DATA_API_KEY = 'test-key';
    process.env.ALLOWED_ORIGINS = '';
    dateNowSpy = vi.spyOn(Date, 'now').mockImplementation(() => mockTime);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    if (dateNowSpy) {
      dateNowSpy.mockRestore();
    }
  });

  const getMockFetch = () => {
    return vi.fn().mockImplementation(async (url) => {
      if (url.includes('/fixtures')) {
        return {
          json: async () => ({
            response: [{
              fixture: { id: 101, date: '2026-06-15T15:00:00+00:00', venue: { name: 'Boston', city: 'Boston' }, status: { short: 'NS' } },
              teams: { home: { name: 'France' }, away: { name: 'Morocco' } },
              goals: { home: 0, away: 0 },
              league: { round: 'QF' }
            }]
          })
        };
      }
      if (url.includes('/standings')) {
        return {
          json: async () => ({
            response: [{
              league: {
                standings: [
                  [{ rank: 1, team: { name: 'France' }, all: { played: 3, win: 3, draw: 0, lose: 0 }, goalsDiff: 5, points: 9, group: 'Group A' }]
                ]
              }
            }]
          })
        };
      }
      // Top Scorers or assists
      return {
        json: async () => ({
          response: [{
            player: { name: 'L. Messi', nationality: 'Argentina' },
            statistics: [{ team: { name: 'Argentina' }, goals: { total: 5 }, games: { rating: '8.5' } }]
          }]
        })
      };
    });
  };

  it('Cache-miss: calls upstream API on first request and updates cache', async () => {
    const fetchMock = getMockFetch();
    global.fetch = fetchMock;

    const { req, res } = mockReqRes('GET');
    await handler(req, res);

    expect(fetchMock).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.isSimulated).toBe(false);
  });

  it('Cache-hit: second request within TTL does not call real upstream API', async () => {
    const fetchMock = getMockFetch();
    global.fetch = fetchMock;

    // First call (cache miss)
    const { req: req1, res: res1 } = mockReqRes('GET');
    await handler(req1, res1);
    expect(fetchMock).toHaveBeenCalledTimes(4); // fixtures, standings, scorers, assists

    fetchMock.mockClear();

    // Move time forward by 5 minutes (less than TTL)
    mockTime += 5 * 60 * 1000;

    // Second call (cache hit)
    const { req: req2, res: res2 } = mockReqRes('GET');
    await handler(req2, res2);

    expect(fetchMock).not.toHaveBeenCalled();
    expect(res2.status).toHaveBeenCalledWith(200);
    const responseData = res2.json.mock.calls[0][0];
    expect(responseData.matchesList[0].teamA).toBe('France');
  });

  it('Cache-miss: calling after TTL expires triggers fresh upstream call', async () => {
    const fetchMock = getMockFetch();
    global.fetch = fetchMock;

    const { req: req1, res: res1 } = mockReqRes('GET');
    await handler(req1, res1);
    expect(fetchMock).toHaveBeenCalled();

    fetchMock.mockClear();

    // Advance time beyond TTL (70 minutes)
    mockTime += 70 * 60 * 1000;

    const { req: req2, res: res2 } = mockReqRes('GET');
    await handler(req2, res2);
    expect(fetchMock).toHaveBeenCalled();
  });

  it('Upstream API failure falls back to hardcoded mock data', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));

    const { req, res } = mockReqRes('GET');
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.isSimulated).toBe(true);
    expect(responseData.matchesList.length).toBeGreaterThan(0);
  });

  it('Quota cutoff: stops calling upstream and serves stale/fallback data after 90 calls', async () => {
    const fetchMock = getMockFetch();
    global.fetch = fetchMock;

    // Simulate reaching 90 calls.
    // Expired cache calls do 3 fetches each. Calling 32 times triggers 96 calls (cutoff > 90).
    for (let i = 0; i < 32; i++) {
      await kv.del('sports_fixtures');
      await kv.del('sports_standings');
      await kv.del('sports_stats');
      const { req, res } = mockReqRes('GET');
      req.socket.remoteAddress = `127.0.0.${i}`; // Bypass rate limiter using unique IPs
      await handler(req, res);
    }
    
    // Now verify the next call does NOT trigger fetch and serves fallback
    fetchMock.mockClear();
    await kv.del('sports_fixtures');
    await kv.del('sports_standings');
    await kv.del('sports_stats');
    const { req, res } = mockReqRes('GET');
    req.socket.remoteAddress = '127.0.0.99';
    await handler(req, res);
    
    expect(fetchMock).not.toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.isSimulated).toBe(true);
  });

  it('Concurrent atomic increments: verifies the shared quota counter is atomic across concurrent handler calls', async () => {
    const fetchMock = getMockFetch();
    global.fetch = fetchMock;

    const { req: req1, res: res1 } = mockReqRes('GET');
    const { req: req2, res: res2 } = mockReqRes('GET');
    
    req1.socket.remoteAddress = '127.0.0.10';
    req2.socket.remoteAddress = '127.0.0.11'; // bypass rate limiter for concurrent calls

    // Run two requests concurrently
    await Promise.all([
      handler(req1, res1),
      handler(req2, res2)
    ]);

    // Each request does 3 fetches (fixtures, standings, stats)
    // Total quota count should be 6
    const todayStr = new Date().toISOString().split('T')[0];
    const quotaKey = `sports_quota:${todayStr}`;
    console.log('Final mockStore state:', JSON.stringify(mockStore));
    const quotaVal = await kv.get(quotaKey);
    expect(parseInt(quotaVal, 10)).toBe(6);
  });
});
