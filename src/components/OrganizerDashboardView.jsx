import React from 'react';
import { AlertTriangle, Activity, CheckCircle2, Users } from 'lucide-react';
import ReactECharts from 'echarts-for-react';

/**
 * OrganizerDashboardView component rendering the telemetry analytics graphs for organizers.
 * @param {object} props The component props.
 * @param {number} props.underReviewIssues Total count of issues in review/submitted.
 * @param {number} props.inProgressIssues Total count of issues in progress.
 * @param {number} props.resolvedIssues Total count of resolved issues.
 * @param {object} props.gateFlowOption ECharts options for gate flow rate.
 * @param {object} props.zoneDensityOption ECharts options for zone crowd density.
 * @param {object} props.sustainabilityOption ECharts options for sustainability data.
 * @param {object} props.transitOption ECharts options for transit wait times.
 * @returns {React.ReactElement} The rendered Organizer Dashboard View.
 */
export default function OrganizerDashboardView({
  underReviewIssues,
  inProgressIssues,
  resolvedIssues,
  gateFlowOption,
  zoneDensityOption,
  sustainabilityOption,
  transitOption
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400">Triage Queue Issues</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-amber-500">{underReviewIssues}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 font-bold">Needs Dispatch</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-amber-500">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400">Active Responses</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-blue-500">{inProgressIssues}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 font-bold">On-Site</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500">
            <Activity className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400">Resolved Incidents</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-emerald-500">{resolvedIssues}</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 font-bold">Resolved</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl flex items-center justify-between shadow-sm">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-zinc-400">Total Stadium Density</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-zinc-800 dark:text-zinc-100">76%</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-400 font-bold">Optimal</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <ReactECharts option={gateFlowOption} style={{ height: '300px' }} />
        </div>
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <ReactECharts option={zoneDensityOption} style={{ height: '300px' }} />
        </div>
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <ReactECharts option={sustainabilityOption} style={{ height: '300px' }} />
        </div>
        <div className="p-5 bg-white dark:bg-[#0c0c0f] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm">
          <ReactECharts option={transitOption} style={{ height: '300px' }} />
        </div>
      </div>
    </div>
  );
}
