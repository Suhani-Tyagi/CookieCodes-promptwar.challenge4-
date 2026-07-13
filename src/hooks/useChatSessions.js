import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';

/**
 * Custom hook to manage chat sessions, handle updates, switching, deletion, and local storage synchronization with debouncing.
 * @returns {object} The state values and handlers for chat session management.
 */
export default function useChatSessions() {
  const { chatHistory, setChatHistory } = useApp();

  // Chat sessions state
  const [chatSessions, setChatSessions] = useState(() => {
    try {
      const saved = localStorage.getItem('fifa_chat_sessions');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [activeSessionId, setActiveSessionId] = useState(() => {
    return localStorage.getItem('fifa_active_session_id') || '';
  });

  // Sync sessions to localStorage with a 300ms debounce
  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        localStorage.setItem('fifa_chat_sessions', JSON.stringify(chatSessions));
      } catch (e) {
        console.warn("localStorage write failed:", e);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [chatSessions]);

  useEffect(() => {
    const handler = setTimeout(() => {
      try {
        if (activeSessionId) {
          localStorage.setItem('fifa_active_session_id', activeSessionId);
        } else {
          localStorage.removeItem('fifa_active_session_id');
        }
      } catch (e) {
        console.warn("localStorage write failed:", e);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [activeSessionId]);

  // Load active session on mount
  useEffect(() => {
    if (activeSessionId) {
      const session = chatSessions.find(s => s.id === activeSessionId);
      if (session) {
        setChatHistory(session.messages);
      }
    } else if (chatSessions.length > 0) {
      setActiveSessionId(chatSessions[0].id);
      setChatHistory(chatSessions[0].messages);
    }
  }, []);

  // Sync active chatHistory back to the active session in chatSessions
  useEffect(() => {
    if (chatHistory.length === 0) return;
    if (chatHistory.length === 1 && chatHistory[0].sender === 'ai' && chatHistory[0].text.includes('Hello!')) {
      return;
    }

    setChatSessions(prev => {
      const activeId = activeSessionId || 'session-' + Date.now();
      if (!activeSessionId) {
        setActiveSessionId(activeId);
      }

      const exists = prev.some(s => s.id === activeId);
      if (exists) {
        return prev.map(s => {
          if (s.id === activeId) {
            let title = s.title;
            if (title === 'Untitled Chat' || title === 'New Chat' || title === 'Untitled Session') {
              const firstUserMsg = chatHistory.find(m => m.sender === 'user');
              if (firstUserMsg) {
                title = firstUserMsg.text.length > 30 ? firstUserMsg.text.substring(0, 27) + '...' : firstUserMsg.text;
              }
            }
            return { ...s, messages: chatHistory, title };
          }
          return s;
        });
      } else {
        let title = 'Untitled Chat';
        const firstUserMsg = chatHistory.find(m => m.sender === 'user');
        if (firstUserMsg) {
          title = firstUserMsg.text.length > 30 ? firstUserMsg.text.substring(0, 27) + '...' : firstUserMsg.text;
        }
        return [
          {
            id: activeId,
            title,
            messages: chatHistory,
            timestamp: new Date().toLocaleDateString()
          },
          ...prev
        ];
      }
    });
  }, [chatHistory, activeSessionId]);

  const handleStartNewChat = () => {
    const newId = 'session-' + Date.now();
    setActiveSessionId(newId);
    setChatHistory([
      {
        sender: 'ai',
        text: "Hello! I am your ArenaAssist FIFA Stadium Companion for the FIFA World Cup 2026. Ask me questions about stadium gates, accessibility, transit shuttles, rules, or report issues. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleClearActiveChat = () => {
    setChatHistory([
      {
        sender: 'ai',
        text: "Hello! I am your ArenaAssist FIFA Stadium Companion for the FIFA World Cup 2026. Ask me questions about stadium gates, accessibility, transit shuttles, rules, or report issues. How can I help you today?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    if (activeSessionId) {
      setChatSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return {
            ...s,
            title: 'New Chat',
            messages: [
              {
                sender: 'ai',
                text: "Hello! I am your ArenaAssist FIFA Stadium Companion for the FIFA World Cup 2026. Ask me questions about stadium gates, accessibility, transit shuttles, rules, or report issues. How can I help you today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              }
            ]
          };
        }
        return s;
      }));
    }
  };

  const handleLoadSession = (sessionId) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setActiveSessionId(sessionId);
      setChatHistory(session.messages);
    }
  };

  const handleDeleteSession = (sessionId) => {
    setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    if (activeSessionId === sessionId) {
      const remaining = chatSessions.filter(s => s.id !== sessionId);
      if (remaining.length > 0) {
        setActiveSessionId(remaining[0].id);
        setChatHistory(remaining[0].messages);
      } else {
        handleStartNewChat();
      }
    }
  };

  const handleClearAllSessions = () => {
    setChatSessions([]);
    localStorage.removeItem('fifa_chat_sessions');
    localStorage.removeItem('fifa_active_session_id');
    handleStartNewChat();
  };

  return {
    chatSessions,
    activeSessionId,
    handleStartNewChat,
    handleClearActiveChat,
    handleLoadSession,
    handleDeleteSession,
    handleClearAllSessions
  };
}
