// ===============================
// Import modul React & hook bawaan
// ===============================
// React digunakan untuk membangun komponen UI berbasis deklaratif
// useState  -> untuk membuat state lokal (data yang bisa berubah di dalam komponen)
// useEffect -> untuk efek samping, misalnya mengambil data dari localStorage saat pertama kali render
import React, { useState, useEffect } from "react";

// ===============================
// Import ikon dari lucide-react
// ===============================
// Lucide-react adalah library ikon modern berbasis React
// Ikon digunakan agar tombol lebih mudah dikenali (UX lebih baik)
import { X, Trash2, SkipForward, SkipBack, Search } from "lucide-react"; 

// ===============================
// Object mapping warna genre
// ===============================
// Tujuan: setiap genre memiliki warna background berbeda untuk memudahkan identifikasi visual
// Key   -> nama genre
// Value -> class Tailwind CSS warna background
const genreColors = {
  Pop: "bg-pink-500",
  Rock: "bg-red-500",
  "R&B": "bg-blue-500",
  Dangdut: "bg-yellow-500",
  "K-Pop": "bg-purple-500",
  "Pop Daerah": "bg-green-500",
  Reggae: "bg-teal-500",
  Bollywood: "bg-orange-500",
  "Pop Indonesia": "bg-pink-400", // tambahan genre baru
};

// ===============================
// Komponen utama: MyPlaylist
// ===============================
// Bertanggung jawab untuk:
// - Menampilkan daftar lagu (playlist)
// - Memainkan audio dari lagu yang dipilih
// - Menghapus lagu dari playlist
// - Navigasi next/prev track
// - Search/filter lagu
const MyPlaylist = () => {
  // ===============================
  // STATE MANAGEMENT
  // ===============================
  const [myPlaylist, setMyPlaylist] = useState([]); // daftar track (lagu) milik user
  const [currentIndex, setCurrentIndex] = useState(null); // index lagu yang sedang diputar, null = tidak ada yang diputar
  const [search, setSearch] = useState(""); // query pencarian dari input user

  // ===============================
  // FETCH DATA dari localStorage
  // ===============================
  // Tujuan: agar playlist tetap tersimpan meskipun halaman direfresh
  // useEffect hanya dijalankan sekali saat komponen pertama kali render
  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem("myPlaylist")) || []; 
    setMyPlaylist(savedPlaylist); // simpan ke state lokal
  }, []);

  // ===============================
  // FUNGSI: removeTrack
  // ===============================
  // Menghapus track dari playlist berdasarkan id
  // Juga menyesuaikan currentIndex supaya tidak error:
  //  - Jika track yang sedang diputar dihapus, player berhenti
  //  - Jika track sebelum track aktif dihapus, index dikurangi 1
  const removeTrack = (trackId) => {
    setMyPlaylist((prev) => {
      // Buat array baru tanpa track yang dihapus
      const updated = prev.filter((t) => t.id !== trackId);

      // Cari posisi track yang dihapus
      const removedIndex = prev.findIndex((t) => t.id === trackId);

      // Update currentIndex agar player tetap sinkron
      if (currentIndex !== null) {
        if (removedIndex === currentIndex) {
          // Jika yang dihapus adalah lagu yang sedang diputar → stop player
          setCurrentIndex(null);
        } else if (removedIndex < currentIndex) {
          // Jika posisi track dihapus berada sebelum lagu aktif → geser index ke kiri
          setCurrentIndex((ci) => ci - 1);
        }
      }

      // Simpan playlist baru ke localStorage
      localStorage.setItem("myPlaylist", JSON.stringify(updated));
      return updated;
    });
  };

  // ===============================
  // FUNGSI: Kontrol player
  // ===============================
  // handlePlayTrack → set lagu yang dipilih user untuk diputar
  const handlePlayTrack = (index) => setCurrentIndex(index);

  // handleNext → pindah ke lagu selanjutnya (pakai modulus supaya looping kembali ke awal)
  const handleNext = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    setCurrentIndex((currentIndex + 1) % myPlaylist.length);

  // handlePrev → pindah ke lagu sebelumnya (pakai + length supaya tidak negatif)
  const handlePrev = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    setCurrentIndex((currentIndex - 1 + myPlaylist.length) % myPlaylist.length);

  // ===============================
  // DERIVED STATE
  // ===============================
  // playingTrack → track yang sedang aktif diputar berdasarkan currentIndex
  const playingTrack = currentIndex !== null ? myPlaylist[currentIndex] : null;

  // filteredPlaylist → daftar lagu setelah difilter berdasarkan input search
  // Matching dilakukan pada title dan artist, tidak case-sensitive
  const filteredPlaylist = myPlaylist.filter(
    (track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase())
  );

  // ===============================
  // RENDER UI
  // ===============================
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-black via-black/70 to-purple-900 text-white p-6 overflow-hidden">

      {/* Judul halaman */}
      {/* Styling menggunakan gradient text + animasi bounce */}
      <h1 className="text-5xl font-extrabold mb-6 text-center tracking-wide 
                     bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-200 
                     drop-shadow-2xl animate-bounce">
        My Playlist 🎶
      </h1>

      {/* SEARCH BAR */}
      {/* Input untuk mencari lagu berdasarkan title/artist */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-white/10 rounded-2xl px-3 py-2 w-full max-w-md">
          {/* Ikon search di kiri input */}
          <Search size={18} className="text-white mr-2" />
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)} // update state search setiap ketikan
            className="bg-transparent outline-none flex-1 text-white placeholder-gray-300"
          />
        </div>
      </div>

      {/* PLAYLIST GRID */}
      {filteredPlaylist.length === 0 ? (
        // Kondisi jika hasil search kosong atau playlist kosong
        <p className="text-center text-gray-400 text-lg italic mt-32">
          {myPlaylist.length === 0
            ? "Your playlist is empty. Add some tracks!"
            : "No songs match your search."}
        </p>
      ) : (
        // Grid responsive untuk menampilkan setiap track
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {filteredPlaylist.map((track, index) => (
            <div
              key={track.id}
              className={`relative group bg-white/10 backdrop-blur-md rounded-2xl p-3 cursor-pointer transition-all duration-300 ${
                // Highlight track yang sedang diputar dengan ring & shadow
                index === currentIndex
                  ? "ring-2 ring-purple-400 shadow-[0_0_25px_rgba(150,75,200,0.6)] scale-105"
                  : "hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              }`}
              onClick={() => handlePlayTrack(index)} // klik card → mulai putar track
            >
              {/* Thumbnail lagu */}
              <div className="relative">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-40 object-cover rounded-xl transition-transform group-hover:scale-105"
                />

                {/* Tombol hapus track */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // cegah trigger klik card
                    removeTrack(track.id); // hapus lagu
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-600/80 hover:bg-red-700 transition shadow-md"
                >
                  <Trash2 size={16} />
                </button>

                {/* Label genre lagu */}
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full text-white shadow-md ${
                    genreColors[track.genre] || "bg-gray-500"
                  }`}
                >
                  {track.genre}
                </span>
              </div>

              {/* Judul & artist */}
              <h3 className="mt-2 font-bold text-lg truncate">{track.title}</h3>
              <p className="text-gray-300 text-sm italic truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      )}

      {/* MINI PLAYER FLOATING */}
      {/* Player muncul jika ada track yang sedang diputar */}
      {playingTrack && (
        <div className="fixed bottom-4 left-4 right-4 
                        bg-gradient-to-r from-black/80 via-black/60 to-purple-800 
                        backdrop-blur-2xl border border-white/20 z-50 
                        flex items-center gap-2 p-2 rounded-xl shadow-lg 
                        max-w-md md:max-w-lg lg:max-w-xl mx-auto">
          {/* Thumbnail kecil track */}
          <img
            src={playingTrack.cover}
            alt={playingTrack.title}
            className="w-12 h-12 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1 ml-2">
            {/* Info lagu */}
            <h2 className="text-sm font-bold truncate">{playingTrack.title}</h2>
            <p className="text-xs text-gray-300 truncate">{playingTrack.artist}</p>

            {/* Audio player native HTML */}
            {/* autoPlay → otomatis play saat track berubah */}
            {/* onEnded → otomatis play lagu berikutnya */}
            <audio
              src={playingTrack.preview}
              controls
              autoPlay
              onEnded={handleNext}
              className="w-full mt-1"
            />
          </div>
          {/* Kontrol tombol di kanan */}
          <div className="flex items-center gap-1">
            {/* Tombol previous track */}
            <button
              onClick={handlePrev}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              <SkipBack size={14} />
            </button>
            {/* Tombol next track */}
            <button
              onClick={handleNext}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              <SkipForward size={14} />
            </button>
            {/* Tombol stop/close player */}
            <button
              onClick={() => setCurrentIndex(null)}
              className="p-1 rounded-full bg-red-500 hover:bg-red-600 transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ===============================
// Export komponen
// ===============================
export default MyPlaylist;
