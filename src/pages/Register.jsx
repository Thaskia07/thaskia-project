// Import React dan hook useState untuk menyimpan dan mengelola state lokal komponen
import React, { useState } from "react";

// Import useNavigate & Link dari react-router-dom untuk navigasi antar halaman
// useNavigate → untuk redirect programatik setelah registrasi
// Link → untuk navigasi menggunakan anchor style tanpa reload halaman
import { useNavigate, Link } from "react-router-dom";

// Import ikon dari library lucide-react
// User, Mail, Lock, UserPlus digunakan sebagai visual indicator di input dan header
import { User, Mail, Lock, UserPlus } from "lucide-react";

// Import motion dari framer-motion untuk animasi UI yang smooth
import { motion } from "framer-motion";

// Alias motion.div agar lebih ringkas saat digunakan berulang
const MotionDiv = motion.div;

function Register() {
  /* -------------------------------------------------
     STATE MANAGEMENT
     Menggunakan useState untuk menyimpan nilai input form
  ------------------------------------------------- */
  const [fullName, setFullName] = useState(""); // Nama lengkap user
  const [email, setEmail] = useState("");       // Email user
  const [username, setUsername] = useState(""); // Username unik user
  const [password, setPassword] = useState(""); // Password user
  const [confirmPassword, setConfirmPassword] = useState(""); // Konfirmasi password

  // Hook untuk navigasi ke halaman lain setelah register berhasil
  const navigate = useNavigate();

  /* -------------------------------------------------
     HANDLE REGISTER FUNCTION
     Fungsi ini dijalankan saat submit form
  ------------------------------------------------- */
  const handleRegister = (e) => {
    e.preventDefault(); // Mencegah reload halaman default saat submit form

    // Ambil daftar user yang tersimpan di localStorage, jika tidak ada maka pakai array kosong
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];

    // VALIDASI 1: Email harus unik
    if (storedUsers.find((u) => u.email === email)) {
      alert("Email sudah terdaftar!"); // Pemberitahuan jika email sudah ada
      return; // Hentikan proses registrasi
    }

    // VALIDASI 2: Username harus unik
    if (storedUsers.find((u) => u.username === username)) {
      alert("Username sudah digunakan!");
      return;
    }

    // VALIDASI 3: Password dan Confirm Password harus sama
    if (password !== confirmPassword) {
      alert("Password dan Confirm Password tidak sama!");
      return;
    }

    // Jika semua validasi lolos, buat object user baru
    const newUser = { fullName, email, username, password };

    // Tambahkan user baru ke array daftar user
    storedUsers.push(newUser);

    // Simpan daftar user terbaru ke localStorage (persistensi data sederhana)
    localStorage.setItem("users", JSON.stringify(storedUsers));

    // Redirect ke halaman login setelah registrasi sukses
    navigate("/login");
  };

  /* -------------------------------------------------
     RENDER UI
     Bagian ini mendefinisikan struktur dan tampilan komponen
  ------------------------------------------------- */
  return (
    <div
      className="relative h-screen w-full flex items-center justify-center overflow-hidden 
                 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 
                 animate-[gradient_15s_ease_infinite]"
    >
      {/* -------------------------------------------------
          BACKGROUND PARTICLES
          Membuat efek partikel bergerak untuk tampilan futuristik
      ------------------------------------------------- */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i} // Key unik untuk React rendering
          className="absolute rounded-full bg-white/70 shadow-md" // Bentuk bulat + efek shadow
          style={{
            width: `${Math.random() * 3 + 1}px`,   // Lebar random tiap partikel
            height: `${Math.random() * 3 + 1}px`,  // Tinggi random
            left: `${Math.random() * 100}%`,       // Posisi X acak
            top: `${Math.random() * 100}%`,        // Posisi Y acak
          }}
          animate={{
            x: [0, Math.random() * 50, 0],         // Gerakan horizontal bolak-balik
            y: [0, -50, 0],                        // Gerakan vertikal naik-turun
            opacity: [0.2, 1, 0.2],                // Efek kedip / transparansi
          }}
          transition={{
            duration: 5 + Math.random() * 5,       // Durasi gerakan random tiap partikel
            repeat: Infinity,                      // Animasi berulang terus menerus
            delay: Math.random() * 3,              // Delay random agar tidak seragam
            ease: "easeInOut",                     // Animasi halus
          }}
        />
      ))}

      {/* -------------------------------------------------
          GLOW CIRCLES
          Lingkaran blur dengan gradien untuk efek visual modern
      ------------------------------------------------- */}
      <motion.div
        className="absolute w-96 h-96 rounded-full bg-purple-500/40 blur-3xl"
        initial={{ x: "-40%", y: "-20%" }} // posisi awal
        animate={{ x: ["-40%", "30%", "-20%"], y: ["-20%", "20%", "-15%"] }} // animasi bergerak
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }} // transisi halus
      />
      <motion.div
        className="absolute w-72 h-72 rounded-full bg-pink-400/40 blur-3xl"
        initial={{ x: "40%", y: "40%" }}
        animate={{ x: ["40%", "-20%", "25%"], y: ["40%", "-25%", "20%"] }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* -------------------------------------------------
          REGISTER FORM CARD
          Card utama berisi form pendaftaran
      ------------------------------------------------- */}
      <motion.form
        onSubmit={handleRegister} // Submit form memanggil handleRegister
        className="relative z-10 bg-white/20 backdrop-blur-xl border border-white/30 
                   shadow-[0_0_40px_rgba(255,255,255,0.4)] rounded-3xl p-8 
                   w-[85%] max-w-sm text-white"
        initial={{ opacity: 0, y: 60 }}  // Animasi muncul dari bawah
        animate={{ opacity: 1, y: 0 }}   // Fade in dan naik
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {/* -------------------- HEADER -------------------- */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {/* Icon register dengan animasi hover */}
          <motion.div whileHover={{ rotate: [0, 15, -15, 0], scale: 1.15 }} transition={{ duration: 0.6 }}>
            <UserPlus size={36} className="text-purple-700 drop-shadow-xl" />
          </motion.div>
          {/* Judul Register dengan gradien teks */}
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 bg-clip-text text-transparent drop-shadow-xl">
            Register
          </h2>
        </div>

        {/* -------------------- INPUT FIELDS -------------------- */}
        {[
          {icon: User, type: "text", placeholder: "Full Name", state: fullName, setState: setFullName},
          {icon: Mail, type: "email", placeholder: "Email", state: email, setState: setEmail},
          {icon: User, type: "text", placeholder: "Username", state: username, setState: setUsername},
          {icon: Lock, type: "password", placeholder: "Password", state: password, setState: setPassword},
          {icon: Lock, type: "password", placeholder: "Confirm Password", state: confirmPassword, setState: setConfirmPassword}
        ].map((field, i) => (
          <div key={i} className="flex items-center border rounded mb-4 px-3 py-2 bg-white/20 shadow-inner">
            {/* Icon input field */}
            <field.icon className="text-white/80 mr-2" size={18} />
            {/* Input field */}
            <input
              type={field.type}
              placeholder={field.placeholder}
              value={field.state}
              onChange={(e) => field.setState(e.target.value)} // update state sesuai input user
              className="w-full p-2 outline-none text-white placeholder-white"
              required // wajib diisi
            />
          </div>
        ))}

        {/* -------------------- BUTTON REGISTER -------------------- */}
        <motion.button
          type="submit"
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-700 via-pink-700 to-indigo-700 py-2 rounded hover:shadow-[0_0_20px_rgba(255,255,255,0.8)] transition-transform duration-200"
          whileHover={{ scale: 1.07 }} // efek membesar saat hover
          whileTap={{ scale: 0.95 }}   // efek mengecil saat ditekan
        >
          <UserPlus size={20} /> Register
        </motion.button>

        {/* -------------------- LINK LOGIN -------------------- */}
        <p className="mt-4 text-center text-sm text-white font-semibold drop-shadow-lg">
          Sudah punya akun?{" "}
          <Link to="/login" className="text-green-400 font-semibold hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
}

export default Register;
