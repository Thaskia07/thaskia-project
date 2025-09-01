// Import React
import React from "react";

// Import Link dari react-router-dom untuk navigasi antar halaman
import { Link } from "react-router-dom";

// Import motion dari framer-motion untuk animasi
import { motion } from "framer-motion";

// Import ikon dari lucide-react
// - Music → ikon musik mengambang
// - PlayCircle → ikon tombol play
import { Music, PlayCircle } from "lucide-react";

// Membuat alias MotionDiv agar mudah digunakan untuk animasi div
const MotionDiv = motion.div;

// -------------------------------
// Konfigurasi ikon musik mengambang
// -------------------------------
// Array objek berisi posisi horizontal (x) dan delay animasi tiap ikon
const floatingIcons = [
  { id: 1, x: "20%", delay: 0 },
  { id: 2, x: "60%", delay: 2 },
  { id: 3, x: "80%", delay: 4 },
];

const Start = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage: "url('public/ms6.jpg')", // background utama halaman start
      }}
    >
      {/* Overlay gradasi untuk memberi efek gelap di background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* Ikon musik animasi naik */}
      {floatingIcons.map((icon) => (
        <motion.div
          key={icon.id}
          className="absolute text-white opacity-20"
          style={{ left: icon.x, bottom: "-60px" }} // posisi horizontal sesuai x dan start dari bawah
          initial={{ y: 0 }}
          animate={{ y: ["0%", "-130vh"] }} // animasi naik ke atas hingga keluar layar
          transition={{
            repeat: Infinity, // loop terus menerus
            duration: 18, // durasi pergerakan
            delay: icon.delay, // delay individual agar tidak seragam
            ease: "linear", // animasi linear
          }}
        >
          <Music size={26} />
        </motion.div>
      ))}

      {/* Lingkaran neon blur untuk efek estetika */}
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-purple-500/20 blur-3xl"
        initial={{ x: "-30%", y: "-30%" }}
        animate={{ x: ["-30%", "30%", "-20%"], y: ["-30%", "20%", "-25%"] }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-64 h-64 rounded-full bg-indigo-400/20 blur-3xl"
        initial={{ x: "30%", y: "40%" }}
        animate={{ x: ["30%", "-20%", "25%"], y: ["40%", "-30%", "35%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Partikel sparkle kecil yang bergerak random */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white opacity-70"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{ y: ["0%", "100%"], opacity: [1, 0] }} // animasi jatuh ke bawah dan hilang
          transition={{
            duration: 6 + Math.random() * 5, // durasi acak
            repeat: Infinity,
            delay: Math.random() * 3, // delay acak
            ease: "linear",
          }}
        />
      ))}

      {/* Kotak utama halaman start */}
      <MotionDiv
        className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl
                   p-5 sm:p-6
                   w-[85%] sm:max-w-[260px] md:max-w-[300px]
                   text-center border border-white/20
                   hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-shadow"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Efek gelombang di sekitar logo PlayCircle */}
        <div className="relative flex justify-center items-center mb-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-20 h-20 rounded-full border-2 border-purple-400/40"
              animate={{ scale: [1, 2], opacity: [0.6, 0] }} // gelombang membesar dan menghilang
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 1, // delay tiap gelombang agar berurutan
                ease: "easeOut",
              }}
            />
          ))}
          <PlayCircle size={40} className="relative text-purple-400 z-10" />
        </div>

        {/* Branding / Judul Aplikasi */}
        <motion.h1
          className="text-3xl sm:text-4xl font-extrabold mb-2 drop-shadow-lg 
                     bg-gradient-to-r from-purple-400 via-pink-500 to-indigo-400 
                     bg-clip-text text-transparent animate-pulse"
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
        >
          VibeBeat
        </motion.h1>

        {/* Tagline dengan efek ketik */}
        <motion.p
          className="text-xs sm:text-sm md:text-base text-gray-200 mb-6 h-10 overflow-hidden whitespace-nowrap border-r-2 border-gray-300 pr-2"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 4, ease: "linear" }}
        >
          Dive into the rhythm of your world... Discover, create, and vibe 🎶
        </motion.p>

        {/* Equalizer animasi */}
        <div className="flex justify-center gap-1 mb-6">
          {[1, 2, 3, 4, 5].map((bar, i) => (
            <motion.div
              key={i}
              className="w-1 bg-purple-400 rounded"
              animate={{ height: [5, 25, 10, 20, 8] }} // tinggi bar naik turun
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
                repeatType: "reverse", // naik turun bolak-balik
              }}
            />
          ))}
        </div>

        {/* Tombol aksi login dan sign up */}
        <div className="flex flex-col gap-3">
          {/* Tombol Login */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{
              scale: 1.07,
              boxShadow: "0 0 15px rgba(99,102,241,0.8)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/login"
              className="block w-full py-2 rounded-lg font-semibold shadow-lg 
                         bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition"
            >
              Login
            </Link>
          </motion.div>

          {/* Tombol Sign Up */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            whileHover={{
              scale: 1.07,
              boxShadow: "0 0 15px rgba(255,255,255,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              to="/register"
              className="block w-full py-2 rounded-lg font-semibold shadow-lg 
                         bg-white/20 text-white border border-white hover:bg-white/30 transition"
            >
              Sign Up
            </Link>
          </motion.div>
        </div>
      </MotionDiv>
    </div>
  );
};

// Export component agar bisa digunakan di file lain
export default Start;
