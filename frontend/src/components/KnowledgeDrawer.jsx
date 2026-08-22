import React, { useState } from 'react';
import { BookOpen, ChevronDown, ChevronUp, ExternalLink, ShieldCheck, Tag } from 'lucide-react';

export default function KnowledgeDrawer({ provisions }) {
  const [expanded, setExpanded] = useState(false);

  if (!provisions || provisions.length === 0) return null;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 sm:p-5 transition-all">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between text-left group"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-200 group-hover:text-blue-300 transition-colors">
              Retrieved Statutory Sections from Local Knowledge Base ({provisions.length})
            </h3>
            <p className="text-[11px] text-slate-400">
              Exact statutory sections extracted from /data knowledge base used to evaluate your dispute
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-400 font-medium hidden sm:inline">
            {expanded ? 'Hide Source Sections' : 'View Source Sections'}
          </span>
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-slate-400 group-hover:text-white" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-white" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-800 space-y-3.5">
          {provisions.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 text-xs space-y-2"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-100 text-sm">
                  {item.title}
                </span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 font-mono text-[11px] border border-blue-800/40">
                  {item.act} ({item.section})
                </span>
              </div>

              <p className="text-slate-300 leading-relaxed">
                {item.summary}
              </p>

              {item.key_provisions && item.key_provisions.length > 0 && (
                <div className="pt-2 border-t border-slate-800/50">
                  <span className="text-slate-400 font-semibold block mb-1">Key Statutory Rules:</span>
                  <ul className="list-disc list-inside space-y-1 text-slate-300 pl-1">
                    {item.key_provisions.map((kp, kIdx) => (
                      <li key={kIdx}>{kp}</li>
                    ))}
                  </ul>
                </div>
              )}

              {item.remedy && (
                <div className="pt-2 border-t border-slate-800/50 text-emerald-300/90">
                  <span className="font-semibold text-emerald-400">Statutory Remedy: </span>
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
