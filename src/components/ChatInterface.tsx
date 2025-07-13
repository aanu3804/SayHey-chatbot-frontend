
import React, { useState, useRef, useEffect } from 'react';
import { Send, Heart } from 'lucide-react';
import ChatMessage from './ChatMessage';
import TypingIndicator from './TypingIndicator';
import { sendMessage } from '@/lib/api';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "नमस्ते! Hi there! I'm SayHey, your emotional support companion. I'm here to listen and help. How are you feeling today? 💚",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [userId] = useState(() => {
    const stored = localStorage.getItem('sayhey-user-id');
    if (stored) return stored;
    const newId = 'user-' + Date.now();
    localStorage.setItem('sayhey-user-id', newId);
    return newId;
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
    adjustTextareaHeight();
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }

    try {
      // Connect to backend API
      const data = await sendMessage({
        message: userMessage.text,
        user_id: userId
      });
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response,
        isUser: false,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now, but I'm still here for you. Please try again in a moment. 💙",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-sage-50 to-blue-50 font-inter">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-sage-200 px-4 py-4 shadow-sm">
        <div className="flex items-center justify-center">
          <Heart className="text-sage-600 mr-2" size={24} />
          <h1 className="text-xl font-semibold text-sage-800">SayHey</h1>
        </div>
        <p className="text-sm text-sage-600 text-center mt-1">Your emotional support companion</p>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-sage-200 p-4">
        <div className="flex items-end space-x-3 max-w-4xl mx-auto">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={inputText}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              placeholder="Share your thoughts in Hindi or English..."
              className="w-full resize-none rounded-2xl border border-sage-300 px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-sage-400 focus:border-sage-400 placeholder-sage-500 text-sage-800 bg-white/90 transition-all duration-200"
              rows={1}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-sage-600 hover:bg-sage-700 disabled:bg-sage-300 text-white rounded-full p-3 transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
