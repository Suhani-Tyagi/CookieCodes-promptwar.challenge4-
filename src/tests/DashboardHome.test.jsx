import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import DashboardHome from '../components/DashboardHome.jsx';
import StorylineSimulator from '../components/StorylineSimulator.jsx';
import VectorPitchMap from '../components/VectorPitchMap.jsx';

const mockUseApp = vi.fn();
vi.mock('../context/AppContext.jsx', () => ({
  useApp: () => mockUseApp()
}));

vi.mock('echarts-for-react', () => {
  return {
    default: (props) => <div data-testid="mock-echarts" />
  };
});

describe('DashboardHome Component - Roles Rendering', () => {
  const baseContext = {
    complaints: [
      { id: '1', category: 'Crowd Congestion', status: 'Submitted' },
      { id: '2', category: 'Medical Help', status: 'In Progress' },
      { id: '3', category: 'Facility Repair', status: 'Resolved' }
    ],
    setActiveTab: vi.fn(),
    theme: 'dark',
    addEcoPoints: vi.fn(),
    matchesList: [
      {
        id: 'm1',
        teamA: 'Argentina',
        teamB: 'France',
        teamAColors: { primary: '#74acdf' },
        teamBColors: { primary: '#002395' },
        bestPlayerDetails: { name: 'Messi', photoUrl: '' },
        opponentBestPlayerDetails: { name: 'Mbappe', photoUrl: '' },
        minute: '90m QF',
        status: 'LIVE',
        date: 'July 15',
        time: '20:00',
        scoreA: 2,
        scoreB: 1,
        stadium: 'MetLife Stadium',
        teamAFlag: '🇦🇷',
        teamBFlag: '🇫🇷'
      }
    ],
    selectedMatchId: 'm1',
    setSelectedMatchId: vi.fn(),
    liveDemoActive: false,
    setLiveDemoActive: vi.fn(),
    t: (key) => key,
    simulatorAct: 1,
    triggerSimulatorAct: vi.fn(),
    telemetry: {
      gateCWait: 2,
      gateDWait: 3,
      gateBWait: 5,
      activeVisitors: 12000,
      heatmapSpots: [{ x: 380, y: 180, intensity: 0.3, label: 'Gate C' }],
      routingPath: null,
      volunteerTasks: [],
      medicalTriage: [],
      securityIncidents: [],
      droneStatus: 'Stationary',
      droneReport: ''
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Fan dashboard correctly', () => {
    mockUseApp.mockReturnValue({
      ...baseContext,
      userProfile: {
        role: 'Fan',
        name: 'Alex Fan',
        seatNumber: 'Sec 104, Row A',
        ticketCategory: 'Category 1',
        ecoPoints: 120
      }
    });

    render(<DashboardHome />);
    expect(screen.getByText(/FIFA Fans Portal/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to the Pitch, Alex Fan/i)).toBeInTheDocument();
    expect(screen.getByText(/Sec 104, Row A/i)).toBeInTheDocument();
  });

  it('renders Volunteer dashboard correctly', () => {
    mockUseApp.mockReturnValue({
      ...baseContext,
      userProfile: {
        role: 'Volunteer',
        name: 'Sam Vol'
      }
    });

    render(<DashboardHome />);
    expect(screen.getByText(/Volunteer Duty Node/i)).toBeInTheDocument();
    expect(screen.getByText(/Welcome to Shift, Sam Vol/i)).toBeInTheDocument();
    expect(screen.getByText(/Shift Task Checklist/i)).toBeInTheDocument();
  });

  it('renders Venue Staff dashboard correctly', () => {
    mockUseApp.mockReturnValue({
      ...baseContext,
      userProfile: {
        role: 'Venue Staff',
        name: 'Chris Staff'
      }
    });

    render(<DashboardHome />);
    expect(screen.getByText(/Operations Venue Staff/i)).toBeInTheDocument();
    expect(screen.getByText(/MetLife Operations Hub, Chris Staff/i)).toBeInTheDocument();
    expect(screen.getByText(/Concourse Facility Inspections/i)).toBeInTheDocument();
  });

  it('renders Organizer dashboard correctly', () => {
    mockUseApp.mockReturnValue({
      ...baseContext,
      userProfile: {
        role: 'Organizer',
        name: 'Pat Org'
      }
    });

    render(<DashboardHome />);
    expect(screen.getByText(/Triage Queue Issues/i)).toBeInTheDocument();
    expect(screen.getByText(/Total Stadium Density/i)).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-echarts').length).toBe(4);
  });
});

describe('StorylineSimulator Component', () => {
  beforeEach(() => {
    mockUseApp.mockReturnValue({
      simulatorAct: 1,
      triggerSimulatorAct: vi.fn(),
      telemetry: {
        gateCWait: 2,
        gateDWait: 3,
        gateBWait: 5,
        activeVisitors: 12000,
        heatmapSpots: [{ x: 380, y: 180, intensity: 0.3, label: 'Gate C' }],
        routingPath: null,
        volunteerTasks: [],
        medicalTriage: [],
        securityIncidents: [],
        droneStatus: 'Stationary',
        droneReport: ''
      },
      userProfile: {
        role: 'Operations'
      }
    });
  });

  it('renders all 9 matchday acts/steps', () => {
    render(<StorylineSimulator />);
    
    expect(screen.getByText(/Live Matchday Storyline Simulator/i)).toBeInTheDocument();
    
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });
});

describe('VectorPitchMap Component', () => {
  beforeEach(() => {
    mockUseApp.mockReturnValue({
      simulatorAct: 1,
      triggerSimulatorAct: vi.fn(),
      telemetry: {
        gateCWait: 2,
        gateDWait: 3,
        gateBWait: 5,
        activeVisitors: 12000,
        heatmapSpots: [{ x: 380, y: 180, intensity: 0.3, label: 'Gate C' }],
        routingPath: null,
        volunteerTasks: [],
        medicalTriage: [],
        securityIncidents: [],
        droneStatus: 'Stationary',
        droneReport: ''
      },
      userProfile: {
        role: 'Operations'
      }
    });
  });

  it('renders stadium map controls and pins', () => {
    render(<VectorPitchMap />);
    
    expect(screen.getByText(/MetLife Interactive Vector Map/i)).toBeInTheDocument();
    expect(screen.getByText(/LOWER/i)).toBeInTheDocument();
    expect(screen.getByText(/MEZZANINE/i)).toBeInTheDocument();
    expect(screen.getByText(/UPPER/i)).toBeInTheDocument();
  });
});
