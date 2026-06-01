/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Menu, Sparkles, Clock, LogOut } from 'lucide-react';
import { AppState, UserSession, RecentActivityItem } from './types';

// Importing Views
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import MoMGeneratorView from './components/MoMGeneratorView';
import UserStoryGeneratorView from './components/UserStoryGeneratorView';
import JiraAnalyzerView from './components/JiraAnalyzerView';
import SettingsView from './components/SettingsView';

// Realistic sample activities list
const initialActivities: RecentActivityItem[] = [
  {
    id: 'activity-1',
    type: 'mom',
    title: 'Q3 Product Strategic Review Board',
    timestamp: '06:12:05 AM (UTC)',
    status: 'success',
    details: 'AI MoM synthesized. Generated 3 key developer milestones and logged action owners.'
  },
  {
    id: 'activity-2',
    type: 'user-story',
    title: 'Unified Billing Interface Exporter Docs',
    timestamp: 'Yesterday at 04:30 PM',
    status: 'completed',
    details: 'Completed compiling Agile stories and scenario Gherkin criterion validations.'
  },
  {
    id: 'activity-3',
    type: 'jira',
    title: 'Core Services Backlog CSV',
    timestamp: 'Yesterday at 11:15 AM',
    status: 'alert',
    details: 'Parsed 32 active tickets. Triggered Moderate Risk warning regarding unassigned memory leak blocks.'
  },
  {
    id: 'activity-4',
    type: 'system',
    title: 'Workspace Authentication Access',
    timestamp: '06:45:21 AM (UTC)',
    status: 'completed',
    details: 'Corporate session validated from portal gate.'
  }
];

export default function App() {
  
  // 1. Session state holding user logins
  const [session, setSession] = useState<UserSession>(() => {
    const saved = localStorage.getItem('pma_session');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    return {
      email: '',
      isLoggedIn: false,
      rememberMe: true
    };
  });

  // 2. Main application global states
  const [state, setState] = useState<AppState>(() => {
    const savedTheme = localStorage.getItem('pma_theme') as 'light' | 'dark' | null;
    return {
      currentTab: 'dashboard',
      stats: {
        totalMeetings: 12,
        userStoriesGenerated: 45,
        openActionItems: 8,
        jiraTicketsAnalyzed: 6
      },
      activities: initialActivities,
      theme: savedTheme || 'dark' // Default to dark mode for an elegant "fintech" feel
    };
  });

  // 3. Mobile sidebar toggle
  const [mobileOpen, setMobileOpen] = useState(false);

  // 4. Live UTC Clock
  const [currentTime, setCurrentTime] = useState('');

  // Handle live clock
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const stringTime = now.toLocaleTimeString('en-US', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' UTC';
      setCurrentTime(stringTime);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Theme Sync effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('pma_theme', state.theme);
  }, [state.theme]);

  // Persist session if rememberMe is toggled
  useEffect(() => {
    if (session.isLoggedIn && session.rememberMe) {
      localStorage.setItem('pma_session', JSON.stringify(session));
    } else {
      localStorage.removeItem('pma_session');
    }
  }, [session]);

  const handleLoginSuccess = (email: string, rememberMe: boolean) => {
    setSession({
      email,
      isLoggedIn: true,
      rememberMe
    });

    // Add a login activity log dynamically
    handleAddActivity({
      id: `login-${Date.now()}`,
      type: 'system',
      title: 'Portal Access Authenticated',
      timestamp: new Date().toLocaleTimeString() + ' (UTC)',
      status: 'completed',
      details: `Successful sign-in validated for identity ${email}.`
    });
  };

  const handleLogout = () => {
    setSession({
      email: '',
      isLoggedIn: false,
      rememberMe: true
    });
    localStorage.removeItem('pma_session');
  };

  // State Updates helpers
  const handleAddActivity = (activity: RecentActivityItem) => {
    setState(prev => ({
      ...prev,
      activities: [activity, ...prev.activities].slice(0, 30) // Limit to 30 elements
    }));
  };

  const handleIncrementMeetings = () => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        totalMeetings: prev.stats.totalMeetings + 1
      }
    }));
  };

  const handleIncrementStories = () => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        userStoriesGenerated: prev.stats.userStoriesGenerated + 1
      }
    }));
  };

  const handleIncrementJira = () => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        jiraTicketsAnalyzed: prev.stats.jiraTicketsAnalyzed + 1
      }
    }));
  };

  const handleAddActionItems = (count: number) => {
    setState(prev => ({
      ...prev,
      stats: {
        ...prev.stats,
        openActionItems: prev.stats.openActionItems + count
      }
    }));
  };

  const handleChangeTheme = (theme: 'light' | 'dark') => {
    setState(prev => ({ ...prev, theme }));
  };

  const handleClearActivities = () => {
    setState(prev => ({ ...prev, activities: [] }));
  };

  const handleResetStats = () => {
    setState(prev => ({
      ...prev,
      stats: {
        totalMeetings: 0,
        userStoriesGenerated: 0,
        openActionItems: 0,
        jiraTicketsAnalyzed: 0
      }
    }));
  };

  const handleNavigate = (tab: typeof state.currentTab) => {
    setState(prev => ({ ...prev, currentTab: tab }));
  };

  // Render non-logged-in login card if false
  if (!session.isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Render principal operational portal framework
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#070b12] text-gray-900 dark:text-slate-100 flex transition-colors duration-200">
      
      {/* 1. Left Sidebar Core */}
      <Sidebar 
        currentTab={state.currentTab} 
        onChangeTab={handleNavigate} 
        userEmail={session.email}
        onLogout={handleLogout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* 2. Main Canvas Grid */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        
        {/* Upper Corporate Header */}
        <header className="h-16 flex items-center justify-between px-6 bg-white dark:bg-[#111927] border-b border-gray-150 dark:border-gray-850 shadow-sm flex-shrink-0">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
            >
              <Menu className="w-5.5 h-5.5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">WORKSPACE LEVEL</span>
              <span className="px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/30 text-[9px] font-bold text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-900/30 rounded">SAAS OPERATIONAL_CORE</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            
            {/* dynamic UTC sync timer clock */}
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-mono font-semibold-500 bg-gray-50 dark:bg-[#1f293d]/30 px-3 py-1.5 rounded-lg border border-gray-150/50 dark:border-gray-800">
              <Clock className="w-3.5 h-3.5 text-blue-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>{currentTime}</span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1 px-2.5 text-xs font-semibold text-gray-500 hover:text-red-500 dark:text-gray-450 dark:hover:text-red-400 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/40"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>

        </header>

        {/* 3. Views Main Controller Scroll Container */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
          <div className="w-full max-w-7xl mx-auto animate-fade-in">
            {state.currentTab === 'dashboard' && (
              <DashboardView state={state} onNavigate={handleNavigate} />
            )}
            {state.currentTab === 'mom' && (
              <MoMGeneratorView 
                onAddActivity={handleAddActivity} 
                onIncrementMeetings={handleIncrementMeetings}
                onAddActionItems={handleAddActionItems}
              />
            )}
            {state.currentTab === 'user-story' && (
              <UserStoryGeneratorView 
                onAddActivity={handleAddActivity} 
                onIncrementStories={handleIncrementStories}
              />
            )}
            {state.currentTab === 'jira' && (
              <JiraAnalyzerView 
                onAddActivity={handleAddActivity} 
                onIncrementJira={handleIncrementJira}
                onAddActionItems={handleAddActionItems}
              />
            )}
            {state.currentTab === 'settings' && (
              <SettingsView 
                state={state} 
                onChangeTheme={handleChangeTheme}
                onClearActivities={handleClearActivities}
                onResetStats={handleResetStats}
              />
            )}
          </div>
        </main>

      </div>

    </div>
  );
}
