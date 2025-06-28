
import React, { useState, useEffect } from 'react';
import { getAppSetting } from '../utils/supabaseHelpers';

const MarqueeText = () => {
  const [text, setText] = useState('Selamat datang di ARVIN PROFESSIONAL EDITING - Layanan terbaik untuk kebutuhan editing Anda!');

  useEffect(() => {
    const loadMarqueeText = async () => {
      try {
        const marqueText = await getAppSetting('marque_text');
        if (marqueText) {
          setText(marqueText);
        }
      } catch (error) {
        console.error('Error loading marquee text:', error);
      }
    };

    loadMarqueeText();
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
