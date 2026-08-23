import React, { useState } from 'react';
import { Send, Sparkles, Home, ShoppingBag, Briefcase, FileText, ArrowRight, Loader2, Scale, Shield, CheckCircle } from 'lucide-react';

const CATEGORIES = [
  { id: 'auto', label: 'Auto-Detect Legal Domain', icon: Sparkles, color: 'from-blue-600 to-indigo-600' },
  { id: 'tenant', label: 'Tenant Rights (Rent/Deposit)', icon: Home, color: 'from-amber-600 to-amber-700' },
  { id: 'consumer', label: 'Consumer Grievance & Refunds', icon: ShoppingBag, color: 'from-emerald-600 to-teal-700' },
  { id: 'workplace', label: 'Workplace & Salary FnF', icon: Briefcase, color: 'from-purple-600 to-indigo-700' },
  { id: 'rti', label: 'RTI Act 2005 Application', icon: FileText, color: 'from-sky-600 to-blue-700' },
];

const TEMPLATE_PROMPTS = [
  {
    category: 'tenant',
    title: 'Unreturned Security Deposit & False Painting Deduction',
    lawBadge: 'Model Tenancy Act §13',
    badge: 'Tenant Dispute',
    prompt: 'My landlord in Bangalore is refusing to return my security deposit of ₹65,000 even though I gave 1 month notice and vacated the flat peacefully on 1st of this month. He is claiming false painting charges without receipts.'
  },
  {
    category: 'consumer',
    title: 'Defective E-Commerce Product & Refused Refund',
    lawBadge: 'CPA 2019 §35 & §84',
    badge: 'Consumer Grievance',
    prompt: 'I purchased a 43-inch Smart TV from an e-commerce platform for ₹28,000. It stopped turning on within 4 days of delivery. Customer support says replacement policy is over and is refusing a refund or technician visit.'
  },
  {
    category: 'workplace',
    title: 'Withheld Final Settlement Salary & Relieving Letter',
    lawBadge: 'Payment of Wages Act §15',
    badge: 'Workplace Issue',
    prompt: 'I resigned from my software company in Hyderabad after serving the full 30 days notice period. It has been 45 days since my last working day, but they have withheld my final month salary of ₹55,000 and refuse to issue my relieving and experience letter.'
  },
  {
    category: 'rti',
    title: 'Incomplete Municipal Road Repair & Public Tender Enquiry',
    lawBadge: 'RTI Act 2005 §6(1)',
    badge: 'Civic Accountability',
    prompt: 'Our local municipal corporation dug up the main colony road for drainage 7 months ago and abandoned the work. It is causing severe accidents and dust. I need the contractor details, sanctioned budget, and completion timeline under RTI Act.'
  }
];

export default function DisputeForm({ onSubmit, loading, initialText = '', onCategorySelect }) {
  const [text, setText] = useState(initialText);
  const [selectedCategory, setSelectedCategory] = useState('auto');

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!text.trim() || loading) return;
    onSubmit(text.trim(), selectedCategory);
  };

  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleSubmit();
    }
  };

  const selectTemplate = (template) => {
    setText(template.prompt);
    setSelectedCategory(template.category);
  };

  return (
    <div className="glass-panel-elevated rounded-3xl p-5 sm:p-8 shadow-2xl relative overflow-hidden border border-slate-700/60">
      {/* Decorative top accent line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />

      {/* Category Pills */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2.5">
          <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Select Legal Domain</span>
          </label>
          <span className="text-[11px] text-slate-400">
            Select specific domain or let AI auto-detect
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 p-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/25 border border-blue-400/40 ring-2 ring-blue-500/20'
                    : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                <div className={`p-1 rounded-lg ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="truncate">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            rows={5}
            placeholder="Describe your dispute in plain language (e.g. 'My landlord refuses to return my ₹50,000 security deposit after vacating flat', 'E-commerce seller delivered broken monitor and denied refund', 'Employer is withholding last month salary & experience letter')..."
            className="w-full bg-slate-950/80 border border-slate-700/80 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 rounded-2xl p-4 sm:p-5 text-sm sm:text-base text-slate-100 placeholder-slate-500 outline-none transition-all resize-y min-h-[130px] font-sans leading-relaxed shadow-inner"
            disabled={loading}
          />
          <div className="flex items-center justify-between mt-1.5 text-[11px] text-slate-400 px-1">
            <span className="flex items-center gap-1">
              Press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-300 font-mono text-[10px]">Enter</kbd> to analyze
            </span>
            <span className={text.length > 50 ? 'text-amber-400/90 font-medium' : ''}>
              {text.length} characters
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Scale className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              Directly cross-referenced with Indian Acts, Statutory Rules & RTI Provisions
            </span>
          </div>

          <button
            type="submit"
            disabled={!text.trim() || loading}
            className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-500 via-amber-600 to-blue-600 hover:from-amber-400 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm rounded-xl shadow-xl shadow-amber-500/20 hover:shadow-amber-500/35 flex items-center justify-center gap-2.5 transition-all transform hover:-translate-y-0.5"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Evaluating Indian Laws & Precedents...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Analyze My Legal Rights</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Quick Example Scenarios */}
      <div className="mt-8 pt-6 border-t border-slate-800/80">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Example Scenarios (Click to Load)
          </span>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Real-world Indian citizen disputes
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {TEMPLATE_PROMPTS.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => selectTemplate(t)}
              className="text-left p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/40 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="flex items-center justify-between mb-1.5 gap-2">
                <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors line-clamp-1">
                  {t.title}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-950 text-blue-300 border border-blue-900/60 shrink-0">
                  {t.lawBadge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                {t.prompt}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
