import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SmartCompanion from '../components/SmartCompanion.jsx';

const mockUseApp = vi.fn();
vi.mock('../context/AppContext.jsx', () => ({
  useApp: () => mockUseApp()
}));

describe('SmartCompanion Component', () => {
  const baseContext = {
    chatHistory: [
      { sender: 'ai', text: 'Hello! I am your ArenaAssist...' }
    ],
    setChatHistory: vi.fn(),
    settings: {},
    language: 'en',
    userProfile: { role: 'Fan', name: 'Alex Fan' },
    t: (key) => key
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseApp.mockReturnValue(baseContext);
    localStorage.clear();
  });

  it('manages sessions and synchronizes with localStorage', async () => {
    // Seed some mock sessions in localStorage before rendering
    const existingSessions = [
      {
        id: 'session-123',
        title: 'Parking Queries',
        messages: [
          { sender: 'user', text: 'How is parking?' },
          { sender: 'ai', text: 'Parking rules are...' }
        ],
        timestamp: '10/24/2026'
      }
    ];
    localStorage.setItem('fifa_chat_sessions', JSON.stringify(existingSessions));
    localStorage.setItem('fifa_active_session_id', 'session-123');

    const setChatHistoryMock = vi.fn();
    mockUseApp.mockReturnValue({
      ...baseContext,
      chatHistory: existingSessions[0].messages,
      setChatHistory: setChatHistoryMock
    });

    render(<SmartCompanion />);

    // Check that our mock session title is displayed
    expect(screen.getByText('Parking Queries')).toBeInTheDocument();

    // Click "New Chat" button to trigger new session creation
    const newChatBtn = screen.getByRole('button', { name: /\+ New Chat/i });
    fireEvent.click(newChatBtn);

    // Verify it triggers setting initial welcome text
    expect(setChatHistoryMock).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          sender: 'ai',
          text: expect.stringContaining('Hello! I am your ArenaAssist')
        })
      ])
    );

    // Test session deletion by clicking the delete button (which has title "Delete chat session")
    const deleteBtns = screen.getAllByTitle('Delete chat session');
    deleteBtns.forEach(btn => fireEvent.click(btn));

    // Verify that sessions are updated and active session is removed or recreated
    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('fifa_chat_sessions') || '[]');
      expect(stored.find(s => s.id === 'session-123')).toBeUndefined();
    });
  });
});
