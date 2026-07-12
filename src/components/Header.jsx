import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { Menu, Languages, Sun, Moon, Bell, X, User, LogOut, Settings } from 'lucide-react';
import { ROLES_LIST } from '../constants/roles.js';

export default function Header({
  mobileMenuOpen,
  setMobileMenuOpen,
  setActiveTab
}) {
  const {
    language,
    setLanguage,
    theme,
    toggleTheme,
    userProfile,
    setUserProfile,
    notifications,
    dismissNotification,
    t
  } = useApp();

  const [notiOpen, setNotiOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const activeNotiCount = notifications.filter(n => n.active).length;
  const rolesList = ROLES_LIST;

  const languagesList = [
    { code: 'en', label: 'English' },
    { code: 'es', label: 'Español' },
    { code: 'fr', label: 'Français' },
    { code: 'pt', label: 'Português' },
    { code: 'ar', label: 'العربية' },
    { code: 'hi', label: 'हिंदी' }
  ];

  const handleRoleChange = (e) => {
    setUserProfile(prev => ({
      ...prev,
      role: e.target.value
    }));
  };

  return (
    <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] px-4 md:px-8 flex items-center justify-between sticky top-0 z-30">
      
      {/* Left Action / Mobile trigger */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open navigation menu"
          aria-expanded={mobileMenuOpen}
          className="md:hidden p-2 -ml-2 rounded-lg text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Menu className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Welcome banner (desktop) */}
        <div className="hidden sm:block">
          <h2 className="text-xs font-bold text-zinc-950 dark:text-zinc-50">
            {t('welcomeBack')} {userProfile.name}
          </h2>
          <p className="text-[10px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 pulse-green"></span>
            MetLife Stadium Operations Node (Live)
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        
        {/* Role Quick Selector */}
        <div className="relative">
          <label htmlFor="role-selector" className="sr-only">Switch user role</label>
          <select
            id="role-selector"
            value={userProfile.role}
            onChange={handleRoleChange}
            aria-label="Switch user role"
            className="appearance-none bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-lg pl-3 pr-8 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer text-zinc-800 dark:text-zinc-200"
          >
            {rolesList.map(role => (
              <option key={role.code} value={role.code}>{role.label}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500" aria-hidden="true">
            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        {/* Language Selector Dropdown */}
        <div className="relative">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            aria-label="Preferred Language"
            className="appearance-none bg-zinc-100 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700/80 rounded-lg pl-7 pr-6 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer text-zinc-800 dark:text-zinc-200"
          >
            {languagesList.map(lang => (
              <option key={lang.code} value={lang.code}>{lang.label}</option>
            ))}
          </select>
          <Languages className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
            </svg>
          </div>
        </div>

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800"
          aria-label={theme === 'dark' ? t('themeLight') : t('themeDark')}
          title={theme === 'dark' ? t('themeLight') : t('themeDark')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-orange-450" aria-hidden="true" /> : <Moon className="w-4 h-4 text-blue-600" aria-hidden="true" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setNotiOpen(!notiOpen);
              setProfileOpen(false);
            }}
            aria-label={`Notifications${activeNotiCount > 0 ? `, ${activeNotiCount} unread` : ''}`}
            aria-expanded={notiOpen}
            aria-haspopup="true"
            className="p-2 rounded-lg text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-zinc-200 dark:border-zinc-800 relative"
          >
            <Bell className="w-4 h-4" aria-hidden="true" />
            {activeNotiCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 pulse-blue" aria-hidden="true"></span>
            )}
          </button>

          {/* Notification Overlay Menu */}
          {notiOpen && (
            <div
              role="dialog"
              aria-label="Notifications panel"
              aria-live="polite"
              className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-40 py-2 animate-fade-in"
            >
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-900 flex justify-between items-center">
                <span className="font-bold text-[10px] tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
                  {t('notificationTitle')} ({activeNotiCount})
                </span>
              </div>
              <div className="max-h-64 overflow-y-auto px-2 py-1 space-y-1">
                {notifications.length === 0 ? (
                  <p className="text-center text-xs text-zinc-400 py-6">No notifications</p>
                ) : (
                  notifications.map(n => (
                    <div 
                      key={n.id}
                      role="article"
                      className={`p-2.5 rounded-lg border text-xs transition-all relative ${
                        n.active 
                          ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-100 dark:border-emerald-900/20 font-medium' 
                          : 'bg-transparent border-transparent opacity-75'
                      }`}
                    >
                      <p className="text-zinc-850 dark:text-zinc-200 pr-4">{n.text}</p>
                      <span className="text-[10px] text-zinc-450 dark:text-zinc-500 block mt-1">{n.time}</span>
                      {n.active && (
                        <button 
                          onClick={() => dismissNotification(n.id)}
                          aria-label={`Dismiss notification: ${n.text}`}
                          className="absolute top-2 right-2 text-zinc-400 hover:text-zinc-650 dark:hover:text-zinc-200"
                        >
                          <X className="w-3 h-3" aria-hidden="true" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setNotiOpen(false);
            }}
            aria-label="Open user profile menu"
            aria-expanded={profileOpen}
            aria-haspopup="true"
            className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-300 dark:border-zinc-700 cursor-pointer"
          >
            <User className="w-4 h-4 text-zinc-650 dark:text-zinc-300" aria-hidden="true" />
          </button>

          {/* Profile Overlay */}
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-40 py-2 animate-fade-in">
              <div className="px-4 py-2 border-b border-zinc-100 dark:border-zinc-900">
                <p className="text-xs font-bold text-zinc-900 dark:text-zinc-50 truncate">{userProfile.name}</p>
                <p className="text-[10px] text-zinc-450 dark:text-zinc-500 truncate">{userProfile.email}</p>
              </div>
              <div className="px-2 py-1">
                <button 
                  onClick={() => {
                    setActiveTab('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-750 dark:text-zinc-300"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{t('navSettings')}</span>
                </button>
                <button 
                  onClick={() => setProfileOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs hover:bg-rose-50 dark:hover:bg-rose-950/20 text-rose-600 dark:text-rose-400 mt-1"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout (Simulation)</span>
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
