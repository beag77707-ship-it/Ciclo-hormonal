import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { sendChatMessage } from '../services/geminiService';
import { UserSettings } from '../types';

interface Props {
  onClose: () => void;
  user: UserSettings | null;
}

interface Message {
  role: 'user' | 'ai';
  text: string;
}

const ChatBot: React.FC<Props> = ({ onClose, user }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', text: `Hola ${user?.name || ''}, soy Ciclo AI. ¿En qué puedo ayudarte hoy sobre tu salud o bienestar?` }
  ]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    // Get previous history for context (last 5 messages)
    const history = messages.slice(-5).map(m => m.text);
    
    const responseText = await sendChatMessage(input, history);
    
    setMessages(prev => [...prev, { role: 'ai', text: responseText }]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-white flex flex-col animate-slide-up">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-full">
            <Sparkles size={20} className="text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800">Ciclo AI Assistant</h2>
            <p className="text-xs text-slate-500">Potenciado por Gemini 3.0 Pro</p>
          </div>
        </div>
        <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200">
          <X size={20} className="text-slate-600" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' 
                  ? 'bg-rose-500 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
              }`}
            >
              {m.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
             <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex gap-2">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-slate-100 flex gap-2">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Escribe tu pregunta..."
          className="flex-1 bg-slate-100 border-none rounded-xl px-4 focus:ring-2 focus:ring-rose-500 outline-none"
        />
        <button 
          onClick={handleSend}
          disabled={loading || !input.trim()}
          className="bg-rose-500 text-white p-3 rounded-xl disabled:opacity-50 hover:bg-rose-600"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatBot;