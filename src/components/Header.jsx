// Import React + hook useState untuk state lokal,
// serta hook useNavigate & useLocation dari react-router-dom untuk navigasi dan mengetahui path aktif
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

// Import ikon dari library lucide-react
// LogOut → ikon logout, UserCircle → ikon user/avatar
// Settings → ikon setting, Menu → hamburger menu, X → tombol close
import { LogOut, UserCircle, Settings, Menu, X } from "lucide-react";

function Header() {
  // Hook untuk navigasi programatik (misal setelah logout)
  const navigate = useNavigate();
  // Hook untuk mendapatkan path halaman saat ini
  const location = useLocation();

  // Ambil data user yang login dari localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // State untuk menandai apakah dropdown profil desktop terbuka
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // State untuk menandai apakah menu mobile/hamburger terbuka
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Fungsi untuk logout user
  // - Hapus data loggedInUser di localStorage
  // - Redirect ke halaman /start
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    navigate("/start");
  };

  // Komponen kecil untuk membuat link navigasi agar lebih DRY (Don't Repeat Yourself)
  // Props:
  // - to → path tujuan
  // - label → teks yang ditampilkan
  const NavLink = ({ to, label }) => {
    // Cek apakah path saat ini sama dengan path link → untuk menandai active link
    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`relative font-semibold transition duration-300 group
          ${
            isActive
              ? "text-cyan-300" // Link aktif → beri warna cyan
              : "text-white hover:text-cyan-300 hover:drop-shadow-[0_0_12px_rgba(0,255,255,0.9)]" // default → putih dengan efek hover
          }`}
        onClick={() => setMobileMenuOpen(false)} // Tutup menu mobile saat link diklik
      >
        {label}

        {/* Garis bawah animasi untuk link aktif / hover */}
        <span
          className={`absolute -bottom-1 left-0 h-[2px] w-full bg-cyan-300 rounded-full transition-transform duration-300 ${
            isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
          }`}
        ></span>
      </Link>
    );
  };

  return (
    // Header sticky → selalu di atas saat scroll
    <header className="sticky top-0 z-50 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 backdrop-blur-lg shadow-md">
      
      {/* NAVBAR UTAMA */}
      <nav className="flex justify-between items-center px-4 md:px-8 py-4 text-white">

        {/* LOGO KIRI */}
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-widest bg-gradient-to-r from-cyan-300 via-purple-200 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
          🎵 VibeBeat
        </h1>

        {/* LINK NAVIGASI DESKTOP (hanya tampil di md ke atas) */}
        <div className="hidden md:flex gap-8 items-center text-lg">
          <NavLink to="/" label="Home" />
          <NavLink to="/discover" label="Discover" />
          <NavLink to="/my-playlist" label="MyPlaylist" />
          <NavLink to="/favorites" label="Favorites" />
          <NavLink to="/about" label="About" />
        </div>

        {/* PROFIL USER + DROPDOWN (desktop only) */}
        <div className="hidden md:flex items-center gap-4 relative">
          {loggedInUser && (
            <div className="relative">
              {/* Tombol profil */}
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)} // toggle dropdown
                className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-full backdrop-blur-md shadow-md hover:bg-white/30 transition-all duration-300 hover:scale-105"
              >
                <UserCircle size={24} className="text-cyan-300" />
                <span className="text-sm font-bold tracking-wide">
                  {loggedInUser.fullName}
                </span>
              </button>

              {/* DROPDOWN MENU PROFIL */}
              <div
                className={`absolute right-0 mt-3 w-44 bg-white/95 text-gray-800 rounded-xl shadow-xl overflow-hidden backdrop-blur-md border border-gray-200 transform transition-all duration-300 origin-top ${
                  dropdownOpen
                    ? "scale-100 opacity-100" // tampil
                    : "scale-95 opacity-0 pointer-events-none" // sembunyi
                }`}
              >
                {/* Link Settings */}
                <Link
                  to="/settings"
                  className="w-full px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
                >
                  <Settings size={18} className="text-purple-600" /> Settings
                </Link>

                {/* Tombol Logout */}
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600"
                >
                  <LogOut size={18} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>

        {/* TOMBOL HAMBURGER (mobile only) */}
        <button
          className="md:hidden flex items-center text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} // toggle menu mobile
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-gradient-to-b from-blue-600 via-purple-600 to-pink-600 px-4 pb-4 flex flex-col gap-4">
          {/* Info user di bagian atas (kalau login) */}
          {loggedInUser && (
            <div className="flex items-center gap-2 bg-white/20 px-3 py-2 rounded-lg backdrop-blur-md shadow-md mt-2">
              <UserCircle size={22} className="text-cyan-300" />
              <span className="text-sm font-semibold">{loggedInUser.fullName}</span>
            </div>
          )}

          {/* Link navigasi (mobile) */}
          <NavLink to="/" label="Home" />
          <NavLink to="/discover" label="Discover" />
          <NavLink to="/my-playlist" label="MyPlaylist" />
          <NavLink to="/favorites" label="Favorites" />
          <NavLink to="/about" label="About" />

          {/* Bagian Settings & Logout di bawah (mobile) */}
          {loggedInUser && (
            <div className="mt-4 border-t border-white/20 pt-4 flex flex-col gap-2">
              <Link
                to="/settings"
                className="px-4 py-2 hover:bg-white/20 flex items-center gap-2 rounded-md"
              >
                <Settings size={18} className="text-purple-300" /> Settings
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-red-50 flex items-center gap-2 text-red-600 rounded-md"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

// Ekspor komponen agar bisa dipakai di file lain
export default Header;
