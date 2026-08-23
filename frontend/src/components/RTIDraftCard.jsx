import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  HelpCircle,
  AlertCircle,
  ShieldAlert,
  Stamp,
  Scale,
  ShieldCheck
} from 'lucide-react';

export default function RTIDraftCard({ rtiDraft }) {
  const [copied, setCopied] = useState(false);

  if (!rtiDraft) return null;

  if (!rtiDraft.is_applicable) {
    return (
      <div className="glass-panel rounded-3xl p-6 shadow-xl border border-slate-800">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-200">
              3. Right to Information (RTI Act 2005) Guidance
            </h2>
            <span className="text-xs text-slate-400">
              Direct RTI is reserved for Public Authorities (Government, Municipalities, Regulators)
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans mt-2">
          {rtiDraft.reason_for_applicability ||
            'Direct RTI applications apply against Public Authorities (government departments, municipal corporations, public utilities). For disputes with private entities, an RTI can be directed to the overseeing government regulator or licensing board.'}
        </p>
      </div>
    );
  }

  const handleCopy = () => {
    if (!rtiDraft.sample_draft_text) return;
    navigator.clipboard.writeText(rtiDraft.sample_draft_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!rtiDraft.sample_draft_text) return;
    const element = document.createElement('a');
    const file = new Blob([rtiDraft.sample_draft_text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `RTI_Application_Section_6_1_${Date.now()}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-blue-500/30">
      {/* Decorative top blue/amber line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/30 shadow-inner">
            <Stamp className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
                3. Auto-Filled RTI Application Draft
              </h2>
              <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 uppercase tracking-wider">
                Section 6(1) Ready
              </span>
            </div>
            <p className="text-xs text-blue-200/80 mt-0.5">
              Statutory request for certified government records, files, and inspection
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-700 shadow-sm"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied Draft</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Draft</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/25"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Target Authority Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-5 text-xs">
        <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 shadow-inner">
          <span className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">
            Target Public Authority:
          </span>
          <span className="font-semibold text-slate-100 text-sm">
            {rtiDraft.public_authority_name || 'Competent Public Authority'}
          </span>
        </div>
        <div className="p-3.5 bg-slate-950/70 rounded-2xl border border-slate-800 shadow-inner">
          <span className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">
            Designated Officer:
          </span>
          <span className="font-semibold text-slate-100 text-sm">
            {rtiDraft.public_information_officer_title || 'The Central / State Public Information Officer (PIO)'}
          </span>
        </div>
      </div>

      {/* Questions Sought */}
      {rtiDraft.questions_sought && rtiDraft.questions_sought.length > 0 && (
        <div className="mb-5">
          <h4 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" />
            Specific Information Requested Under Section 6(1):
          </h4>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-200 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            {rtiDraft.questions_sought.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-blue-400 font-extrabold font-mono">{idx + 1}.</span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Complete Draft Preview */}
      {rtiDraft.sample_draft_text && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Complete Formatted RTI Application:
            </span>
          </div>
          <div className="p-4 sm:p-5 bg-slate-950 rounded-2xl border border-slate-800 font-mono text-xs text-slate-200 whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto selection:bg-blue-600 shadow-inner">
            {rtiDraft.sample_draft_text}
          </div>
        </div>
      )}

      {/* Statutory Guidelines & Link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-gradient-to-r from-blue-950/40 via-indigo-950/30 to-blue-950/40 rounded-2xl border border-blue-800/40 text-xs shadow-md">
        <div className="space-y-1">
          <span className="font-bold text-blue-300 block flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Statutory RTI Filing Fee & 30-Day Mandate:
          </span>
          <p className="text-blue-200/80 leading-relaxed">
            Application fee is ₹10 (Exempt for BPL cardholders). The PIO is legally mandated under Section 7(1) to furnish certified answers within 30 days (or 48 hours for life & liberty).
          </p>
        </div>

        <a
          href={rtiDraft.portal_url || "https://rtionline.gov.in"}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all shadow-md shadow-blue-500/20"
        >
          <span>Open RTI Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
