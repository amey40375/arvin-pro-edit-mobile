
import React, { useState } from 'react';
import { Star, User } from 'lucide-react';

const TestimonialSection = () => {
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Budi Santoso",
      location: "Jakarta",
      rating: 5,
      comment: "Pelayanan sangat memuaskan! Logo yang dibuat untuk warung makan saya sangat profesional dan menarik pelanggan.",
      date: "2024-01-15",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Siti Nurhaliza",
      location: "Bandung",
      rating: 5,
      comment: "Edit video prewedding saya hasilnya luar biasa! Terima kasih ARVIN PROFESSIONAL EDITING 🥰",
      date: "2024-01-20",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Ahmad Fadli",
      location: "Surabaya",
      rating: 5,
      comment: "Desain spanduk untuk toko saya keren banget! Harga terjangkau dan kualitas premium. Recommended!",
      date: "2024-01-22",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 4,
      name: "Rina Wati",
      location: "Medan",
      rating: 5,
      comment: "Menu cafe yang didesain sangat elegan dan menarik. Pelanggan saya jadi lebih tertarik untuk memesan!",
      date: "2024-01-25",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 5,
      name: "Dedi Kurniawan",
      location: "Yogyakarta",
      rating: 5,
      comment: "Hosting website untuk bisnis online saya sangat stabil dan cepat. Tim support juga responsif banget!",
      date: "2024-01-28",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const allTestimonials = [
    ...testimonials,
    {
      id: 6,
      name: "Maya Sari",
      location: "Makassar",
      rating: 5,
      comment: "Kartu undangan pernikahan saya dibuat dengan sangat detail dan cantik. Semua tamu memuji desainnya!",
      date: "2024-02-01",
      avatar: "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 7,
      name: "Rizki Pratama",
      location: "Palembang",
      rating: 5,
      comment: "Aplikasi yang dibuat untuk bisnis saya sangat user-friendly dan sesuai kebutuhan. Top markotop!",
      date: "2024-02-03",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 8,
      name: "Dewi Lestari",
      location: "Semarang",
      rating: 5,
      comment: "Buku tamu digital untuk event saya sangat inovatif dan memudahkan tamu untuk memberikan ucapan.",
      date: "2024-02-05",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 9,
      name: "Andi Wijaya",
      location: "Balikpapan",
      rating: 5,
      comment: "Edit foto produk untuk toko online saya hasilnya sangat profesional. Penjualan jadi meningkat!",
      date: "2024-02-08",
      avatar: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 10,
      name: "Lila Sari",
      location: "Pontianak",
      rating: 5,
      comment: "Jasa aransemen lagu untuk cafe saya sangat bagus! Suasana jadi lebih menarik dan pelanggan betah berlama-lama.",
      date: "2024-02-10",
      avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 11,
      name: "Fajar Nugroho",
      location: "Solo",
      rating: 5,
      comment: "Desain logo untuk startup saya sangat kreatif dan mencerminkan visi perusahaan. Highly recommended!",
      date: "2024-02-12",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face"
    },
    {
      id: 12,
      name: "Indira Siska",
      location: "Denpasar",
      rating: 5,
      comment: "Spanduk promosi untuk acara saya sangat eye-catching. Banyak yang bertanya dimana bikin spanduknya!",
      date: "2024-02-14",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b550?w=100&h=100&fit=crop&crop=face"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
    ));
  };

  const renderTestimonial = (testimonial: any) => (
    <div key={testimonial.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start space-x-3">
        <img
          src={testimonial.avatar}
          alt={testimonial.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
        />
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">{testimonial.name}</h4>
              <p className="text-xs text-gray-500">{testimonial.location}</p>
            </div>
            <span className="text-xs text-gray-400">
              {new Date(testimonial.date).toLocaleDateString('id-ID')}
            </span>
          </div>
          <div className="flex items-center space-x-1 mb-2">
            {renderStars(testimonial.rating)}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">{testimonial.comment}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Star className="w-6 h-6 text-yellow-400 fill-current" />
        <h2 className="text-xl font-bold text-gray-800">Testimoni Pelanggan</h2>
      </div>
      
      <div className="space-y-4 mb-6">
        {testimonials.map(renderTestimonial)}
      </div>

      <button
        onClick={() => setShowAllTestimonials(true)}
        className="w-full bg-gradient-to-r from-blue-50 to-purple-50 text-blue-600 hover:from-blue-100 hover:to-purple-100 font-semibold text-sm py-3 px-4 border border-blue-200 rounded-xl transition-all duration-300"
      >
        Lihat Komentar Lainnya ({allTestimonials.length - 5} komentar)
      </button>

      {/* All Testimonials Modal */}
      {showAllTestimonials && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-800">Semua Testimoni Pelanggan</h3>
              <button
                onClick={() => setShowAllTestimonials(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors text-2xl"
              >
                ×
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-4">
              {allTestimonials.map(renderTestimonial)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialSection;
