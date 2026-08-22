import React, { useState } from 'react';
import { Scale, CheckCircle2, BookOpen, AlertCircle, Copy, Check, Sparkles, ShieldCheck, Home, ShoppingBag, Briefcase, FileText } from 'lucide-react';

const CATEGORY_META = {
  tenant: { label: 'Tenant Dispute', icon: Home, color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  consumer: { label: 'Consumer Grievance', icon: ShoppingBag, color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  workplace: { label: 'Workplace & Employment', icon: Briefcase, color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  rti: { label: 'Right to Information', icon: FileText, color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  general: { label: 'Legal Rights', icon: Scale, color: 'text-slate-400 bg-slate-500/10 border-slate-500/30' }
};

export default function RightsAnalysisView({ analysis }) {
  const [copied, setCopied] = useState(false);

  if (!analysis) return null;

  const categoryInfo = CATEGORY_META[analysis.detected_category] || CATEGORY_META.general;
  const CategoryIcon = categoryInfo.icon;

  const handleCopySummary = () => {
    const rightsText = analysis.rights_explanation
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${categoryInfo.color}`}>
              <CategoryIcon className="w-3.5 h-3.5" />
              {categoryInfo.label}
            </span>
            <span className="text-xs text-slate-400">
              Provider: <span className="font-mono text-slate-300">{analysis.provider_used}</span>
            </span>
          </div>

          <button
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors border border-slate-700/60"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Analysis</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </>
            )}
          </button>
        </div>

        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
          Dispute Assessment
        </h3>
        <p className="text-base sm:text-lg text-slate-100 font-medium leading-relaxed">
          {analysis.summary}
        </p>
      </div>

      {/* 1) Plain-Language Explanation of Rights */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
              1. Your Legal Rights Explained in Plain Language
            </h2>
            <p className="text-xs text-slate-400">
              Statutory protections granted under Indian law for your dispute
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {analysis.rights_explanation.map((right, idx) => (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-800/90 hover:border-slate-700/80 rounded-xl p-4 sm:p-5 transition-all shadow-md group"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 text-xs font-bold font-mono">
                    {idx + 1}
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                    {right.title}
                  </h3>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono font-medium bg-blue-950 text-blue-300 border border-blue-800/60">
                    {right.act_citation}
                  </span>
                  {right.applicability && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300">
                      {right.applicability} Relevance
                    </span>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed pl-0 sm:pl-8">
                {right.explanation}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
