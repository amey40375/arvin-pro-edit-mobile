
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, X } from 'lucide-react';

interface LiveChatProps {
  onClose?: () => void;
  isAdmin?: boolean;
}

const LiveChat: React.FC<LiveChatProps> = ({ onClose, isAdmin = false }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserChat, setSelectedUserChat] = useState('');
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
    
    if (isAdmin) {
      setMessages(savedMessages);
    } else {
      const currentUserEmail = JSON.parse(localStorage.getItem('currentUser') || '{}').email;
      // Filter messages for current user and admin replies to this user
      const userMessages = savedMessages.filter(msg => 
        msg.senderEmail === currentUserEmail || 
        (msg.isAdmin && msg.replyTo === currentUserEmail)
      );
      setMessages(userMessages);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getUniqueUsers = () => {
    const userEmails = [...new Set(messages.map(msg => msg.senderEmail).filter(email => email && !email.includes('admin')))];
    return userEmails;
  };

  const getFilteredMessages = () => {
    if (!isAdmin || !selectedUserChat) return messages;
    return messages.filter(msg => 
      msg.senderEmail === selectedUserChat || 
      (msg.isAdmin && msg.replyTo === selectedUserChat)
    );
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    let message;
    if (isAdmin) {
      if (!selectedUserChat) return;
      message = {
        id: Date.now(),
        text: newMessage,
        sender: 'Admin ARVIN',
        senderEmail: 'admin@arvin.com',
        timestamp: new Date().toISOString(),
        isAdmin: true,
        replyTo: selectedUserChat
      };
    } else {
      message = {
        id: Date.now(),
        text: newMessage,
        sender: currentUser?.fullName || 'User',
        senderEmail: currentUser?.email || '',
        timestamp: new Date().toISOString(),
        isAdmin: false
      };
    }

    const allMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const updatedMessages = [...allMessages, message];
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    
    // Update local state for immediate display
    if (isAdmin) {
      setMessages(updatedMessages);
    } else {
      setMessages(prev => [...prev, message]);
    }
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const displayMessages = isAdmin ? getFilteredMessages() : messages;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 overflow-hidden">
          {/* Animated Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-32 h-32 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute top-0 -right-4 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <MessageSquare className="w-5 h-5 text-white" />
                <div>
                  <h2 className="text-lg font-bold text-white drop-shadow-lg">
                    {isAdmin ? 'Live Chat Admin' : 'Live Chat'}
                  </h2>
                  <p className="text-sm text-blue-100">
                    {isAdmin ? 'Chat dengan Users' : 'Chat dengan Admin ARVIN'}
                  </p>
                </div>
              </div>
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-white hover:text-red-200 transition-colors bg-white/20 backdrop-blur-sm p-2 rounded-lg hover:bg-white/30"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        {isAdmin ? (
          <div className="flex flex-1 overflow-hidden">
            {/* User List */}
            <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
              <div className="p-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-700 text-sm">Daftar User</h3>
              </div>
              <div className="flex-1 overflow-y-auto">
                {getUniqueUsers().length === 0 ? (
                  <div className="p-3 text-center text-gray-500">
                    <MessageSquare className="w-6 h-6 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Belum ada chat</p>
                  </div>
                ) : (
                  getUniqueUsers().map((userEmail) => {
                    const userMessages = messages.filter(msg => msg.senderEmail === userEmail);
                    const lastMessage = userMessages[userMessages.length - 1];
                    const userName = lastMessage?.sender || userEmail;
                    
                    return (
                      <button
                        key={userEmail}
                        onClick={() => setSelectedUserChat(userEmail)}
                        className={`w-full p-2 text-left border-b border-gray-100 hover:bg-white transition-colors ${
                          selectedUserChat === userEmail ? 'bg-white border-l-4 border-l-blue-500' : ''
                        }`}
                      >
                        <div className="font-medium text-xs text-gray-800">{userName}</div>
                        <div className="text-xs text-gray-500 truncate">
                          {lastMessage?.text || 'Belum ada pesan'}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {selectedUserChat ? (
                <>
                  {/* Chat Header */}
                  <div className="p-3 border-b border-gray-200 bg-gray-50">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      Chat dengan {messages.find(msg => msg.senderEmail === selectedUserChat)?.sender || selectedUserChat}
                    </h4>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-gray-50">
                    {displayMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs px-3 py-2 rounded-xl text-sm ${
                            message.isAdmin
                              ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                              : 'bg-white text-gray-800 shadow-sm border border-gray-200'
                          }`}
                        >
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="text-xs font-semibold">
                              {message.isAdmin ? 'Admin' : message.sender}
                            </span>
                            <span className={`text-xs ${message.isAdmin ? 'text-blue-100' : 'text-gray-500'}`}>
                              {new Date(message.timestamp).toLocaleTimeString('id-ID', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <p className="text-xs leading-relaxed">{message.text}</p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Message Input */}
                  <div className="p-3 border-t border-gray-200">
                    <div className="flex space-x-2">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ketik balasan..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-sm"
                        rows={1}
                      />
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Pilih user untuk mulai chat</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {displayMessages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-sm">Mulai percakapan dengan admin</p>
                </div>
              ) : (
                displayMessages.map((message) => (
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
          </>
        )}
      </div>
    </div>
  );
};

export default LiveChat;
