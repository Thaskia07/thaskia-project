// Import React dan useState hook
// React → library utama untuk membuat komponen dan JSX
// useState → hook untuk menyimpan dan memperbarui state lokal dalam komponen
import React, { useState } from "react";

// Import icon dari lucide-react untuk visualisasi
// User → ikon user generik
// UserCircle → ikon avatar/profil
// Mail → ikon email
// Lock → ikon password
// X → ikon close (untuk modal)
// Trash2 → ikon hapus
import { User, UserCircle, Mail, Lock, X, Trash2 } from "lucide-react";

// useNavigate → hook dari react-router-dom untuk navigasi programatik
import { useNavigate } from "react-router-dom";

// Deklarasi komponen fungsional Settings
// Menampilkan profil user, form edit profil, dan fitur hapus akun
function Settings() {
  const navigate = useNavigate(); // Hook untuk berpindah halaman secara manual

  // State untuk user yang sedang login
  // Mengambil data dari localStorage dengan key "loggedInUser"
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(localStorage.getItem("loggedInUser"))
  );

  // State untuk mengatur mode edit (true → modal edit terbuka)
  const [isEditing, setIsEditing] = useState(false);

  // State input untuk form edit profil
  const [fullName, setFullName] = useState(loggedInUser?.fullName || "");
  const [username, setUsername] = useState(loggedInUser?.username || "");
  const [email, setEmail] = useState(loggedInUser?.email || "");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Jika tidak ada user yang login, tampilkan pesan dan blok akses
  if (!loggedInUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black">
        <h2 className="text-xl font-bold text-red-600 bg-white/70 px-6 py-3 rounded-xl shadow-lg">
          Kamu harus login untuk mengakses Settings.
        </h2>
      </div>
    );
  }

  // Fungsi untuk menyimpan perubahan profil
  const handleSave = () => {
    // Validasi password jika ada perubahan
    if (newPassword || confirmPassword) {
      // Cek apakah password lama sesuai
      if (oldPassword !== loggedInUser.password) {
        alert("Password lama tidak sesuai!");
        return; // hentikan proses jika password lama salah
      }
      // Cek apakah password baru sama dengan konfirmasi
      if (newPassword !== confirmPassword) {
        alert("Password baru dan konfirmasi tidak sama!");
        return; // hentikan proses jika tidak sama
      }
    }

    // Buat object user yang diperbarui
    const updatedUser = {
      ...loggedInUser, // salin semua properti lama
      fullName,
      username,
      email,
      password: newPassword ? newPassword : loggedInUser.password, // pakai password baru jika ada
    };

    // Update user di localStorage
    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    // Update user di daftar semua user (users)
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users = users.map((u) =>
      u.username === loggedInUser.username ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(users));

    // Update state lokal dan tutup modal edit
    setLoggedInUser(updatedUser);
    setIsEditing(false);
    alert("Profil berhasil diperbarui!");
  };

  // Fungsi untuk menghapus akun user
  const handleDeleteAccount = () => {
    if (window.confirm("Yakin ingin menghapus akun ini?")) {
      // Ambil daftar user
      let users = JSON.parse(localStorage.getItem("users")) || [];
      // Filter user yang tidak dihapus
      const updatedUsers = users.filter(
        (u) => u.username !== loggedInUser.username
      );
      // Simpan daftar user baru di localStorage
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      // Hapus data login user
      localStorage.removeItem("loggedInUser");
      alert("Akun berhasil dihapus!");
      // Arahkan user ke halaman register
      navigate("/register");
    }
  };

  // Bagian return menampilkan UI utama
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-black p-6">
      {/* Card utama dengan efek glassmorphism */}
      <div className="relative w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-white/30 text-gray-800">

        {/* Avatar dan info user */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 p-1 rounded-full shadow-lg">
            <UserCircle size={90} className="text-white drop-shadow-lg" />
          </div>
          <h2 className="text-2xl font-extrabold mt-3">{loggedInUser.fullName}</h2>
          <p className="text-sm text-gray-600">@{loggedInUser.username}</p>
        </div>

        {/* Info user card */}
        <div className="space-y-4">
          {/* Full Name */}
          <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 shadow-inner">
            <User size={20} className="text-yellow-500" />
            <div>
              <p className="text-xs text-gray-600">Full Name</p>
              <p className="font-bold">{loggedInUser.fullName}</p>
            </div>
          </div>
          {/* Username */}
          <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 shadow-inner">
            <User size={20} className="text-green-500" />
            <div>
              <p className="text-xs text-gray-600">Username</p>
              <p className="font-bold">{loggedInUser.username}</p>
            </div>
          </div>
          {/* Email */}
          <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 shadow-inner">
            <Mail size={20} className="text-blue-500" />
            <div>
              <p className="text-xs text-gray-600">Email</p>
              <p className="font-bold">{loggedInUser.email}</p>
            </div>
          </div>
        </div>

        {/* Tombol aksi: Edit & Delete */}
        <div className="mt-8 flex flex-col gap-3">
          {/* Tombol Edit Profile → buka modal */}
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold 
                       bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 
                       text-white hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            ✏️ Edit Profile
          </button>
          {/* Tombol Delete Account → hapus akun */}
          <button
            onClick={handleDeleteAccount}
            className="flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold 
                       bg-gradient-to-r from-red-600 to-purple-700 text-white 
                       hover:scale-105 hover:shadow-lg transition-all duration-200"
          >
            <Trash2 size={18} /> Delete Account
          </button>
        </div>
      </div>

      {/* Modal Edit Profile */}
      {isEditing && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[90%] max-w-md text-gray-800 relative">
            {/* Tombol close modal */}
            <button
              onClick={() => setIsEditing(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
            >
              <X size={20} />
            </button>

            {/* Judul modal */}
            <h3 className="text-xl font-bold mb-4 text-purple-600">Edit Profile</h3>

            {/* Form input */}
            <div className="space-y-3">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Password Lama"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Password Baru"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Konfirmasi Password Baru"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
              />
            </div>

            {/* Tombol aksi modal: Batal & Simpan */}
            <div className="mt-5 flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 text-white rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Export komponen agar bisa digunakan di file lain
export default Settings;
