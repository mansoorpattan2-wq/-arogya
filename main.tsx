import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Send, Bot, User, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import Markdown from 'react-markdown';

export default function HealthAI() {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', content: string }[]>([
    { role: 'model', content: "Hello! I'm your Arogya Mantra AI assistant. How can I help you with your health today? You can ask me about symptoms, general wellness tips, or how to manage your medications." }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [...messages, { role: 'user', content: userMessage }].map(m => ({
          role: m.role,
          parts: [{ text: m.content }]
        })),
        config: {
          systemInstruction: "You are a helpful and knowledgeable health assistant for the 'Arogya Mantra' app. Provide accurate, empathetic, and clear health information. Always include a disclaimer that you are an AI and the user should consult a real doctor for serious medical concerns. Keep responses concise and formatted with markdown.",
        }
      });

      const text = response.text || "I'm sorry, I couldn't generate a response.";
      setMessages(prev => [...prev, { role: 'model', content: text }]);
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'model', content: "I encountered an error. Please check your connection and try again." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Chat Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-emerald-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Arogya AI</h2>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-emerald-600">Online & Ready</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full border border-emerald-100">
          <Sparkles size={14} className="text-emerald-500" />
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Powered by Gemini</span>
        </div>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
      >
        {messages.map((msg, i) => (
          <div 
            key={i}
            className={cn(
              "flex gap-4 max-w-[85%]",
              msg.role === 'user' ? "ml-auto flex-row-reverse" : ""
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
              msg.role === 'user' ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-600"
            )}>
              {msg.role === 'user' ? <User size={18} /> : <Bot size={18} />}
            </div>
            <div className={cn(
              "p-4 rounded-2xl text-sm leading-relaxed",
              msg.role === 'user' 
                ? "bg-emerald-600 text-white rounded-tr-none" 
                : "bg-slate-50 text-slate-700 rounded-tl-none border border-slate-100"
            )}>
              <div className="markdown-body">
                <Markdown>{msg.content}</Markdown>
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4 max-w-[85%]">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <Bot size={18} />
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none border border-slate-100 flex items-center gap-2">
              <Loader2 size={18} className="animate-spin text-emerald-500" />
              <span className="text-sm text-slate-400 font-medium">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="px-6 py-2 bg-amber-50 border-y border-amber-100 flex items-center gap-2">
        <AlertCircle size={14} className="text-amber-600" />
        <p className="text-[10px] font-medium text-amber-700">
          AI assistant for informational purposes only. Not a substitute for professional medical advice.
        </p>
      </div>

      {/* Input Area */}
      <div className="p-6 bg-white">
        <form 
          onSubmit={handleSend}
          className="relative"
        >
          <input 
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask anything about your health..."
            className="w-full pl-6 pr-14 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
          />
          <button 
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-emerald-600 text-white rounded-xl flex items-center justify-center hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-emerald-100"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
