import { useState, useRef, useEffect } from 'react';
import { Bot, Send, Loader2, Sparkles } from 'lucide-react';
import { useProviders } from '@/providers/context';
import type { ChatMessage } from '@/providers/types';

export function AIAssistantPage() {
  const providers = useProviders();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg: ChatMessage = { role: 'user', content: input, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await providers.ai.chat([...messages, userMsg]);
      setMessages((prev) => [...prev, { role: 'assistant', content: res.response, timestamp: Date.now() }]);
    } catch (e) {
      console.error(e);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error.', timestamp: Date.now() }]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = [
    'What coverage tier should I choose?',
    'How do I file a claim?',
    'Explain EDU certification',
    'What is the premium pool?',
  ];

  return (
    <div className="space-y-4 h-full flex flex-col">
      <div>
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-violet-600" />
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Assistant</h1>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Ask about coverage, claims, EDU, or pool mechanics
        </p>
      </div>

      {/* Demo notice */}
      <div className="rounded-lg bg-amber-50 dark:bg-amber-900/20 p-3 flex items-start gap-2">
        <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300">
          Demo mode: responses are rule-based, not AI-generated. In realDeal, this connects to an LLM
          with access to your policy context for personalized assistance.
        </p>
      </div>

      {/* Chat area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 rounded-xl shadow-sm p-4 space-y-3 min-h-[300px]">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <Bot className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">Ask me anything about CryptoSure</p>
            <div className="mt-4 flex flex-wrap gap-2 justify-center">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-400 hover:border-violet-400 hover:text-violet-600"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                m.role === 'user'
                  ? 'bg-violet-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white'
              }`}>
                {m.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 rounded-lg px-3 py-2">
              <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type your question..."
          className="flex-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          Send
        </button>
      </div>
    </div>
  );
}
