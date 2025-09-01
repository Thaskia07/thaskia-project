import React, { useEffect, useState, useRef } from "react";
import { Heart, Shuffle, Search, Trash2 } from "lucide-react";

// ============================================================================
// Mapping warna untuk setiap genre lagu
// ============================================================================
// Tujuannya: memberi identitas visual yang berbeda per genre di UI.
// Jika genre tidak ada di mapping, default ke abu-abu
// ✅ Menambahkan "Pop Indonesia" sesuai track.json
const genreColors = {
  Pop: "bg-pink-500",
  Rock: "bg-red-500",
  "R&B": "bg-blue-500",
  Dangdut: "bg-yellow-500",
  "K-Pop": "bg-purple-500",
  "Pop Daerah": "bg-green-500",
  Reggae: "bg-teal-500",
  Bollywood: "bg-orange-500",
  "Pop Indonesia": "bg-pink-400",
};

// ============================================================================
// COMPONENT Favorites
// ============================================================================
const Favorites = () => {
  // --------------------------------------------------------------------------
  // STATE
  // --------------------------------------------------------------------------
  const [favorites, setFavorites] = useState([]);          // Array lagu favorit
  const [playingTrack, setPlayingTrack] = useState(null);  // Track yang sedang diputar
  const [progress, setProgress] = useState(0);             // Progress bar (0..1)
  const [search, setSearch] = useState("");                // Input search box

  // --------------------------------------------------------------------------
  // useRef
  // --------------------------------------------------------------------------
  // Memberikan akses langsung ke DOM audio element, misal untuk play/pause atau seek
  const audioRef = useRef(null);

  // --------------------------------------------------------------------------
  // useEffect: load favorites
  // --------------------------------------------------------------------------
  // Jalankan sekali saat component pertama kali mount
  useEffect(() => {
    const savedFav = JSON.parse(localStorage.getItem("favorites")) || [];
    if (savedFav.length > 0) {
      // Jika ada data di localStorage → load favorites
      setFavorites(savedFav);
    } else {
      // Jika tidak ada → fetch data dari track.json di public folder
      fetch("/track.json")
        .then((res) => res.json())
        .then((data) => {
          setFavorites(data); // Set state favorites
          localStorage.setItem("favorites", JSON.stringify(data)); // Simpan ke localStorage
        })
        .catch((err) => console.error("Error fetching track.json:", err));
    }
  }, []);

  // --------------------------------------------------------------------------
  // FUNCTION removeFavorite
  // --------------------------------------------------------------------------
  // Menghapus lagu dari favorites
  // 1. Filter track yang ingin dihapus
  // 2. Update state favorites
  // 3. Update localStorage
  // 4. Hentikan audio jika lagu yang dihapus sedang diputar
  const removeFavorite = (trackId) => {
    const updatedFav = favorites.filter((t) => t.id !== trackId);
    setFavorites(updatedFav);
    localStorage.setItem("favorites", JSON.stringify(updatedFav));

    if (playingTrack && playingTrack.id === trackId) setPlayingTrack(null);
  };

  // --------------------------------------------------------------------------
  // FUNCTION handlePlayTrack
  // --------------------------------------------------------------------------
  // Memulai memutar track tertentu
  // 1. Set track yang sedang diputar
  // 2. Reset progress bar ke 0
  const handlePlayTrack = (track) => {
    setPlayingTrack(track);
    setProgress(0);
  };

  // --------------------------------------------------------------------------
  // FUNCTION handlePlayRandom
  // --------------------------------------------------------------------------
  // Memutar track random dari daftar favorites
  // 1. Pilih track secara acak
  // 2. Set track yang sedang diputar
  // 3. Reset progress bar
  const handlePlayRandom = () => {
    if (favorites.length > 0) {
      const randomIndex = Math.floor(Math.random() * favorites.length);
      setPlayingTrack(favorites[randomIndex]);
      setProgress(0);
    }
  };

  // --------------------------------------------------------------------------
  // FILTER favorites berdasarkan search input
  // --------------------------------------------------------------------------
  // Case-insensitive, filter di title dan artist
  const filteredFavorites = favorites.filter(
    (track) =>
      track.title.toLowerCase().includes(search.toLowerCase()) ||
      track.artist.toLowerCase().includes(search.toLowerCase())
  );

  // --------------------------------------------------------------------------
  // FUNCTION playNextTrack
  // --------------------------------------------------------------------------
  // Auto-play track berikutnya saat current track selesai
  // 1. Cari index track saat ini
  // 2. Loop ke track pertama jika track terakhir
  // 3. Set playingTrack baru
  const playNextTrack = () => {
    if (!playingTrack || filteredFavorites.length === 0) return;
    const currentIndex = filteredFavorites.findIndex(
      (t) => t.id === playingTrack.id
    );
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredFavorites.length;
    setPlayingTrack(filteredFavorites[nextIndex]);
    setProgress(0);
  };

  // ========================================================================
  // RENDER UI
  // ========================================================================
  return (
    <div className="relative min-h-screen overflow-hidden text-white p-6">
      {/* Background gradient full screen */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-950 via-purple-900 to-black animate-gradient-x -z-10"></div>

      {/* Judul halaman */}
      <h1 className="text-3xl font-bold mb-4 text-center animate-bounce drop-shadow-lg">
        💖 My Favorites
      </h1>

      {/* Toolbar search + tombol random */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        {/* Total lagu */}
        <p className="text-lg font-semibold">
          Total: <span className="text-pink-300">{favorites.length}</span> songs
        </p>

        {/* Search box + Random play */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search box */}
          <div className="flex w-full sm:w-72 items-center bg-white rounded-2xl shadow-md overflow-hidden">
            <Search size={18} className="ml-3 text-gray-500" /> {/* Icon search */}
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search songs..."
              className="flex-1 px-3 py-2 text-black font-medium focus:outline-none"
            />
            <button
              type="button"
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
            >
              Cari
            </button>
          </div>

          {/* Tombol random play */}
          <button
            onClick={handlePlayRandom}
            className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl shadow hover:scale-105 transition"
          >
            <Shuffle size={18} /> Random
          </button>
        </div>
      </div>

      {/* Pesan jika tidak ada lagu */}
      {filteredFavorites.length === 0 ? (
        <p className="text-center text-gray-300 text-lg">
          {favorites.length === 0
            ? "You don't have any favorite songs yet."
            : "No songs match your search."}
        </p>
      ) : (
        // Grid lagu
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 relative z-10">
          {filteredFavorites.map((track) => (
            <div
              key={track.id}
              className="bg-gradient-to-b from-purple-900 to-black rounded-xl p-4 flex flex-col items-center transform transition-all duration-500 hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.7)] hover:rotate-1 cursor-pointer group relative"
              onClick={() => handlePlayTrack(track)}
            >
              {/* Cover */}
              <img
                src={track.cover}
                alt={track.title}
                className="w-full h-44 object-cover rounded-lg mb-3 transition-transform group-hover:scale-110"
              />
              {/* Judul & artis */}
              <h3 className="font-semibold text-lg text-center">{track.title}</h3>
              <p className="text-gray-300 text-sm mb-2 text-center">{track.artist}</p>
              {/* Label genre */}
              <span
                className={`mt-1 px-2 py-0.5 text-xs rounded-full text-white animate-pulse ${
                  genreColors[track.genre] || "bg-gray-500"
                }`}
              >
                {track.genre}
              </span>
              {/* Tombol hapus */}
              <button
                onClick={(e) => {
                  e.stopPropagation(); // Mencegah klik kartu memicu play
                  removeFavorite(track.id);
                }}
                className="absolute top-3 right-3 p-1 rounded-full text-red-500 hover:text-red-400 hover:scale-110 transition-transform"
                title="Hapus dari Favorites"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Floating player untuk lagu yang sedang diputar */}
      {playingTrack && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-b from-purple-900 to-black rounded-3xl shadow-2xl w-96 flex flex-col items-center p-6 relative animate-slide-up">
            {/* Tombol close */}
            <button
              onClick={() => setPlayingTrack(null)}
              className="absolute top-3 right-3 text-white text-2xl hover:text-red-400 transition-colors"
            >
              ×
            </button>

            {/* Cover besar */}
            <img
              src={playingTrack.cover}
              alt={playingTrack.title}
              className="w-72 h-72 object-cover rounded-2xl shadow-lg mb-4"
            />

            {/* Judul & artis */}
            <h2 className="text-2xl font-bold mb-1">{playingTrack.title}</h2>
            <p className="text-gray-300 mb-3">{playingTrack.artist}</p>

            {/* Audio element */}
            <audio
              src={playingTrack.preview}
              controls
              autoPlay
              ref={audioRef}
              onTimeUpdate={(e) =>
                setProgress(e.target.currentTime / e.target.duration)
              }
              onEnded={playNextTrack}
              className="w-full mt-3 rounded-lg"
            />

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-700 rounded-full mt-2">
              <div
                className="h-2 bg-purple-500 rounded-full transition-all"
                style={{ width: `${progress * 100 || 0}%` }}
              ></div>
            </div>

            {/* Visualizer */}
            <div className="flex gap-1 mt-3 w-full justify-center items-end h-10">
              {Array.from({ length: 10 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-gradient-to-t from-purple-400 to-pink-400 rounded"
                  style={{
                    height: `${Math.random() * 20 + 10}px`,
                    transition: "height 0.1s",
                  }}
                ></div>
              ))}
            </div>

            {/* Tombol hapus lagu dari player */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => removeFavorite(playingTrack.id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-white font-medium transition"
              >
                <Trash2 size={18} /> Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Favorites;
