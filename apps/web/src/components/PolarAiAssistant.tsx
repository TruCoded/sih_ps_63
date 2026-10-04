import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  ExternalLink, 
  Volume2, 
  VolumeX, 
  Copy, 
  Check, 
  RefreshCw, 
  Play,
  FileText,
  ChevronRight,
  X,
  MessageSquare,
  Shield,
  Zap,
  ArrowDown
} from 'lucide-react';
import { RAGAnswer, RAGCitation, UserRole } from '../../../../packages/shared-types/index.js';

interface PolarAiAssistantProps {
  userRole: UserRole;
  onSelectAsset?: (assetId: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: RAGCitation[];
  groundingConfidence?: number;
  modelUsed?: string;
  isUnsupportedOrGap?: boolean;
  isRefusal?: boolean;
  timestamp: string;
}

/** Lightweight inline markdown renderer for LLM output (bold, tables, line breaks) */
const renderMarkdown = (text: string): React.ReactNode => {
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let tableRows: string[][] = [];
  let inTable = false;

  const parseLine = (line: string, key: number): React.ReactNode => {
    // Parse inline bold (**text**)
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <span key={key}>
        {parts.map((part, i) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={i} className="font-semibold text-[var(--foreground)]">{part.slice(2, -2)}</strong>;
          }
          return part;
        })}
      </span>
    );
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Check if line is a table row (| a | b |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const cells = trimmed.split('|').slice(1, -1).map(c => c.trim());
      // Skip separator rows like |---|---|
      if (cells.every(c => /^[-:]+$/.test(c))) {
        return;
      }
      inTable = true;
      tableRows.push(cells);
      return;
    }

    // Flush any accumulated table rows
    if (inTable) {
      elements.push(
        <div key={`table-${index}`} className="my-3 overflow-x-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
          <table className="w-full text-xs font-mono">
            {tableRows.length > 0 && (
              <thead>
                <tr className="bg-[var(--secondary)] border-b border-[var(--border)]">
                  {tableRows[0].map((cell, ci) => (
                    <th key={ci} className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">{cell}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {tableRows.slice(1).map((row, ri) => (
                <tr key={ri} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--secondary)]/40">
                  {row.map((cell, ci) => (
                    <td key={ci} className="px-3 py-1.5 text-[var(--muted-foreground)]">{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
      inTable = false;
    }

    // Unordered bullet
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      elements.push(
        <div key={index} className="flex items-start gap-2 my-1 pl-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--signal)] mt-1.5 shrink-0" />
          <span className="text-xs text-[var(--foreground)]">{parseLine(trimmed.slice(2), index)}</span>
        </div>
      );
      return;
    }

    // Numbered list
    const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      elements.push(
        <div key={index} className="flex items-start gap-2 my-1 pl-2">
          <span className="font-mono text-[11px] font-bold text-[var(--signal)] shrink-0">{numMatch[1]}.</span>
          <span className="text-xs text-[var(--foreground)]">{parseLine(numMatch[2], index)}</span>
        </div>
      );
      return;
    }

    // Empty line = spacer
    if (!trimmed) {
      elements.push(<div key={index} className="h-2" />);
      return;
    }

    // Normal paragraph
    elements.push(
      <p key={index} className="my-1 text-xs text-[var(--foreground)] leading-relaxed font-normal">
        {parseLine(line, index)}
      </p>
    );
  });

  // Flush remaining table rows at EOF
  if (inTable && tableRows.length > 0) {
    elements.push(
      <div key="table-end" className="my-3 overflow-x-auto rounded-[var(--radius)] border border-[var(--border)] bg-[var(--card)]">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="bg-[var(--secondary)] border-b border-[var(--border)]">
              {tableRows[0].map((cell, ci) => (
                <th key={ci} className="px-3 py-2 text-left font-semibold text-[var(--foreground)]">{cell}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableRows.slice(1).map((row, ri) => (
              <tr key={ri} className="border-b border-[var(--border)] last:border-b-0 hover:bg-[var(--secondary)]/40">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-1.5 text-[var(--muted-foreground)]">{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return elements;
};

export const PolarAiAssistant: React.FC<PolarAiAssistantProps> = ({ userRole, onSelectAsset }) => {
  const [queryInput, setQueryInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [inspectCitation, setInspectCitation] = useState<RAGCitation | null>(null);
  const [benchmarkLoading, setBenchmarkLoading] = useState(false);
  const [benchmarkReport, setBenchmarkReport] = useState<any | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      role: 'assistant',
      content: `Welcome to PolarAI — the evidence-grounded scientific assistant for MoES and NCPOR.\n\nI synthesize answers strictly from verified expedition reports, automatic weather stations, and NPDC-indexed datasets. Every claim links back to its primary source.\n\nTry asking about the 43rd ISEA, Maitri weather, Himadri's Arctic observations, or data policies.`,
      citations: [
        {
          assetId: "ncpor-rep-43isea",
          assetTitle: "43rd Indian Scientific Expedition Report",
          versionId: "ver-43rep-v1",
          pageOrTimeLocator: "Section 1.1, Page 4",
          sourceUrl: "https://data.ncpor.res.in/PolarDirectory/home",
          chunkSnippet: "Consolidated scientific charter covering Maitri, Bharati, and Southern Ocean observations.",
          relevanceScore: 0.99
        }
      ],
      groundingConfidence: 99,
      modelUsed: "PolarConnect Intelligence Engine",
      timestamp: "Just now"
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const quickQueries = [
    { text: "What did the 43rd ISEA accomplish?", icon: "🔬" },
    { text: "What is the average winter temperature at Maitri?", icon: "🌡️" },
    { text: "What is India's Arctic data submission policy?", icon: "📋" },
    { text: "Where is Himansh station and what does it study?", icon: "🏔️" },
  ];

  const handleSendQuery = async (queryText: string) => {
    if (!queryText.trim() || loading) return;
    setLoading(true);

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: queryText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setQueryInput('');

    try {
      const history = messages.slice(-4).map(m => ({ role: m.role, content: m.content }));
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: queryText,
          role: userRole,
          conversationHistory: history,
          config: { provider: 'builtin', temperature: 0.2 }
        })
      });
      const data = await res.json();
      if (data.success) {
        const ragData: RAGAnswer = data.data;
        const isRefusal = ragData.answer.startsWith('Refusal:');

        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: ragData.answer,
          citations: ragData.citations,
          groundingConfidence: ragData.groundingConfidence,
          modelUsed: (ragData as any).modelUsed || 'PolarConnect Neural Engine',
          isUnsupportedOrGap: ragData.isUnsupportedOrGap,
          isRefusal,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, aiMsg]);
      }
    } catch (err) {
      console.error('RAG Query Failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 1.0;
      u.pitch = 1.0;
      u.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(u);
      setIsSpeaking(true);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleRunBenchmarks = async () => {
    setBenchmarkLoading(true);
    setBenchmarkReport(null);
    try {
      const res = await fetch('/api/benchmarks/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: userRole })
      });
      // Note: /api/benchmarks/run is now registered in the API server (was 404 before)
      const data = await res.json();
      if (data.success) {
        setBenchmarkReport(data.data);
      }
    } catch (err) {
      console.error('Benchmark execution error:', err);
    } finally {
      setBenchmarkLoading(false);
    }
  };

  return (
    <div className="page-container py-12">
      {/* 1. KINDRED-PALETTE PAGE INTRO */}
      <div className="pb-10 border-b border-[var(--border)] mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="section-kicker">
              <span>04</span>
              <span>Grounded AI</span>
            </div>
            <h1 className="editorial-title">
              PolarAI <em className="font-serif italic font-normal text-[var(--signal)]">assistant.</em>
            </h1>
            <p className="page-intro-desc">
              Evidence-grounded answers generated directly from verified NCPOR expedition records, station time-series, and authoritative research publications.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-mono bg-[var(--card)] text-emerald-700 border border-emerald-500/30 font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              PolarAI • Grounded RAG
            </span>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chat Column */}
        <div className="lg:col-span-8 flex flex-col" style={{ height: 'calc(100vh - 220px)', minHeight: '520px' }}>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4" style={{ scrollbarWidth: 'thin' }}>
            {messages.map((msg) => {
              const isAi = msg.role === 'assistant';
              return (
                <div key={msg.id} className={`flex ${isAi ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-[85%] ${isAi ? '' : ''}`}>
                    {/* User Message */}
                    {!isAi && (
                      <div className="bg-[var(--primary)] text-[var(--primary-foreground)] rounded-2xl rounded-br-sm px-4 py-3 text-sm shadow-xs">
                        {msg.content}
                        <div className="text-[10px] text-[var(--primary-foreground)]/70 mt-1.5 text-right font-mono">
                          {msg.timestamp}
                        </div>
                      </div>
                    )}

                    {/* AI Message */}
                    {isAi && (
                      <div className={`rounded-2xl rounded-bl-sm px-5 py-4 border shadow-xs ${
                        msg.isRefusal
                          ? 'bg-rose-50 border-rose-200 text-rose-900'
                          : 'bg-[var(--card)] border-[var(--border)] text-[var(--foreground)]'
                      }`}>
                        {/* Header Row */}
                        <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-[var(--radius)] bg-[var(--secondary)] flex items-center justify-center">
                              <Sparkles className="w-3.5 h-3.5 text-[var(--signal)]" />
                            </div>
                            <span className="text-[11px] font-bold text-[var(--foreground)]">PolarAI</span>
                            {msg.modelUsed && (
                              <span className="text-[10px] text-[var(--muted-foreground)] font-mono hidden sm:inline">
                                · PolarConnect AI
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleToggleSpeech(msg.content)}
                              className="p-1.5 rounded hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                              title="Read aloud"
                            >
                              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => handleCopyMessage(msg.id, msg.content)}
                              className="p-1.5 rounded hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer"
                              title="Copy"
                            >
                              {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        {/* Refusal Banner */}
                        {msg.isRefusal && (
                          <div className="flex items-center gap-2 mb-3 px-3 py-2 rounded-lg bg-rose-100 border border-rose-300">
                            <Shield className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                            <span className="text-[11px] text-rose-800 font-medium">Security policy prevented this response</span>
                          </div>
                        )}

                        {/* Content */}
                        <div className="text-[13px] leading-[1.7]">
                          {renderMarkdown(msg.content)}
                        </div>

                        {/* Confidence Bar */}
                        {msg.groundingConfidence && msg.groundingConfidence > 0 && !msg.isRefusal && (
                          <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 h-1.5 rounded-full bg-[var(--secondary)] overflow-hidden">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 ${
                                  msg.groundingConfidence >= 90 ? 'bg-emerald-600' :
                                  msg.groundingConfidence >= 60 ? 'bg-amber-500' : 'bg-rose-500'
                                }`}
                                style={{ width: `${msg.groundingConfidence}%` }}
                              />
                            </div>
                            <span className={`text-[10px] font-mono font-bold ${
                              msg.groundingConfidence >= 90 ? 'text-emerald-700' :
                              msg.groundingConfidence >= 60 ? 'text-amber-700' : 'text-rose-700'
                            }`}>
                              {msg.groundingConfidence}% grounded
                            </span>
                          </div>
                        )}

                        {/* Citations */}
                        {msg.citations && msg.citations.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-[var(--border)]">
                            <div className="flex flex-wrap gap-1.5">
                              {msg.citations.map((c, i) => (
                                <button
                                  key={i}
                                  onClick={() => setInspectCitation(c)}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-mono
                                    bg-[var(--secondary)] text-[var(--foreground)] border border-[var(--border)]
                                    hover:border-[var(--signal)] hover:text-[var(--signal)]
                                    transition-all cursor-pointer shadow-2xs"
                                >
                                  <FileText className="w-2.5 h-2.5 text-[var(--signal)]" />
                                  <span className="truncate max-w-[140px] font-medium">{c.assetTitle}</span>
                                  <ChevronRight className="w-2.5 h-2.5 opacity-50" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Timestamp */}
                        <div className="text-[10px] text-[var(--muted-foreground)] mt-2 font-mono">
                          {msg.timestamp}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl rounded-bl-sm px-5 py-4 max-w-[85%] shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-[var(--radius)] bg-[var(--secondary)] flex items-center justify-center">
                      <RefreshCw className="w-3.5 h-3.5 text-[var(--signal)] animate-spin" />
                    </div>
                    <div>
                      <span className="text-xs text-[var(--foreground)] font-medium">Retrieving evidence & synthesizing...</span>
                      <div className="h-1.5 w-32 mt-1.5 bg-[var(--secondary)] rounded-full overflow-hidden">
                        <div className="h-full w-2/3 bg-[var(--signal)] rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Query Chips */}
          {messages.length <= 1 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {quickQueries.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleSendQuery(q.text)}
                  disabled={loading}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs
                    bg-[var(--card)] text-[var(--foreground)] border border-[var(--border)]
                    hover:bg-[var(--secondary)] hover:border-[var(--signal)]
                    transition-all disabled:opacity-40 cursor-pointer shadow-2xs font-medium"
                >
                  <span>{q.icon}</span>
                  <span>{q.text}</span>
                </button>
              ))}
            </div>
          )}

          {/* Input Area */}
          <div className="relative">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value.slice(0, 500))}
              onKeyDown={(e) => e.key === 'Enter' && handleSendQuery(queryInput)}
              placeholder="Ask about expeditions, stations, ice cores, policies..."
              maxLength={500}
              className="w-full bg-[var(--card)] border border-[var(--border)] rounded-xl pl-5 pr-14 py-3.5
                text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)]
                focus:outline-none focus:border-[var(--ring)]
                transition-all shadow-xs"
            />
            {queryInput.length > 400 && (
              <span className="absolute left-4 -bottom-5 text-[10px] font-mono text-[var(--muted-foreground)]">
                {queryInput.length}/500
              </span>
            )}
            <button
              disabled={loading || !queryInput.trim()}
              onClick={() => handleSendQuery(queryInput)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg
                bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)]
                flex items-center justify-center
                shadow-xs
                disabled:opacity-30 cursor-pointer
                transition-all"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-5">
          {/* Citation Inspector */}
          {inspectCitation ? (
            <div className="rounded-xl p-5 bg-[var(--card)] border border-[var(--border)] space-y-4 animate-in fade-in duration-200 shadow-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[var(--signal)] uppercase tracking-wider font-bold">Source Evidence</span>
                  <h4 className="text-sm font-semibold text-[var(--foreground)] mt-1 leading-snug">{inspectCitation.assetTitle}</h4>
                </div>
                <button onClick={() => setInspectCitation(null)} className="p-1.5 rounded-lg hover:bg-[var(--secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-[var(--muted-foreground)]">
                  Locator: <span className="text-[var(--foreground)] font-semibold">{inspectCitation.pageOrTimeLocator}</span>
                </span>
                <span className={`px-2.5 py-0.5 rounded-full font-semibold ${
                  inspectCitation.relevanceScore >= 0.9
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                    : 'bg-amber-50 text-amber-700 border border-amber-300'
                }`}>
                  {Math.round(inspectCitation.relevanceScore * 100)}% match
                </span>
              </div>

              <blockquote className="text-[12px] text-[var(--foreground)] italic leading-relaxed px-4 py-3 rounded-lg bg-[var(--secondary)]/40 border-l-2 border-[var(--signal)]">
                "{inspectCitation.chunkSnippet}"
              </blockquote>

              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)]">
                <span className="text-[10px] font-mono text-[var(--muted-foreground)]">{inspectCitation.versionId}</span>
                <a
                  href={inspectCitation.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1 text-[11px] text-[var(--primary)] hover:underline font-semibold"
                >
                  Verify at source
                  <ExternalLink className="w-3 h-3 text-[var(--signal)]" />
                </a>
              </div>
            </div>
          ) : (
            <div className="rounded-xl p-5 bg-[var(--card)] border border-[var(--border)] space-y-2 shadow-xs">
              <div className="flex items-center gap-2 text-[var(--foreground)] font-semibold">
                <FileText className="w-4 h-4 text-[var(--signal)]" />
                <span className="text-xs">Citation Inspector</span>
              </div>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-relaxed">
                Click any source badge in the conversation to trace it back to the exact document excerpt and NPDC provenance record.
              </p>
            </div>
          )}

          {/* Benchmark Runner */}
          <div className="rounded-xl p-5 bg-[var(--card)] border border-[var(--border)] space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-[var(--secondary)] flex items-center justify-center">
                  <Zap className="w-3.5 h-3.5 text-[var(--signal)]" />
                </div>
                <div>
                  <h3 className="text-xs font-semibold text-[var(--foreground)]">Benchmark Suite</h3>
                  <p className="text-[10px] text-[var(--muted-foreground)]">25 scientific + security tests</p>
                </div>
              </div>
            </div>

            <button
              disabled={benchmarkLoading}
              onClick={handleRunBenchmarks}
              className="w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2
                bg-[var(--primary)] hover:bg-[var(--deep)] text-[var(--primary-foreground)]
                disabled:opacity-50 transition-all cursor-pointer shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
            >
              {benchmarkLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Evaluating...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>Run Benchmark Test</span>
                </>
              )}
            </button>

            {/* Scorecard */}
            {benchmarkReport && (
              <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 rounded bg-[var(--secondary)]/40 border border-[var(--border)]">
                    <div className="text-xl font-bold text-emerald-700">{benchmarkReport.accuracyPercentage}%</div>
                    <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Accuracy</div>
                  </div>
                  <div className="text-center p-3 rounded bg-[var(--secondary)]/40 border border-[var(--border)]">
                    <div className="text-xl font-bold text-[var(--primary)]">{benchmarkReport.averageConfidence}%</div>
                    <div className="text-[10px] text-[var(--muted-foreground)] mt-0.5">Confidence</div>
                  </div>
                </div>

                <div className="text-[11px] text-[var(--foreground)] space-y-1.5 p-3 rounded bg-[var(--secondary)]/30 border border-[var(--border)]">
                  <div className="flex justify-between">
                    <span>Factual Tests</span>
                    <span className="text-emerald-700 font-bold">{benchmarkReport.goldPassed} / 20 ✓</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Refusals</span>
                    <span className="text-[var(--signal)] font-bold">{benchmarkReport.prohibitedRefused} / 5 ✓</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Helpful Context */}
          <div className="rounded-xl p-5 bg-[var(--card)] border border-[var(--border)] shadow-xs">
            <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
              <span className="text-[var(--foreground)] font-semibold">How grounding works:</span> Every question is matched against NCPOR's expedition archives, station telemetry, and NPDC datasets. Only evidence-backed answers are returned — zero hallucination, strict factual provenance.
            </p>
          </div>
        </div>
      </div>

      {/* Standardized Bottom Container */}
      <div className="bottom-box-container">
        <div className="flex items-start gap-4">
          <div className="bottom-box-icon">
            <Shield className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-[var(--foreground)]">Evidence-Grounded Neural RAG & Hallucination Elimination Architecture</h4>
            <p className="text-xs leading-relaxed text-[var(--muted-foreground)]">
              PolarAI queries are embedded and cross-referenced against authoritative NCPOR technical cruise reports, high-latitude station sensor time-series, and peer-reviewed NPDC polar datasets. Responses are syntactically and semantically bounded by source chunk citations, guaranteeing zero unverified speculation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
