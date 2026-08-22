import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import DisclaimerBanner from './components/DisclaimerBanner.jsx';
import DisputeForm from './components/DisputeForm.jsx';
import RightsAnalysisView from './components/RightsAnalysisView.jsx';
import NextStepsTimeline from './components/NextStepsTimeline.jsx';
import RTIDraftCard from './components/RTIDraftCard.jsx';
import KnowledgeDrawer from './components/KnowledgeDrawer.jsx';
import FollowUpChat from './components/FollowUpChat.jsx';
import KnowledgeExplorer from './components/KnowledgeExplorer.jsx';
import { Scale, RefreshCw, AlertCircle, Sparkles, HelpCircle, FileText, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('navigator');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [providerStatus, setProviderStatus] = useState(null);
  const [currentDisputeText, setCurrentDisputeText] = useState('');

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

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Persistent Disclaimer */}
      <div className="bg-amber-950/70 border-b border-amber-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <DisclaimerBanner compact />
        </div>
      </div>

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        providerStatus={providerStatus}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-8">
        {activeTab === 'knowledge' ? (
          <KnowledgeExplorer />
        ) : (
          <div className="space-y-8">
            {/* Hero Header */}
            {!analysis && (
              <div className="text-center max-w-3xl mx-auto space-y-3 py-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI-Powered Citizen Legal Empowerment</span>
                </div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Know Your Rights & Take Action Under <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">Indian Law</span>
                </h1>
                <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
                  Describe any dispute in plain language—whether tenant security deposits, consumer refunds, workplace salaries, or RTI queries. We retrieve relevant statutory sections and generate clear rights, actionable steps, and auto-filled RTI drafts.
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-950/60 border border-red-500/40 rounded-xl text-red-200 text-sm flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="font-bold text-red-300">Analysis Error</div>
                  <div>{error}</div>
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
              <div className="space-y-8 animate-fadeIn">
                {/* Reset & Summary Header */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    <h2 className="text-lg font-bold text-white">Dispute Legal Analysis</h2>
                  </div>

                  <button
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors border border-slate-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Analyze Another Dispute</span>
                  </button>
                </div>

                {/* 1) Plain-language explanation of rights */}
                <RightsAnalysisView analysis={analysis} />

                {/* 2) 2-3 Concrete Next Steps */}
                <NextStepsTimeline nextSteps={analysis.next_steps} />

                {/* 3) Optional Auto-Filled RTI Application Draft */}
                <RTIDraftCard rtiDraft={analysis.rti_draft} />

                {/* Knowledge Base Sources Drawer */}
                <KnowledgeDrawer provisions={analysis.relevant_provisions} />

                {/* Follow-up Chat Component */}
                <FollowUpChat
                  disputeText={currentDisputeText || analysis.query}
                />
              </div>
            )}
          </div>
        )}
      </main>

      {/* Persistent Footer Legal Disclaimer */}
      <footer className="border-t border-slate-800/80 bg-slate-950 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <DisclaimerBanner />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-500 pt-3 border-t border-slate-900">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-blue-500" />
              <span className="font-semibold text-slate-400">Rights Navigator India</span>
              <span>• Educational Public Good</span>
            </div>
            <div>
              Built for Indian citizens to navigate Tenant Law, Consumer Protection 2019, Workplace Rights & RTI Act 2005.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
