
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!email || !password) {
      alert('Harap isi semua field!');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Admin login
      if (email === 'id.arvinstudio@gmail.com' && password === 'Bandung123') {
        localStorage.setItem('userRole', 'admin');
        localStorage.setItem('currentUser', JSON.stringify({ email, role: 'admin' }));
        navigate('/admin-dashboard');
      } else {
        // Check approved users
        const approvedUsers = JSON.parse(localStorage.getItem('approvedUsers') || '[]');
        const user = approvedUsers.find((u: any) => u.email === email && u.password === password);

        if (user) {
          localStorage.setItem('userRole', 'user');
          localStorage.setItem('currentUser', JSON.stringify(user));
          navigate('/user-dashboard');
        } else {
          // Check if user is pending
          const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
          const pendingUser = pendingUsers.find((u: any) => u.email === email && u.password === password);

          if (pendingUser) {
            alert('Mohon Bersabar Karena Admin Sedang Memeriksa Permintaan Kamu Terlebih Dahulu.');
          } else {
            // Check if user is rejected
            const rejectedUsers = JSON.parse(localStorage.getItem('rejectedUsers') || '[]');
            const rejectedUser = rejectedUsers.find((u: any) => u.email === email && u.password === password);

            if (rejectedUser) {
              const whatsappUrl = `https://wa.me/6281299660660?text=Halo, saya ingin menanyakan status pendaftaran saya.`;
              if (confirm('Maaf, pendaftaran kamu ditolak. Silakan hubungi admin via WhatsApp.')) {
                window.open(whatsappUrl, '_blank');
              }
            } else {
              alert('Login gagal! Email atau password salah.');
            }
          }
        }
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 animate-scale-in">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">A</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">ARVIN PROFESSIONAL</h1>
          <p className="text-gray-600">Masuk ke akun Anda</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Memuat...' : 'Masuk'}
          </button>

          <button
            onClick={() => navigate('/register')}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Daftar Akun Baru
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
