import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import StorylineSimulator from '../components/StorylineSimulator.jsx';
import VectorPitchMap from '../components/VectorPitchMap.jsx';
import { AppProvider } from '../context/AppContext.jsx';

// Mock context hook for testing custom views in isolation
vi.mock('../context/AppContext.jsx', async () => {
  const actual = await vi.importActual('../context/AppContext.jsx');
  return {
    ...actual,
    useApp: () => ({
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
    })
  };
});

describe('StorylineSimulator Component', () => {
  it('renders all 9 matchday acts/steps', () => {
    render(<StorylineSimulator />);
    
    // Check that we render the titles or labels for simulation acts
    expect(screen.getByText(/Live Matchday Storyline Simulator/i)).toBeInTheDocument();
    
    // Check for the timeline progress numbers
    for (let i = 1; i <= 9; i++) {
      expect(screen.getByText(i.toString())).toBeInTheDocument();
    }
  });
});

describe('VectorPitchMap Component', () => {
  it('renders stadium map controls and pins', () => {
    render(<VectorPitchMap />);
    
    // Check that header info exists
    expect(screen.getByText(/MetLife Interactive Vector Map/i)).toBeInTheDocument();
    
    // Check that the interactive bowl levels lower, mezzanine, upper toggles exist
    expect(screen.getByText(/LOWER/i)).toBeInTheDocument();
    expect(screen.getByText(/MEZZANINE/i)).toBeInTheDocument();
    expect(screen.getByText(/UPPER/i)).toBeInTheDocument();
  });
});
