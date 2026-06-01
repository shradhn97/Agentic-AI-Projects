/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Briefcase, 
  Settings, 
  LogOut, 
  CalendarDays, 
  FileEdit, 
  BarChart4, 
  User, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

interface SidebarProps {
  currentTab: 'dashboard' | 'mom' | 'user-story' | 'jira' | 'settings';
  onChangeTab: (tab: 'dashboard' | 'mom' | 'user-story' | 'jira' | 'settings') => void;
  userEmail: string;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  currentTab,
  onChangeTab,
  userEmail,
  onLogout,
  mobileOpen,
  setMobileOpen,
}: SidebarProps) {
  
  const menuItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: BarChart4 },
    { id: 'mom' as const, label: 'MoM Generator', icon: CalendarDays },
    { id: 'user-story' as const, label: 'Story Generator', icon: FileEdit },
    { id: 'jira' as const, label: 'Jira Analyzer', icon: Briefcase },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
  ];

  const handleTabClick = (tabId: typeof currentTab) => {
    onChangeTab(tabId);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-neutral-900/40 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Main Container Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-64 bg-white dark:bg-[#111927] text-slate-900 dark:text-slate-100 border-r border-slate-200 dark:border-slate-850 z-50 
        flex flex-col transform transition-transform duration-300 lg:static lg:transform-none lg:h-screen
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 dark:border-slate-850">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-xl italic font-sans shadow-md shadow-blue-500/10">A</div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">AI.PRO</span>
          </div>
          
          <button 
            type="button"
            onClick={() => setMobileOpen(false)} 
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white lg:hidden cursor-pointer rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all cursor-pointer font-bold
                  ${isActive 
                    ? 'sidebar-active text-blue-600 dark:text-blue-400' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-905 dark:text-slate-400 dark:hover:bg-slate-800/40 dark:hover:text-white'
                  }
                `}
              >
                <Icon className={`w-4.5 h-4.5 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-slate-400 group-hover:text-white'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* AI Model Status box from design */}
        <div className="px-4 py-2">
          <div className="bg-slate-50 dark:bg-[#1f293d]/30 p-4 rounded-xl border border-slate-100 dark:border-slate-800/80">
            <p className="text-[10px] uppercase font-bold text-slate-400 mb-2 font-display tracking-wider">AI Model Status</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-350">v4.2-Pro Active</span>
            </div>
          </div>
        </div>

        {/* Footer / User Profile Row */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/20">
          <div className="flex items-center gap-3 px-2 py-1.5 rounded-xl border border-transparent">
            <div className="flex items-center justify-center w-8 h-8 bg-slate-100 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-300">
              <User className="w-4.5 h-4.5" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block text-xs font-bold text-slate-850 dark:text-white truncate">{userEmail}</span>
              <span className="block text-[10px] text-slate-400 dark:text-slate-500 font-medium -mt-0.5">Release Director</span>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-350 font-bold cursor-pointer transition-colors duration-150"
          >
            <LogOut className="w-3.5 h-3.5" />
            Disconnect Portal
          </button>
        </div>
      </aside>
    </>
  );
}
