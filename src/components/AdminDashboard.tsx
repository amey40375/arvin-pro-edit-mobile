import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Settings, LogOut, Check, X, MessageSquare, Edit, Send } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [pendingUsers, setPendingUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [marqueText, setMarqueText] = useState('');
  const [showMarqueEdit, setShowMarqueEdit] = useState(false);
  const [promoSettings, setPromoSettings] = useState({ enabled: false, title: '', content: '', image: '' });
  const [showPromoEdit, setShowPromoEdit] = useState(false);
  const [priceInput, setPriceInput] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);
  
  // Live Chat States
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUserChat, setSelectedUserChat] = useState('');
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
    loadMessages();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Auto-refresh messages every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadMessages();
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadData = () => {
    setPendingUsers(JSON.parse(localStorage.getItem('pendingUsers') || '[]'));
    setOrders(JSON.parse(localStorage.getItem('orders') || '[]'));
    setMarqueText(localStorage.getItem('marqueText') || 'Selamat datang di ARVIN PROFESSIONAL EDITING - Layanan terbaik untuk kebutuhan editing Anda!');
    setPromoSettings(JSON.parse(localStorage.getItem('promoSettings') || '{"enabled":false,"title":"","content":"","image":""}'));
  };

  const loadMessages = () => {
    const savedMessages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    setMessages(savedMessages);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getUniqueUsers = () => {
    const userEmails = [...new Set(messages.map(msg => msg.senderEmail).filter(email => email && !email.includes('admin')))];
    return userEmails;
  };

  const getFilteredMessages = () => {
    if (!selectedUserChat) return messages;
    return messages.filter(msg => 
      msg.senderEmail === selectedUserChat || 
      (msg.isAdmin && msg.replyTo === selectedUserChat)
    );
  };

  const handleSendAdminMessage = () => {
    if (!newMessage.trim() || !selectedUserChat) return;

    const adminMessage = {
      id: Date.now(),
      text: newMessage,
      sender: 'Admin ARVIN',
      senderEmail: 'admin@arvin.com',
      timestamp: new Date().toISOString(),
      isAdmin: true,
      replyTo: selectedUserChat
    };

    const updatedMessages = [...messages, adminMessage];
    setMessages(updatedMessages);
    localStorage.setItem('chatMessages', JSON.stringify(updatedMessages));
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendAdminMessage();
    }
  };

  const handleUserAction = (userId: number, action: 'approve' | 'reject') => {
    const pending = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
    const user = pending.find((u: any) => u.id === userId);
    
    if (user) {
      const updatedPending = pending.filter((u: any) => u.id !== userId);
      localStorage.setItem('pendingUsers', JSON.stringify(updatedPending));

      if (action === 'approve') {
        const approved = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
        approved.push(user);
        localStorage.setItem('approvedUsers', JSON.stringify(approved));
      } else {
        const rejected = JSON.parse(localStorage.getItem('rejectedUsers') || '[]');
        rejected.push(user);
        localStorage.setItem('rejectedUsers', JSON.stringify(rejected));
      }

      loadData();
    }
  };

  const handleOrderStatus = (orderId: number, status: string) => {
    if (status === 'Sedang Dikerjakan') {
      setSelectedOrder(orderId);
      setShowPriceModal(true);
      return;
    }

    const updatedOrders = orders.map((order: any) => 
      order.id === orderId ? { ...order, status, updatedAt: new Date().toISOString() } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
  };

  const handlePriceSubmit = () => {
    if (!priceInput) {
      alert('Harap masukkan harga!');
      return;
    }

    const updatedOrders = orders.map((order: any) => 
      order.id === selectedOrder ? { 
        ...order, 
        status: 'Sedang Dikerjakan', 
        price: priceInput,
        updatedAt: new Date().toISOString()
      } : order
    );
    setOrders(updatedOrders);
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    
    setShowPriceModal(false);
    setPriceInput('');
    setSelectedOrder(null);
  };

  const handleCompleteOrder = (orderId: number) => {
    const order = orders.find((o: any) => o.id === orderId);
    if (order) {
      const invoice = {
        id: Date.now(),
        orderId: order.id,
        userName: order.userName,
        service: order.service,
        price: order.price,
        date: new Date().toISOString(),
        invoiceNumber: `INV-${Date.now()}`
      };

      const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
      invoices.push(invoice);
      localStorage.setItem('invoices', JSON.stringify(invoices));

      handleOrderStatus(orderId, 'Selesai');
    }
  };

  const saveMarqueText = () => {
    localStorage.setItem('marqueText', marqueText);
    setShowMarqueEdit(false);
    alert('Teks berjalan berhasil diperbarui!');
  };

  const savePromoSettings = () => {
    localStorage.setItem('promoSettings', JSON.stringify(promoSettings));
    setShowPromoEdit(false);
    alert('Pengaturan promo berhasil disimpan!');
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  if (showLiveChat) {
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Live Chat Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
            <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          </div>
          
          <div className="relative z-10 p-4">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-white drop-shadow-lg">Live Chat Admin</h1>
              <button
                onClick={() => setShowLiveChat(false)}
                className="text-white hover:text-red-200 transition-colors bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/30"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Chat Content */}
        <div className="p-4">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="flex h-96">
              {/* User List */}
              <div className="w-1/3 border-r border-gray-200 bg-gray-50">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-semibold text-gray-700">Daftar User</h3>
                </div>
                <div className="overflow-y-auto h-full">
                  {getUniqueUsers().length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Belum ada chat</p>
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
                          className={`w-full p-3 text-left border-b border-gray-100 hover:bg-white transition-colors ${
                            selectedUserChat === userEmail ? 'bg-white border-l-4 border-l-blue-500' : ''
                          }`}
                        >
                          <div className="font-medium text-sm text-gray-800">{userName}</div>
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
                    <div className="p-4 border-b border-gray-200 bg-gray-50">
                      <h4 className="font-semibold text-gray-800">
                        Chat dengan {messages.find(msg => msg.senderEmail === selectedUserChat)?.sender || selectedUserChat}
                      </h4>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {getFilteredMessages().map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.isAdmin ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-2xl ${
                              message.isAdmin
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <div className="flex items-center space-x-2 mb-1">
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
                            <p className="text-sm">{message.text}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Message Input */}
                    <div className="p-4 border-t border-gray-200">
                      <div className="flex space-x-3">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ketik balasan..."
                          className="flex-1 p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          rows={2}
                        />
                        <button
                          onClick={handleSendAdminMessage}
                          disabled={!newMessage.trim()}
                          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MessageSquare className="w-16 h-16 mx-auto mb-4 opacity-30" />
                      <p>Pilih user untuk mulai chat</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Enhanced Header with Animation */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 p-4">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">Admin Dashboard</h1>
              <p className="text-blue-100 mt-1 font-medium">Panel Kontrol Admin</p>
            </div>
            
            {/* Live Chat Button */}
            <button
              onClick={() => setShowLiveChat(true)}
              className="mr-3 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-all duration-300 shadow-lg"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-white hover:text-red-200 transition-colors bg-white/20 backdrop-blur-sm px-3 py-2 rounded-lg hover:bg-white/30"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Smaller Navigation Tabs */}
      <div className="bg-white border-b shadow-sm">
        <div className="flex space-x-2 px-4 py-2 overflow-x-auto">
          {[
            { id: 'users', label: 'Users', icon: Users },
            { id: 'orders', label: 'Orders', icon: ShoppingBag },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg font-medium text-sm transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">User Menunggu Verifikasi</h2>
            {pendingUsers.length === 0 ? (
              <p className="text-gray-500">Tidak ada user yang menunggu verifikasi.</p>
            ) : (
              <div className="space-y-4">
                {pendingUsers.map((user: any) => (
                  <div key={user.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {user.profilePhoto && (
                        <img
                          src={user.profilePhoto}
                          alt={user.fullName}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      )}
                      <div>
                        <h3 className="font-medium">{user.fullName}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-xs text-gray-400">
                          Daftar: {new Date(user.registrationDate).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleUserAction(user.id, 'approve')}
                        className="flex items-center space-x-1 bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                        <span>Terima</span>
                      </button>
                      <button
                        onClick={() => handleUserAction(user.id, 'reject')}
                        className="flex items-center space-x-1 bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                        <span>Tolak</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Kelola Pesanan</h2>
            {orders.length === 0 ? (
              <p className="text-gray-500">Tidak ada pesanan.</p>
            ) : (
              <div className="space-y-4">
                {orders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{order.userName}</h3>
                        <p className="text-sm text-gray-600">{order.service}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        order.status === 'Menunggu' ? 'bg-yellow-100 text-yellow-800' :
                        order.status === 'Sedang Dikerjakan' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {order.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{order.description}</p>
                    {order.price && (
                      <p className="text-sm font-medium text-green-600 mb-3">
                        Harga: Rp {parseInt(order.price).toLocaleString('id-ID')}
                      </p>
                    )}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleOrderStatus(order.id, 'Ditolak')}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Tolak
                      </button>
                      <button
                        onClick={() => handleOrderStatus(order.id, 'Sedang Dikerjakan')}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Kerjakan
                      </button>
                      {order.status === 'Sedang Dikerjakan' && (
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 transition-colors"
                        >
                          Selesai
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-6">
            {/* Marquee Text Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pengaturan Teks Berjalan</h2>
                <button
                  onClick={() => setShowMarqueEdit(!showMarqueEdit)}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
              {showMarqueEdit ? (
                <div className="space-y-4">
                  <textarea
                    value={marqueText}
                    onChange={(e) => setMarqueText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    rows={3}
                    placeholder="Masukkan teks yang akan berjalan..."
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={saveMarqueText}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setShowMarqueEdit(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{marqueText}</p>
                </div>
              )}
            </div>

            {/* Promo Settings */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Pengaturan Pop-up Promo</h2>
                <button
                  onClick={() => setShowPromoEdit(!showPromoEdit)}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>
              {showPromoEdit ? (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={promoSettings.enabled}
                      onChange={(e) => setPromoSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label className="text-sm font-medium text-gray-700">Aktifkan Pop-up Promo</label>
                  </div>
                  <input
                    type="text"
                    placeholder="Judul Promo"
                    value={promoSettings.title}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                  <textarea
                    placeholder="Konten Promo"
                    value={promoSettings.content}
                    onChange={(e) => setPromoSettings(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    rows={4}
                  />
                  <div className="flex space-x-2">
                    <button
                      onClick={savePromoSettings}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      Simpan
                    </button>
                    <button
                      onClick={() => setShowPromoEdit(false)}
                      className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">
                    Status: {promoSettings.enabled ? 'Aktif' : 'Nonaktif'}
                  </p>
                  <p className="font-medium">{promoSettings.title || 'Belum ada judul'}</p>
                  <p className="text-gray-700 mt-2">{promoSettings.content || 'Belum ada konten'}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Price Modal */}
      {showPriceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Masukkan Harga</h3>
            <input
              type="number"
              placeholder="Masukkan harga dalam Rupiah"
              value={priceInput}
              onChange={(e) => setPriceInput(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 mb-4"
            />
            <div className="flex space-x-2">
              <button
                onClick={handlePriceSubmit}
                className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Simpan
              </button>
              <button
                onClick={() => {
                  setShowPriceModal(false);
                  setPriceInput('');
                  setSelectedOrder(null);
                }}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
