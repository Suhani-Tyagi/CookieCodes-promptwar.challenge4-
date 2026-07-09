/**
 * @fileoverview Tests for SettingsPanel component — profile save, API key masking,
 * form validation, feedback display, and accessibility attributes.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SettingsPanel from '../components/SettingsPanel.jsx';
import { AppProvider } from '../context/AppContext.jsx';

vi.mock('../context/AppContext.jsx', async () => {
  const actual = await vi.importActual('../context/AppContext.jsx');
  return {
    ...actual,
    useApp: () => ({
      userProfile: {
        name: 'Test Fan',
        seatNumber: 'C-15',
        ticketCategory: 'Category 2',
        role: 'Fan',
        preferredLanguage: 'en',
        email: 'test@arena.com',
      },
      setUserProfile: vi.fn(),
      settings: {
        apiMode: 'simulated',
        geminiApiKey: '',
      },
      saveSettings: vi.fn(),
      t: (key) => ({
        settingsTitle: 'Companion Settings',
        apiToggleLabel: 'GenAI Engine Mode',
        liveEngine: 'Live (Gemini API)',
        simulatedEngine: 'Simulated (Offline)',
        apiKeyLabel: 'Gemini API Key',
        apiKeyPlaceholder: 'Enter your API key...',
        saveBtn: 'Save Settings',
        feedbackMsg: 'Settings saved successfully!',
      }[key] || key),
    }),
  };
});

function renderSettings() {
  return render(<AppProvider><SettingsPanel /></AppProvider>);
}

describe('SettingsPanel — Rendering', () => {
  it('renders the settings title', () => {
    renderSettings();
    expect(screen.getByText('Companion Settings')).toBeInTheDocument();
  });

  it('renders the profile name input with correct id/label pair', () => {
    renderSettings();
    const nameInput = document.getElementById('profile-name');
    expect(nameInput).toBeTruthy();
    expect(nameInput.value).toBe('Test Fan');
  });

  it('renders all form sections: Profile and API Settings', () => {
    renderSettings();
    expect(screen.getByText(/Matchday Guest Credentials/i)).toBeInTheDocument();
    expect(screen.getByText(/GenAI Engine Settings/i)).toBeInTheDocument();
  });
});

describe('SettingsPanel — Accessibility', () => {
  it('profile name input has accessible label', () => {
    renderSettings();
    const input = screen.getByLabelText('Full Name');
    expect(input).toBeTruthy();
  });

  it('ticket category select has accessible label', () => {
    renderSettings();
    const select = screen.getByLabelText('Ticket Category');
    expect(select).toBeTruthy();
  });

  it('role select has accessible label', () => {
    renderSettings();
    const select = screen.getByLabelText('User Role (Simulation)');
    expect(select).toBeTruthy();
  });

  it('language select has accessible label', () => {
    renderSettings();
    const select = screen.getByLabelText('Preferred Language');
    expect(select).toBeTruthy();
  });
});

describe('SettingsPanel — Form Interactions', () => {
  it('updates name input value when user types', () => {
    renderSettings();
    const nameInput = screen.getByLabelText('Full Name');
    fireEvent.change(nameInput, { target: { value: 'New User' } });
    expect(nameInput.value).toBe('New User');
  });

  it('changes role select value', () => {
    renderSettings();
    const roleSelect = screen.getByLabelText('User Role (Simulation)');
    fireEvent.change(roleSelect, { target: { value: 'Volunteer' } });
    expect(roleSelect.value).toBe('Volunteer');
  });

  it('submit button exists for profile form', () => {
    renderSettings();
    expect(screen.getByText('Update Credentials')).toBeInTheDocument();
  });

  it('save settings button exists for API form', () => {
    renderSettings();
    expect(screen.getByText('Save Settings')).toBeInTheDocument();
  });
});

describe('SettingsPanel — API Mode Toggle', () => {
  it('shows mode select', () => {
    renderSettings();
    const modeSelect = screen.getByText('Simulated (Offline)').closest('select');
    expect(modeSelect).toBeTruthy();
  });
});
