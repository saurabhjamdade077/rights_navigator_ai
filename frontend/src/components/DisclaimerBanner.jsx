import React from 'react';
import { AlertTriangle, Info, Scale, ShieldAlert } from 'lucide-react';

export default function DisclaimerBanner({ compact = false }) {
  if (compact) {
    return (
      <div className="bg-amber-950/40 border border-amber-500/30 rounded-xl px-4 py-2.5 flex items-center gap-3 text-xs text-amber-200/90 shadow-sm backdrop-blur-sm">
        <Scale className="w-4 h-4 text-amber-400 shrink-0" />
        <div>
          <span className="font-bold text-amber-300">Legal Disclaimer:</span> Rights Navigator provides educational statutory guidance under Indian Law (Model Tenancy Act, CPA 2019, Payment of Wages, RTI 2005). This is not formal legal advice or advocate representation.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-amber-950/60 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-xs sm:text-sm text-amber-200/95 shadow-xl backdrop-blur-md">
      <div className="flex items-start gap-3.5">
        <div className="p-2 bg-amber-500/15 rounded-xl shrink-0 mt-0.5 border border-amber-500/30">
          <Scale className="w-5 h-5 text-amber-400" />
        </div>
        <div className="space-y-1.5">
          <div className="font-extrabold text-amber-300 flex items-center gap-2 tracking-wide">
            <span>INFORMATIONAL STATUTORY GUIDANCE DISCLAIMER</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 font-mono font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">
              Educational Public Good
            </span>
          </div>
          <p className="text-amber-200/80 leading-relaxed text-xs">
            Rights Navigator is an automated citizen empowerment platform designed to translate Indian statutory provisions into plain language and actionable roadmaps. Outputs are grounded on codified acts and local knowledge bases. For court filings, formal pleadings, or binding legal representation, please consult an advocate enrolled with the Bar Council of India.
          </p>
        </div>
      </div>
    </div>
  );
}
