/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { 
  Upload, 
  Sparkles, 
  FileSpreadsheet, 
  Trash2, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Layers,
  ArrowUpRight,
  ShieldAlert,
  Download
} from 'lucide-react';
import { JiraAnalysisResult } from '../types';
import { analyzeJira } from '../services/api';

interface JiraAnalyzerViewProps {
  onAddActivity: (activity: any) => void;
  onIncrementJira: () => void;
  onAddActionItems: (count: number) => void;
}

// Sample Jira backlog CSV payload to configure instantly in one click
const sampleJiraCSV = `Issue Key,Summary,Status,Assignee,Priority
PRJ-101,Resolve memory leaks occurring in token authentication cache layers,Blocked,Sarah Lin,High
PRJ-104,Formulate responsive tablet user story testing scripts,Completed,Marcus Vance,Low
PRJ-115,Validate payment gateway webhook retries match back-off curves,In Progress,Nikolas Tesla,High
PRJ-120,Refactor redundant global context imports into sub-bundles,Completed,Isabelle White,Medium
PRJ-205,Investigate potential SQL deadlocks on simultaneous transaction index creations,Blocked,Sarah Lin,High
PRJ-310,Document standard local staging Docker sandbox guidelines,In Progress,David Wright,Low
PRJ-342,Audit workspace dependencies for absolute React 19 forward margins,In Progress,Nikolas Tesla,Light`;

export default function JiraAnalyzerView({
  onAddActivity,
  onIncrementJira,
  onAddActionItems,
}: JiraAnalyzerViewProps) {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<JiraAnalysisResult | null>(null);
  const [csvContent, setCsvContent] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [dragging, setDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Parse file and load string helper
  const processCSVFile = (file: File) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      setErrorMsg('Unauthorized file extension. Please upload a structured format Comma-Delimited (.csv) backlog list.');
      return;
    }

    setFileName(file.name);
    setErrorMsg(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      setCsvContent(text);
    };
    reader.readAsText(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processCSVFile(files[0]);
    }
  };

  // Drag and Drop support handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processCSVFile(files[0]);
    }
  };

  const handleLoadSample = () => {
    setCsvContent(sampleJiraCSV);
    setFileName('production_backlog_draft.csv');
    setErrorMsg(null);
  };

  const handleClear = () => {
    setCsvContent('');
    setFileName('');
    setResult(null);
    setErrorMsg(null);
  };

  const handleTriggerInput = () => {
    fileInputRef.current?.click();
  };

  const handleAnalyze = async () => {
    if (!csvContent) return;
    setLoading(true);
    setErrorMsg(null);
    setResult(null);

    try {
      const analyticResult = await analyzeJira(csvContent, fileName);
      setResult(analyticResult);

      // Save global KPIs
      onIncrementJira();
      if (analyticResult.blocked > 0) {
        onAddActionItems(analyticResult.blocked);
      }

      onAddActivity({
        id: `jira-${Date.now()}`,
        type: 'jira',
        title: `backlog: ${fileName || 'unnamed.csv'}`,
        timestamp: new Date().toLocaleTimeString() + ' (UTC)',
        status: 'completed',
        details: `Parsed backlog file with ${analyticResult.totalTickets} items. Identified ${analyticResult.blocked} execution blockers.`
      });

    } catch (err: any) {
      setErrorMsg(err?.message || 'High-latency analytical process timeout.');
    } finally {
      setLoading(false);
    }
  };

  // Helper download simulated backlog generator for user
  const handleDownloadSampleTemplate = () => {
    const blob = new Blob([sampleJiraCSV], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const tempLink = document.createElement('a');
    tempLink.href = url;
    tempLink.download = 'sample_backlog_metrics.csv';
    document.body.appendChild(tempLink);
    tempLink.click();
    document.body.removeChild(tempLink);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Upper Pitch Grid Panel with Bold Typography */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-slate-800 pb-5">
        <div className="space-y-1">
          <h1 className="bold-header text-slate-900 dark:text-white">
            Jira Backlog Analyzer
          </h1>
          <p className="text-sm text-slate-500 dark:text-gray-400 font-semibold">
            Ingest raw Jira backlog issue tables to evaluate real-time project risk factors and task roadblocks.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upload controller column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-850 rounded-2xl p-6 shadow-sm space-y-5">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400">
                <Layers className="w-4.5 h-4.5" />
                INGESTION MODULE
              </div>
              <button 
                type="button"
                onClick={handleDownloadSampleTemplate}
                className="text-[10px] text-blue-600 dark:text-blue-450 hover:underline font-bold flex items-center gap-1 cursor-pointer"
              >
                <Download className="w-3 h-3" />
                Export Sample CSV
              </button>
            </div>

            {/* Ingestion Drop Zone */}
            {!csvContent ? (
              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleTriggerInput}
                className={`
                  border-2 border-dashed border-gray-205 dark:border-gray-800 rounded-2xl p-8 
                  flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[220px]
                  ${dragging 
                    ? 'border-blue-500 bg-blue-50/20 dark:bg-blue-950/10' 
                    : 'hover:border-blue-400 hover:bg-gray-50/40 dark:hover:bg-[#111927]/40'
                  }
                `}
              >
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv"
                  className="hidden"
                />
                <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full mb-3 shadow-xs">
                  <Upload className="w-6 h-6 animate-bounce" />
                </div>
                <h4 className="text-xs font-bold text-gray-850 dark:text-slate-350">
                  Select Backlog Comma-Delimited csv file
                </h4>
                <p className="text-[10px] text-gray-400 dark:text-gray-505 mt-1 max-w-[210px] leading-relaxed font-semibold">
                  Drag and drop local exports here or click to open folders selection
                </p>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLoadSample();
                  }}
                  className="mt-4 px-3 py-1.5 bg-gray-100 dark:bg-slate-800 hover:bg-slate-700 rounded-lg text-[10px] font-bold text-slate-650 dark:text-slate-300 transition-colors"
                >
                  Synthesize Enterprise Sample Payload
                </button>
              </div>
            ) : (
              <div className="border border-gray-100 dark:border-gray-800 rounded-2xl p-4 bg-gray-50/55 dark:bg-[#1f293d]/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl">
                    <FileSpreadsheet className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold text-gray-900 dark:text-white truncate max-w-[160px]">
                      {fileName}
                    </span>
                    <span className="block text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5 uppercase tracking-wide">
                      Rows Ingested: {csvContent.split('\n').filter(Boolean).length}
                    </span>
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 text-gray-400 hover:text-red-500 dark:hover:text-red-400 rounded-lg cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Run Analysis Action */}
            <button
              onClick={handleAnalyze}
              disabled={loading || !csvContent}
              className="w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-blue-600 hover:bg-blue-505 active:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-600 font-medium text-xs rounded-xl cursor-pointer shadow-lg shadow-blue-500/10 transition-all duration-150"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Backlog Risk Matrices...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Generate Jira Ingestion Audit
                </>
              )}
            </button>

          </div>
        </div>

        {/* Audit outputs column */}
        <div className="lg:col-span-7">
          
          {errorMsg && (
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 rounded-2xl flex items-start gap-3 text-xs mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-red-800 dark:text-red-400 block mb-0.5">Ingestion Incompatibility</span>
                <p className="text-red-700 dark:text-red-400 font-medium leading-relaxed">{errorMsg}</p>
              </div>
            </div>
          )}

          {!result && !loading && (
            <div className="h-full bg-slate-50 dark:bg-[#111927]/30 border border-dashed border-slate-205 dark:border-slate-800 rounded-2xl flex flex-col items-center justify-center text-center p-8 min-h-[460px]">
              <div className="p-4 bg-white dark:bg-[#111927] border border-gray-100 dark:border-gray-800 rounded-full text-slate-400 mb-4 shadow-sm">
                <FileSpreadsheet className="w-8 h-8" />
              </div>
              <h3 className="font-display text-sm font-semibold text-gray-900 dark:text-slate-350">
                Audited results presentation
              </h3>
              <p className="text-xs text-gray-400 dark:text-gray-550 mt-1.5 max-w-sm leading-relaxed">
                Provide or synthesize a valid backlog row spreadsheet export, then click action button to receive AI risk diagnostics and task charts.
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
                Evaluating Sprint Pipelines
              </h4>
              <p className="text-xs text-gray-450 dark:text-gray-550 mt-2 max-w-xs leading-normal">
                Determining bottlenecks, correlating critical paths, and isolating active velocity risks in real-time.
              </p>
            </div>
          )}

          {result && !loading && (
            <div className="bg-white dark:bg-[#111927] border border-gray-105 dark:border-gray-855 rounded-2xl p-6 shadow-sm space-y-6 animate-fade-in">
              
              {/* Output Header */}
              <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
                <h3 className="font-display text-base font-bold text-gray-905 dark:text-white">
                  Backlog Assessment Diagnostic Report
                </h3>
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-mono mt-0.5 uppercase tracking-wide">
                  Analysis Timestamp: {result.generatedAt} • Code: JIRA-DIAG-REPORT
                </p>
              </div>

              {/* Grid cards for Jira counts */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                
                {/* Total */}
                <div className="p-3 bg-gray-50 dark:bg-[#1f293d]/15 border border-gray-100 dark:border-gray-850/60 rounded-xl text-center">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-tight">Total Tickets</span>
                  <span className="text-2xl font-mono font-bold text-gray-850 dark:text-white block mt-1">{result.totalTickets}</span>
                </div>

                {/* Completed */}
                <div className="p-3 bg-green-50/45 dark:bg-green-950/10 border border-green-100 dark:border-green-905/20 rounded-xl text-center">
                  <span className="block text-[10px] font-bold text-green-600 uppercase tracking-tight">Completed</span>
                  <span className="text-2xl font-mono font-bold text-green-700 dark:text-green-450 block mt-1">{result.completed}</span>
                </div>

                {/* In Progress */}
                <div className="p-3 bg-blue-50/45 dark:bg-blue-950/10 border border-blue-105 dark:border-blue-905/20 rounded-xl text-center">
                  <span className="block text-[10px] font-bold text-blue-600 uppercase tracking-tight">In Progress</span>
                  <span className="text-2xl font-mono font-bold text-blue-700 dark:text-blue-450 block mt-1">{result.inProgress}</span>
                </div>

                {/* Blocked */}
                <div className="p-3 bg-red-50/45 dark:bg-red-955/10 border border-red-100 dark:border-red-905/20 rounded-xl text-center">
                  <span className="block text-[10px] font-bold text-red-600 uppercase tracking-tight font-sans">Blocked</span>
                  <span className="text-2xl font-mono font-bold text-red-700 dark:text-red-450 block mt-1">{result.blocked}</span>
                </div>

              </div>

              {/* Risk Summary */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-505 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-amber-500" />
                  Sprint Risk Evaluation
                </span>
                <div className="p-4 bg-amber-50/30 dark:bg-amber-950/15 border border-amber-100 dark:border-amber-900/30 rounded-xl text-xs leading-relaxed text-gray-750 dark:text-slate-300 font-medium">
                  {result.riskSummary}
                </div>
              </div>

              {/* Itemized backlogs list */}
              <div className="space-y-3 pt-2">
                <span className="block text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-505">
                  Parsed Ticket Log List
                </span>

                <div className="border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden max-h-72 overflow-y-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-gray-900/40 text-gray-450 text-[10px] font-bold uppercase tracking-wider border-b border-gray-100 dark:border-gray-800/80">
                        <th className="py-2.5 px-4 font-mono">Key</th>
                        <th className="py-2.5 px-4">Summary task</th>
                        <th className="py-2.5 px-4">Status</th>
                        <th className="py-2.5 px-4">Assignee</th>
                        <th className="py-2.5 px-4 text-center">Priority</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-105 dark:divide-gray-850/70 text-gray-755 dark:text-slate-350">
                      {result.tickets.map((t, idx) => (
                        <tr key={idx} className="hover:bg-gray-50/50 dark:hover:bg-slate-800/35">
                          <td className="py-3 px-4 font-mono font-bold text-gray-900 dark:text-white whitespace-nowrap">{t.key}</td>
                          <td className="py-3 px-4 font-medium leading-relaxed max-w-xs">{t.summary}</td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${
                              t.status === 'Completed' ? 'text-green-600 dark:text-green-450' :
                              t.status === 'In Progress' ? 'text-blue-600 dark:text-blue-450' :
                              'text-red-600 dark:text-red-450'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                t.status === 'Completed' ? 'bg-green-500' :
                                t.status === 'In Progress' ? 'bg-blue-500' :
                                'bg-red-500'
                              }`} />
                              {t.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-400 dark:text-gray-500 whitespace-nowrap font-medium">{t.assignee}</td>
                          <td className="py-3 px-4 text-center">
                            <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                              t.priority === 'High' ? 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400' :
                              t.priority === 'Medium' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400' :
                              'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400'
                            }`}>
                              {t.priority}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
