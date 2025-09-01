import React from "react"; 
import { Navigate } from "react-router-dom"; 
// Import React untuk membuat komponen dan Navigate dari react-router-dom 
// yang digunakan untuk mengarahkan (redirect) user ke halaman lain

function ProtectedRoute({ children }) { 
  // Komponen ProtectedRoute menerima props "children"
  // "children" di sini adalah elemen/halaman yang dibungkus oleh ProtectedRoute

  const loggedInUser = localStorage.getItem("loggedInUser"); 
  // Mengecek apakah ada data "loggedInUser" di localStorage browser
  // Jika ada -> berarti user sudah login
  // Jika tidak ada -> berarti user belum login

  if (!loggedInUser) { 
    // Jika "loggedInUser" tidak ditemukan (user belum login)
    return <Navigate to="/start" replace />; 
    // Maka user akan diarahkan (redirect) ke halaman "/start"
    // "replace" digunakan agar halaman "/start" menggantikan halaman sebelumnya di riwayat browser
  }

  return children; 
  // Jika user sudah login, tampilkan halaman/komponen anak (children) yang dilindungi
}

export default ProtectedRoute; 
// Export komponen agar bisa digunakan di file lain
