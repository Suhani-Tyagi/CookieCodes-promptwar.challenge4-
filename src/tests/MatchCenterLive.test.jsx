import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MatchCenter from '../components/MatchCenter.jsx';
import { AppProvider } from '../context/AppContext.jsx';

vi.mock('../context/AppContext.jsx', async () => {
  const actual = await vi.importActual('../context/AppContext.jsx');
  return {
    ...actual,
    useApp: () => mockUseAppContextValue
  };
});

let mockUseAppContextValue = {
  matchesList: [],
  selectedMatchId: 'M1',
  setSelectedMatchId: vi.fn(),
  activeMatch: {
    id: 'M1',
    teamA: 'France',
    teamB: 'Morocco',
    teamAColors: { primary: '#000', secondary: '#fff' },
    teamBColors: { primary: '#000', secondary: '#fff' },
    status: 'UPCOMING',
    minute: 'QF 1',
    scoreA: 0,
    scoreB: 0,
    events: [],
    bestPlayer: 'Mbappe'
  },
  allGroupsStandings: {},
  topStatsData: { goals: [], assists: [], cleanSheets: [], discipline: [] },
  liveDemoActive: false,
  setLiveDemoActive: vi.fn(),
  isSportsDataSimulated: true,
  sportsDataLastUpdated: 1781535600000, // mock timestamp
  refreshSportsData: vi.fn()
};

describe('MatchCenter - Live Match Integration UI', () => {
  it('shows the "Simulated Data" badge when isSportsDataSimulated is true', () => {
    mockUseAppContextValue.isSportsDataSimulated = true;
    render(<MatchCenter />);
    expect(screen.getByText(/SIMULATED EXHIBITION DATA/i)).toBeInTheDocument();
  });

  it('hides the "Simulated Data" badge when isSportsDataSimulated is false', () => {
    mockUseAppContextValue.isSportsDataSimulated = false;
    render(<MatchCenter />);
    expect(screen.queryByText(/SIMULATED EXHIBITION DATA/i)).not.toBeInTheDocument();
  });

  it('renders the "Last updated" timestamp correctly when sportsDataLastUpdated is set', () => {
    mockUseAppContextValue.sportsDataLastUpdated = 1781535600000;
    render(<MatchCenter />);
    expect(screen.getByText(/\(Last updated:/i)).toBeInTheDocument();
  });

  it('calls refreshSportsData when the Refresh button is clicked', () => {
    const refreshMock = vi.fn();
    mockUseAppContextValue.refreshSportsData = refreshMock;
    render(<MatchCenter />);
    const refreshBtn = screen.getByRole('button', { name: /refresh match data/i });
    fireEvent.click(refreshBtn);
    expect(refreshMock).toHaveBeenCalled();
  });
});
