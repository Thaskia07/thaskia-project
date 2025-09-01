import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer"; // ⬅️ Footer di-import untuk ditampilkan di layout utama

function App() {
  // Ambil user yang sedang login dari localStorage
  // JSON.parse karena data tersimpan dalam format JSON string
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // useLocation untuk mengetahui path URL saat ini
  const location = useLocation();

  // Daftar halaman yang tidak ingin menampilkan Header
  // Contoh: halaman login, register, start (landing page)
  const hideHeaderPages = ["/login", "/register", "/start"];

  // Tampilkan Header hanya jika:
  // 1. User sudah login (loggedInUser ada)
  // 2. Path saat ini tidak termasuk halaman yang disembunyikan
  const showHeader = loggedInUser && !hideHeaderPages.includes(location.pathname);

  // Footer ditampilkan di semua halaman kecuali halaman yang disembunyikan
  const showFooter = !hideHeaderPages.includes(location.pathname);

  // State untuk menyimpan data tracks (lagu) yang di-fetch dari file JSON
  const [tracks, setTracks] = useState([]);

  // useEffect → dijalankan sekali saat pertama render
  useEffect(() => {
    fetch("/tracks.json") // Ambil file JSON berisi data lagu
      .then((res) => res.json()) // Konversi response menjadi objek JavaScript
      .then((data) => setTracks(data)) // Set state tracks dengan data dari JSON
      .catch((err) => console.error("Error fetching tracks:", err)); 
      // Tangani error jika fetch gagal
  }, []); // [] → hanya dijalankan sekali saat mount

  // Proteksi route: jika user belum login dan bukan di halaman login/register/start
  if (!loggedInUser && !hideHeaderPages.includes(location.pathname)) {
    return <Navigate to="/start" />; 
    // Redirect ke halaman start (landing page)
  }

  // Struktur utama layout
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header muncul jika showHeader true */}
      {showHeader && <Header user={loggedInUser} />}
      
      {/* Outlet → tempat render nested routes */}
      {/* Context dikirim ke semua komponen anak yang menggunakan useOutletContext */}
      <main className="flex-1">
        <Outlet context={{ tracks, loggedInUser }} />
      </main>

      {/* Footer muncul jika showFooter true */}
      {showFooter && <Footer />} {/* Footer selalu di bawah konten */}
    </div>
  );
}

export default App;
