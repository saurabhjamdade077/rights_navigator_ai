import React, { useState, useEffect } from 'react';
import { BookOpen, Search, Home, ShoppingBag, Briefcase, FileText, Scale, Loader2, Sparkles } from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Laws', icon: Scale },
  { id: 'tenant', label: 'Tenant Law', icon: Home },
  { id: 'consumer', label: 'Consumer Protection', icon: ShoppingBag },
  { id: 'workplace', label: 'Workplace & Labour', icon: Briefcase },
  { id: 'rti', label: 'RTI Act 2005', icon: FileText },
];

export default function KnowledgeExplorer({ onSelectScenario }) {
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
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400 border border-blue-500/20">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Indian Legal Knowledge Base
            </h1>
            <p className="text-xs text-slate-400">
              Curated statutory provisions, rules, and remedies stored locally under <code className="text-blue-300 font-mono">/data</code>
            </p>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by act, section, topic, or keyword (e.g. deposit, refund, termination, PIO)..."
              className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {CATEGORY_TABS.map((tab) => {
              const Icon = tab.icon;
              const isSelected = selectedTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
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
        <div className="flex flex-col items-center justify-center py-16 text-slate-400 space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <span className="text-sm">Loading Indian legal repository...</span>
        </div>
      ) : filteredProvisions.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800 text-slate-400 text-sm">
          No legal provisions found matching your search.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProvisions.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900/90 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-3 transition-all"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {item.category}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md font-mono text-[11px] font-medium bg-slate-950 text-slate-300 border border-slate-800">
                    {item.act} ({item.section})
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white mb-2">
                  {item.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  {item.summary}
                </p>

                {item.key_provisions && item.key_provisions.length > 0 && (
                  <div className="space-y-1 mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Statutory Safeguards:
                    </span>
                    <ul className="space-y-1 text-xs text-slate-300">
                      {item.key_provisions.map((p, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-blue-400 font-bold">•</span>
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {item.remedy && (
                <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/80 text-xs text-emerald-300">
                  <span className="font-semibold text-emerald-400 block mb-0.5">Enforcement / Remedy:</span>
                  <p className="text-slate-300">{item.remedy}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
