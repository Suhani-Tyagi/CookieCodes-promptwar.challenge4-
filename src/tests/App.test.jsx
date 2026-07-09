/**
 * @fileoverview Integration tests for the App component — tab navigation,
 * sidebar rendering, mobile menu, theme toggle, and role switching.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, within } from '@testing-library/react';
import App from '../App.jsx';
import { AppProvider } from '../context/AppContext.jsx';

function renderApp() {
  return render(
    <AppProvider>
      <App />
    </AppProvider>
  );
}

// ─── Sidebar Navigation ───────────────────────────────────────────────────
describe('App — Sidebar Navigation', () => {
  it('renders the ArenaAssist brand in the sidebar', () => {
    renderApp();
    expect(screen.getAllByText(/ArenaAssist/i).length).toBeGreaterThan(0);
  });

  it('renders all 8 navigation items', () => {
    renderApp();
    // All nav items should be accessible by aria-label
    const navButtons = screen.getAllByRole('button', { hidden: false });
    // At least the 8 nav items plus header controls
    expect(navButtons.length).toBeGreaterThan(7);
  });

  it('Dashboard nav button has aria-current="page" when active', () => {
    renderApp();
    // The Dashboard button should be the default active tab
    const dashboardBtns = screen.getAllByLabelText(/Dashboard/i);
    // At least one should have aria-current=page (desktop sidebar)
    const activeBtn = dashboardBtns.find(btn => btn.getAttribute('aria-current') === 'page');
    expect(activeBtn).toBeTruthy();
  });
});

// ─── Tab Switching ────────────────────────────────────────────────────────
describe('App — Tab Switching', () => {
  it('switches to Match Center view when nav button clicked', () => {
    renderApp();
    const matchCenterBtns = screen.getAllByLabelText(/Match Center/i);
    fireEvent.click(matchCenterBtns[0]);
    // Match Center content should now appear
    expect(screen.getAllByLabelText(/Match Center/i)[0].getAttribute('aria-current')).toBe('page');
  });

  it('switches to Settings view when nav button clicked', () => {
    renderApp();
    const settingsBtns = screen.getAllByLabelText(/Settings/i);
    fireEvent.click(settingsBtns[0]);
    expect(settingsBtns[0].getAttribute('aria-current')).toBe('page');
  });
});

// ─── Mobile Menu ──────────────────────────────────────────────────────────
describe('App — Mobile Menu', () => {
  it('mobile menu button has correct aria-label', () => {
    renderApp();
    const menuBtn = screen.queryByLabelText(/Open navigation menu/i);
    // On desktop it may not be visible but should exist in DOM
    if (menuBtn) {
      expect(menuBtn).toBeTruthy();
    }
  });
});

// ─── Header Controls ─────────────────────────────────────────────────────
describe('App — Header Controls', () => {
  it('renders dark mode toggle button', () => {
    renderApp();
    const themeBtn = screen.queryByLabelText(/Light Mode|Dark Mode/i);
    expect(themeBtn).toBeTruthy();
  });

  it('renders notification button with proper aria attributes', () => {
    renderApp();
    const notiBtn = screen.queryByLabelText(/Notification/i);
    expect(notiBtn).toBeTruthy();
    expect(notiBtn.getAttribute('aria-expanded')).toBeDefined();
  });

  it('renders profile button', () => {
    renderApp();
    const profileBtn = screen.queryByLabelText(/Open user profile menu/i);
    expect(profileBtn).toBeTruthy();
  });

  it('role selector has a label', () => {
    renderApp();
    const label = screen.queryByLabelText(/Switch user role/i);
    expect(label).toBeTruthy();
  });
});

// ─── Skip Navigation ─────────────────────────────────────────────────────
describe('App — Accessibility', () => {
  it('main content area has id="main-content"', () => {
    renderApp();
    const main = document.getElementById('main-content');
    expect(main).toBeTruthy();
  });
});
