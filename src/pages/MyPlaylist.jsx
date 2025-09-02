// ===============================
// Import modul React & hook bawaan
// ===============================
// React → library utama untuk membuat komponen UI reaktif
// useState → hook untuk membuat state lokal di komponen fungsional
// useEffect → hook untuk menjalankan side effect, seperti fetch data atau update DOM
import React, { useState, useEffect } from "react";

// ===============================
// Import ikon dari lucide-react
// ===============================
// X → tombol close/exit (✖)
// Play → tombol play (▶)
// Trash2 → tombol hapus 🗑
// SkipForward → tombol next/track berikutnya ⏭
// SkipBack → tombol previous/track sebelumnya ⏮
// Search → ikon search/pencarian 🔍
import { X, Play, Trash2, SkipForward, SkipBack, Search } from "lucide-react"; 

// ===============================
// Object mapping warna genre
// ===============================
// Tujuannya: setiap genre punya identitas visual yang konsisten menggunakan Tailwind CSS.
// Key = nama genre (string)
// Value = kelas Tailwind (string) untuk memberi warna background label genre
const genreColors = {
  Pop: "bg-pink-500",
  Rock: "bg-red-500",
  "R&B": "bg-blue-500",
  Dangdut: "bg-yellow-500",
  "K-Pop": "bg-purple-500",
  "Pop Daerah": "bg-green-500",
  Reggae: "bg-teal-500",
  Bollywood: "bg-orange-500",
  "Pop Indonesia": "bg-pink-400", // ✅ genre baru ditambahkan
};

// ===============================
// Komponen utama: MyPlaylist
// ===============================
// Fungsi: menampilkan playlist user, mendukung pencarian lagu, play/next/prev, hapus lagu, mini player floating
const MyPlaylist = () => {

  // ===============================
  // STATE MANAGEMENT
  // ===============================
  const [myPlaylist, setMyPlaylist] = useState([]); 
  // → Menyimpan seluruh lagu yang ditampilkan di UI. Array berisi objek:
  // {id, title, artist, cover, genre, preview}

  const [currentIndex, setCurrentIndex] = useState(null);
  // → Menyimpan index lagu yang sedang diputar.
  // → null = tidak ada lagu yang sedang diputar → mini player tersembunyi.

  const [search, setSearch] = useState(""); 
  // → Menyimpan input pencarian user.
  // → Digunakan untuk filter lagu berdasarkan judul/artist.

  // ===============================
  // FETCH DATA dari tracks.json
  // ===============================
  useEffect(() => {
    // 1️⃣ Ambil playlist dari localStorage jika user sebelumnya sudah menyimpan playlist
    const savedPlaylist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
    
    if (savedPlaylist.length > 0) {
      // Jika ada data di localStorage → langsung set state
      setMyPlaylist(savedPlaylist);
    } else {
      // Jika localStorage kosong → fetch dari tracks.json
      fetch("/tracks.json")
        .then((res) => res.json()) // ubah response jadi JSON
        .then((data) => {
          setMyPlaylist(data); // set semua lagu dari file ke state
          localStorage.setItem("myPlaylist", JSON.stringify(data)); 
          // Simpan juga ke localStorage agar user tetap punya playlist saat reload
        })
        .catch((err) => console.error("Error fetching tracks.json:", err));
    }
  }, []);
  // [] → dependency array kosong, berarti hanya dijalankan sekali saat mount

  // ===============================
  // FUNGSI: removeTrack
  // ===============================
  // Hapus lagu dari playlist
  const removeTrack = (trackId) => {
    setMyPlaylist((prev) => {
      // Filter array → hapus lagu dengan id yang sama
      const updated = prev.filter((t) => t.id !== trackId);

      // Dapatkan index lagu yang dihapus
      const removedIndex = prev.findIndex((t) => t.id === trackId);

      // Atur currentIndex agar mini player tetap valid
      if (currentIndex !== null) {
        if (removedIndex === currentIndex) {
          // Lagu yang sedang diputar dihapus → stop player
          setCurrentIndex(null);
        } else if (removedIndex < currentIndex) {
          // Lagu dihapus sebelum lagu yang sedang main → geser index ke kiri
          setCurrentIndex((ci) => ci - 1);
        }
      }

      // Update localStorage agar tetap sinkron
      localStorage.setItem("myPlaylist", JSON.stringify(updated));

      return updated;
    });
  };

  // ===============================
  // FUNGSI: Kontrol player (Play/Next/Prev)
  // ===============================
  const handlePlayTrack = (index) => setCurrentIndex(index);
  // → Menyetel lagu tertentu untuk diputar, index = posisi lagu di myPlaylist

  const handleNext = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    setCurrentIndex((currentIndex + 1) % myPlaylist.length);
  // → Pindah ke lagu berikutnya
  // → % myPlaylist.length membuat playlist looping ke awal jika sampai akhir

  const handlePrev = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    setCurrentIndex((currentIndex - 1 + myPlaylist.length) % myPlaylist.length);
  // → Pindah ke lagu sebelumnya
  // → + myPlaylist.length untuk menghindari negatif saat index = 0

  // ===============================
  // DERIVED STATE
  // ===============================
  const playingTrack = currentIndex !== null ? myPlaylist[currentIndex] : null;
  // → Objek lagu yang sedang diputar
  // → null jika tidak ada lagu aktif

  const filteredPlaylist = myPlaylist.filter(
    (track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase())
  );
  // → Filter playlist berdasarkan input search
  // → Case-insensitive karena pakai toLowerCase()

  // ===============================
  // RENDER UI
  // ===============================
  return (
    <div className="min-h-screen relative bg-gradient-to-br from-black via-black/70 to-purple-900 text-white p-6 overflow-hidden">

      {/* Judul halaman */}
      <h1 className="text-5xl font-extrabold mb-6 text-center tracking-wide 
                     bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-200 
                     drop-shadow-2xl animate-bounce">
        My Playlist 🎶
      </h1>

      {/* SEARCH BAR */}
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

      {/* PLAYLIST GRID */}
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

                {/* Tombol hapus */}
                <button
                  onClick={(e) => {
                    e.stopPropagation(); // klik tombol hapus tidak trigger play
                    removeTrack(track.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-600/80 hover:bg-red-700 transition shadow-md"
                >
                  <Trash2 size={16} />
                </button>

                {/* Label genre */}
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
      {playingTrack && (
        <div className="fixed bottom-4 left-4 right-4 
                        bg-gradient-to-r from-black/80 via-black/60 to-purple-800 
                        backdrop-blur-2xl border border-white/20 z-50 
                        flex items-center gap-2 p-2 rounded-xl shadow-lg 
                        max-w-md md:max-w-lg lg:max-w-xl mx-auto">
          <img
            src={playingTrack.cover}
            alt={playingTrack.title}
            className="w-12 h-12 object-cover rounded-lg shadow-md"
          />
          <div className="flex-1 ml-2">
            <h2 className="text-sm font-bold truncate">{playingTrack.title}</h2>
            <p className="text-xs text-gray-300 truncate">{playingTrack.artist}</p>
            <audio
              src={playingTrack.preview}   // sumber audio (preview URL)
              controls                     // tampilkan kontrol bawaan browser
              autoPlay                     // otomatis play begitu muncul
              onEnded={handleNext}         // setelah selesai → otomatis next
              className="w-full mt-1"
            />
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev} // pindah ke lagu sebelumnya
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition"
            >
              <SkipBack size={14} />
            </button>
            <button
              onClick={handleNext} // pindah ke lagu berikutnya
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