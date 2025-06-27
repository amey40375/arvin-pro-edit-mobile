
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Camera } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    profilePhoto: null as File | null
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profilePhoto: file }));
    }
  };

  const handleRegister = () => {
    if (!formData.fullName || !formData.email || !formData.password) {
      alert('Harap isi semua field!');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const pendingUsers = JSON.parse(localStorage.getItem('pendingUsers') || '[]');
      
      // Check if email already exists
      const allUsers = [
        ...pendingUsers,
        ...JSON.parse(localStorage.getItem('approvedUsers') || '[]'),
        ...JSON.parse(localStorage.getItem('rejectedUsers') || '[]')
      ];

      if (allUsers.some((u: any) => u.email === formData.email)) {
        alert('Email sudah terdaftar!');
        setLoading(false);
        return;
      }

      const newUser = {
        id: Date.now(),
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        profilePhoto: formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : null,
        registrationDate: new Date().toISOString()
      };

      pendingUsers.push(newUser);
      localStorage.setItem('pendingUsers', JSON.stringify(pendingUsers));

      alert('Pendaftaran berhasil! Silakan tunggu persetujuan admin.');
      navigate('/login');
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Daftar Akun</h1>
          <p className="text-gray-600">Buat akun baru Anda</p>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="fullName"
              placeholder="Nama Lengkap"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="relative">
            <Camera className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50"
          >
            {loading ? 'Mendaftar...' : 'Daftar'}
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
          >
            Sudah punya akun? Masuk
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;
