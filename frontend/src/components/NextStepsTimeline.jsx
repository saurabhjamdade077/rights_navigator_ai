import React, { useState } from 'react';
import {
  ArrowRight,
  CheckCircle,
  Clock,
  Send,
  FileText,
  Building2,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Download
} from 'lucide-react';

const ACTION_TYPE_STYLES = {
  Notice: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  'Grievance Portal': 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  'Authority Filing': 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  'Evidence Gathering': 'bg-purple-500/15 text-purple-300 border-purple-500/30',
  default: 'bg-slate-800 text-slate-300 border-slate-700'
};

export default function NextStepsTimeline({ nextSteps }) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [expandedDrafts, setExpandedDrafts] = useState({});

  if (!nextSteps || nextSteps.length === 0) return null;

  const toggleDraft = (idx) => {
    setExpandedDrafts(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const handleCopyDraft = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const handleDownloadDraft = (text, title) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${title.replace(/\s+/g, '_')}_Draft_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-inner">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            2. Concrete Actionable Next Steps
          </h2>
          <p className="text-xs text-slate-400">
            Step-by-step enforcement roadmap to resolve your grievance without immediate costly litigation
          </p>
        </div>
      </div>

      <div className="space-y-5 relative before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-gradient-to-b before:from-emerald-500/60 before:via-blue-500/40 before:to-slate-800 before:pointer-events-none">
        {nextSteps.map((step, idx) => {
          const actionStyle = ACTION_TYPE_STYLES[step.action_type] || ACTION_TYPE_STYLES.default;
          const isDraftExpanded = expandedDrafts[idx];

          return (
            <div
              key={idx}
              className="relative pl-10 sm:pl-12 group"
            >
              {/* Timeline marker */}
              <div className="absolute left-1 sm:left-2 top-4 w-7 h-7 sm:w-7 sm:h-7 rounded-xl bg-slate-900 border-2 border-emerald-400 text-emerald-300 flex items-center justify-center font-extrabold text-xs shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                {step.step_number || idx + 1}
              </div>

              {/* Step Card */}
              <div className="glass-panel hover:bg-slate-900/90 rounded-2xl p-5 sm:p-6 transition-all shadow-md border border-slate-700/60 group-hover:border-emerald-500/40">
                <div className="flex flex-wrap items-center justify-between gap-2.5 mb-2.5">
                  <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {step.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${actionStyle}`}>
                      {step.action_type}
                    </span>
                    {step.timeline && (
                      <span className="flex items-center gap-1 text-xs text-slate-300 bg-slate-950/80 px-2.5 py-0.5 rounded-md border border-slate-800 font-medium">
                        <Clock className="w-3 h-3 text-amber-400" />
                        {step.timeline}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed mb-3.5 font-sans">
                  {step.description}
                </p>

                {/* Target Authority Info */}
                {step.authority_or_platform && (
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-blue-300 bg-blue-950/50 border border-blue-800/40 rounded-xl px-3.5 py-2.5 mb-3.5 shadow-inner">
                    <Building2 className="w-4 h-4 shrink-0 text-blue-400" />
                    <span><strong>Competent Authority / Forum:</strong> {step.authority_or_platform}</span>
                  </div>
                )}

                {/* Draft Template Section */}
                {step.draft_template && (
                  <div className="mt-3.5 pt-3.5 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleDraft(idx)}
                        className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <FileText className="w-4 h-4" />
                        <span>{isDraftExpanded ? 'Hide Notice Template' : 'View Sample Demand Notice Template'}</span>
                        {isDraftExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {isDraftExpanded && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopyDraft(step.draft_template, idx)}
                            className="flex items-center gap-1 text-xs text-slate-200 hover:text-white px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
                          >
                            {copiedIndex === idx ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Text</span>
                              </>
                            )}
                          </button>

                          <button
                            onClick={() => handleDownloadDraft(step.draft_template, step.title)}
                            className="flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200 px-2.5 py-1 bg-emerald-950/80 hover:bg-emerald-900/80 rounded-lg transition-colors border border-emerald-800/60"
                          >
                            <Download className="w-3 h-3" />
                            <span>Save .txt</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {isDraftExpanded && (
                      <div className="mt-3 p-4 bg-slate-950/90 rounded-xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed shadow-inner selection:bg-emerald-600">
                        {step.draft_template}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
