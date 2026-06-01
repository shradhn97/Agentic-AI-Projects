/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserSession {
  email: string;
  isLoggedIn: boolean;
  rememberMe: boolean;
}

export interface KPIStats {
  totalMeetings: number;
  userStoriesGenerated: number;
  openActionItems: number;
  jiraTicketsAnalyzed: number;
}

export interface RecentActivityItem {
  id: string;
  type: 'mom' | 'user-story' | 'jira' | 'system';
  title: string;
  timestamp: string;
  status: 'completed' | 'pending' | 'success' | 'alert';
  details: string;
}

export interface AIChartData {
  name: string; // Date or week
  mom: number;
  stories: number;
  jira: number;
}

export interface MoMTask {
  id: string;
  task: string;
  assignee: string;
  dueDate: string;
  priority: 'High' | 'Medium' | 'Low';
}

export interface MoMResult {
  meetingSummary: string;
  discussionPoints: string[];
  actionItems: MoMTask[];
  rawNotesLength: number;
  generatedAt: string;
}

export interface UserStoryResult {
  title: string;
  userStory: string;
  acceptanceCriteria: string[];
  priority: 'High' | 'Medium' | 'Low';
  storyPoints: number;
  generatedAt: string;
}

export interface JiraAnalysisResult {
  totalTickets: number;
  completed: number;
  inProgress: number;
  blocked: number;
  riskSummary: string;
  tickets: {
    key: string;
    summary: string;
    status: 'Completed' | 'In Progress' | 'Blocked';
    assignee: string;
    priority: 'High' | 'Medium' | 'Low';
  }[];
  generatedAt: string;
}

export interface AppState {
  currentTab: 'dashboard' | 'mom' | 'user-story' | 'jira' | 'settings';
  stats: KPIStats;
  activities: RecentActivityItem[];
  theme: 'light' | 'dark';
}
