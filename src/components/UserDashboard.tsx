
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, ShoppingBag, User, Star, MessageSquare, FileText } from 'lucide-react';
import MarqueeText from './MarqueeText';
import PromoPopup from './PromoPopup';
import TestimonialSection from './TestimonialSection';

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState('services');
  const [currentUser, setCurrentUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [orderDescription, setOrderDescription] = useState('');
  const [orderFile, setOrderFile] = useState(null);
  const navigate = useNavigate();

  const services = [
    { id: 1, name: 'Bikin Logo', icon: '🎨' },
    { id: 2, name: 'Desain Spanduk', icon: '🎯' },
    { id: 3, name: 'Desain Menu Cafe', icon: '📋' },
    { id: 4, name: 'Kartu Undangan', icon: '💌' },
    { id: 5, name: 'Buku Tamu Digital', icon: '📱' },
    { id: 6, name: 'Bikin Aplikasi', icon: '💻' },
    { id: 7, name: 'Hosting Website', icon: '🌐' },
    { id: 8, name: 'Edit Video Prewedding', icon: '🎬' },
    { id: 9, name: 'Edit Foto & Video', icon: '📸' },
    { id: 10, name: 'Jasa Lagu & Aransemen', icon: '🎵' }
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setCurrentUser(user);
    loadUserOrders(user.email);
  }, []);

  const loadUserOrders = (userEmail: string) => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const filteredOrders = allOrders.filter((order: any) => order.userEmail === userEmail);
    setUserOrders(filteredOrders);
  };

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    setShowOrderForm(true);
  };

  const handleOrderSubmit = () => {
    if (!orderDescription) {
      alert('Harap isi deskripsi pesanan!');
      return;
    }

    const newOrder = {
      id: Date.now(),
      userName: currentUser.fullName,
      userEmail: currentUser.email,
      service: selectedService,
      description: orderDescription,
      file: orderFile ? URL.createObjectURL(orderFile) : null,
      status: 'Menunggu',
      createdAt: new Date().toISOString()
    };

    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));

    setShowOrderForm(false);
    setOrderDescription('');
    setOrderFile(null);
    setSelectedService('');
    
    loadUserOrders(currentUser.email);
    alert('Pesanan berhasil dikirim!');
  };

  const handleLogout = () => {
    localStorage.removeItem('userRole');
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const viewInvoice = (orderId: number) => {
    const invoices = JSON.parse(localStorage.getItem('invoices') || '[]');
    const invoice = invoices.find((inv: any) => inv.orderId === orderId);
    
    if (invoice) {
      const invoiceWindow = window.open('', '_blank');
      invoiceWindow?.document.write(`
        <html>
          <head>
            <title>Invoice - ${invoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .header { text-align: center; margin-bottom: 30px; }
              .invoice-details { margin-bottom: 20px; }
              .total { font-size: 18px; font-weight: bold; color: #2563eb; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>ARVIN PROFESSIONAL EDITING</h1>
              <h2>INVOICE</h2>
            </div>
            <div class="invoice-details">
              <p><strong>Nomor Invoice:</strong> ${invoice.invoiceNumber}</p>
              <p><strong>Nama:</strong> ${invoice.userName}</p>
              <p><strong>Jenis Jasa:</strong> ${invoice.service}</p>
              <p><strong>Tanggal:</strong> ${new Date(invoice.date).toLocaleDateString('id-ID')}</p>
              <p class="total"><strong>Total Harga: Rp ${parseInt(invoice.price).toLocaleString('id-ID')}</strong></p>
            </div>
          </body>
        </html>
      `);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PromoPopup />
      
      {/* Header */}
      <div className="bg-white shadow-md p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">ARVIN PROFESSIONAL</h1>
            <p className="text-gray-600">Selamat datang, {currentUser?.fullName}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-600 hover:text-red-800 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>Keluar</span>
          </button>
        </div>
      </div>

      {/* Marquee Text */}
      <MarqueeText />

      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="flex space-x-8 px-4">
          {[
            { id: 'services', label: 'Layanan', icon: ShoppingBag },
            { id: 'orders', label: 'Pesanan Saya', icon: FileText },
            { id: 'profile', label: 'Profil', icon: User },
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
        {activeTab === 'services' && (
          <div>
            {/* Services Grid */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-6">Pilih Layanan</h2>
              <div className="grid grid-cols-2 gap-4">
                {services.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.name)}
                    className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all duration-300 text-center group"
                  >
                    <div className="text-3xl mb-2">{service.icon}</div>
                    <div className="text-sm font-medium text-gray-700 group-hover:text-blue-600">
                      {service.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <TestimonialSection />
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Pesanan Saya</h2>
            {userOrders.length === 0 ? (
              <p className="text-gray-500">Belum ada pesanan.</p>
            ) : (
              <div className="space-y-4">
                {userOrders.map((order: any) => (
                  <div key={order.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">{order.service}</h3>
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
                    <p className="text-sm text-gray-700 mb-2">{order.description}</p>
                    {order.price && (
                      <p className="text-sm font-medium text-green-600 mb-2">
                        Harga: Rp {parseInt(order.price).toLocaleString('id-ID')}
                      </p>
                    )}
                    {order.status === 'Selesai' && (
                      <button
                        onClick={() => viewInvoice(order.id)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Profil Saya</h2>
            <div className="flex items-center space-x-4 mb-6">
              {currentUser?.profilePhoto && (
                <img
                  src={currentUser.profilePhoto}
                  alt={currentUser.fullName}
                  className="w-16 h-16 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-medium">{currentUser?.fullName}</h3>
                <p className="text-gray-600">{currentUser?.email}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Live Chat dengan Admin</h2>
            <div className="bg-gray-50 rounded-lg p-4 h-96 flex items-center justify-center">
              <p className="text-gray-500">Fitur live chat akan segera hadir...</p>
            </div>
          </div>
        )}
      </div>

      {/* Order Form Modal */}
      {showOrderForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Pesan {selectedService}</h3>
            <div className="space-y-4">
              <textarea
                placeholder="Deskripsi kebutuhan Anda..."
                value={orderDescription}
                onChange={(e) => setOrderDescription(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                rows={4}
              />
              <input
                type="file"
                onChange={(e) => setOrderFile(e.target.files?.[0] || null)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
              />
              <div className="flex space-x-2">
                <button
                  onClick={handleOrderSubmit}
                  className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
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
                  className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
