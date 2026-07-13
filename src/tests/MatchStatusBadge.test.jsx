import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MatchHeroVisualizer } from '../components/MatchHeroVisualizer.jsx';
import { computeMatchStatus } from '../context/AppContext.jsx';

describe('Match Status Date Computation', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('correctly computes status as COMPLETED for a past date', () => {
    const fakeNow = new Date('2026-07-13T12:00:00');
    const match = {
      date: 'Jul 10, 2026',
      time: '17:00 Local',
      status: 'UPCOMING'
    };
    const computedStatus = computeMatchStatus(match, fakeNow);
    expect(computedStatus).toBe('COMPLETED');
  });

  it('asserts that a match dated July 10, 2026 is NOT rendered with UPCOMING MATCH badge when current date is July 13, 2026', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-07-13T12:00:00'));

    const match = {
      id: 'm1',
      teamA: 'France',
      teamB: 'Morocco',
      teamAColors: { primary: '#002395' },
      teamBColors: { primary: '#006241' },
      date: 'Jul 10, 2026',
      time: '17:00 Local',
      status: 'UPCOMING',
      minute: 'QF 1'
    };

    // Calculate computed status dynamically
    const computedStatus = computeMatchStatus(match, new Date());
    const matchWithComputedStatus = {
      ...match,
      status: computedStatus
    };

    render(
      <MatchHeroVisualizer 
        match={matchWithComputedStatus}
        liveActive={false}
        onToggleLive={vi.fn()}
      />
    );

    const badge = screen.queryByText(/UPCOMING MATCH/i);
    expect(badge).toBeNull();
    
    expect(screen.queryByText(/Match Score/i)).toBeInTheDocument();
  });
});
