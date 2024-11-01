"use client"
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { generateWormholeResponse,context } from '@/lib/model';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' }
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
          "AIzaSyAFbxx4LAR7KQaeCf0lJmiPd4nae2f60Nw"
        }`,
        method: "post",
        data: {
          contents: [{ parts: [{ text: message +"messeage less than 50"}] }],
        },
      });
      const data =   await generateWormholeResponse(context,message)
      console.log(data)


      const aiResponse = response["data"]["candidates"][0]["content"]["parts"][0]["text"];
      console.log(aiResponse)
      const botMessage = { 
        id: Date.now() + 1, 
        text: data, 
        sender: 'bot' 
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error("Error generating response:", error);
      const errorMessage = { 
        id: Date.now() + 1, 
        text: "Sorry, something went wrong. Please try again.", 
        sender: 'bot' 
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col z-50">
      {!isOpen && !isMinimized && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-neutral-800 hover:bg-neutral-900 text-white p-4 rounded-full shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {isOpen && (
        <div className="bg-neutral-900 rounded-lg shadow-xl w-80 flex flex-col">
          {/* Header */}
          <div className="bg-neutral-800 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Grey Chat Support</h3>
            <div className="flex gap-2">
              <button 
                onClick={() =>  {setIsOpen(false); setIsMinimized(true)}} 
                className="hover:text-red-600"
              >
                <Minus className="w-5 h-5" />
              </button>
              <button 
                onClick={() => setIsOpen(false)} 
                className="hover:text-red-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div 
            ref={chatContainerRef}
            className="p-4 h-96 overflow-y-auto flex flex-col gap-4"
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-neutral-500 text-white self-end'
                    : 'bg-gray-100 self-start'
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            ))}
            
            {isGenerating && (
              <div className="self-start bg-gray-100 p-3 rounded-lg animate-pulse">
                Thinking...
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
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
                className={`bg-neutral-800 text-white p-2 rounded-lg hover:bg-neutral-600 ${
                  isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={isGenerating}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}

      {isMinimized && (
        <button
          onClick={() => {
            setIsMinimized(false);
            setIsOpen(true);
          }}
          className="bg-neutral-500 hover:bg-neutral-400 text-white px-4 py-2 rounded-t-lg shadow-lg"
        >
          Chat Support
        </button>
      )}
    </div>
  );
};

export default ChatPopup;