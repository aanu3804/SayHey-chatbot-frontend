
import React from 'react';
import { Bot, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const formatTime = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div className={`flex max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          message.isUser 
            ? 'bg-blue-500 ml-2' 
            : 'bg-sage-500 mr-2'
        } shadow-sm`}>
          {message.isUser ? (
            <User size={16} className="text-white" />
          ) : (
            <Bot size={16} className="text-white" />
          )}
        </div>
        
        {/* Message Bubble */}
        <div className="flex flex-col">
          <div className={`rounded-2xl px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md ${
            message.isUser
              ? 'bg-blue-500 text-white rounded-br-md'
              : 'bg-white text-sage-800 border border-sage-200 rounded-bl-md'
          }`}>
            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
              {message.text}
            </p>
          </div>
          <span className={`text-xs text-sage-500 mt-1 ${
            message.isUser ? 'text-right' : 'text-left'
          }`}>
            {formatTime(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
