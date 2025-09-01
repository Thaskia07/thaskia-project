// Import modul React & hook bawaan
import React, { useState, useEffect } from "react";

// Import berbagai ikon dari library "lucide-react"
// - X → tombol close (✖)
// - Play → ikon play (▶)
// - Trash2 → ikon hapus 🗑
// - SkipForward → tombol next ⏭
// - SkipBack → tombol previous ⏮
// - Search → ikon pencarian 🔍
import { X, Play, Trash2, SkipForward, SkipBack, Search } from "lucide-react"; 

/* ------------------------------------------------
   Object mapping untuk warna background berdasarkan genre lagu.
   - Key: nama genre (Pop, Rock, dll.)
   - Value: kelas Tailwind CSS untuk memberi warna pada label genre.
   Fungsinya: supaya setiap genre punya identitas visual konsisten.
------------------------------------------------ */
const genreColors = {
  Pop: "bg-pink-500",
  Rock: "bg-red-500",
  "R&B": "bg-blue-500",
  Dangdut: "bg-yellow-500",
  "K-Pop": "bg-purple-500",
  "Pop Daerah": "bg-green-500",
  Reggae: "bg-teal-500",
  Bollywood: "bg-orange-500",
};

/* ------------------------------------------------
   Komponen utama: MyPlaylist
   Menampilkan playlist lagu user, mendukung:
   - Pencarian lagu (search)
   - Play, Next, Previous
   - Hapus lagu
   - Mini player yang "floating" di bawah layar
------------------------------------------------ */
const MyPlaylist = () => {
  /* ------------------------------------------
     STATE MANAGEMENT
  ------------------------------------------ */
  const [myPlaylist, setMyPlaylist] = useState([]);
  // → Menyimpan seluruh daftar lagu (array objek lagu).
  // → Setiap objek lagu biasanya punya: id, title, artist, cover, genre, preview.

  const [currentIndex, setCurrentIndex] = useState(null);
  // → Menyimpan index lagu yang sedang diputar.
  // → null berarti tidak ada lagu yang aktif (player tersembunyi).

  const [search, setSearch] = useState("");
  // → Menyimpan input pencarian dari user.
  // → Digunakan untuk filter daftar lagu sesuai title/artist.

  /* ------------------------------------------
     useEffect: Load data playlist dari localStorage
     - Dipanggil sekali saat komponen pertama kali render.
     - Ambil string dari localStorage dengan key "myPlaylist".
     - Jika tidak ada data, pakai array kosong.
     - Update state myPlaylist agar UI sinkron dengan localStorage.
  ------------------------------------------ */
  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
    setMyPlaylist(savedPlaylist);
  }, []);

  /* ------------------------------------------
     FUNGSI: removeTrack
     - Input: trackId (id lagu yang ingin dihapus)
     - Proses:
       1. Buat playlist baru tanpa lagu dengan id tsb.
       2. Cek apakah lagu yang dihapus sedang diputar.
          • Jika iya → set currentIndex ke null (stop player).
          • Jika posisi lagu yang dihapus ada sebelum currentIndex,
            maka currentIndex dikurangi 1 (supaya index tetap valid).
       3. Simpan playlist terbaru ke localStorage.
     - Output: state myPlaylist terupdate.
  ------------------------------------------ */
  const removeTrack = (trackId) => {
    setMyPlaylist((prev) => {
      const updated = prev.filter((t) => t.id !== trackId); // hapus lagu
      const removedIndex = prev.findIndex((t) => t.id === trackId); // cari posisi lagu yg dihapus

      if (currentIndex !== null) {
        if (removedIndex === currentIndex) {
          // Lagu yg diputar dihapus → stop player
          setCurrentIndex(null);
        } else if (removedIndex < currentIndex) {
          // Lagu dihapus sebelum lagu yg sedang main → geser index ke kiri
          setCurrentIndex((ci) => ci - 1);
        }
      }

      localStorage.setItem("myPlaylist", JSON.stringify(updated));
      return updated;
    });
  };

  /* ------------------------------------------
     FUNGSI: Kontrol player (play/next/prev)
  ------------------------------------------ */
  const handlePlayTrack = (index) => setCurrentIndex(index);
  // → Menyetel lagu tertentu untuk diputar, berdasarkan index.

  const handleNext = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    setCurrentIndex((currentIndex + 1) % myPlaylist.length);
  // → Pindah ke lagu berikutnya.
  // → Operator modulo (%) membuat playlist berulang (looping kembali ke awal).

  const handlePrev = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    setCurrentIndex((currentIndex - 1 + myPlaylist.length) % myPlaylist.length);
  // → Pindah ke lagu sebelumnya.
  // → Ditambah myPlaylist.length supaya tidak negatif saat di lagu pertama.

  /* ------------------------------------------
     STATE TURUNAN (Derived State)
  ------------------------------------------ */
  const playingTrack = currentIndex !== null ? myPlaylist[currentIndex] : null;
  // → Objek lagu yang sedang diputar.
  // → null jika tidak ada lagu yang aktif.

  const filteredPlaylist = myPlaylist.filter(
    (track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase())
  );
  // → Hasil filter dari myPlaylist berdasarkan input search.
  // → Pencarian case-insensitive karena pakai toLowerCase().

  /* ------------------------------------------
     RENDER UI
  ------------------------------------------ */
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-black via-black/70 to-purple-900 text-white p-6 overflow-hidden">
      {/* Judul halaman utama */}
      <h1 className="text-5xl font-extrabold mb-6 text-center tracking-wide 
                     bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-200 
                     drop-shadow-2xl animate-bounce">
        My Playlist 🎶
      </h1>

      {/* ------------------------------------------
          SEARCH BAR
          - Input teks untuk mencari lagu.
          - Ikon Search ditampilkan di kiri input.
          - Input dikontrol oleh state "search".
      ------------------------------------------ */}
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

      {/* ------------------------------------------
          PLAYLIST GRID
          - Jika playlist kosong → tampilkan pesan.
          - Jika ada lagu → render dalam grid card.
      ------------------------------------------ */}
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
              key={track.id}
              // Style kondisi: kalau lagu ini sedang diputar → highlight dengan ring & scale
              className={`relative group bg-white/10 backdrop-blur-md rounded-2xl p-3 cursor-pointer transition-all duration-300 ${
                index === currentIndex
                  ? "ring-2 ring-purple-400 shadow-[0_0_25px_rgba(150,75,200,0.6)] scale-105"
                  : "hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              }`}
              onClick={() => handlePlayTrack(index)}
            >
              {/* Thumbnail lagu (cover album/artwork) */}
              <div className="relative">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-40 object-cover rounded-xl transition-transform group-hover:scale-105"
                />

                {/* Tombol hapus lagu (pojok kanan atas) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // Supaya klik tombol hapus tidak ikut trigger play
                    removeTrack(track.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-600/80 hover:bg-red-700 transition shadow-md"
                >
                  <Trash2 size={16} />
                </button>

                {/* Label genre lagu (pojok kiri atas) */}
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full text-white shadow-md ${
                    genreColors[track.genre] || "bg-gray-500"
                  }`}
                >
                  {track.genre}
                </span>
              </div>

              {/* Judul lagu & nama artist */}
              <h3 className="mt-2 font-bold text-lg truncate">{track.title}</h3>
              <p className="text-gray-300 text-sm italic truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      )}

      {/* ------------------------------------------
          MINI PLAYER FLOATING
          - Hanya muncul kalau ada lagu yg sedang diputar (playingTrack != null).
          - Menempel di bawah layar.
          - Menampilkan cover, judul, artist, audio player, & tombol kontrol.
      ------------------------------------------ */}
      {playingTrack && (
        <div className="fixed bottom-4 left-4 right-4 
                        bg-gradient-to-r from-black/80 via-black/60 to-purple-800 
                        backdrop-blur-2xl border border-white/20 z-50 
                        flex items-center gap-2 p-2 rounded-xl shadow-lg 
                        max-w-md md:max-w-lg lg:max-w-xl mx-auto">
          {/* Thumbnail kecil cover lagu */}
          <img
            src={playingTrack.cover}
            alt={playingTrack.title}
            className="w-12 h-12 object-cover rounded-lg shadow-md"
          />

          {/* Info lagu + elemen <audio> */}
          <div className="flex-1 ml-2">
            <h2 className="text-sm font-bold truncate">{playingTrack.title}</h2>
            <p className="text-xs text-gray-300 truncate">{playingTrack.artist}</p>
            <audio
              src={playingTrack.preview}   // sumber audio (preview URL)
              controls                     // tampilkan kontrol bawaan browser
              autoPlay                     // otomatis play begitu muncul
              onEnded={handleNext}          // setelah selesai → otomatis lagu berikutnya
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
              onClick={() => setCurrentIndex(null)} // close player
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

export default MyPlaylist;
