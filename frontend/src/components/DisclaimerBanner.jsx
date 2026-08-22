import React from 'react';
import { AlertTriangle, Info, Scale } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-lg px-4 py-2.5 flex items-center gap-3 text-xs text-amber-200/90 shadow-sm">
        <Scale className="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <span className="font-semibold text-amber-300">Legal Disclaimer:</span> Rights Navigator provides informational guidance on Indian statutory provisions. This does not constitute formal legal advice or substitute for a qualified advocate.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/60 border-y sm:border sm:rounded-xl border-amber-500/30 p-3.5 sm:p-4 text-xs sm:text-sm text-amber-200/95 shadow-md backdrop-blur">
      <div className="flex items-start gap-3">
        <div className="p-1.5 bg-amber-500/10 rounded-lg shrink-0 mt-0.5 border border-amber-500/20">
          <Scale className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-1">
          <div className="font-bold text-amber-300 flex items-center gap-2">
            <span>INFORMATIONAL LEGAL GUIDANCE DISCLAIMER</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono px-2 py-0.5 rounded-full border border-amber-500/30">
              Not Legal Advice
            </span>
          </div>
          <p className="text-amber-200/80 leading-relaxed text-xs">
            Rights Navigator is an automated citizen empowerment tool designed to explain Indian laws (Tenant, Consumer, Workplace & RTI) in plain language. Outputs are generated using local legal knowledge bases and LLM reasoning. For legal representation, filings before courts of law, or binding legal opinions, please consult an advocate enrolled with the Bar Council of India.
          </p>
        </div>
      </div>
    </div>
  );
}
