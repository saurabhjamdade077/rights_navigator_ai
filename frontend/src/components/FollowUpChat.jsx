import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, User, Bot, Sparkles, CornerDownLeft, Scale, Shield } from 'lucide-react';

const SUGGESTED_QUERIES = [
  'Can I claim 18% statutory interest on withheld security deposit?',
  'What if the landlord/company completely ignores my legal notice?',
  'How do I file a consumer complaint on e-Daakhil without a lawyer?',
  'What are the penalties on a PIO for delaying RTI beyond 30 days?'
];

export default function FollowUpChat({ disputeText, onSendChat, loading }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'I have analyzed your dispute under Indian statutory law. Feel free to ask any follow-up questions — for instance, how to calculate interest on security deposit, what to do if the notice is ignored, or how to file without a lawyer.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isSending]);

  const handleSend = async (queryText) => {
    const textToSend = queryText || input.trim();
    if (!textToSend || isSending) return;

    setInput('');
    const newMessages = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    setIsSending(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dispute_context: disputeText,
          conversation_history: newMessages,
          user_message: textToSend
        })
      });

      if (!response.ok) {
        throw new Error('Failed to fetch reply');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error answering your follow-up question. Please verify your connection or LLM configuration.'
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    handleSend();
  };

  return (
    <div className="glass-panel-elevated rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col h-[560px] border border-slate-700/60">
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">Interactive Citizen Legal Assistant</h3>
            <p className="text-[11px] text-slate-400">Ask clarifying legal questions, enforcement strategies, or penalty clauses</p>
          </div>
        </div>
        <span className="text-[10px] font-mono bg-slate-950 px-2.5 py-1 rounded-full text-amber-300 border border-amber-500/30">
          Statutory Grounded
        </span>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 scrollbar-thin">
        {SUGGESTED_QUERIES.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q)}
            disabled={isSending}
            className="shrink-0 px-2.5 py-1 bg-slate-950/80 hover:bg-slate-850 text-slate-300 hover:text-amber-300 border border-slate-800 hover:border-amber-500/40 rounded-lg text-[11px] transition-all"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-2">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex gap-3 text-xs sm:text-sm ${
              m.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {m.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                <Scale className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl px-4 py-3 leading-relaxed whitespace-pre-wrap ${
                m.role === 'user'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-br-none shadow-md'
                  : 'bg-slate-950/90 text-slate-200 rounded-bl-none border border-slate-800 shadow-inner'
              }`}
            >
              {m.content}
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isSending && (
          <div className="flex gap-3 text-xs justify-start">
            <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0 mt-0.5">
              <Scale className="w-4 h-4" />
            </div>
            <div className="bg-slate-950 text-slate-400 rounded-2xl rounded-bl-none border border-slate-800 px-4 py-3 flex items-center gap-2 shadow-inner">
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
              <span>Analyzing Indian legal provisions...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="mt-3.5 pt-3.5 border-t border-slate-800 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question (e.g. 'Can I claim interest on the deposit?', 'What if the employer threatens legal action?')..."
          className="flex-1 bg-slate-950/90 border border-slate-700 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 rounded-2xl px-4 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-all shadow-inner"
          disabled={isSending}
        />
        <button
          type="submit"
          disabled={!input.trim() || isSending}
          className="px-5 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Send</span>
        </button>
      </form>
    </div>
  );
}
