import React from 'react';
import { Shield, Clock, AlertTriangle, Users } from 'lucide-react';

/**
 * VolunteerDashboardView component rendering the duty shift logs & supervisor radios for volunteers.
 * @param {object} props The component props.
 * @param {object} props.userProfile The volunteer's profile details.
 * @param {boolean} props.simulatedVolunteerCheckin Flag indicating if the volunteer is currently checked-in.
 * @param {function} props.handleVolunteerCheckin Callback to toggle duty shift check-in.
 * @param {object} props.volTasksCompleted Object tracking completion states of shift checklist tasks.
 * @param {function} props.toggleVolTask Callback to toggle individual checklist tasks.
 * @returns {React.ReactElement} The rendered Volunteer Dashboard View.
 */
export default function VolunteerDashboardView({
  userProfile,
  simulatedVolunteerCheckin,
  handleVolunteerCheckin,
  volTasksCompleted,
  toggleVolTask
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 opacity-10 rounded-full blur-2xl pointer-events-none" style={{ background: '#10b981' }}></div>
        <div className="space-y-1">
          <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            Volunteer Duty Node
          </span>
          <h2 className="text-xl font-extrabold tracking-tight mt-2">
            Welcome to Shift, {userProfile.name}! 👋
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 max-w-xl">
            You are logged in as a Volunteer. Help fans with ticket validation, accessibility directions, and coordinate with supervisors directly.
          </p>
        </div>
        <button 
          onClick={handleVolunteerCheckin}
          className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
            simulatedVolunteerCheckin 
              ? 'bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30' 
              : 'bg-emerald-600 hover:bg-emerald-700 text-white border border-transparent'
          }`}
        >
          {simulatedVolunteerCheckin ? "Check-out of Shift" : "Check-in to Duty Shift"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Today's Shift Assignment</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10">
                <p className="text-xs text-zinc-400 uppercase font-semibold">Duty Details</p>
                <h4 className="font-extrabold text-sm text-zinc-800 dark:text-zinc-100 mt-1">Gate 3 Access Control & Queue Support</h4>
                <p className="text-xs text-zinc-500 mt-2">
                  Assist stewards in managing ticket scanner queues. Ensure wheelchair-accessible fans are directed to Ramp 3B.
                </p>
                <div className="flex items-center gap-1.5 mt-3 text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  <Clock className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                  <span>Shift B (12:00 - 18:00)</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 space-y-3">
                <p className="text-xs text-zinc-400 uppercase font-semibold">Shift Task Checklist</p>
                
                <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={volTasksCompleted.ticketScan} 
                    onChange={() => toggleVolTask('ticketScan')} 
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300 rounded" 
                  />
                  <span className={volTasksCompleted.ticketScan ? 'line-through text-zinc-400' : ''}>Help scan 50 tickets at Turnstiles (+25 pts)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={volTasksCompleted.wheelchairGuide} 
                    onChange={() => toggleVolTask('wheelchairGuide')} 
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300 rounded" 
                  />
                  <span className={volTasksCompleted.wheelchairGuide ? 'line-through text-zinc-400' : ''}>Escort accessibility fan to Section 105 (+25 pts)</span>
                </label>

                <label className="flex items-center gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    checked={volTasksCompleted.recycleCups} 
                    onChange={() => toggleVolTask('recycleCups')} 
                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-zinc-300 rounded" 
                  />
                  <span className={volTasksCompleted.recycleCups ? 'line-through text-zinc-400' : ''}>Distribute eco-cups at Section 102 (+25 pts)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Operations Broadcast Channel</span>
            </h3>

            <div className="space-y-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-900/40 rounded-xl text-xs text-amber-800 dark:text-amber-300">
                <div className="flex justify-between items-center font-bold mb-1">
                  <span>URGENT: TURNSTILE OUTAGE GATE 3</span>
                  <span>10 mins ago</span>
                </div>
                <p>Gate 3 Ticket Scanner Turnstile #4 is offline. Scanner queues are building. Nearby volunteers at Sectors 1-3 please move to Gate 3 to assist stewards with crowd dispersal.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col h-full">
          <h3 className="font-bold text-sm border-b border-zinc-100 dark:border-zinc-900 pb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-emerald-500" />
            <span>Duty Supervisor Radio</span>
          </h3>

          <div className="flex-1 max-h-60 overflow-y-auto space-y-3 px-1 py-2 text-xs">
            <div className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-300 w-4/5">
              <p className="font-bold text-xs text-zinc-400">Supervisor Sarah</p>
              <p className="mt-0.5">Volunteers at Gate 3, Turnstile #4 is currently being fixed by engineering. Stewards are moving to handheld ticket scanners. Please guide fans to the rightmost lanes.</p>
            </div>
          </div>

          <div className="flex gap-2">
            <input 
              type="text" 
              placeholder="Radio supervisor..." 
              className="flex-1 px-3 py-1.5 text-xs rounded-lg bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-zinc-950 dark:text-white"
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs">Send</button>
          </div>
        </div>
      </div>
    </div>
  );
}
