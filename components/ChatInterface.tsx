import React, { useState, useRef, useEffect } from 'react';
import { Button } from './Button';
import { ChatMessage, AppState } from '../types';

interface ChatInterfaceProps {
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  appState: AppState;
}

const SUGGESTIONS = [
  "Dark mode portfolio",
  "Luxury fashion store",
  "Minimalist blog",
  "Brutalist gallery"
];

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, onSendMessage, appState }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, appState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && appState !== AppState.GENERATING) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleSuggestion = (suggestion: string) => {
    if (appState !== AppState.GENERATING) {
        onSendMessage(suggestion);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#111] rounded-none md:rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-[#111] flex items-center justify-between border-b border-gray-800 z-10">
        <div>
           <h2 className="font-serif text-xl font-normal text-white tracking-wide">Sinko AI.</h2>
           <p className="text-[10px] text-gray-500 font-sans tracking-[0.2em] uppercase mt-1">Architecture</p>
        </div>
        <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
            <span className="text-[10px] uppercase text-gray-600 tracking-wider">Online</span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#111] pb-24 scrollbar-thin scrollbar-thumb-gray-800">
        {messages.length === 0 && (
          <div className="flex flex-col opacity-0 animate-fade-in text-left mt-8">
            <h3 className="font-serif text-3xl mb-8 text-white">System Ready.</h3>
            <div className="space-y-8 border-l border-gray-800 pl-6">
                <div className="group">
                    <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-hover:text-white transition-colors">01. Purpose</h4>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">Define the objective. Portfolio, Commerce, or Editorial?</p>
                </div>
                <div className="group">
                    <h4 className="font-sans text-xs font-bold uppercase tracking-widest text-gray-500 mb-2 group-hover:text-white transition-colors">02. Aesthetic</h4>
                    <p className="text-gray-400 text-sm font-light leading-relaxed">Set the tone. Dark, Brutalist, Minimal, or Soft?</p>
                </div>
            </div>
          </div>
        )}
        
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-slide-up`}>
            <div 
              className={`max-w-[90%] py-2 px-0 text-sm leading-relaxed ${
                msg.role === 'user' 
                  ? 'text-right' 
                  : 'text-left'
              }`}
            >
              <span className={`block text-[9px] tracking-[0.2em] uppercase mb-3 text-gray-600`}>
                  {msg.role === 'user' ? 'Input' : 'Response'}
              </span>
              <div className={`p-5 ${msg.role === 'user' ? 'bg-white text-black rounded-2xl rounded-tr-sm' : 'bg-[#1a1a1a] border border-gray-800 text-gray-300 rounded-2xl rounded-tl-sm'}`}>
                  {msg.content}
              </div>
            </div>
          </div>
        ))}
        
        {appState === AppState.GENERATING && (
           <div className="flex justify-start items-center space-x-2 p-4">
             <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce"></div>
             <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-75"></div>
             <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce delay-150"></div>
           </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggestion Chips */}
      {messages.length === 0 && (
          <div className="absolute bottom-24 left-0 right-0 px-6 py-4 flex gap-3 overflow-x-auto no-scrollbar mask-gradient">
              {SUGGESTIONS.map((sugg, i) => (
                  <button 
                    key={i}
                    onClick={() => handleSuggestion(sugg)}
                    className="flex-shrink-0 bg-[#1a1a1a] border border-gray-800 hover:border-gray-600 hover:text-white text-gray-400 text-[10px] uppercase tracking-widest px-4 py-3 rounded-full transition-all whitespace-nowrap"
                  >
                      {sugg}
                  </button>
              ))}
          </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-[#111] border-t border-gray-800 z-10">
        <form onSubmit={handleSubmit} className="relative group">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Describe your vision..."
            disabled={appState === AppState.GENERATING}
            className="w-full pl-6 pr-14 py-4 bg-[#1a1a1a] border border-transparent focus:border-gray-700 rounded-xl focus:outline-none focus:ring-0 text-white transition-all text-sm font-light placeholder-gray-600"
          />
          <button 
            type="submit" 
            disabled={!input.trim() || appState === AppState.GENERATING}
            className="absolute right-2 top-2 p-2 rounded-lg hover:bg-gray-800 transition-all disabled:opacity-30 text-white"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </form>
      </div>
    </div>
  );
};