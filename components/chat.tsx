"use client"

import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Minus, ArrowUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const ModernChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hi there! here to help you with Soon queries?', sender: 'bot' }
  ]);
  const [isGenerating, setIsGenerating] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll effect
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isGenerating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isGenerating) return;
    
    // Add user message
    const userMessage = { id: Date.now(), text: message, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setIsGenerating(true);

    try {
      const response = await axios({
        url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${
          "AIzaSyCCfPxT-3CYBmOnySJQAU6jt3dj9mjpVbg"
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: message }] }],
        },
      });

      const aiResponse = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      const botMessage = { 
        id: Date.now() + 1, 
        text: aiResponse, 
        sender: 'bot' 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: "Oops! Something went wrong. Please try again.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Launcher */}
      {!isOpen && !isMinimized && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white p-3.5 rounded-full shadow-xl transition-all duration-300 ease-in-out"
        >
          <MessageCircle className="w-6 h-6 text-white/80" />
        </button>
      )}

      {/* Full Chat Window */}
      {isOpen && (
        <div className="w-96 bg-black/30 backdrop-blur-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-white/5 backdrop-blur-md p-4 flex justify-between items-center border-b border-white/10">
            <h3 className="text-white/80 font-medium text-sm tracking-wide">AI Chat Support</h3>
            <div className="flex space-x-2">
              <button 
                onClick={() => { setIsOpen(false); setIsMinimized(true); }}
                className="text-white/60 hover:text-white/90 transition-colors"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/60 hover:text-white/90 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Container */}
          <div 
            ref={chatContainerRef}
            className="h-[26rem] p-4 space-y-3 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`
                    max-w-[85%] p-3 rounded-2xl 
                    ${msg.sender === 'user' 
                      ? 'bg-white/10 backdrop-blur-md text-white' 
                      : 'bg-white/5 backdrop-blur-md text-white/80'}
                    transition-all duration-300 ease-in-out
                  `}
                >
                  <ReactMarkdown>{msg.text}</ReactMarkdown>
                </div>
              </div>
            ))}
            
            {isGenerating && (
              <div className="flex justify-start">
                <div className="bg-white/5 backdrop-blur-md text-white/60 p-3 rounded-2xl animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="p-4 border-t border-white/10 bg-white/5 backdrop-blur-md">
            <div className="flex items-center space-x-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="
                  w-full p-2 bg-white/10 backdrop-blur-md 
                  text-white placeholder-white/40 
                  rounded-xl border border-white/20 
                  focus:outline-none focus:ring-1 focus:ring-white/30
                  resize-none transition-all duration-300
                "
                rows={2}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                disabled={isGenerating}
              />
              <button
                type="submit"
                className={`
                  bg-white/10 backdrop-blur-md rounded-full p-2.5 
                  hover:bg-white/20 transition-all duration-300
                  ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                disabled={isGenerating}
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <button
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
          className="
            bg-white/10 backdrop-blur-md 
            text-white/80 px-4 py-2 
            rounded-xl 
            hover:bg-white/20 
            transition-all duration-300 
            border border-white/20
            shadow-md
          "
        >
          Chat Support
        </button>
      )}
    </div>
  );
};

export default ModernChatPopup;
