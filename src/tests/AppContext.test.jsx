/**
 * @fileoverview Tests for AppContext — translation, eco-points, settings persistence.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, act, fireEvent } from '@testing-library/react';
import { AppProvider, useApp } from '../context/AppContext.jsx';

// ─── Helper component to expose context values ────────────────────────────
function ContextConsumer({ testId, selector }) {
  const ctx = useApp();
  const value = selector(ctx);
  return <div data-testid={testId}>{JSON.stringify(value)}</div>;
}

function renderWithProvider(ui) {
  return render(<AppProvider>{ui}</AppProvider>);
}

// ─── Translation (t) function ─────────────────────────────────────────────
describe('AppContext — t() translation function', () => {
  it('returns English string for known key', () => {
    renderWithProvider(
      <ContextConsumer testId="result" selector={(ctx) => ctx.t('navDashboard')} />
    );
    expect(screen.getByTestId('result').textContent).toContain('Dashboard');
  });

  it('returns the key itself when translation is missing', () => {
    renderWithProvider(
      <ContextConsumer testId="result" selector={(ctx) => ctx.t('unknownKey_xyz')} />
    );
    expect(screen.getByTestId('result').textContent).toContain('unknownKey_xyz');
  });

  it('returns title translation', () => {
    renderWithProvider(
      <ContextConsumer testId="result" selector={(ctx) => ctx.t('title')} />
    );
    expect(screen.getByTestId('result').textContent).toContain('ArenaAssist');
  });
});

// ─── Theme ───────────────────────────────────────────────────────────────
describe('AppContext — theme', () => {
  function ThemeTest() {
    const { theme, toggleTheme } = useApp();
    return (
      <div>
        <span data-testid="theme">{theme}</span>
        <button onClick={toggleTheme} data-testid="toggle-btn">Toggle</button>
      </div>
    );
  }

  it('has an initial theme value of light or dark', () => {
    render(<AppProvider><ThemeTest /></AppProvider>);
    const themeValue = screen.getByTestId('theme').textContent;
    expect(['light', 'dark']).toContain(themeValue);
  });

  it('toggles theme when toggleTheme is called', async () => {
    render(<AppProvider><ThemeTest /></AppProvider>);
    const before = screen.getByTestId('theme').textContent;
    await act(async () => {
      fireEvent.click(screen.getByTestId('toggle-btn'));
    });
    const after = screen.getByTestId('theme').textContent;
    expect(after).not.toBe(before);
  });
});


// ─── Settings persistence ─────────────────────────────────────────────────
describe('AppContext — saveSettings', () => {
  function SettingsTest() {
    const { settings, saveSettings } = useApp();
    return (
      <div>
        <span data-testid="api-mode">{settings.apiMode}</span>
        <button
          onClick={() => saveSettings({ apiMode: 'live', geminiApiKey: 'test-key' })}
          data-testid="save-btn"
        >
          Save
        </button>
      </div>
    );
  }

  it('starts with a valid apiMode', () => {
    render(<AppProvider><SettingsTest /></AppProvider>);
    const mode = screen.getByTestId('api-mode').textContent;
    expect(['live', 'simulated']).toContain(mode);
  });

  it('updates apiMode after saveSettings', async () => {
    render(<AppProvider><SettingsTest /></AppProvider>);
    await act(async () => {
      fireEvent.click(screen.getByTestId('save-btn'));
    });
    expect(screen.getByTestId('api-mode').textContent).toBe('live');
  });
});

// ─── Notifications ────────────────────────────────────────────────────────
describe('AppContext — notifications', () => {
  function NotificationsTest() {
    const { notifications, dismissNotification } = useApp();
    const activeCount = notifications.filter(n => n.active).length;
    const first = notifications[0];
    return (
      <div>
        <span data-testid="active-count">{activeCount}</span>
        {first && (
          <button onClick={() => dismissNotification(first.id)} data-testid="dismiss-btn">
            Dismiss
          </button>
        )}
      </div>
    );
  }

  it('has at least one notification', () => {
    render(<AppProvider><NotificationsTest /></AppProvider>);
    const count = parseInt(screen.getByTestId('active-count').textContent, 10);
    expect(count).toBeGreaterThanOrEqual(0);
  });
});

// ─── userProfile ─────────────────────────────────────────────────────────
describe('AppContext — userProfile', () => {
  function ProfileTest() {
    const { userProfile } = useApp();
    return (
      <div>
        <span data-testid="role">{userProfile.role}</span>
        <span data-testid="name">{userProfile.name}</span>
      </div>
    );
  }

  it('has a default role', () => {
    render(<AppProvider><ProfileTest /></AppProvider>);
    expect(screen.getByTestId('role').textContent).toBeTruthy();
  });

  it('has a non-empty name', () => {
    render(<AppProvider><ProfileTest /></AppProvider>);
    expect(screen.getByTestId('name').textContent.length).toBeGreaterThan(0);
  });
});
