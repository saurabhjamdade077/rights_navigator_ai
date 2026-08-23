import React, { useState, useEffect } from 'react';
import Navbar, { BACKGROUND_THEMES } from './components/Navbar.jsx';
import DisclaimerBanner from './components/DisclaimerBanner.jsx';
import DisputeForm from './components/DisputeForm.jsx';
import RightsAnalysisView from './components/RightsAnalysisView.jsx';
import NextStepsTimeline from './components/NextStepsTimeline.jsx';
import RTIDraftCard from './components/RTIDraftCard.jsx';
import KnowledgeDrawer from './components/KnowledgeDrawer.jsx';
import FollowUpChat from './components/FollowUpChat.jsx';
import KnowledgeExplorer from './components/KnowledgeExplorer.jsx';
import {
  Scale,
  RefreshCw,
  AlertCircle,
  Sparkles,
  Shield,
  Home,
  ShoppingBag,
  Briefcase,
  FileText,
  CheckCircle2,
  BookOpen,
  ArrowRight
} from 'lucide-react';

const DOMAIN_CARDS = [
  {
    id: 'tenant',
    title: 'Tenant & Housing Rights',
    subtitle: 'Security Deposits & Unlawful Evictions',
    act: 'Model Tenancy Act §13 & §21',
    icon: Home,
    color: 'from-amber-500/20 to-amber-900/10 border-amber-500/30 text-amber-300',
    sample: 'My landlord refuses to return my security deposit after 1 month notice.'
  },
  {
    id: 'consumer',
    title: 'Consumer Protection',
    subtitle: 'Defective Goods, Fake Ads & Refunds',
    act: 'Consumer Protection Act 2019',
    icon: ShoppingBag,
    color: 'from-emerald-500/20 to-emerald-900/10 border-emerald-500/30 text-emerald-300',
    sample: 'E-commerce platform delivered a defective appliance and refused replacement.'
  },
  {
    id: 'workplace',
    title: 'Workplace & Salary Rights',
    subtitle: 'Unpaid Wages, Notice Period & FnF',
    act: 'Payment of Wages Act §15',
    icon: Briefcase,
    color: 'from-purple-500/20 to-purple-900/10 border-purple-500/30 text-purple-300',
    sample: 'Company withheld my final settlement salary and relieving letter.'
  },
  {
    id: 'rti',
    title: 'RTI & Civic Accountability',
    subtitle: 'Government Transparency & Tenders',
    act: 'RTI Act 2005 §6(1)',
    icon: FileText,
    color: 'from-blue-500/20 to-blue-900/10 border-blue-500/30 text-blue-300',
    sample: 'Municipal corporation abandoned road repairs. Need contractor & budget details.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('navigator');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [providerStatus, setProviderStatus] = useState(null);
  const [currentDisputeText, setCurrentDisputeText] = useState('');
  const [currentBg, setCurrentBg] = useState('scales');
  const [bgDimmer, setBgDimmer] = useState('medium');

  useEffect(() => {
    fetchHealthStatus();
  }, []);

  const fetchHealthStatus = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setProviderStatus(data);
      }
    } catch (err) {
      console.warn('Backend not yet reachable:', err);
    }
  };

  const handleAnalyzeDispute = async (text, category) => {
    setLoading(true);
    setError(null);
    setCurrentDisputeText(text);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispute_text: text,
          category: category
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || 'Analysis request failed.');
      }

      const data = await res.json();
      setAnalysis(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing your dispute.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setCurrentDisputeText('');
  };

  const handleDomainCardClick = (sampleText) => {
    setCurrentDisputeText(sampleText);
    window.scrollTo({ top: 380, behavior: 'smooth' });
  };

  // Determine current background URL and dimming opacity
  const activeBgTheme = BACKGROUND_THEMES.find(t => t.id === currentBg) || BACKGROUND_THEMES[0];
  
  const dimmerOverlayClass = {
    subtle: 'bg-slate-950/70 backdrop-blur-[2px]',
    medium: 'bg-slate-950/85 backdrop-blur-[3px]',
    vivid: 'bg-slate-950/60 backdrop-blur-[1px]',
  }[bgDimmer] || 'bg-slate-950/85 backdrop-blur-[3px]';

  return (
    <div className="min-h-screen relative flex flex-col text-slate-100 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Law Photo Layer */}
      <div
        className="fixed inset-0 pointer-events-none z-0 transition-all duration-700 ease-in-out bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${activeBgTheme.url}')`,
        }}
      >
        {/* Dynamic Dark Gradient & Glass Overlay */}
        <div className={`absolute inset-0 transition-colors duration-500 ${dimmerOverlayClass}`}>
          {/* Subtle Ambient Radial Lighting */}
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />
        </div>
      </div>

      {/* Content wrapper on top of the background */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Top Disclaimer Banner */}
        <div className="bg-amber-950/70 border-b border-amber-500/30 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <DisclaimerBanner compact />
          </div>
        </div>

        {/* Main Navbar with Law Theme Switcher */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          providerStatus={providerStatus}
          currentBg={currentBg}
          setCurrentBg={setCurrentBg}
          bgDimmer={bgDimmer}
          setBgDimmer={setBgDimmer}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
          {activeTab === 'knowledge' ? (
            <KnowledgeExplorer />
          ) : (
            <div className="space-y-8">
              {/* Hero Header Section */}
              {!analysis && (
                <div className="text-center max-w-4xl mx-auto space-y-4 py-6 sm:py-8">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-amber-300 border border-amber-500/30 text-xs font-semibold shadow-lg shadow-amber-500/10">
                    <Scale className="w-4 h-4 text-amber-400" />
                    <span>Indian Citizen Legal Empowerment & RTI Navigation</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                    Know Your Rights Under{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-blue-400">
                      Indian Law
                    </span>
                  </h1>

                  <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
                    Plain-language statutory guidance for tenant deposits, consumer refunds, workplace salaries, and RTI civic applications. Powered by statutory knowledge bases and AI reasoning.
                  </p>

                  {/* 4 Core Legal Domain Badges */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 text-left">
                    {DOMAIN_CARDS.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div
                          key={card.id}
                          onClick={() => handleDomainCardClick(card.sample)}
                          className={`p-4 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border ${card.color} transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-md group`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="p-2 rounded-xl bg-slate-950/80 border border-slate-800 text-amber-400 group-hover:scale-105 transition-transform">
                              <Icon className="w-4 h-4" />
                            </div>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-950/90 text-slate-300 border border-slate-800">
                              {card.act}
                            </span>
                          </div>
                          <h3 className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                            {card.title}
                          </h3>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            {card.subtitle}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <div className="p-4 bg-red-950/70 border border-red-500/40 rounded-2xl text-red-200 text-sm flex items-start gap-3 shadow-xl backdrop-blur-md">
                  <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="font-bold text-red-300">Analysis Error</div>
                    <div className="text-xs sm:text-sm text-red-200/90 mt-0.5">{error}</div>
                  </div>
                  <button
                    onClick={() => setError(null)}
                    className="text-xs text-red-300 hover:text-white underline font-semibold"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Dispute Input Section */}
              {!analysis && (
                <DisputeForm
                  onSubmit={handleAnalyzeDispute}
                  loading={loading}
                  initialText={currentDisputeText}
                />
              )}

              {/* Analysis Results View */}
              {analysis && (
                <div className="space-y-8 animate-fade-in">
                  {/* Reset & Summary Header */}
                  <div className="glass-panel rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border border-slate-700/60 shadow-xl">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping" />
                      <div>
                        <h2 className="text-base sm:text-lg font-bold text-white">
                          Dispute Legal Assessment & Action Roadmap
                        </h2>
                        <p className="text-xs text-slate-400">
                          Cross-referenced with verified Indian statutory provisions & remedies
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={handleReset}
                      className="flex items-center justify-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-bold transition-all border border-slate-600 shadow-md"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Analyze Another Dispute</span>
                    </button>
                  </div>

                  {/* 1) Plain-language explanation of rights */}
                  <RightsAnalysisView analysis={analysis} />

                  {/* 2) 2-3 Concrete Next Steps */}
                  <NextStepsTimeline nextSteps={analysis.next_steps} />

                  {/* 3) Auto-Filled RTI Application Draft */}
                  <RTIDraftCard rtiDraft={analysis.rti_draft} />

                  {/* Knowledge Base Sources Drawer */}
                  <KnowledgeDrawer provisions={analysis.relevant_provisions} />

                  {/* Follow-up Interactive Chat */}
                  <FollowUpChat
                    disputeText={currentDisputeText || analysis.query}
                  />
                </div>
              )}
            </div>
          )}
        </main>

        {/* Persistent Footer Legal Disclaimer */}
        <footer className="border-t border-slate-800/80 bg-slate-950/90 backdrop-blur-xl mt-12 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
            <DisclaimerBanner />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-3 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <Scale className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-slate-200">Rights Navigator India</span>
                <span>• Built by <strong className="text-slate-200">Saurabh Jamdade</strong></span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <a
                  href="https://www.linkedin.com/in/saurabh-jamdade-b98259373/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 font-semibold transition-colors flex items-center gap-1"
                >
                  <span>LinkedIn Profile</span>
                  <span>↗</span>
                </a>
                <span className="text-slate-600">•</span>
                <a
                  href="https://github.com/saurabhjamdade077/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-slate-300 hover:text-white font-semibold transition-colors flex items-center gap-1"
                >
                  <span>GitHub Profile</span>
                  <span>↗</span>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
