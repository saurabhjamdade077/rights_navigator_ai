import React, { useState } from 'react';
import {
  Scale,
  CheckCircle2,
  BookOpen,
  AlertCircle,
  Copy,
  Check,
  Sparkles,
  ShieldCheck,
  Home,
  ShoppingBag,
  Briefcase,
  FileText,
  Shield
} from 'lucide-react';

const CATEGORY_META = {
  tenant: { label: 'Tenant Rights & Housing', icon: Home, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  consumer: { label: 'Consumer Protection', icon: ShoppingBag, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  workplace: { label: 'Workplace & Labour', icon: Briefcase, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  rti: { label: 'Right to Information', icon: FileText, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  general: { label: 'Indian Statutory Rights', icon: Scale, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
};

export default function RightsAnalysisView({ analysis }) {
  const [copied, setCopied] = useState(false);

  if (!analysis) return null;

  const categoryInfo = CATEGORY_META[analysis.detected_category] || CATEGORY_META.general;
  const CategoryIcon = categoryInfo.icon;

  const handleCopySummary = () => {
    const rightsText = (analysis.rights_explanation || [])
      .map(r => `• ${r.title} (${r.act_citation}):\n  ${r.explanation}`)
      .join('\n\n');
    
    const textToCopy = `RIGHTS NAVIGATOR ANALYSIS:\n\nSummary:\n${analysis.summary}\n\nApplicable Legal Rights:\n${rightsText}\n\nDisclaimer: Informational guidance only under Indian law.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Summary Card */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-700/60">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${categoryInfo.color}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {categoryInfo.label}
            </span>
            <span className="text-xs text-slate-400">
              Provider: <span className="font-mono text-slate-200">{analysis.provider_used}</span>
            </span>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800/90 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold transition-all border border-slate-600 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Summary</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5" />
          Dispute Assessment & Statutory Grounding
        </h3>
        <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed font-sans">
          {analysis.summary}
        </p>
      </div>

      {/* 1) Plain-Language Explanation of Rights */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-inner">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              1. Your Legal Rights Explained in Plain Language
            </h2>
            <p className="text-xs text-slate-400">
              Statutory protections granted under Indian law for your specific dispute
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {analysis.rights_explanation?.map((right, idx) => (
            <div
              key={idx}
              className="glass-panel hover:bg-slate-900/90 rounded-2xl p-5 sm:p-6 transition-all shadow-md border border-slate-700/60 group hover:border-amber-500/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-7 h-7 rounded-xl bg-amber-500/15 text-amber-400 text-xs font-extrabold font-mono border border-amber-500/30 shrink-0">
                    {idx + 1}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                    {right.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="px-3 py-1 rounded-lg text-xs font-mono font-bold bg-slate-950 text-blue-300 border border-blue-800/60 shadow-sm">
                    {right.act_citation}
                  </span>
                  {right.applicability && (
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-extrabold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                      {right.applicability}
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed pl-0 sm:pl-10">
                {right.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
