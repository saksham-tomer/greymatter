"use client"
import { useState } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';

const ChatPopup = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, text: 'Hello! How can I help you today?', sender: 'bot' }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      setMessages([...messages, { id: Date.now(), text: message, sender: 'user' }]);
      setMessage('');
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
              <button onClick={() =>  {setIsOpen(false); setIsMinimized(true)}} className="hover:text-red-600">
                <Minus className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="hover:text-red-600">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="p-4 h-96 overflow-y-auto flex flex-col gap-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`max-w-[80%] p-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-neutral-500 text-white self-end'
                    : 'bg-gray-100 self-start'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              />
              <button
                type="submit"
                className="bg-neutral-800 text-white p-2 rounded-lg hover:bg-neutral-600"
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