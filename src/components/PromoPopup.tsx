
import React, { useState, useEffect } from 'react';
import { X, Gift } from 'lucide-react';

const PromoPopup = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [promoSettings, setPromoSettings] = useState({ enabled: false, title: '', content: '', image: '' });

  useEffect(() => {
    const settings = JSON.parse(localStorage.getItem('promoSettings') || '{"enabled":false,"title":"","content":"","image":""}');
    setPromoSettings(settings);

    if (settings.enabled && settings.title && settings.content) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!showPopup || !promoSettings.enabled) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md relative animate-scale-in shadow-2xl">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          <div className="mb-4">
            <Gift className="w-16 h-16 text-purple-600 mx-auto mb-2" />
          </div>
          
          {promoSettings.image && (
            <img
              src={promoSettings.image}
              alt="Promo"
              className="w-full h-32 object-cover rounded-xl mb-4"
            />
          )}
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{promoSettings.title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{promoSettings.content}</p>
          
          <button
            onClick={() => setShowPopup(false)}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
