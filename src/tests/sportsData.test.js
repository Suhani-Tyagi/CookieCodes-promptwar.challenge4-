import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import handler, { resetCacheForTesting } from '../../api/sports-data.js';

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

  beforeEach(() => {
    resetCacheForTesting();
    originalFetch = global.fetch;
    process.env.SPORTS_DATA_API_KEY = 'test-key';
    process.env.ALLOWED_ORIGINS = '';
    vi.spyOn(Date, 'now').mockImplementation(() => mockTime);
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
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
      mockTime += 70 * 60 * 1000; // expire cache
      const { req, res } = mockReqRes('GET');
      await handler(req, res);
    }
    
    // Now verify the next call does NOT trigger fetch and serves fallback
    fetchMock.mockClear();
    mockTime += 70 * 60 * 1000; // expire cache
    const { req, res } = mockReqRes('GET');
    await handler(req, res);
    
    expect(fetchMock).not.toHaveBeenCalled();
    const responseData = res.json.mock.calls[0][0];
    expect(responseData.isSimulated).toBe(true);
  });
});
