/**
 * @fileoverview Tests for ErrorBoundary component — render, error catch, reset.
 */
import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary.jsx';

// Suppress console.error during error boundary tests
beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

// A component that throws on demand
function BrokenComponent({ shouldThrow }) {
  if (shouldThrow) {
    throw new Error('Test render error');
  }
  return <div data-testid="healthy">Healthy Component</div>;
}

describe('ErrorBoundary — Normal Rendering', () => {
  it('renders children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={false} />
      </ErrorBoundary>
    );
    expect(screen.getByTestId('healthy')).toBeInTheDocument();
  });
});

describe('ErrorBoundary — Error State', () => {
  it('renders fallback UI when child throws', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Something went wrong/i)).toBeInTheDocument();
  });

  it('shows a "Try Again" button in the error state', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('button', { name: /Try Again/i })).toBeInTheDocument();
  });

  it('shows descriptive error message', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByText(/unexpected error/i)).toBeInTheDocument();
  });

  it('"Try Again" button resets the error boundary and shows healthy state', () => {
    // This test verifies the reset works by using a wrapper that controls shouldThrow
    let throwError = true;

    function ControlledBroken() {
      if (throwError) throw new Error('test');
      return <div data-testid="recovered">Recovered!</div>;
    }

    const { rerender } = render(
      <ErrorBoundary>
        <ControlledBroken />
      </ErrorBoundary>
    );

    // Error state shown
    expect(screen.getByRole('alert')).toBeInTheDocument();

    // Stop throwing, then click retry
    throwError = false;
    const retryBtn = screen.getByRole('button', { name: /Try Again/i });
    fireEvent.click(retryBtn);

    // After reset with no throw, healthy content should render
    expect(screen.getByTestId('recovered')).toBeInTheDocument();
  });

});

describe('ErrorBoundary — Accessibility', () => {
  it('fallback container has role="alert"', () => {
    render(
      <ErrorBoundary>
        <BrokenComponent shouldThrow={true} />
      </ErrorBoundary>
    );
    expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });
});
