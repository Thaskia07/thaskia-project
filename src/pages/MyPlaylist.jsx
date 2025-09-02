// ===============================
// Import modul React & hook bawaan
// ===============================
// React → library utama untuk membangun UI berbasis komponen
// useState → hook untuk membuat state lokal di dalam komponen fungsional
// useEffect → hook untuk mengatur efek samping (side effect), contoh: fetch data, sinkronisasi localStorage
import React, { useState, useEffect } from "react";

// ===============================
// Import ikon dari lucide-react (ikon berbasis SVG)
// ===============================
// lucide-react menyediakan ikon modern berbasis React component
// Kelebihan: ringan, scalable, bisa diubah warna/ukuran pakai props
// Ikon yang diimport di sini:
//   - X (✖) → dipakai untuk tombol tutup mini-player
//   - Play (▶) → tidak dipakai langsung (tapi bisa dipakai untuk tombol play custom)
//   - Trash2 (🗑) → tombol hapus track
//   - SkipForward (⏭) → tombol ke lagu berikutnya
//   - SkipBack (⏮) → tombol ke lagu sebelumnya
//   - Search (🔍) → ikon search bar
import { X, Play, Trash2, SkipForward, SkipBack, Search } from "lucide-react"; 

// ===============================
// Mapping warna genre → agar setiap genre punya identitas visual berbeda
// ===============================
// key   = nama genre (string yang harus cocok dengan field track.genre)
// value = Tailwind CSS class untuk background warna badge genre
// Tujuan: mempermudah styling dinamis berdasarkan genre lagu
const genreColors = {
  Pop: "bg-pink-500",
  Rock: "bg-red-500",
  "R&B": "bg-blue-500",
  Dangdut: "bg-yellow-500",
  "K-Pop": "bg-purple-500",
  "Pop Daerah": "bg-green-500",
  Reggae: "bg-teal-500",
  Bollywood: "bg-orange-500",
  "Pop Indonesia": "bg-pink-400", // ✅ contoh tambahan genre lokal
};

// ===============================
// Komponen utama: MyPlaylist
// ===============================
// Ini adalah komponen React fungsional yang menangani:
// 1. Menampilkan daftar lagu (grid playlist)
// 2. Fitur pencarian (search filter)
// 3. Mini player untuk memutar lagu
// 4. Penyimpanan data di localStorage agar persistent
const MyPlaylist = () => {
  // ===============================
  // STATE MANAGEMENT
  // ===============================
  // myPlaylist    → array berisi daftar lagu
  // currentIndex  → index lagu yang sedang diputar (null = tidak ada lagu yang aktif)
  // search        → string query pencarian dari user
  const [myPlaylist, setMyPlaylist] = useState([]); 
  const [currentIndex, setCurrentIndex] = useState(null);
  const [search, setSearch] = useState(""); 

  // ===============================
  // FETCH DATA pertama kali dengan useEffect
  // Dependency array kosong ([]) → hanya jalan sekali saat komponen mount
  // ===============================
useEffect(() => {
  // Ambil playlist dari localStorage
  const savedPlaylist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
  setMyPlaylist(savedPlaylist); // kalau kosong ya hasilnya tetap []
}, []);

  // ===============================
  // FUNGSI: removeTrack
  // Tujuan: menghapus 1 lagu dari playlist berdasarkan ID
  // ===============================
  const removeTrack = (trackId) => {
    setMyPlaylist((prev) => {
      // Buat array baru tanpa track dengan id tersebut
      const updated = prev.filter((t) => t.id !== trackId);
      // Cari posisi (index) track yang dihapus di array lama
      const removedIndex = prev.findIndex((t) => t.id === trackId);

      // Update currentIndex agar tidak error
      if (currentIndex !== null) {
        if (removedIndex === currentIndex) {
          // Kalau track yang dihapus sedang diputar → stop
          setCurrentIndex(null);
        } else if (removedIndex < currentIndex) {
          // Kalau track yang dihapus ada sebelum track yang diputar → geser index -1
          setCurrentIndex((ci) => ci - 1);
        }
      }

      // Update localStorage dengan playlist baru
      localStorage.setItem("myPlaylist", JSON.stringify(updated));
      return updated;
    });
  };

  // ===============================
  // FUNGSI: Kontrol player
  // ===============================
  const handlePlayTrack = (index) => setCurrentIndex(index); // set lagu yang sedang diputar

  const handleNext = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    // % supaya looping ke awal kalau sudah di akhir
    setCurrentIndex((currentIndex + 1) % myPlaylist.length);

  const handlePrev = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    // (index - 1 + length) % length → rumus aman agar tidak negatif
    setCurrentIndex((currentIndex - 1 + myPlaylist.length) % myPlaylist.length);

  // ===============================
  // DERIVED STATE
  // ===============================
  // playingTrack → track object yang sedang diputar
  const playingTrack = currentIndex !== null ? myPlaylist[currentIndex] : null;

  // filteredPlaylist → daftar track yang cocok dengan search query
  // Pakai optional chaining (?.) + fallback string kosong (?? "")
  // Supaya aman kalau field title/artist undefined/null
  const filteredPlaylist = myPlaylist.filter((track) => {
    const title = track?.title ?? "";
    const artist = track?.artist ?? "";
    return (
      title.toLowerCase().includes(search.toLowerCase()) ||
      artist.toLowerCase().includes(search.toLowerCase())
    );
  });

  // ===============================
  // RENDER UI
  // ===============================
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-black via-black/70 to-purple-900 text-white p-6 overflow-hidden">
      {/* ==========================
           Judul halaman 
           - Pakai gradient text, animasi bounce, drop shadow
         ========================== */}
      <h1 className="text-5xl font-extrabold mb-6 text-center tracking-wide 
                     bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-200 
                     drop-shadow-2xl animate-bounce">
        My Playlist 🎶
      </h1>

      {/* ==========================
           Search Bar
           - Flexbox horizontal
           - Background transparan putih
           - Input text untuk pencarian
         ========================== */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-white/10 rounded-2xl px-3 py-2 w-full max-w-md">
          <Search size={18} className="text-white mr-2" />
          <input
            type="text"
            placeholder="Search by title or artist..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent outline-none flex-1 text-white placeholder-gray-300"
          />
        </div>
      </div>

      {/* ==========================
           Playlist Grid
           - Tampilkan pesan kalau playlist kosong
           - Atau tampilkan daftar track dalam grid responsive
         ========================== */}
      {filteredPlaylist.length === 0 ? (
        <p className="text-center text-gray-400 text-lg italic mt-32">
          {myPlaylist.length === 0
            ? "Your playlist is empty. Add some tracks!"
            : "No songs match your search."}
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 mt-4">
          {filteredPlaylist.map((track, index) => (
            <div
              key={track.id} // key unik untuk React
              className={`relative group bg-white/10 backdrop-blur-md rounded-2xl p-3 cursor-pointer transition-all duration-300 ${
                index === currentIndex
                  ? "ring-2 ring-purple-400 shadow-[0_0_25px_rgba(150,75,200,0.6)] scale-105"
                  : "hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              }`}
              onClick={() => handlePlayTrack(index)}
            >
              {/* Thumbnail lagu */}
              <div className="relative">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-40 object-cover rounded-xl transition-transform group-hover:scale-105"
                />

                {/* Tombol hapus (pojok kanan atas) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // supaya klik hapus tidak trigger play
                    removeTrack(track.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-600/80 hover:bg-red-700 transition shadow-md"
                >
                  <Trash2 size={16} />
                </button>

                {/* Label genre (pojok kiri atas) */}
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

      {/* ==========================
           Mini Player Floating
           - Fixed di bawah layar
           - Background gradient transparan
           - Menampilkan cover, info, audio controls
           - Tombol prev, next, close
         ========================== */}
      {playingTrack && (
        <div className="fixed bottom-4 left-4 right-4 
                        bg-gradient-to-r from-black/80 via-black/60 to-purple-800 
                        backdrop-blur-2xl border border-white/20 z-50 
                        flex items-center gap-2 p-2 rounded-xl shadow-lg 
                        max-w-md md:max-w-lg lg:max-w-xl mx-auto">
          {/* Cover lagu mini */}
          <img
            src={playingTrack.cover}
            alt={playingTrack.title}
            className="w-12 h-12 object-cover rounded-lg shadow-md"
          />
          {/* Info lagu + audio */}
          <div className="flex-1 ml-2">
            <h2 className="text-sm font-bold truncate">{playingTrack.title}</h2>
            <p className="text-xs text-gray-300 truncate">{playingTrack.artist}</p>
            {/* Audio player HTML bawaan */}
            <audio
              src={playingTrack.preview}
              controls
              autoPlay
              onEnded={handleNext} // otomatis lanjut ke next track setelah selesai
              className="w-full mt-1"
            />
          </div>
          {/* Tombol kontrol player */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              <SkipBack size={14} />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              <SkipForward size={14} />
            </button>
            <button
              onClick={() => setCurrentIndex(null)} // stop player
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
// Export komponen utama
// ===============================
// Supaya bisa digunakan di file lain (misalnya App.jsx)
export default MyPlaylist;