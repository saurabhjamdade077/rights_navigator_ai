import React, { useState } from 'react';
import { Scale, BookOpen, MessageSquare, Cpu, Image as ImageIcon, Sparkles, Sun, Moon, Shield } from 'lucide-react';

export const BACKGROUND_THEMES = [
  {
    id: 'scales',
    name: 'Scales of Justice',
    url: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=2000&q=80',
    description: 'Golden scales & legal codex books'
  },
  {
    id: 'courthouse',
    name: 'Supreme Pillars',
    url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&w=2000&q=80',
    description: 'Classical neoclassical judicial columns'
  },
  {
    id: 'library',
    name: 'Law Library',
    url: 'https://images.unsplash.com/photo-1453733197781-7040d701d855?auto=format&fit=crop&w=2000&q=80',
    description: 'Historic law reports and leather codices'
  },
  {
    id: 'gavel',
    name: 'Courtroom Gavel',
    url: 'https://images.unsplash.com/photo-1589994965851-a8f479c573a9?auto=format&fit=crop&w=2000&q=80',
    description: 'Judicial gavel & courtroom desk'
  }
];

export default function Navbar({
  activeTab,
  setActiveTab,
  providerStatus,
  currentBg,
  setCurrentBg,
  bgDimmer,
  setBgDimmer
}) {
  const [showThemeMenu, setShowThemeMenu] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-3 cursor-pointer group select-none"
            onClick={() => setActiveTab('navigator')}
          >
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 via-blue-600 to-indigo-700 p-0.5 shadow-lg shadow-amber-500/10 group-hover:shadow-amber-500/25 transition-all">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-amber-300 transition-colors">
                  Rights Navigator
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                  India
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <span>Citizen Legal Empowerment</span>
                <span>•</span>
                <span className="text-blue-400">Statutory AI</span>
              </p>
            </div>
          </div>

          {/* Center Tabs */}
          <nav className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setActiveTab('navigator')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'navigator'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Dispute Navigator</span>
            </button>

            <button
              onClick={() => setActiveTab('knowledge')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'knowledge'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Legal Knowledge Base</span>
            </button>
          </nav>

          {/* Right Controls: Background Theme Switcher & Provider Badge */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Background Theme Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowThemeMenu(!showThemeMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition-all shadow-sm"
                title="Change Legal Background Photo"
              >
                <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline font-medium">Laws Backdrop</span>
              </button>

              {showThemeMenu && (
                <div className="absolute right-0 mt-2 w-64 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-50 space-y-2 animate-fade-in backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs font-bold text-slate-300">
                    <span className="flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                      Law Photo Themes
                    </span>
                    <button
                      onClick={() => setShowThemeMenu(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {BACKGROUND_THEMES.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => {
                          setCurrentBg(theme.id);
                          setShowThemeMenu(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs text-left transition-all ${
                          currentBg === theme.id
                            ? 'bg-blue-600 text-white font-semibold shadow-sm'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div>
                          <div className="font-semibold">{theme.name}</div>
                          <div className={`text-[10px] ${currentBg === theme.id ? 'text-blue-100' : 'text-slate-400'}`}>
                            {theme.description}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Backdrop Dimmer Control */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Backdrop Opacity:</span>
                    <div className="flex items-center gap-1">
                      {['subtle', 'medium', 'vivid'].map((level) => (
                        <button
                          key={level}
                          onClick={() => setBgDimmer(level)}
                          className={`px-2 py-0.5 rounded text-[10px] capitalize transition-all ${
                            bgDimmer === level
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Provider Badge */}
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-xs">
              <Cpu className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-400">Model:</span>
              <span className="font-mono font-medium text-emerald-300">
                {providerStatus?.active_client || providerStatus?.llm_provider || 'Gemini / Statutory RAG'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
