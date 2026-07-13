import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ConcessionsPanel from '../components/ConcessionsPanel.jsx';

const mockUseApp = vi.fn();
vi.mock('../context/AppContext.jsx', () => ({
  useApp: () => mockUseApp()
}));

describe('ConcessionsPanel Component', () => {
  beforeEach(() => {
    mockUseApp.mockReturnValue({
      addEcoPoints: vi.fn(),
      userProfile: { role: 'Fan', ecoPoints: 100 }
    });
  });

  it('adds items to cart, updates quantities, and calculates financial math correctly', () => {
    render(<ConcessionsPanel />);

    // Initial cart should be empty
    expect(screen.getByText(/Order cart is empty/i)).toBeInTheDocument();

    // Click "Add to Cart" on "Classic Arena Burger" ($14)
    const addBurgerBtn = screen.getByRole('button', { name: /Add Classic Arena Burger to order/i });
    fireEvent.click(addBurgerBtn);

    // Cart should now show the item
    expect(screen.queryByText(/Order cart is empty/i)).not.toBeInTheDocument();
    expect(screen.getAllByText(/Classic Arena Burger/i)[0]).toBeInTheDocument();

    // Add another item: "Crispy Chicken Tenders" ($12)
    const addTendersBtn = screen.getByRole('button', { name: /Add Crispy Chicken Tenders to order/i });
    fireEvent.click(addTendersBtn);

    // Subtotal: 14 + 12 = 26
    // Tax: 26 * 0.088 = 2.29
    // Total: 26 + 2.29 = 28.29
    expect(screen.getByText(/\$26\.00/)).toBeInTheDocument(); // Subtotal
    expect(screen.getByText(/\$2\.29/)).toBeInTheDocument();  // Tax
    expect(screen.getByText(/\$28\.29/)).toBeInTheDocument(); // Total

    // Click "+" button for Classic Arena Burger to increase qty to 2
    // The first item is Burger, second is Chicken. Let's find the "+" button by aria-label or index
    const plusButtons = screen.getAllByLabelText(/Increase quantity/i);
    fireEvent.click(plusButtons[0]);

    // Subtotal: (14 * 2) + 12 = 40
    // Tax: 40 * 0.088 = 3.52
    // Total: 40 + 3.52 = 43.52
    expect(screen.getByText(/\$40\.00/)).toBeInTheDocument();
    expect(screen.getByText(/\$3\.52/)).toBeInTheDocument();
    expect(screen.getByText(/\$43\.52/)).toBeInTheDocument();

    // Toggle Reusable Cup Discount ($1.00 off)
    const discountCheckbox = screen.getByLabelText(/Reusable Souvenir Cup/i);
    fireEvent.click(discountCheckbox);

    // New Total: 40 - 1.00 + 3.52 = 42.52
    expect(screen.getByText(/-\$1\.00/)).toBeInTheDocument(); // Discount indicator
    expect(screen.getByText(/\$42\.52/)).toBeInTheDocument(); // Total

    // Decrease quantity of Chicken Tenders to 0 to remove it
    const minusButtons = screen.getAllByLabelText(/Decrease quantity/i);
    // Chicken Tenders is index 1
    fireEvent.click(minusButtons[1]);

    // Chicken Tenders should be removed from cart
    const cartItems = screen.queryAllByTestId('cart-item-name').filter(el => el.textContent.includes('Crispy Chicken Tenders'));
    expect(cartItems.length).toBe(0);

    // Subtotal: 14 * 2 = 28
    // Discount: 1.00
    // Tax: 28 * 0.088 = 2.46
    // Total: 28 - 1 + 2.46 = 29.46
    expect(screen.getByText(/\$28\.00/)).toBeInTheDocument();
    expect(screen.getByText(/\$2\.46/)).toBeInTheDocument();
    expect(screen.getByText(/\$29.46/)).toBeInTheDocument();
  });
});
