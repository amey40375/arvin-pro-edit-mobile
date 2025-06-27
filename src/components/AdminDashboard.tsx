
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ShoppingBag, Settings, LogOut, Check, X, MessageSquare, Edit } from 'lucide-react';

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
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPendingUsers(JSON.parse(localStorage.getItem('pendingUsers') || '[]'));
    setOrders(JSON.parse(localStorage.getItem('orders') || '[]'));
    setMarqueText(localStorage.getItem('marqueText') || 'Selamat datang di ARVIN PROFESSIONAL EDITING - Layanan terbaik untuk kebutuhan editing Anda!');
    setPromoSettings(JSON.parse(localStorage.getItem('promoSettings') || '{"enabled":false,"title":"","content":"","image":""}'));
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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="flex space-x-8 px-4">
          {[
            { id: 'users', label: 'Verifikasi User', icon: Users },
            { id: 'orders', label: 'Kelola Pesanan', icon: ShoppingBag },
            { id: 'settings', label: 'Pengaturan', icon: Settings },
            { id: 'chat', label: 'Live Chat', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-5 h-5" />
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

        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Live Chat dengan User</h2>
            <div className="bg-gray-50 rounded-lg p-4 h-96 flex items-center justify-center">
              <p className="text-gray-500">Fitur live chat akan segera hadir...</p>
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
