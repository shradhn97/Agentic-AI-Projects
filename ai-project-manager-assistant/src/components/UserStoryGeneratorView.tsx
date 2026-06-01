/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Sparkles, 
  Copy, 
  Check, 
  Trash2, 
  FileEdit, 
  Layers, 
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  CheckSquare
} from 'lucide-react';
import { UserStoryResult } from '../types';
import { generateUserStory } from '../services/api';

interface UserStoryGeneratorViewProps {
  onAddActivity: (activity: any) => void;
  onIncrementStories: () => void;
}

const presetRequirements = [
  {
    title: "Multi-select Search Filters",
    text: "Create instant multi-select categorical search status filters for workspace audit tables so that operational analysts can isolate database histories without reloading pages."
  },
  {
    title: "Activity Stream Export",
    text: "Allow subscribers to securely export entire historical activity tables into clean comma-delimited CSV worksheets, processing downloads in background service queues for lists above 10,000 items."
  },
  {
    title: "Two-Factor Auth Onboarding",
    text: "Implement dynamic multi-factor authentication (MFA) onboarding flows during workspace login, prompting users to scan Google Authenticator QR keys with secure backup recovery support."
  }
];

export default function UserStoryGeneratorView({
  onAddActivity,
  onIncrementStories,
}: UserStoryGeneratorViewProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<UserStoryResult | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      requirement: presetRequirements[0].text
    }
  });

  const requirementText = watch('requirement');

  const handlePresetSelect = (text: string) => {
    setValue('requirement', text);
  };

  const handleClear = () => {
    setValue('requirement', '');
    setResult(null);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const gResult = await generateUserStory(data.requirement);
      setResult(gResult);

      // Increment metric and log activity
      onIncrementStories();
      onAddActivity({
        id: `story-${Date.now()}`,
        type: 'user-story',
        title: gResult.title || 'Technical User Story',
        timestamp: new Date().toLocaleTimeString() + ' (UTC)',
        status: 'success',
        details: `Successfully compiled Agile narrative block. Story Points: ${gResult.storyPoints}.`
      });

    } catch (err: any) {
      setErrorMsg(err?.message || 'Failed to establish stable AI parsing pipeline.');
    } finally {
      setLoading(false);
    }
  };

  // Copy standard Gherkin user story block to clipboard
  const handleCopyStory = () => {
    if (!result) return;

    const formatted = `TITLE: ${result.title}
Story Points: ${result.storyPoints} | Priority: ${result.priority}

USER STORY DESCRIPTION:
${result.userStory}

ACCEPTANCE CRITERIA:
${result.acceptanceCriteria.map((c, i) => `${i + 1}. [ ] ${c}`).join('\n')}
`;

    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Upper Pitch Grid Panel with Bold Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <h1 className="bold-header text-slate-900 dark:text-white">
            User Story Writer
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold">
            Formulate developer-ready user stories and Gherkin acceptance criteria from raw text notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Requirement Inputs */}
        <div className="lg:col-span-5 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="bg-white dark:bg-[#111927] border border-gray-105 dark:border-gray-850 rounded-2xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <Layers className="w-4.5 h-4.5" />
              REQUIREMENT SPECIFICATION
            </div>

            {/* Presets Grid */}
            <div className="space-y-2">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-550">
                Choose Sample Product Presets
              </span>
              <div className="grid grid-cols-1 gap-2">
                {presetRequirements.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetSelect(preset.text)}
                    className="p-2.5 bg-gray-50/75 dark:bg-[#1f293d]/25 border border-gray-150/45 dark:border-gray-805 hover:bg-blue-50/40 dark:hover:bg-[#1f293d]/50 hover:border-blue-150 dark:hover:border-blue-900 rounded-xl text-left cursor-pointer transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Lightbulb className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span className="text-[11px] font-bold text-gray-850 dark:text-slate-250 leading-tight">{preset.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Main Area */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label htmlFor="requirement" className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-505">
                  Raw Requirement Text Block
                </label>
                {requirementText && (
                  <button
                    type="button"
                    onClick={handleClear}
                    className="text-[10px] text-red-500 dark:text-red-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    Clear
                  </button>
                )}
              </div>
              <textarea
                id="requirement"
                rows={10}
                placeholder="Declare system needs, user actions, business goals, or system rules to compile..."
                className={`w-full px-4 py-3 bg-gray-50 dark:bg-[#1f293d]/40 border ${
                  errors.requirement ? 'border-red-400' : 'border-gray-205 dark:border-gray-800'
                } rounded-2xl text-xs leading-relaxed text-gray-950 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-sans`}
                {...register('requirement', { required: 'Requirement description is required to generate Agile stories.' })}
              />
              <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-gray-500 font-medium px-1 pt-0.5">
                <span>Enter up to 1,000 words</span>
                <span>{requirementText ? requirementText.length : 0} chars</span>
              </div>
              {errors.requirement && (
                <p className="text-xs text-red-550 font-medium ml-1 mt-0.5">{errors.requirement.message}</p>
              )}
            </div>

            {/* Author Story Trigger */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-blue-600 hover:bg-blue-505 active:bg-blue-700 disabled:bg-blue-600/50 text-white font-medium text-xs rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 transition-all duration-150"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Authoring Story Schema...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Agile User Story
                </>
              )}
            </button>

          </form>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-7">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl flex items-start gap-3 text-xs mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-red-800 dark:text-red-400 block mb-0.5">Authoring Pipeline Error</span>
                <p className="text-red-700 dark:text-red-400 font-medium leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="h-full bg-slate-50 dark:bg-[#111927]/30 border border-dashed border-slate-205 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 min-h-[460px]">
              <div className="p-4 bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-800 rounded-full text-slate-400 mb-4 shadow-sm">
                <FileEdit className="w-8 h-8" />
              </div>
              <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-slate-350">
                User Story output summary
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-550 mt-1.5 max-w-sm leading-relaxed">
                Click preset requirements or define your functional needs, then click generate to compile Agile User Stories and detailed acceptance criteria boards with story points.
              </p>
            </div>
          )}

          {loading && (
            <div className="h-full bg-white dark:bg-[#111927] border border-gray-105 dark:border-gray-850 rounded-2xl flex flex-col items-center justify-center text-center p-8 min-h-[460px]">
              <div className="relative flex items-center justify-center mb-6">
                <div className="w-12 h-12 rounded-full border-4 border-blue-105 dark:border-blue-955/45 animate-pulse" />
                <div className="w-8 h-8 rounded-full border-3 border-blue-500 border-t-transparent animate-spin absolute" />
              </div>
              <h4 className="font-display text-sm font-semibold text-gray-850 dark:text-slate-300">
                Formulating Narrative Segments
              </h4>
              <p className="text-xs text-gray-450 dark:text-gray-500 mt-2 max-w-xs leading-normal">
                Structuring Agile Gherkin alignments, parsing priority dependencies, and assigning complexity Fibonacci story points instantly.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="bg-white dark:bg-[#111927] border border-gray-105 dark:border-gray-855 rounded-2xl shadow-sm p-6 space-y-5 animate-fade-in">
              
              {/* Output Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
                <div>
                  <h3 className="font-display text-base font-bold text-gray-950 dark:text-white-100">
                    {result.title || 'Technical User Story'}
                  </h3>
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5 uppercase tracking-wide">
                    STORY CODE: PM-STORY-{result.storyPoints || 5}X • Generated: {result.generatedAt}
                  </p>
                </div>
                
                <button
                  type="button"
                  onClick={handleCopyStory}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg text-gray-750 dark:text-slate-350 font-bold transition-all cursor-pointer self-start sm:self-auto"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied Details' : 'Copy Story Box'}
                </button>
              </div>

              {/* Grid: Complexity & Priority */}
              <div className="grid grid-cols-2 gap-4">
                
                {/* Priority */}
                <div className="p-3 bg-gray-50 dark:bg-[#1f293d]/15 border border-gray-100 dark:border-gray-850/80 rounded-xl">
                  <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                    Priority Alignment
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                    result.priority === 'High' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/20' :
                    result.priority === 'Medium' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400 border border-amber-100 dark:border-amber-900/20' :
                    'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-905/20'
                  }`}>
                    {result.priority}
                  </span>
                </div>

                {/* Story Points */}
                <div className="p-3 bg-gray-50 dark:bg-[#1f293d]/15 border border-gray-100 dark:border-gray-850/80 rounded-xl">
                  <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-1">
                    Fibonacci Story Points
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-mono font-bold text-gray-900 dark:text-white">
                      {result.storyPoints || 5}
                    </span>
                    <span className="text-[10px] text-gray-400 dark:text-gray-500 font-medium">Complexity Weight</span>
                  </div>
                </div>

              </div>

              {/* User Story Body */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                  Agile Narrative Syntax
                </span>
                <div className="p-4 bg-blue-50/40 dark:bg-[#1f293d]/20 border border-blue-100/50 dark:border-blue-900/40 rounded-xl text-xs leading-relaxed text-gray-800 dark:text-slate-200 font-medium whitespace-pre-wrap">
                  {result.userStory}
                </div>
              </div>

              {/* Acceptance Criteria Checklist */}
              <div className="space-y-3 pt-1">
                <span className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-505">
                  Acceptance Criteria (Gherkin Scenarios)
                </span>
                
                <div className="space-y-2.5">
                  {result.acceptanceCriteria.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-3 p-3 bg-slate-50/75 dark:bg-[#1f293d]/10 border border-slate-150/50 dark:border-slate-805 rounded-xl hover:border-slate-200 transition-colors"
                    >
                      <div className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400">
                        <CheckSquare className="w-4.5 h-4.5" />
                      </div>
                      <div className="text-xs text-gray-800 dark:text-slate-350 leading-relaxed font-medium">
                        <span className="font-mono text-[10px] text-gray-400 dark:text-gray-500 block">SCENARIO_0{index + 1}</span>
                        {item}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
