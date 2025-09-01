// Import React dan hook bawaan useEffect dan useState
// useState → untuk menyimpan state tagline acak
// useEffect → untuk menjalankan efek samping saat komponen mount
import React, { useEffect, useState } from "react";     

// Import ikon sosial media dan headphone dari library lucide-react
// Digunakan untuk menampilkan ikon interaktif di footer
import { Facebook, Twitter, Instagram, Youtube, Headphones } from "lucide-react";

// Array tagline statis
// ❗ Diletakkan di luar komponen agar tidak dianggap dependency oleh useEffect
// Jika diletakkan di dalam komponen, React akan menganggap array selalu berubah → memicu warning
const taglines = [
  "Feel the music, live your vibe.",            // tagline Bahasa Inggris
  "Rasakan musiknya, hidupkan vibe-mu.",        // tagline Bahasa Indonesia
  "Música a tu vida, siente tu ritmo.",         // tagline Bahasa Spanyol
  "Musique et vibes, vive ton rythme."          // tagline Bahasa Perancis
];

function Footer() {
  // State untuk menyimpan tagline yang akan ditampilkan di bagian bawah
  const [tagline, setTagline] = useState(taglines[0]); 

  // useEffect berjalan sekali saat komponen pertama kali dirender (mount)
  // Digunakan untuk memilih tagline secara acak
  useEffect(() => {
    // Membuat index acak antara 0 sampai panjang array taglines - 1
    const randomIndex = Math.floor(Math.random() * taglines.length);
    // Set state tagline ke tagline acak
    setTagline(taglines[randomIndex]);
  }, []); // dependency array kosong → dijalankan hanya sekali saat mount

  // Daftar ikon sosial media dengan warna khas masing-masing
  // Disimpan dalam array agar mudah di-loop menggunakan map()
  const socialIcons = [
    { icon: Facebook, color: "#3b5998" },   // Facebook biru tua
    { icon: Twitter, color: "#1da1f2" },    // Twitter biru muda
    { icon: Instagram, color: "#e1306c" },  // Instagram pink
    { icon: Youtube, color: "#ff0000" },    // YouTube merah
  ];

  return (
    <footer
      className="relative w-full overflow-hidden py-6 px-4 md:py-12 md:px-10 
                 bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 
                 text-gray-900 shadow-[0_-6px_20px_rgba(0,0,0,0.2)]"
    >
      {/* === Elemen dekoratif: lingkaran blur besar di background === */}
      {/* Lingkaran top-left */}
      <div className="absolute top-[-100px] left-[-100px] w-60 h-60 md:w-72 md:h-72 
                      bg-yellow-300 rounded-full opacity-25 blur-3xl animate-pulse-slow 
                      pointer-events-none"></div>
      {/* Lingkaran bottom-right */}
      <div className="absolute bottom-[-100px] right-[-100px] w-60 h-60 md:w-72 md:h-72 
                      bg-pink-300 rounded-full opacity-25 blur-3xl animate-pulse-slow 
                      pointer-events-none"></div>

      {/* === FOOTER UNTUK MOBILE === */}
      {/* Hanya muncul di layar kecil karena md:hidden */}
      <div className="flex md:hidden flex-col items-center gap-4">
        {/* Logo teks */}
        <h1 className="text-xl font-bold">VibeBeat</h1>

        {/* Baris ikon sosial media */}
        <div className="flex gap-4">
          {socialIcons.map((social, i) => (
            <a
              key={i}                 // key unik agar React bisa tracking elemen
              href="#"                 // link dummy (bisa diganti dengan URL asli)
              className="transition transform hover:scale-125 hover:rotate-6 
                         hover:shadow-[0_0_12px] hover:shadow-white/50"
            >
              {/* Render ikon dengan warna sesuai array */}
              <social.icon size={24} style={{ color: social.color }} />
            </a>
          ))}
        </div>

        {/* Copyright sederhana */}
        <p className="text-sm italic">&copy; {new Date().getFullYear()} VibeBeat</p>
      </div>

      {/* === FOOTER UNTUK DESKTOP === */}
      {/* Hanya muncul di layar besar karena hidden md:grid */}
      <div className="hidden md:grid grid-cols-3 gap-8 max-w-7xl mx-auto relative z-10">

        {/* === KOLOM 1: Logo + Deskripsi === */}
        <div className="flex flex-col items-start gap-3">
          <div className="flex items-center gap-2">
            {/* Ikon headphone */}
            <Headphones size={24} className="text-purple-700" />
            <h1 className="text-2xl font-bold">VibeBeat</h1>
          </div>
          {/* Deskripsi singkat aplikasi */}
          <p className="text-sm text-gray-900 max-w-xs">
            VibeBeat brings your music to life. Stream, discover tracks, 
            create playlists, and feel your vibe.
          </p>

          {/* Mini waveform animasi (bar naik turun seperti equalizer musik) */}
          <div className="flex gap-1 mt-2">
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className="bg-cyan-300 w-1 h-3 md:h-6 animate-wave inline-block"
                // Delay animasi setiap bar berbeda agar gerakan wave terlihat lebih natural
                style={{ animationDelay: `${i * 0.1}s` }}
              ></span>
            ))}
          </div>
        </div>

        {/* === KOLOM 2: Daftar Fitur === */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Why VibeBeat?</h2>
          <ul className="text-sm text-gray-900 space-y-1">
            <li className="hover:text-white cursor-pointer transition">Curated Playlists</li>
            <li className="hover:text-white cursor-pointer transition">Discover Artists</li>
            <li className="hover:text-white cursor-pointer transition">Offline Listening</li>
            <li className="hover:text-white cursor-pointer transition">Personalized Recommendations</li>
          </ul>
        </div>

        {/* === KOLOM 3: Ikon Sosial Media === */}
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold text-gray-900 mb-1">Join the Community</h2>
          <div className="flex gap-3 mt-2">
            {socialIcons.map((social, i) => (
              <a
                key={i}
                href="#"
                className="transition transform hover:scale-125 hover:rotate-6 
                           hover:shadow-[0_0_12px] hover:shadow-white/50"
              >
                <social.icon size={24} style={{ color: social.color }} />
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Tagline acak + copyright */}
      <div className="text-center text-sm mt-6 md:mt-8 relative z-10 italic">
        {tagline} &copy; {new Date().getFullYear()} VibeBeat
      </div>

      {/* === CSS internal untuk animasi tambahan === */}
      <style>
        {`
          /* Animasi lingkaran besar: pulse pelan */
          @keyframes pulse-slow {
            0%, 100% { transform: scale(1); opacity: 0.25; }
            50% { transform: scale(1.05); opacity: 0.4; }
          }
          .animate-pulse-slow { animation: pulse-slow 6s ease-in-out infinite; }

          /* Animasi mini waveform (bar naik turun) */
          @keyframes wave {
            0%, 100% { height: 6px; }
            50% { height: 18px; }
          }
          .animate-wave { animation: wave 1s infinite ease-in-out; }
        `}
      </style>
    </footer>
  );
}

// Ekspor komponen Footer agar bisa digunakan di file lain
export default Footer;
