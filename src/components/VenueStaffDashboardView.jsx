import React from 'react';
import { Wrench, CheckCircle2, AlertCircle } from 'lucide-react';

/**
 * VenueStaffDashboardView component rendering the active dispatches & checklists for venue operations.
 * @param {object} props The component props.
 * @param {object} props.userProfile The venue staff's profile details.
 * @param {number} props.underReviewIssues Total count of issues in review/submitted.
 * @param {number} props.inProgressIssues Total count of issues in progress.
 * @param {number} props.resolvedIssues Total count of resolved issues.
 * @param {function} props.setActiveTab Callback to change primary view tab.
 * @returns {React.ReactElement} The rendered Venue Staff Dashboard View.
 */
export default function VenueStaffDashboardView({
  userProfile,
  underReviewIssues,
  inProgressIssues,
  resolvedIssues,
  setActiveTab
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10 rounded-full blur-2xl pointer-events-none" style={{ background: '#3b82f6' }}></div>
        <div className="space-y-1">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 border border-blue-200 dark:border-blue-800">
            Operations Venue Staff
          </span>
          <h2 className="text-xl font-extrabold tracking-tight mt-2">
            MetLife Operations Hub, {userProfile.name}! 🔧
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            Review active maintenance reports, monitor emergency protocols, and report facilities/safety issues directly.
          </p>
        </div>
        <button 
          onClick={() => setActiveTab('complaints')}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2.5 rounded-lg transition-colors w-fit shadow-sm z-10"
        >
          <Wrench className="w-4 h-4" />
          <span>Go to Incident Desk</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-xs text-zinc-400 uppercase font-semibold">Triage Queue</span>
              <p className="text-2xl font-black text-amber-500">{underReviewIssues}</p>
            </div>
            <div className="p-4 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-xs text-zinc-400 uppercase font-semibold">Active Dispatch</span>
              <p className="text-2xl font-black text-blue-500">{inProgressIssues}</p>
            </div>
            <div className="p-4 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl space-y-1 shadow-sm">
              <span className="text-xs text-zinc-400 uppercase font-semibold">Closed Tickets</span>
              <p className="text-2xl font-black text-emerald-500">{resolvedIssues}</p>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-blue-500" />
              <span>Concourse Facility Inspections</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-lg border border-zinc-150 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-zinc-800 dark:text-zinc-100">Section 104 - Concourse Restroom Inspection</h4>
                  <p className="text-xs text-zinc-400 mt-0.5">Status: Verified clean & supplies stocked by Staff #14</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 font-bold uppercase">Passed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span>Emergency Protocols Channel</span>
          </h3>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/40 rounded-xl text-red-800 dark:text-red-400">
              <h4 className="font-bold uppercase mb-1">Gate 3 High Traffic warning</h4>
              <p className="leading-relaxed">Crowd density at Gate 3 access has triggered a level 2 crowd bottleneck alarm. Deploy crowd control team with barriers to split lanes.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
