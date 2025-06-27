
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X } from 'lucide-react';

interface LiveChatProps {
  onClose?: () => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ onClose }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-refresh messages every 2 seconds to get admin replies
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = () => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const currentUserEmail = JSON.parse(localStorage.getItem('currentUser') || '{}').email;
    
    // Filter messages for current user and admin replies to this user
    const userMessages = savedMessages.filter(msg => 
      msg.senderEmail === currentUserEmail || 
      (msg.isAdmin && msg.replyTo === currentUserEmail)
    );
    
    setMessages(userMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message = {
      id: Date.now(),
      text: newMessage,
      sender: currentUser?.fullName || 'User',
      senderEmail: currentUser?.email || '',
      timestamp: new Date().toISOString(),
      isAdmin: false
    };

    const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const updatedMessages = [...allMessages, message];
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    
    // Update local state for immediate display
    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative z-10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MessageSquare className="w-6 h-6 text-white" />
              <div>
                <h2 className="text-lg font-bold text-white drop-shadow-lg">Live Chat</h2>
                <p className="text-sm text-blue-100">Chat dengan Admin ARVIN</p>
              </div>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                className="text-white hover:text-red-200 transition-colors bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Mulai percakapan dengan admin</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isAdmin ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-2xl ${
                      message.isAdmin
                        ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                        : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-semibold">
                        {message.isAdmin ? 'Admin' : 'Anda'}
                      </span>
                      <span className={`text-xs ${message.isAdmin ? 'text-gray-500' : 'text-blue-100'}`}>
                        {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex space-x-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan Anda..."
                className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={2}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
