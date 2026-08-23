import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Home, ShoppingBag, Briefcase, FileText, Scale, Loader2, Sparkles, Shield, Bookmark } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Laws', icon: Scale },
  { id: 'tenant', label: 'Tenant Law', icon: Home },
  { id: 'consumer', label: 'Consumer Protection', icon: ShoppingBag },
  { id: 'workplace', label: 'Workplace & Labour', icon: Briefcase },
  { id: 'rti', label: 'RTI Act 2005', icon: FileText },
];

export default function KnowledgeExplorer() {
  const [provisions, setProvisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const fetchKnowledge = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/knowledge');
      const data = await res.json();
      setProvisions(data);
    } catch (err) {
      console.error('Failed to load knowledge base:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProvisions = provisions.filter((item) => {
    const matchesCategory = selectedTab === 'all' || item.category === selectedTab;
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.title?.toLowerCase().includes(search) ||
      item.summary?.toLowerCase().includes(search) ||
      item.act?.toLowerCase().includes(search) ||
      item.section?.toLowerCase().includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel-elevated rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-700/60">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2.5 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/30 shadow-inner">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Indian Legal Knowledge Base
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Curated statutory codices, rules, and enforceable citizen remedies stored locally under <code className="text-amber-300 font-mono">/data</code>
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-6 flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by act, section, topic, or keyword (e.g. deposit, refund, termination, PIO)..."
              className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 rounded-2xl pl-11 pr-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cards List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
          <span className="text-sm font-medium">Loading Indian legal repository...</span>
        </div>
      ) : filteredProvisions.length === 0 ? (
        <div className="text-center py-16 glass-panel rounded-3xl border border-slate-800 text-slate-400 text-sm">
          No legal provisions found matching your search term.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {filteredProvisions.map((item) => (
            <div
              key={item.id}
              className="glass-panel hover:bg-slate-900/95 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4 transition-all border border-slate-700/60 hover:border-amber-500/40 group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/30">
                    {item.category}
                  </span>
                  <span className="px-3 py-1 rounded-lg font-mono text-xs font-bold bg-slate-950 text-blue-300 border border-blue-900/60 shadow-sm">
                    {item.act} ({item.section})
                  </span>
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-300 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3 font-sans">
                  {item.summary}
                </p>

                {item.key_provisions && item.key_provisions.length > 0 && (
                  <div className="space-y-1.5 mb-3 bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800">
                    <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block flex items-center gap-1.5">
                      <Bookmark className="w-3.5 h-3.5" />
                      Statutory Safeguards:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300 pl-1">
                      {item.key_provisions.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-amber-400 font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {item.remedy && (
                <div className="p-3.5 bg-emerald-950/40 rounded-2xl border border-emerald-800/40 text-xs text-emerald-300 shadow-inner">
                  <span className="font-bold text-emerald-400 block mb-0.5">Enforcement / Remedy:</span>
                  <p className="text-emerald-200/90">{item.remedy}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
