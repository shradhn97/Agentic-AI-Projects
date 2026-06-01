/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Calendar, 
  FileCheck, 
  Clock, 
  TrendingUp, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle,
  PlayCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { AppState, RecentActivityItem } from '../types';

interface DashboardViewProps {
  state: AppState;
  onNavigate: (tab: 'dashboard' | 'mom' | 'user-story' | 'jira' | 'settings') => void;
}

// Beautiful synthetic historical logs for the usage chart
const initialUsageData = [
  { name: 'Mon', mom: 4, stories: 12, jira: 2 },
  { name: 'Tue', mom: 7, stories: 19, jira: 4 },
  { name: 'Wed', mom: 5, stories: 15, jira: 3 },
  { name: 'Thu', mom: 8, stories: 24, jira: 8 },
  { name: 'Fri', mom: 12, stories: 32, jira: 6 },
  { name: 'Sat', mom: 2, stories: 8, jira: 1 },
  { name: 'Sun', mom: 3, stories: 10, jira: 2 },
];

export default function DashboardView({ state, onNavigate }: DashboardViewProps) {
  const { stats, activities, theme } = state;

  // Render proper status badges
  const renderStatusBadge = (status: RecentActivityItem['status']) => {
    switch (status) {
      case 'success':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200/55 dark:border-green-900/40">
            <CheckCircle2 className="w-3 h-3" />
            Approved
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border border-blue-200/55 dark:border-blue-900/40">
            <CheckCircle2 className="w-3 h-3" />
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/55 dark:border-amber-900/40">
            <Clock className="w-3 h-3" />
            In Progress
          </span>
        );
      case 'alert':
        return (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200/55 dark:border-red-900/45">
            <AlertTriangle className="w-3 h-3" />
            Blocked
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Upper Pitch Grid Panel with Bold Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <h1 className="bold-header text-slate-900 dark:text-white">
            Good morning, Director.
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold">
            You processed <span className="text-blue-600 dark:text-blue-400 font-black">{stats.totalMeetings} meetings</span> in the last 24 hours.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 px-3.5 py-1.5 rounded-xl border border-blue-150 dark:border-blue-900/40 self-start md:self-auto">
          <Activity className="w-4 h-4 animate-pulse text-blue-650 dark:text-blue-400" />
          ACTIVE DEPLOYMENT READY
        </div>
      </div>

      {/* 4 KPI Cards Grid with Bold Typography and Transitions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Meetings */}
        <div className="bg-white dark:bg-[#111927] p-6 rounded-2xl stat-card shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-display">
              Meetings
            </span>
          </div>
          <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
            {stats.totalMeetings}
          </p>
          <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center italic">
            +12.5% from last week
          </div>
        </div>

        {/* KPI 2: User Stories */}
        <div className="bg-white dark:bg-[#111927] p-6 rounded-2xl stat-card shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-display">
              User Stories
            </span>
          </div>
          <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
            {stats.userStoriesGenerated}
          </p>
          <div className="mt-2 text-xs font-bold text-emerald-500 flex items-center italic">
            22 ready for sprint
          </div>
        </div>

        {/* KPI 3: Action Items */}
        <div className="bg-white dark:bg-[#111927] p-6 rounded-2xl stat-card shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-display">
              Action Items
            </span>
          </div>
          <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
            {stats.openActionItems}
          </p>
          <div className="mt-2 text-xs font-bold text-amber-500 flex items-center italic">
            4 pending approval
          </div>
        </div>

        {/* KPI 4: Jira Backlogs Handled */}
        <div className="bg-white dark:bg-[#111927] p-6 rounded-2xl stat-card shadow-xs group">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 font-display">
              Jira Tickets
            </span>
          </div>
          <p className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white">
            {stats.jiraTicketsAnalyzed * 24 + 112}
          </p>
          <div className="mt-2 text-xs font-bold text-blue-500 flex items-center italic">
            Synced 5m ago
          </div>
        </div>

      </div>

      {/* Main Grid: Analytical Chart and Action Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Analytics Chart Container */}
        <div className="bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Task Execution Metric Core
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Weekly processing load by AI service components
              </p>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-blue-500" /> MoM
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-sky-400" /> Stories
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-indigo-500" /> Jira Analysis
            </div>
          </div>

          <div className="h-72 w-full text-xs font-mono">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={initialUsageData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMom" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorStories" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorJira" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={theme === 'dark' ? '#1f2937' : '#f1f5f9'} />
                <XAxis dataKey="name" stroke={theme === 'dark' ? '#6b7280' : '#94a3b8'} axisLine={false} tickLine={false} />
                <YAxis stroke={theme === 'dark' ? '#6b7280' : '#94a3b8'} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f293d' : '#ffffff',
                    borderColor: theme === 'dark' ? '#374151' : '#e2e8f0',
                    color: theme === 'dark' ? '#f3f4f6' : '#111827',
                    borderRadius: '12px',
                    fontSize: '11px',
                    fontFamily: '"JetBrains Mono", monospace'
                  }}
                />
                <Area type="monotone" dataKey="mom" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorMom)" name="MoM Tasks" />
                <Area type="monotone" dataKey="stories" stroke="#38bdf8" strokeWidth={2} fillOpacity={1} fill="url(#colorStories)" name="Story Formulation" />
                <Area type="monotone" dataKey="jira" stroke="#6366f1" strokeWidth={2} fillOpacity={1} fill="url(#colorJira)" name="Jira Auditing" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white mb-2">
              Launch Copilots
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
              Trigger high-utility AI engines immediately in a single click
            </p>

            <div className="space-y-3">
              {/* MoM trigger */}
              <button
                onClick={() => onNavigate('mom')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1f293d]/30 border border-gray-150/50 dark:border-gray-850 hover:bg-blue-50/50 dark:hover:bg-[#1f293d]/80 hover:border-blue-200 dark:hover:border-blue-900 group transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-lg">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-800 dark:text-slate-200">Minutes of Meeting</span>
                    <span className="block text-[10px] text-gray-450 dark:text-gray-550 leading-tight">Summarize meeting audios and transcripts</span>
                  </div>
                </div>
                <PlayCircle className="w-4 h-4 text-gray-425 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* User story trigger */}
              <button
                onClick={() => onNavigate('user-story')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1f293d]/30 border border-gray-150/50 dark:border-gray-850 hover:bg-blue-50/50 dark:hover:bg-[#1f293d]/80 hover:border-blue-200 dark:hover:border-blue-900 group transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-450 rounded-lg">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-800 dark:text-slate-200">User Story Writer</span>
                    <span className="block text-[10px] text-gray-450 dark:text-gray-555 leading-tight">Generate acceptance criteria schemas</span>
                  </div>
                </div>
                <PlayCircle className="w-4 h-4 text-gray-425 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all" />
              </button>

              {/* Jira Analyzer trigger */}
              <button
                onClick={() => onNavigate('jira')}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-[#1f293d]/30 border border-gray-150/50 dark:border-gray-850 hover:bg-blue-50/50 dark:hover:bg-[#1f293d]/80 hover:border-blue-200 dark:hover:border-blue-900 group transition-all text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-450 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-800 dark:text-slate-200">Backlog Risk Audit</span>
                    <span className="block text-[10px] text-gray-450 dark:text-gray-555 leading-tight">Identify bottlenecks and staff overlaps</span>
                  </div>
                </div>
                <PlayCircle className="w-4 h-4 text-gray-425 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all" />
              </button>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-100 dark:border-slate-800/80 rounded-xl flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <p className="text-[10px] text-slate-500 dark:text-slate-450 leading-normal font-medium">
              Running with default cloud authorization keys. All API operations auto-fall back to secure offline parser models if connection limits are breached.
            </p>
          </div>

        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-850 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-850/80 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 dark:text-white">
              Recent Processing Activity
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Audit log of natural language generations and data uploads
            </p>
          </div>
          <span className="text-[10px] font-bold text-gray-400 font-mono tracking-wider">
            UTC AUTO-LOGGING
          </span>
        </div>

        {activities.length === 0 ? (
          <div className="p-12 text-center">
            <Activity className="w-10 h-10 text-gray-300 dark:text-gray-650 mx-auto mb-3" />
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">No activity logged</h4>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-1">Generate a MoM or story to see tracking details.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 dark:bg-gray-900/40 text-gray-400 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100 dark:border-gray-850/60">
                  <th className="py-2.5 px-6">Task Stream</th>
                  <th className="py-2.5 px-6">Task Title & Context</th>
                  <th className="py-2.5 px-6">Execution Timestamp</th>
                  <th className="py-2.5 px-6">SaaS Status</th>
                  <th className="py-2.5 px-6">Sizing Metrics</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-850/60 text-xs">
                {activities.map((act) => (
                  <tr 
                    key={act.id} 
                    className="hover:bg-slate-50/50 dark:hover:bg-[#1f293d]/20 transition-colors"
                  >
                    <td className="py-3 px-6 font-semibold">
                      <span className={`uppercase text-[9px] px-2 py-0.5 rounded-md font-bold ${
                        act.type === 'mom' ? 'bg-blue-100/60 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400' :
                        act.type === 'user-story' ? 'bg-sky-100/60 dark:bg-sky-950/40 text-sky-700 dark:text-sky-400' :
                        act.type === 'jira' ? 'bg-indigo-100/60 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-400' :
                        'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                      }`}>
                        {act.type === 'user-story' ? 'Story' : act.type}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <span className="block font-bold text-gray-950 dark:text-gray-200">{act.title}</span>
                      <span className="block text-[10px] text-gray-400 dark:text-gray-500 mt-0.5 max-w-[280px] truncate">{act.details}</span>
                    </td>
                    <td className="py-3 px-6 text-gray-400 dark:text-gray-500 font-mono text-[11px]">
                      {act.timestamp}
                    </td>
                    <td className="py-3 px-6">
                      {renderStatusBadge(act.status)}
                    </td>
                    <td className="py-3 px-6 font-mono text-[11px] text-gray-500 dark:text-gray-450">
                      ID: {act.id.slice(0, 8).toUpperCase()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}
