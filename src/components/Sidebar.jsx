import React from 'react';
import { MapPin, Clock, X } from 'lucide-react';
import { ROLES_LIST } from '../constants/roles.js';

export default function Sidebar({
  activeTab,
  setActiveTab,
  userProfile,
  activeMatch,
  countdown,
  navItems,
  mobileMenuOpen,
  setMobileMenuOpen,
  badge,
  t
}) {
  const RoleIcon = badge.icon;

  return (
    <>
      {/* Sidebar - Desktop */}
      <aside
        className="hidden md:flex flex-col w-64 border-r border-zinc-205 dark:border-zinc-800 bg-white dark:bg-[#0c0c0f] z-20"
        aria-label="Main navigation sidebar"
      >
        {/* Brand Logo */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-md relative overflow-hidden" style={{ background: activeMatch.teamAColors.primary }}>
            <div className="absolute right-0 top-0 bottom-0 w-1/2" style={{ background: activeMatch.teamBColors.primary }}></div>
            <span className="text-white font-black text-sm tracking-wider z-10">AA</span>
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight leading-none text-zinc-900 dark:text-zinc-50">
              ArenaAssist
            </h1>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">
              Smart Operations 2026
            </span>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 border-b border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-200 dark:border-emerald-800/50">
              {userProfile.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold truncate">{userProfile.name}</p>
              <div className="flex items-center gap-1 text-[10px] text-zinc-500 dark:text-zinc-400">
                <MapPin className="w-3 h-3 text-emerald-500" />
                <span className="truncate">MetLife Stadium, NY/NJ</span>
              </div>
            </div>
          </div>
          
          {/* Dynamic Credentials Indicator */}
          <div className={`mt-3 p-2 rounded-lg border text-[10px] ${badge.color} flex items-start gap-2`}>
            <RoleIcon className="w-3.5 h-3.5 mt-0.5 shrink-0" />
            <div>
              <p className="font-bold leading-none mb-1">{badge.label}</p>
              <p className="opacity-90">{badge.detail}</p>
            </div>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 px-4 py-4 space-y-1" aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={item.label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-105 dark:border-emerald-900/30' 
                    : 'text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-500' : 'text-zinc-500'}`} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-zinc-202 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-900/5">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
            <div className="leading-tight">
              <span className="block text-[10px] text-zinc-450 font-semibold uppercase">{activeMatch.teamA} v {activeMatch.teamB}</span>
              <span className="font-mono text-zinc-700 dark:text-zinc-300 text-xs font-bold">{countdown}</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Sidebar - Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 md:hidden animate-fade-in">
          <aside className="w-64 h-full bg-white dark:bg-[#0c0c0f] border-r border-zinc-200 dark:border-zinc-800 flex flex-col p-4 animate-slide-in-right">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white font-bold">AA</div>
                <span className="font-extrabold text-sm">ArenaAssist</span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close navigation menu"
                className="p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="w-5 h-5" aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Mobile primary navigation" className="flex-1 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={item.label}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive 
                        ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200 border border-transparent'
                    }`}
                  >
                    <Icon className="w-4 h-4" aria-hidden="true" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
