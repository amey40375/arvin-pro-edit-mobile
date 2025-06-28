
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, User, Star, MessageSquare, FileText, Palette, Megaphone, Coffee, Heart, Smartphone, Laptop, Globe, Video, Camera, Music } from 'lucide-react';
import MarqueeText from './MarqueeText';
import PromoPopup from './PromoPopup';
import TestimonialSection from './TestimonialSection';
import LiveChat from './LiveChat';
import { createOrder, getOrdersByUser, getInvoiceByOrderId } from '../utils/supabaseHelpers';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [currentUser, setCurrentUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [orderFile, setOrderFile] = useState(null);
  const [showLiveChat, setShowLiveChat] = useState(false);
  const navigate = useNavigate();

  const services = [
    { id: 1, name: 'Bikin\nLogo', icon: Palette, color: 'from-pink-500 to-rose-500' },
    { id: 2, name: 'Desain\nSpanduk', icon: Megaphone, color: 'from-blue-500 to-cyan-500' },
    { id: 3, name: 'Desain Menu\nCafe', icon: Coffee, color: 'from-amber-500 to-yellow-500' },
    { id: 4, name: 'Kartu\nUndangan', icon: Heart, color: 'from-red-500 to-pink-500' },
    { id: 5, name: 'Buku Tamu\nDigital', icon: Smartphone, color: 'from-green-500 to-emerald-500' },
    { id: 6, name: 'Bikin\nAplikasi', icon: Laptop, color: 'from-purple-500 to-indigo-500' },
    { id: 7, name: 'Hosting\nWebsite', icon: Globe, color: 'from-teal-500 to-cyan-500' },
    { id: 8, name: 'Edit Video\nPrewedding', icon: Video, color: 'from-orange-500 to-red-500' },
    { id: 9, name: 'Edit Foto\n& Video', icon: Camera, color: 'from-violet-500 to-purple-500' },
    { id: 10, name: 'Jasa Lagu &\nAransemen', icon: Music, color: 'from-indigo-500 to-blue-500' }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
    if (user.email) {
      loadUserOrders(user.email);
    }
  }, []);

  const loadUserOrders = async (userEmail: string) => {
    try {
      const orders = await getOrdersByUser(userEmail);
      setUserOrders(orders);
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  };

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName.replace('\n', ' '));
    setShowOrderForm(true);
  };

  const handleOrderSubmit = async () => {
    if (!orderDescription) {
      alert('Harap isi deskripsi pesanan!');
      return;
    }

    try {
      const orderData = {
        userName: currentUser.full_name || currentUser.fullName,
        userEmail: currentUser.email,
        service: selectedService,
        description: orderDescription,
        file: orderFile ? URL.createObjectURL(orderFile) : null
      };

      await createOrder(orderData);

      setShowOrderForm(false);
      setOrderDescription('');
      setOrderFile(null);
      setSelectedService('');
      
      // Reload orders
      await loadUserOrders(currentUser.email);
      alert('Pesanan berhasil dikirim!');
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Gagal mengirim pesanan. Silakan coba lagi.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const viewInvoice = async (orderId: number) => {
    try {
      const invoice = await getInvoiceByOrderId(orderId);
      const order = userOrders.find((o: any) => o.id === orderId);
      
      if (invoice && order) {
        const invoiceWindow = window.open('', '_blank');
        invoiceWindow?.document.write(`
          <html>
            <head>
              <title>Invoice - INV-${invoice.id}</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; background: #f8fafc; }
                .invoice-container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
                .header h1 { color: #1e293b; margin-bottom: 5px; }
                .header h2 { color: #64748b; }
                .invoice-details { margin-bottom: 20px; }
                .invoice-details p { margin: 10px 0; }
                .total { font-size: 24px; font-weight: bold; color: #059669; text-align: center; background: #ecfdf5; padding: 15px; border-radius: 8px; }
              </style>
            </head>
            <body>
              <div class="invoice-container">
                <div class="header">
                  <h1>ARVIN PROFESSIONAL EDITING</h1>
                  <h2>INVOICE</h2>
                </div>
                <div class="invoice-details">
                  <p><strong>Nomor Invoice:</strong> INV-${invoice.id}</p>
                  <p><strong>Nama:</strong> ${order.user_name}</p>
                  <p><strong>Jenis Jasa:</strong> ${order.service}</p>
                  <p><strong>Tanggal:</strong> ${new Date(invoice.created_at).toLocaleDateString('id-ID')}</p>
                </div>
                <div class="total">
                  <strong>Total Harga: Rp ${parseInt(invoice.amount).toLocaleString('id-ID')}</strong>
                </div>
              </div>
            </body>
          </html>
        `);
      }
    } catch (error) {
      console.error('Error viewing invoice:', error);
      alert('Invoice tidak ditemukan.');
    }
  };

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Menunggu';
      case 'accepted': return 'Diterima';
      case 'in_progress': return 'Sedang Dikerjakan';
      case 'completed': return 'Selesai';
      case 'rejected': return 'Ditolak';
      default: return status;
    }
  };

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (showLiveChat) {
    return <LiveChat onClose={() => setShowLiveChat(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <PromoPopup />
      
      {/* Enhanced Header with Animation */}
      <div className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 px-4 py-6">
          <div className="flex justify-between items-center">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white drop-shadow-lg">
                ARVIN PROFESSIONAL
              </h1>
              <p className="text-blue-100 mt-1 font-medium">Halo, {currentUser?.full_name || currentUser?.fullName}!</p>
            </div>
            
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

      <MarqueeText />

      {/* Navigation */}
      <div className="bg-white shadow-sm sticky top-0 z-40">
        <div className="flex overflow-x-auto px-4 py-2 space-x-1">
          {[
            { id: 'services', label: 'Layanan', icon: ShoppingBag },
            { id: 'orders', label: 'Pesanan', icon: FileText },
            { id: 'profile', label: 'Profil', icon: User }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-300 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="text-sm">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 pb-20">
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">Pilih Layanan Kami</h2>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.name)}
                    className="service-card group relative overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`}></div>
                    <div className="relative z-10 flex flex-col items-center text-center h-24 justify-center">
                      <service.icon className={`w-8 h-8 mb-2 text-gray-700`} />
                      <span className="text-xs font-semibold text-gray-700 leading-tight whitespace-pre-line">
                        {service.name}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            <TestimonialSection />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Pesanan Saya</h2>
            {userOrders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Belum ada pesanan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order: any) => (
                  <div key={order.id} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-gray-800">{order.service}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(order.created_at).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusText(order.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{order.description}</p>
                    {order.price && (
                      <p className="text-sm font-bold text-green-600 mb-3">
                        Harga: Rp {parseInt(order.price).toLocaleString('id-ID')}
                      </p>
                    )}
                    {order.status === 'completed' && (
                      <button
                        onClick={() => viewInvoice(order.id)}
                        className="modern-button text-sm py-2 px-4"
                      >
                        Lihat Invoice
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Profil Saya</h2>
            <div className="flex items-center space-x-4 mb-6">
              {currentUser?.profile_photo || currentUser?.profilePhoto ? (
                <img
                  src={currentUser.profile_photo || currentUser.profilePhoto}
                  alt={currentUser.full_name || currentUser.fullName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-blue-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <User className="w-10 h-10 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{currentUser?.full_name || currentUser?.fullName}</h3>
                <p className="text-gray-600">{currentUser?.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Pesan {selectedService}</h3>
            <div className="space-y-4">
              <textarea
                placeholder="Jelaskan kebutuhan Anda dengan detail..."
                value={orderDescription}
                onChange={(e) => setOrderDescription(e.target.value)}
                className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={4}
              />
              <input
                type="file"
                onChange={(e) => setOrderFile(e.target.files?.[0] || null)}
                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex space-x-3">
                <button
                  onClick={handleOrderSubmit}
                  className="flex-1 modern-button"
                >
                  Kirim Pesanan
                </button>
                <button
                  onClick={() => {
                    setShowOrderForm(false);
                    setOrderDescription('');
                    setOrderFile(null);
                    setSelectedService('');
                  }}
                  className="flex-1 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showLiveChat && (
        <LiveChat onClose={() => setShowLiveChat(false)} />
      )}
    </div>
  );
};

export default UserDashboard;
