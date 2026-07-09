import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { maskSecret } from '../utils/sanitize.js';
import { 
  Settings, 
  User, 
  Key, 
  HelpCircle, 
  Check, 
  AlertCircle,
  Sparkles,
  Info,
  Compass,
  Award
} from 'lucide-react';

export default function SettingsPanel() {
  const { 
    userProfile, 
    setUserProfile, 
    settings, 
    saveSettings, 
    t 
  } = useApp();

  // Profile forms state
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileSeat, setProfileSeat] = useState(userProfile.seatNumber);
  const [profileTicketCategory, setProfileTicketCategory] = useState(userProfile.ticketCategory);
  const [profileRole, setProfileRole] = useState(userProfile.role);
  const [profileLanguage, setProfileLanguage] = useState(userProfile.preferredLanguage);

  // API settings state
  const [apiMode, setApiMode] = useState(settings.apiMode);
  const [apiKey, setApiKey] = useState(settings.geminiApiKey);

  const [feedback, setFeedback] = useState('');
  const [showKeyInfo, setShowKeyInfo] = useState(false);
  // Track whether the user has entered a new key in this session
  const [keyEditing, setKeyEditing] = useState(false);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setUserProfile(prev => ({
      ...prev,
      name: profileName,
      seatNumber: profileSeat,
      ticketCategory: profileTicketCategory,
      role: profileRole,
      preferredLanguage: profileLanguage
    }));
    triggerFeedback("Matchday Profile credentials updated!");
  };

  const handleSaveApiSettings = (e) => {
    e.preventDefault();
    saveSettings({
      apiMode,
      geminiApiKey: apiKey
    });
    triggerFeedback(t('feedbackMsg'));
  };

  const triggerFeedback = (msg) => {
    setFeedback(msg);
    setTimeout(() => {
      setFeedback('');
    }, 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <h2 className="text-2xl font-black tracking-tight">{t('settingsTitle')}</h2>
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Configure stadium access credentials, mock roles, or Gemini Live API key.
        </p>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="p-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 rounded-xl text-emerald-800 dark:text-emerald-400 text-xs flex items-center gap-2 animate-fade-in font-bold"
        >
          <Check className="w-4 h-4" aria-hidden="true" />
          <p>{feedback}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        
        {/* Profile Card */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-zinc-850 dark:text-zinc-250 flex items-center gap-2 border-b border-zinc-150 dark:border-zinc-900 pb-3">
            <User className="w-4 h-4 text-emerald-500" />
            <span>Matchday Guest Credentials</span>
          </h3>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs font-semibold text-zinc-550">
            
            {/* Name */}
            <div className="flex flex-col">
              <label htmlFor="profile-name" className="text-zinc-500 mb-1">Full Name</label>
              <input
                id="profile-name"
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                aria-label="Full Name"
                className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Ticket Category */}
              <div className="flex flex-col">
                <label htmlFor="ticket-category" className="text-zinc-500 mb-1">Ticket Category</label>
                <select
                  id="ticket-category"
                  value={profileTicketCategory}
                  onChange={(e) => setProfileTicketCategory(e.target.value)}
                  aria-label="Ticket Category"
                  className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none"
                >
                  <option value="Category 1 (Premium)">Category 1 (Premium)</option>
                  <option value="Category 2">Category 2</option>
                  <option value="Category 3">Category 3</option>
                  <option value="VIP Access Box">VIP Access Box</option>
                </select>
              </div>

              {/* Seat Location */}
              <div className="flex flex-col">
                <label htmlFor="assigned-seat" className="text-zinc-500 mb-1">Assigned Seat</label>
                <input
                  id="assigned-seat"
                  type="text"
                  value={profileSeat}
                  onChange={(e) => setProfileSeat(e.target.value)}
                  aria-label="Assigned Seat"
                  className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Operational Role */}
              <div className="flex flex-col">
                <label htmlFor="user-role" className="text-zinc-500 mb-1">User Role (Simulation)</label>
                <select
                  id="user-role"
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  aria-label="User Role (Simulation)"
                  className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none"
                >
                  <option value="Fan">Fan (Guest)</option>
                  <option value="Volunteer">Volunteer Duty</option>
                  <option value="Venue Staff">Venue Staff</option>
                  <option value="Organizer">Organizer (Operations Command)</option>
                </select>
              </div>

              {/* Language */}
              <div className="flex flex-col">
                <label htmlFor="preferred-lang" className="text-zinc-500 mb-1">Preferred Language</label>
                <select
                  id="preferred-lang"
                  value={profileLanguage}
                  onChange={(e) => setProfileLanguage(e.target.value)}
                  aria-label="Preferred Language"
                  className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none"
                >
                  <option value="en">English</option>
                  <option value="es">Español</option>
                  <option value="fr">Français</option>
                  <option value="pt">Português</option>
                  <option value="ar">العربية</option>
                  <option value="hi">हिंदी</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors w-fit"
            >
              Update Credentials
            </button>

          </form>
        </div>

        {/* API Settings Card */}
        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="font-extrabold text-sm text-zinc-850 dark:text-zinc-250 flex items-center gap-2 border-b border-zinc-150 dark:border-zinc-900 pb-3">
            <Key className="w-4 h-4 text-emerald-500" />
            <span>GenAI Engine Settings</span>
          </h3>

          <form onSubmit={handleSaveApiSettings} className="space-y-4 text-xs font-semibold text-zinc-550">
            
            {/* Mode Select */}
            <div className="flex flex-col">
              <label className="text-zinc-500 mb-1">{t('apiToggleLabel')}</label>
              <select
                value={apiMode}
                onChange={(e) => setApiMode(e.target.value)}
                className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none"
              >
                <option value="live">{t('liveEngine')}</option>
                <option value="simulated">{t('simulatedEngine')}</option>
              </select>
            </div>

            {/* API Key */}
            {apiMode === 'live' && (
              <div className="flex flex-col space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-zinc-500">{t('apiKeyLabel')}</label>
                  <button
                    type="button"
                    onClick={() => setShowKeyInfo(!showKeyInfo)}
                    className="text-zinc-450 hover:text-emerald-500 flex items-center gap-0.5 text-[10px]"
                  >
                    <HelpCircle className="w-3 h-3" />
                    <span>How to get a key?</span>
                  </button>
                </div>

                {showKeyInfo && (
                  <div className="p-3 bg-zinc-50 dark:bg-zinc-900/50 rounded-xl border border-zinc-150 dark:border-zinc-850 leading-relaxed font-medium text-zinc-500">
                    Get a free Gemini API key from <a href="https://aistudio.google.com" target="_blank" rel="noreferrer" className="text-emerald-600 dark:text-emerald-450 hover:underline">Google AI Studio</a>. Set it here to test real-time operational answers.
                  </div>
                )}

                <input
                  id="gemini-api-key"
                  type={keyEditing ? 'text' : 'password'}
                  value={keyEditing ? apiKey : (apiKey ? maskSecret(apiKey) : '')}
                  onChange={(e) => {
                    setKeyEditing(true);
                    setApiKey(e.target.value);
                  }}
                  onFocus={() => setKeyEditing(true)}
                  onBlur={() => setKeyEditing(false)}
                  placeholder={t('apiKeyPlaceholder')}
                  aria-label="Gemini API Key"
                  aria-describedby="api-key-hint"
                  className="px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-250 dark:border-zinc-800 text-zinc-850 dark:text-zinc-150 focus:outline-none font-medium font-mono"
                />
              </div>
            )}

            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded-lg shadow transition-colors w-fit"
            >
              {t('saveBtn')}
            </button>

          </form>

          {/* Settings Advice */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/20 via-transparent to-transparent border border-emerald-500/10 text-xs text-zinc-500 space-y-2 font-medium leading-relaxed">
            <h4 className="font-extrabold text-zinc-805 dark:text-zinc-200 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulated vs Live Mode</span>
            </h4>
            <p>
              In **Simulated Mode**, ArenaAssist will use localized high-fidelity fallback response trees for parking, ADA routing, schedules, and prohibited items without calling external APIs. In **Live Mode**, it contacts Gemini 1.5 Flash.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
