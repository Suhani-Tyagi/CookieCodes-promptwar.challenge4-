import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BracketTreeTab from '../components/BracketTreeTab.jsx';

describe('BracketTreeTab - AI Match Scheduler', () => {
  it('correctly calculates rest days and handles autoResolveConflicts', async () => {
    render(<BracketTreeTab />);

    // Default tournament start date: 2026-07-10
    // Check initial rest day values (default minRestDays is 3)
    // sf1RestDays: min(15 - 10 - 1, 15 - 11 - 1) = min(4, 3) = 3
    // sf2RestDays: min(17 - 12 - 1, 17 - 13 - 1) = min(4, 3) = 3
    // finalRestDays: min(21 - 15 - 1, 21 - 17 - 1) = min(5, 3) = 3

    // Check that we display the initial rest days (3 Days)
    const restGaps = screen.getAllByText(/3 Days/i);
    expect(restGaps.length).toBeGreaterThanOrEqual(3);

    // Initial status: Rest-Day Rules Satisfied
    expect(screen.getByText(/Rest-Day Rules Satisfied/i)).toBeInTheDocument();

    // Increase minRestDays to 4 using the slider
    const slider = screen.getByLabelText(/Min Recovery Gaps/i);
    fireEvent.change(slider, { target: { value: 4 } });

    // Status should change to Rest-Day Conflicts Found
    expect(screen.getByText(/Rest-Day Conflicts Found/i)).toBeInTheDocument();

    // Click Auto-Resolve Conflicts button
    const resolveButton = screen.getByRole('button', { name: /Run AI Match/i });
    expect(resolveButton).not.toBeDisabled();
    fireEvent.click(resolveButton);

    // After resolving, minRestDays is 4.
    // minSf1Date: 2026-07-11 + 5 days = 2026-07-16
    // minSf2Date: 2026-07-13 + 5 days = 2026-07-18
    // minFinalDate: 2026-07-18 + 5 days = 2026-07-23
    await waitFor(() => {
      expect(screen.getAllByText(/2026-07-16/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/2026-07-18/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/2026-07-23/i)[0]).toBeInTheDocument();
      
      // Status should return to Satisfied
      expect(screen.getByText(/Rest-Day Rules Satisfied/i)).toBeInTheDocument();
    });
  });
});
