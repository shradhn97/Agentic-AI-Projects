/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  Settings, 
  Sun, 
  Moon, 
  Sparkles, 
  Lock, 
  ArrowUpRight, 
  ShieldCheck, 
  Info,
  CheckCircle2,
  Sliders,
  Trash2
} from 'lucide-react';
import { AppState } from '../types';

interface SettingsViewProps {
  state: AppState;
  onChangeTheme: (theme: 'light' | 'dark') => void;
  onClearActivities: () => void;
  onResetStats: () => void;
}

export default function SettingsView({
  state,
  onChangeTheme,
  onClearActivities,
  onResetStats
}: SettingsViewProps) {
  const { theme } = state;
  const [leadName, setLeadName] = useState('Sarah Lin (Lead Engineer)');
  const [webhookUrl, setWebhookUrl] = useState('https://hooks.slack.com/services/PM_CO_SAMPLE_WEB_URL');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSave = () => {
    setSuccessMsg('SaaS workspace constraints committed successfully.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Upper Pitch Grid Panel with Bold Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <h1 className="bold-header text-slate-900 dark:text-white">
            Workspace Settings
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold">
            Configure default AI workspace settings, trigger UI templates, and adjust layout themes.
          </p>
        </div>
      </div>

      <div className="max-w-3xl space-y-6">
        
        {/* State Indicators */}
        {successMsg && (
          <div className="p-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/60 rounded-xl text-xs text-green-700 dark:text-green-400 font-semibold flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            {successMsg}
          </div>
        )}

        {/* 1. Theme Selection Core */}
        <div className="bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            <Sliders className="w-4 h-4" />
            Visual Identity Configuration
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div>
              <span className="block text-xs font-bold text-gray-800 dark:text-slate-200">
                Dashboard Canvas Theme
              </span>
              <p className="text-[11px] text-gray-450 dark:text-gray-500 leading-normal mt-0.5 max-w-sm">
                Toggle between clear light-fintech canvas or dark ambient developers layout
              </p>
            </div>

            {/* Toggle group */}
            <div className="flex bg-gray-50 dark:bg-[#1f293d]/50 p-1.5 rounded-xl border border-gray-150 dark:border-gray-800 self-start sm:self-auto scroll-m-2">
              <button
                type="button"
                onClick={() => onChangeTheme('light')}
                className={`
                  flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
                  ${theme === 'light' 
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-150/40' 
                    : 'text-gray-550 hover:text-gray-300'
                  }
                `}
              >
                <Sun className="w-4 h-4 text-amber-500" />
                Light Slate
              </button>
              <button
                type="button"
                onClick={() => onChangeTheme('dark')}
                className={`
                  flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer
                  ${theme === 'dark' 
                    ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700/50' 
                    : 'text-gray-500 hover:text-gray-900 dark:hover:text-blue-300'
                  }
                `}
              >
                <Moon className="w-4 h-4 text-indigo-400" />
                Dark Cosmic
              </button>
            </div>
          </div>
        </div>

        {/* 2. Operational Defaults */}
        <div className="bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
            <Settings className="w-4 w-4" />
            AI Execution Defaults Settings
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Team Lead Default assignee */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-505">
                Default Action Assignee Owner
              </label>
              <input
                type="text"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full px-3.5 py-2 bg-gray-50 dark:bg-[#1f293d]/30 border border-gray-205 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Simulated Slack Channel Hooks */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-505">
                Activity Dispatch Slack Webhook
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full pl-3.5 pr-11 py-2 bg-gray-50 dark:bg-[#1f293d]/30 border border-gray-205 dark:border-gray-800 rounded-xl text-xs text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

          </div>

          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-sm transition-all"
          >
            Commit SaaS Changes
          </button>
        </div>

        {/* 3. System Clearers Console */}
        <div className="bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold text-red-650 dark:text-red-400 uppercase tracking-wide">
            <Trash2 className="w-4 h-4 text-red-500" />
            System Control Console
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-gray-100 dark:border-gray-850 pb-1">
            <div>
              <span className="block text-xs font-bold text-gray-800 dark:text-slate-200">
                Clear Activity Invalidation
              </span>
              <p className="text-[11px] text-gray-450 dark:text-gray-500 leading-normal mt-0.5 max-w-sm">
                Completely erase recorded AI activity streams and history metrics logs
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => {
                onClearActivities();
                alert('Workspace activity stream records successfully invalidated!');
              }}
              className="px-3.5 py-2 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-900/30 text-red-650 dark:text-red-400 border border-red-100 dark:border-red-900/40 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              Clear Process Log Records
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1 border-t border-gray-100 dark:border-gray-850 pb-1">
            <div>
              <span className="block text-xs font-bold text-gray-800 dark:text-slate-200">
                Reset Workspace Stat Controllers
              </span>
              <p className="text-[11px] text-gray-450 dark:text-gray-500 leading-normal mt-0.5 max-w-sm">
                Reset overall meetings, stories, and backlog counters back to minimal baseline levels
              </p>
            </div>
            
            <button
              type="button"
              onClick={() => {
                onResetStats();
                alert('Workspace counters adjusted back to baseline values!');
              }}
              className="px-3.5 py-2 bg-gray-105 hover:bg-gray-150 dark:bg-[#1f293d]/40 dark:hover:bg-[#1f293d]/80 text-gray-700 dark:text-[#a0acc0] border border-gray-205 dark:border-gray-800 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
            >
              Reset Core Metrics
            </button>
          </div>
        </div>

        {/* 4. Credentials Security Indicator */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/40 border border-slate-105 dark:border-slate-805 rounded-2xl flex gap-3 text-xs">
          <Info className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-bold text-gray-900 dark:text-slate-205 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-green-500 inline-block" />
              SaaS Execution Protocol Status
            </span>
            <p className="text-gray-500 dark:text-gray-400 leading-normal">
              You are securely authenticated using corporate credential mapping. Cloud token calls utilize Gemini 3.5 foundation parameters in complete server-isolation, adhering to maximum safety parameters.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
