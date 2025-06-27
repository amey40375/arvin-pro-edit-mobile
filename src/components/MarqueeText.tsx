
import React, { useState, useEffect } from 'react';

const MarqueeText = () => {
  const [text, setText] = useState('');

  useEffect(() => {
    const marqueText = localStorage.getItem('marqueText') || 'Selamat datang di ARVIN PROFESSIONAL EDITING - Layanan terbaik untuk kebutuhan editing Anda!';
    setText(marqueText);
  }, []);

  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        <span className="text-sm font-medium px-4">
          ⭐ {text} ⭐
        </span>
      </div>
    </div>
  );
};

export default MarqueeText;
