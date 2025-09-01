import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom"; // Untuk navigasi antar halaman (react-router-dom)
import { motion } from "framer-motion"; // Library animasi
import { Music } from "lucide-react"; // Icon musik dari lucide-react

// Alias agar lebih ringkas saat dipakai
const MotionDiv = motion.div;

function Login() {
  /* ------------------------------------------
     STATE
     ------------------------------------------ */
  const [identifier, setIdentifier] = useState(""); 
  // State untuk input login → bisa berupa username ATAU email.
  // Default kosong, akan diupdate setiap kali user mengetik di input.

  const [password, setPassword] = useState("");
  // State untuk input password.
  // Default kosong, diupdate sesuai isi input field.

  const navigate = useNavigate();
  // Hook bawaan react-router-dom untuk melakukan redirect ke halaman lain.

  /* ------------------------------------------
     FUNGSI LOGIN
     ------------------------------------------ */
  const handleLogin = (e) => {
    e.preventDefault(); // Mencegah halaman reload saat submit form

    // Ambil daftar user yang sudah pernah register dari localStorage
    // Jika belum ada, return array kosong
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // Cari user yang sesuai → identifier bisa berupa username atau email
    const user = storedUsers.find(
      (u) =>
        (u.username === identifier || u.email === identifier) &&
        u.password === password
    );

    // Kalau user tidak ditemukan → tampilkan pesan error
    if (!user) {
      alert("Username/Email atau Password salah!");
      return;
    }

    // Kalau ditemukan → simpan data user yang login ke localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(user));

    // Tampilkan ucapan selamat datang
    alert(`Selamat datang, ${user.fullName}!`);

    // Redirect ke halaman utama (Home)
    navigate("/");
  };

  /* ------------------------------------------
     RENDER UI
     ------------------------------------------ */
  return (
    <div
      className="h-screen w-full flex items-center justify-center relative overflow-hidden 
                 bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 animate-gradient"
    >
      {/* ------------------------------------------
          Partikel cahaya kecil (15 titik animasi random)
          - Dibuat pakai Array(15).map()
          - Setiap titik berupa div kecil putih dengan animasi naik-turun
         ------------------------------------------ */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 rounded-full bg-white/70 shadow-md"
          style={{
            // Posisi random di layar
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          // Animasi: bergerak naik turun + opacity berdenyut
          animate={{ y: [0, -50, 0], opacity: [0.6, 1, 0.6] }}
          transition={{
            duration: 6 + Math.random() * 5, // Lama animasi random tiap titik
            repeat: Infinity, // Loop terus
            delay: Math.random() * 3, // Delay random biar gak bareng-bareng
            ease: "easeInOut",
          }}
        />
      ))}

      {/* ------------------------------------------
          Lingkaran neon animasi (2 buah background blur)
          - Memberi efek glowing di background login page
         ------------------------------------------ */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-purple-500/30 blur-3xl"
        initial={{ x: "-40%", y: "-20%" }}
        animate={{ x: ["-40%", "30%", "-20%"], y: ["-20%", "20%", "-15%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-pink-400/30 blur-3xl"
        initial={{ x: "40%", y: "40%" }}
        animate={{ x: ["40%", "-20%", "25%"], y: ["40%", "-25%", "20%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* ------------------------------------------
          CARD LOGIN (form login dengan efek kaca/glassmorphism)
         ------------------------------------------ */}
      <motion.form
        onSubmit={handleLogin}
        className="relative z-10 bg-white/20 backdrop-blur-lg border border-white/30 
                   shadow-[0_0_40px_rgba(255,255,255,0.4)] rounded-2xl p-6 w-[85%] max-w-sm text-white"
        initial={{ opacity: 0, y: 60 }} // Muncul dari bawah (opacity 0)
        animate={{ opacity: 1, y: 0 }}   // Animasi ke posisi normal
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* ------------------------------------------
            Branding (Logo + Nama Aplikasi)
            - Icon musik goyang-goyang
            - Nama aplikasi dengan gradasi warna
           ------------------------------------------ */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <motion.div
            animate={{ rotate: [0, 15, -15, 0] }}
            transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
          >
            <Music size={32} className="text-purple-700 drop-shadow-xl" />
          </motion.div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 bg-clip-text text-transparent drop-shadow-xl">
            VibeBeat
          </h2>
        </div>

        <p className="text-center text-sm text-white drop-shadow-xl mb-5 font-semibold">
          Masuk untuk menikmati musik favoritmu 🎶
        </p>

        {/* ------------------------------------------
            Input: Username atau Email
           ------------------------------------------ */}
        <div className="mb-3 relative">
          <input
            type="text"
            placeholder="Username atau Email"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className="w-full p-2.5 pl-3 rounded-lg bg-white/25 text-white placeholder-white
                       focus:outline-none focus:ring-2 focus:ring-purple-500 font-semibold text-sm"
            style={{ textShadow: "0 0 6px rgba(0,0,0,0.8)" }} // Tambah efek glow agar teks lebih terbaca
            required
          />
        </div>

        {/* ------------------------------------------
            Input: Password
           ------------------------------------------ */}
        <div className="mb-4 relative">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2.5 pl-3 rounded-lg bg-white/25 text-white placeholder-white
                       focus:outline-none focus:ring-2 focus:ring-pink-500 font-semibold text-sm"
            style={{ textShadow: "0 0 6px rgba(0,0,0,0.8)" }}
            required
          />
        </div>

        {/* ------------------------------------------
            Tombol Login
            - Dengan efek hover scale
            - Gradasi ungu → pink → biru
           ------------------------------------------ */}
        <motion.button
          type="submit"
          className="w-full py-2.5 rounded-lg font-bold text-base
                     bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 text-white shadow-lg
                     hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Login
        </motion.button>

        {/* ------------------------------------------
            Link ke halaman Register
            - Kalau user belum punya akun
           ------------------------------------------ */}
        <p className="mt-4 text-center text-sm text-white drop-shadow-xl font-semibold">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-pink-400 font-semibold hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default Login;
