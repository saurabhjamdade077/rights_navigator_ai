import React, { useState } from 'react';
import { FileText, Copy, Check, Download, ExternalLink, HelpCircle, AlertCircle, ShieldAlert, Stamp } from 'lucide-react';

export default function RTIDraftCard({ rtiDraft }) {
  const [copied, setCopied] = useState(false);
  const [showFullDraft, setShowFullDraft] = useState(true);

  if (!rtiDraft) return null;

  if (!rtiDraft.is_applicable) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
        <div className="flex items-center gap-2.5 mb-2">
          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-300">
              3. Right to Information (RTI) Application
            </h2>
            <span className="text-xs text-slate-500">
              Direct RTI application is not primary for purely private counter-parties
            </span>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
          {rtiDraft.reason_for_applicability || 'RTI applications apply to Public Authorities (government departments, municipal corporations, public sector banks, utilities). If you require inspection of records from supervising government bodies, an RTI can be filed.'}
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
    <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 shadow-inner">
            <Stamp className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                3. Auto-Filled RTI Application Draft
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 uppercase tracking-wider">
                Section 6(1) Ready
              </span>
            </div>
            <p className="text-xs text-indigo-200/80">
              Formally request certified government records and civic accountability
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors border border-slate-700"
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
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors shadow-md shadow-indigo-500/20"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Target Authority Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1 font-medium">Addressed Public Authority:</span>
          <span className="font-semibold text-slate-200">
            {rtiDraft.public_authority_name || 'Competent Public Authority'}
          </span>
        </div>
        <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
          <span className="text-slate-400 block mb-1 font-medium">Designation of Officer:</span>
          <span className="font-semibold text-slate-200">
            {rtiDraft.public_information_officer_title || 'The Central / State Public Information Officer'}
          </span>
        </div>
      </div>

      {/* Questions Sought */}
      {rtiDraft.questions_sought && rtiDraft.questions_sought.length > 0 && (
        <div className="mb-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Specific Information Requested Under Section 6(1):
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800">
            {rtiDraft.questions_sought.map((q, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-indigo-400 font-bold">•</span>
                <span className="leading-relaxed">{q}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Complete Draft Preview */}
      {rtiDraft.sample_draft_text && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Complete Formatted RTI Application:
            </span>
          </div>
          <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto selection:bg-indigo-600">
            {rtiDraft.sample_draft_text}
          </div>
        </div>
      )}

      {/* Filing Instructions & Portal Link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 bg-indigo-950/30 rounded-xl border border-indigo-800/40 text-xs">
        <div className="space-y-0.5">
          <span className="font-bold text-indigo-300 block">Filing & Statutory Fee Guidelines:</span>
          <p className="text-indigo-200/80">
            Application fee is ₹10 (Free for BPL cardholders). The PIO is mandated under Section 7(1) to furnish certified replies within 30 days (or 48 hours for life & liberty).
          </p>
        </div>

        <a
          href={rtiDraft.portal_url || "https://rtionline.gov.in"}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg font-semibold transition-colors"
        >
          <span>Open RTI Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
