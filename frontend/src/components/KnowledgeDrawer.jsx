import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Tag, Scale } from 'lucide-react';

export default function KnowledgeDrawer({ provisions }) {
  const [expanded, setExpanded] = useState(false);

  if (!provisions || provisions.length === 0) return null;

  return (
    <div className="glass-panel rounded-3xl p-5 sm:p-6 transition-all border border-slate-700/60 shadow-xl">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
              Retrieved Statutory Sections from Local Knowledge Base ({provisions.length})
            </h3>
            <p className="text-xs text-slate-400">
              Verified legal codices & sections referenced directly from <code className="text-amber-300 font-mono">/data</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-400 font-semibold hidden sm:inline">
            {expanded ? 'Hide Source Sections' : 'View Source Sections'}
          </span>
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-white" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-white" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-5 pt-5 border-t border-slate-800 space-y-4">
          {provisions.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-950/80 rounded-2xl p-4 sm:p-5 border border-slate-800 text-xs space-y-2.5 shadow-inner"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-100 text-sm">
                  {item.title}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-950 text-blue-300 font-mono text-xs border border-blue-800/50">
                  {item.act} ({item.section})
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed text-xs sm:text-sm">
                {item.summary}
              </p>

              {item.key_provisions && item.key_provisions.length > 0 && (
                <div className="pt-2.5 border-t border-slate-800/60">
                  <span className="text-amber-400 font-bold block mb-1">Key Statutory Rules:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                    {item.key_provisions.map((kp, kIdx) => (
                      <li key={kIdx}>{kp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.remedy && (
                <div className="pt-2.5 border-t border-slate-800/60 text-emerald-300">
                  <span className="font-bold text-emerald-400">Statutory Remedy: </span>
                  {item.remedy}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
