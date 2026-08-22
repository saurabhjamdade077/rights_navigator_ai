import React, { useState } from 'react';
import { ArrowRight, CheckCircle, Clock, Send, FileText, Building2, Copy, Check, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';

const ACTION_TYPE_STYLES = {
  Notice: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  'Grievance Portal': 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  'Authority Filing': 'bg-blue-500/10 text-blue-300 border-blue-500/30',
  'Evidence Gathering': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
  default: 'bg-slate-800 text-slate-300 border-slate-700'
};

export default function NextStepsTimeline({ nextSteps, onOpenNoticeModal }) {
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

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <CheckCircle className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            2. Concrete Actionable Next Steps
          </h2>
          <p className="text-xs text-slate-400">
            Step-by-step roadmap to resolve your grievance and enforce your statutory rights
          </p>
        </div>
      </div>

      <div className="space-y-4 relative before:absolute before:inset-0 before:left-4 sm:before:left-5 before:w-0.5 before:bg-slate-800 before:pointer-events-none">
        {nextSteps.map((step, idx) => {
          const actionStyle = ACTION_TYPE_STYLES[step.action_type] || ACTION_TYPE_STYLES.default;
          const isDraftExpanded = expandedDrafts[idx];

          return (
            <div
              key={idx}
              className="relative pl-10 sm:pl-12 group"
            >
              {/* Timeline marker */}
              <div className="absolute left-1 sm:left-2 top-4 w-7 h-7 sm:w-7 sm:h-7 rounded-full bg-slate-900 border-2 border-emerald-500/60 text-emerald-400 flex items-center justify-center font-bold text-xs shadow-md">
                {step.step_number || idx + 1}
              </div>

              {/* Step Card */}
              <div className="bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl p-4 sm:p-5 transition-all shadow-md">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                    {step.title}
                  </h3>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${actionStyle}`}>
                      {step.action_type}
                    </span>
                    {step.timeline && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.timeline}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-3">
                  {step.description}
                </p>

                {/* Target Authority Info */}
                {step.authority_or_platform && (
                  <div className="flex items-center gap-2 text-xs text-blue-400 bg-blue-950/40 border border-blue-900/40 rounded-lg px-3 py-2 mb-3">
                    <Building2 className="w-4 h-4 shrink-0 text-blue-400" />
                    <span><strong>Authority / Forum:</strong> {step.authority_or_platform}</span>
                  </div>
                )}

                {/* Draft Template Snippet */}
                {step.draft_template && (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => toggleDraft(idx)}
                        className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{isDraftExpanded ? 'Hide Notice Template' : 'View Sample Demand Notice Template'}</span>
                        {isDraftExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {isDraftExpanded && (
                        <button
                          onClick={() => handleCopyDraft(step.draft_template, idx)}
                          className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2 py-1 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
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
                      )}
                    </div>

                    {isDraftExpanded && (
                      <div className="mt-2.5 p-3.5 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed">
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
