// Import React dan hook penting untuk state management & lifecycle
// - useState : membuat state lokal (data yang bisa berubah dalam komponen)
// - useEffect : menjalankan efek samping (misalnya fetch data saat komponen pertama kali render)
// - useRef : membuat referensi ke elemen DOM (misalnya audio player) agar bisa dikontrol langsung
import React, { useEffect, useState, useRef } from "react";

// Import ikon-ikon dari lucide-react untuk digunakan pada UI (ikon tombol player, favorit, dsb.)
import { Heart, List, X, SkipBack, SkipForward, Repeat } from "lucide-react";

// Objek warna label genre
// Setiap nama genre dipetakan ke kelas warna TailwindCSS agar punya warna khas
const genreColors = {
  Pop: "bg-pink-500",
  Rock: "bg-red-500",
  "R&B": "bg-blue-500",
  Dangdut: "bg-yellow-500",
  "K-Pop": "bg-purple-500",
  "Pop Daerah": "bg-green-500",
  Reggae: "bg-teal-500",
  Bollywood: "bg-orange-500",
  Indie: "bg-indigo-500", // ✅ Genre Indie ditambahkan
};

// Komponen utama Discover
// Komponen ini menampilkan daftar lagu, fitur filter & sort,
// bisa menambah lagu ke favorit / playlist, serta ada audio player popup
const Discover = () => {
  // =======================
  // 1. STATE MANAGEMENT
  // =======================
  const [tracks, setTracks] = useState([]); // Semua track dari file JSON
  const [displayedTracks, setDisplayedTracks] = useState([]); // Subset track yang ditampilkan di layar (pagination / load more)
  const [favorites, setFavorites] = useState([]); // Daftar lagu favorit, tersimpan di localStorage
  const [myPlaylist, setMyPlaylist] = useState([]); // Playlist pribadi, tersimpan di localStorage
  const [filter, setFilter] = useState(""); // Filter untuk genre
  const [sort, setSort] = useState(""); // Sortir track berdasarkan judul / artis
  const [loadCount, setLoadCount] = useState(10); // Batas jumlah track yang ditampilkan
  const [currentTrack, setCurrentTrack] = useState(null); // Lagu yang sedang diputar (null = tidak ada)
  const [isRepeat, setIsRepeat] = useState(false); // Mode repeat (ulang lagu otomatis)
  const [notification, setNotification] = useState(""); // Pesan notifikasi (muncul 2 detik lalu hilang)

  // Ref ke elemen audio (HTML5 <audio>) supaya bisa mengontrol play, pause, dsb. dari kode
  const audioRef = useRef(null);

  // =======================
  // 2. FETCH DATA + LOCALSTORAGE
  // =======================
  useEffect(() => {
    // Fetch daftar track dari file JSON lokal
    fetch("/tracks.json")
      .then((res) => res.json())
      .then((data) => {
        setTracks(data); // simpan semua track ke state
        setDisplayedTracks(data.slice(0, loadCount)); // tampilkan 10 lagu pertama
      });

    // Ambil data favorit yang tersimpan di localStorage
    const savedFav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFav);

    // Ambil data playlist pribadi dari localStorage
    const savedPlaylist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
    setMyPlaylist(savedPlaylist);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // hanya dijalankan sekali saat komponen pertama kali render

  // =======================
  // 3. FILTER & SORT
  // =======================
  // Hasil filter (genre) dan sort (judul / artis)
  const filteredTracks = tracks
    .filter((track) => (filter ? track.genre === filter : true)) // filter genre (jika kosong, tampil semua)
    .sort((a, b) => {
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      if (sort === "artist-asc") return a.artist.localeCompare(b.artist);
      if (sort === "artist-desc") return b.artist.localeCompare(a.artist);
      return 0; // default: tidak ada perubahan
    });

  // Saat filter/sort berubah → reset daftar yang ditampilkan ke 10 lagu pertama
  useEffect(() => {
    setDisplayedTracks(filteredTracks.slice(0, 10));
    setLoadCount(10);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sort, tracks]);

  // =======================
  // 4. FUNGSI-FUNGSI UTAMA
  // =======================

  // Tambahkan 10 lagu lagi ke daftar yang ditampilkan
  const handleLoadMore = () => {
    const nextCount = loadCount + 10;
    setDisplayedTracks(filteredTracks.slice(0, nextCount));
    setLoadCount(nextCount);
  };

  // Tampilkan notifikasi sementara (2 detik)
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000);
  };

  // Toggle favorit (jika sudah favorit → hapus, kalau belum → tambahkan)
  const toggleFavorite = (track) => {
    const isFav = favorites.find((t) => t.id === track.id); // cek apakah track sudah ada di favorit
    const updated = isFav
      ? favorites.filter((t) => t.id !== track.id) // hapus dari favorit
      : [...favorites, track]; // tambahkan ke favorit
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated)); // simpan ke localStorage

    // tampilkan notifikasi
    showNotification(
      isFav
        ? `${track.title} removed from Favorites`
        : `${track.title} added to Favorites!`
    );
  };

  // Tambahkan lagu ke playlist pribadi (jika belum ada)
  const addToMyPlaylist = (track) => {
    if (!myPlaylist.find((t) => t.id === track.id)) {
      const updated = [...myPlaylist, track];
      setMyPlaylist(updated);
      localStorage.setItem("myPlaylist", JSON.stringify(updated)); // simpan ke localStorage
      showNotification(`${track.title} added to My Playlist!`);
    } else {
      showNotification(`${track.title} is already in My Playlist!`);
    }
  };

  // Pindah ke track berikutnya
  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length; // % untuk looping
    setCurrentTrack(tracks[nextIndex]);
  };

  // Pindah ke track sebelumnya
  const handlePrev = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length; // +tracks.length agar tidak negatif
    setCurrentTrack(tracks[prevIndex]);
  };

  // =======================
  // 5. EVENT AUDIO
  // =======================
  // Saat lagu selesai diputar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        if (isRepeat) {
          // Jika repeat aktif → ulangi lagu dari awal
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } else {
          // Jika repeat off → otomatis pindah ke lagu berikutnya
          handleNext();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, isRepeat]);

  // =======================
  // 6. RENDER UI
  // =======================
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white p-6 relative overflow-hidden">
      
      {/* Notifikasi (muncul 2 detik di tengah atas layar) */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur-md shadow-lg z-50 animate-slide-down">
          {notification}
        </div>
      )}

      {/* Judul halaman */}
      <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wide drop-shadow-lg animate-bounce">
        Discover 🎶
      </h1>

      {/* Dropdown untuk Filter & Sort */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {/* Filter genre */}
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-3 rounded-xl text-black font-semibold bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
        >
          <option value="">All Genres</option>
          {Object.keys(genreColors).map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>

        {/* Sortir lagu */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="p-3 rounded-xl text-black font-semibold bg-white/90 backdrop-blur-sm focus:outline-none focus:ring-4 focus:ring-pink-400 transition"
        >
          <option value="">Sort By</option>
          <option value="title-asc">Title A → Z</option>
          <option value="title-desc">Title Z → A</option>
          <option value="artist-asc">Artist A → Z</option>
          <option value="artist-desc">Artist Z → A</option>
        </select>
      </div>

      {/* Grid daftar track */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayedTracks.map((track) => {
          const isFav = favorites.find((t) => t.id === track.id);
          return (
            <div
              key={track.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer group"
              onClick={() => setCurrentTrack(track)} // klik kartu = putar lagu
            >
              {/* Cover lagu */}
              <div className="relative w-full">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-36 object-cover rounded-xl transition-transform group-hover:scale-105"
                />
                {/* Label genre */}
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full text-white shadow-md ${
                    genreColors[track.genre] || "bg-gray-500"
                  }`}
                >
                  {track.genre}
                </span>
              </div>

              {/* Judul & artis */}
              <h3 className="mt-2 font-semibold text-base text-center drop-shadow-md">{track.title}</h3>
              <p className="text-gray-300 text-xs text-center italic">{track.artist}</p>

              {/* Tombol aksi */}
              <div className="flex gap-3 mt-2">
                {/* Favorite */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFavorite(track); }}
                  className={`p-2 rounded-full transition-all hover:scale-110 shadow-md ${
                    isFav ? "text-red-500 bg-white/20 animate-pulse" : "text-white bg-white/10 hover:bg-white/20"
                  }`}
                >
                  <Heart size={16} />
                </button>
                {/* Tambah ke playlist */}
                <button
                  onClick={(e) => { e.stopPropagation(); addToMyPlaylist(track); }}
                  className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-all hover:scale-110 shadow-md"
                >
                  <List size={16} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tombol Load More */}
      {displayedTracks.length < filteredTracks.length && (
        <div className="flex justify-center mt-12">
          <button
            onClick={handleLoadMore}
            className="bg-gradient-to-r from-pink-500 to-purple-600 px-8 py-3 rounded-2xl font-bold text-lg shadow-lg hover:scale-110 transition-transform"
          >
            Load More
          </button>
        </div>
      )}

      {/* Floating Player (Now Playing) */}
      {currentTrack && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl w-96 flex flex-col items-center p-6 relative transform animate-slide-up border border-white/20">
            
            {/* Tombol close */}
            <button
              onClick={() => setCurrentTrack(null)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-500 transition"
            >
              <X size={22} />
            </button>

            {/* Cover lagu yang sedang diputar */}
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-72 h-72 object-cover rounded-2xl mb-5 shadow-lg"
            />

            {/* Judul & artis */}
            <h2 className="text-2xl font-extrabold text-center drop-shadow-lg">{currentTrack.title}</h2>
            <p className="text-gray-300 text-center italic mb-2">{currentTrack.artist}</p>

            {/* Audio player */}
            <audio
              ref={audioRef}
              src={currentTrack.preview}
              controls
              autoPlay
              className="w-full mt-3 rounded-lg"
            />

            {/* Kontrol player */}
            <div className="flex gap-4 mt-5">
              {/* Prev */}
              <button
                onClick={handlePrev}
                className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md"
              >
                <SkipBack size={22} />
              </button>

              {/* Favorite */}
              <button
                onClick={() => toggleFavorite(currentTrack)}
                className={`p-3 rounded-full transition-all hover:scale-125 shadow-md ${
                  favorites.find((t) => t.id === currentTrack.id)
                    ? "text-red-500 bg-white/20 animate-pulse"
                    : "text-white bg-white/10 hover:bg-white/20"
                }`}
              >
                <Heart size={24} />
              </button>

              {/* Next */}
              <button
                onClick={handleNext}
                className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md"
              >
                <SkipForward size={22} />
              </button>
            </div>

            {/* Toggle repeat */}
            <button
              onClick={() => setIsRepeat(!isRepeat)}
              className={`mt-5 px-6 py-2 flex items-center gap-2 rounded-xl font-bold shadow-md ${
                isRepeat ? "bg-yellow-500 hover:bg-yellow-600" : "bg-gray-700 hover:bg-gray-600"
              }`}
            >
              <Repeat size={20} />
              {isRepeat ? "Repeat ON" : "Repeat OFF"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Export komponen agar bisa dipakai di file lain
export default Discover;
