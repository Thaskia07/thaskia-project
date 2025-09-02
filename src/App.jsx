import React, { useEffect, useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer"; // ⬅️ Footer di-import untuk ditampilkan di layout utama

function App() {
  // Ambil user yang sedang login dari localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // useLocation untuk mengetahui path URL saat ini
  const location = useLocation();

  // Daftar halaman yang tidak ingin menampilkan Header
  const hideHeaderPages = ["/login", "/register", "/start"];

  // Tampilkan Header hanya jika user login dan bukan di halaman yang disembunyikan
  const showHeader = loggedInUser && !hideHeaderPages.includes(location.pathname);

  // Footer ditampilkan di semua halaman kecuali halaman yang disembunyikan
  const showFooter = !hideHeaderPages.includes(location.pathname);

  // State untuk menyimpan data tracks (lagu)
  const [tracks, setTracks] = useState([]);

  // useEffect → load data dari localStorage, default kosong
  useEffect(() => {
    const savedTracks = localStorage.getItem("tracks");
    if (savedTracks) {
      setTracks(JSON.parse(savedTracks));
    } else {
      setTracks([]); // kosong dulu kalau belum ada data
    }
  }, []);

  // Proteksi route: jika user belum login dan bukan di halaman login/register/start
  if (!loggedInUser && !hideHeaderPages.includes(location.pathname)) {
    return <Navigate to="/start" />;
  }

  // Struktur utama layout
  return (
    <div className="flex flex-col min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header muncul jika showHeader true */}
      {showHeader && <Header user={loggedInUser} />}

      {/* Outlet → tempat render nested routes */}
      <main className="flex-1">
        <Outlet context={{ tracks, loggedInUser, setTracks }} />
      </main>

      {/* Footer muncul jika showFooter true */}
      {showFooter && <Footer />}
    </div>
  );
}

export default App;
