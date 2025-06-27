
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative animate-scale-in">
        <button
          onClick={() => setShowPopup(false)}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
        
        <div className="text-center">
          {promoSettings.image && (
            <img
              src={promoSettings.image}
              alt="Promo"
              className="w-full h-32 object-cover rounded-lg mb-4"
            />
          )}
          <h2 className="text-xl font-bold text-gray-800 mb-4">{promoSettings.title}</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">{promoSettings.content}</p>
          <button
            onClick={() => setShowPopup(false)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;
