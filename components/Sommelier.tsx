import React, { useState, useRef, useEffect } from 'react';
import { Wine, ChatMessage } from '../types.ts';
import { Send, Loader2, Sparkles } from 'lucide-react';
import { getSommelierAdvice } from '../services/geminiService.ts';

interface SommelierProps {
  cellar: Wine[];
}

const Sommelier: React.FC<SommelierProps> = ({ cellar }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Bonjour! I am your virtual sommelier. How can I assist you with your collection today? I can suggest pairings, tasting notes, or help you decide which bottle to open tonight." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }));

      const response = await getSommelierAdvice(history, cellar);
      if (response) {
        setMessages(prev => [...prev, { role: 'model', content: response }]);
      }
    } catch (error) {
      console.error('Sommelier error:', error);
      setMessages(prev => [...prev, { role: 'model', content: "I apologize, but I am having trouble connecting to my knowledge base right now. Please make sure the API key is configured correctly." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[70vh] animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-red-100 text-red-900 rounded-lg">
          <Sparkles size={20} />
        </div>
        <h2 className="text-2xl font-bold font-serif">Sommelier AI</h2>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin scrollbar-thumb-slate-200"
      >
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                m.role === 'user' 
                ? 'bg-slate-900 text-white rounded-tr-none' 
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-100 px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-red-800" />
              <span className="text-xs text-slate-400 font-medium italic">Sommelier is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="relative mt-auto">
        <input 
          type="text"
          className="w-full pl-4 pr-12 py-4 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-900/20 shadow-lg shadow-slate-100"
          placeholder="Ask about your cellar or a pairing..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 wine-gradient text-white rounded-xl shadow-lg active:scale-95 transition-transform disabled:opacity-50"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sommelier;
