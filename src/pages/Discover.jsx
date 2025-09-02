// =======================
// 0. IMPORT DEPENDENSI
// =======================

// Import React dan beberapa hooks penting
// - useState: untuk membuat state lokal yang bisa berubah dan memicu render ulang komponen
// - useEffect: untuk menjalankan efek samping, misalnya fetch data, update DOM, atau listen ke perubahan state tertentu
// - useRef: untuk referensi elemen DOM, misal audio player untuk kontrol play/pause/restart
import React, { useEffect, useState, useRef } from "react";

// Import ikon dari library lucide-react untuk digunakan pada tombol UI
// Heart → favorit, List → playlist, X → close modal, SkipBack → prev, SkipForward → next, Repeat → repeat toggle
import { Heart, List, X, SkipBack, SkipForward, Repeat } from "lucide-react";

// =======================
// 1. DEFINISI WARNA GENRE
// =======================

// genreColors adalah object yang menyimpan mapping genre → kelas TailwindCSS untuk warna label
// Tujuannya agar setiap genre memiliki warna berbeda di UI dan mudah dikenali user
// Contoh: Pop → pink, Rock → merah, Pop Indonesia → pink muda
const genreColors = {
  Pop: "bg-pink-500",
  Rock: "bg-red-500",
  "R&B": "bg-blue-500",
  Dangdut: "bg-yellow-500",
  "K-Pop": "bg-purple-500",
  "Pop Daerah": "bg-green-500",
  Reggae: "bg-teal-500",
  Bollywood: "bg-orange-500",
  Indie: "bg-indigo-500",
  "Pop Indonesia": "bg-pink-400", // Genre baru
};

// =======================
// 2. COMPONENT DISCOVER
// =======================

// Komponen Discover: menampilkan track musik, filter, sort, favorite, playlist, dan floating audio player
const Discover = () => {

  // =======================
  // 2A. STATE MANAGEMENT
  // =======================

  // tracks → semua lagu yang diambil dari JSON
  const [tracks, setTracks] = useState([]);

  // displayedTracks → lagu yang saat ini ditampilkan di UI
  // Digunakan untuk implementasi "Load More" sehingga tidak semua lagu ditampilkan sekaligus
  const [displayedTracks, setDisplayedTracks] = useState([]);

  // favorites → daftar lagu favorit user, disimpan di localStorage
  const [favorites, setFavorites] = useState([]);

  // myPlaylist → daftar lagu yang dimasukkan ke playlist pribadi, juga disimpan di localStorage
  const [myPlaylist, setMyPlaylist] = useState([]);

  // filter → genre yang dipilih user
  const [filter, setFilter] = useState("");

  // sort → pilihan sorting lagu, bisa title asc/desc atau artist asc/desc
  const [sort, setSort] = useState("");

  // loadCount → jumlah lagu yang ditampilkan di UI (untuk implementasi load more)
  const [loadCount, setLoadCount] = useState(10);

  // currentTrack → track yang sedang diputar di audio player
  const [currentTrack, setCurrentTrack] = useState(null);

  // isRepeat → apakah mode repeat aktif atau tidak
  const [isRepeat, setIsRepeat] = useState(false);

  // notification → pesan notifikasi sementara, misal "added to playlist"
  const [notification, setNotification] = useState("");

  // Ref untuk audio player, memungkinkan kita mengontrol elemen audio secara langsung
  const audioRef = useRef(null);

  // =======================
  // 2B. FETCH DATA + LOCALSTORAGE
  // =======================

  useEffect(() => {
    // 1. Ambil data lagu dari JSON lokal di folder public
    // fetch("/tracks.json") akan memanggil file tracks.json dan mengubah response menjadi object JS
    fetch("/tracks.json")
      .then((res) => res.json())
      .then((data) => {
        setTracks(data); // simpan semua track di state tracks
        setDisplayedTracks(data.slice(0, loadCount)); // tampilkan track pertama sesuai loadCount
      });

    // 2. Ambil data favorit dari localStorage, jika tidak ada gunakan array kosong
    const savedFav = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(savedFav);

    // 3. Ambil data playlist dari localStorage, jika tidak ada gunakan array kosong
    const savedPlaylist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
    setMyPlaylist(savedPlaylist);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] artinya efek ini hanya dijalankan sekali saat komponen pertama kali render

  // =======================
  // 2C. FILTER & SORT LOGIC
  // =======================

  // filteredTracks → lagu yang sudah difilter dan diurutkan sesuai filter/sort user
  const filteredTracks = tracks
    .filter((track) => (filter ? track.genre === filter : true)) // jika filter kosong → tampil semua
    .sort((a, b) => { // sort berdasarkan pilihan user
      if (sort === "title-asc") return a.title.localeCompare(b.title);
      if (sort === "title-desc") return b.title.localeCompare(a.title);
      if (sort === "artist-asc") return a.artist.localeCompare(b.artist);
      if (sort === "artist-desc") return b.artist.localeCompare(a.artist);
      return 0; // default → tidak ada sort
    });

  // Update displayedTracks setiap filter atau sort berubah
  useEffect(() => {
    setDisplayedTracks(filteredTracks.slice(0, 10)); // reset tampilan ke 10 lagu pertama
    setLoadCount(10); // reset loadCount ke 10
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, sort, tracks]);

  // =======================
  // 2D. FUNGSI UTAMA
  // =======================

  // Fungsi Load More → menampilkan 10 lagu tambahan dari filteredTracks
  const handleLoadMore = () => {
    const nextCount = loadCount + 10;
    setDisplayedTracks(filteredTracks.slice(0, nextCount));
    setLoadCount(nextCount);
  };

  // Fungsi menampilkan notifikasi sementara
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000); // hilang setelah 2 detik
  };

  // Toggle favorite: jika track sudah ada di favorites → hapus, jika belum → tambah
  const toggleFavorite = (track) => {
    const isFav = favorites.find((t) => t.id === track.id);
    const updated = isFav
      ? favorites.filter((t) => t.id !== track.id)
      : [...favorites, track];
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated)); // simpan ke localStorage

    showNotification(
      isFav
        ? `${track.title} removed from Favorites`
        : `${track.title} added to Favorites!`
    );
  };

  // Tambah track ke playlist pribadi
  const addToMyPlaylist = (track) => {
    if (!myPlaylist.find((t) => t.id === track.id)) {
      const updated = [...myPlaylist, track];
      setMyPlaylist(updated);
      localStorage.setItem("myPlaylist", JSON.stringify(updated)); // update localStorage
      showNotification(`${track.title} added to My Playlist!`);
    } else {
      showNotification(`${track.title} is already in My Playlist!`);
    }
  };

  // Next track (looping)
  const handleNext = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length; // modulo untuk looping
    setCurrentTrack(tracks[nextIndex]);
  };

  // Previous track (looping)
  const handlePrev = () => {
    if (!currentTrack) return;
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + tracks.length) % tracks.length; // modulo untuk looping
    setCurrentTrack(tracks[prevIndex]);
  };

  // =======================
  // 2E. EVENT AUDIO
  // =======================

  // Memantau event ketika audio selesai diputar
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onended = () => {
        if (isRepeat) { // jika repeat aktif → putar ulang track
          audioRef.current.currentTime = 0;
          audioRef.current.play();
        } else { // jika tidak → lanjut ke track berikutnya
          handleNext();
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, isRepeat]); // dependensi: currentTrack, isRepeat

  // =======================
  // 3. RENDER UI
  // =======================

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 text-white p-6 relative overflow-hidden">

      {/* =======================
          3A. NOTIFIKASI POPUP
          Muncul sementara saat user menambahkan favorit/playlist
      ======================= */}
      {notification && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 bg-white/20 text-white px-6 py-3 rounded-xl backdrop-blur-md shadow-lg z-50 animate-slide-down">
          {notification}
        </div>
      )}

      {/* =======================
          3B. JUDUL HALAMAN
      ======================= */}
      <h1 className="text-5xl font-extrabold mb-12 text-center tracking-wide drop-shadow-lg animate-bounce">
        Discover 🎶
      </h1>

      {/* =======================
          3C. FILTER & SORT DROPDOWN
      ======================= */}
      <div className="flex flex-wrap gap-4 mb-10 justify-center">
        {/* Dropdown Filter Genre */}
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

        {/* Dropdown Sort */}
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

      {/* =======================
          3D. GRID TRACKS
          Menampilkan cover, judul, artis, tombol favorite + playlist
      ======================= */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {displayedTracks.map((track) => {
          const isFav = favorites.find((t) => t.id === track.id); // cek apakah track sudah di favorit
          return (
            <div
              key={track.id}
              className="bg-white/10 backdrop-blur-md rounded-2xl p-3 flex flex-col items-center transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] cursor-pointer group"
              onClick={() => setCurrentTrack(track)} // klik → buka floating player
            >
              <div className="relative w-full">
                {/* Cover */}
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-36 object-cover rounded-xl transition-transform group-hover:scale-105"
                />
                {/* Label Genre */}
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full text-white shadow-md ${
                    genreColors[track.genre] || "bg-gray-500"
                  }`}
                >
                  {track.genre}
                </span>
              </div>

              <h3 className="mt-2 font-semibold text-base text-center drop-shadow-md">{track.title}</h3>
              <p className="text-gray-300 text-xs text-center italic">{track.artist}</p>

              {/* Tombol Favorite + Playlist */}
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

                {/* Tambah Playlist */}
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

      {/* =======================
          3E. LOAD MORE BUTTON
          Menampilkan tombol untuk memuat track tambahan
      ======================= */}
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

      {/* =======================
          3F. FLOATING AUDIO PLAYER
          Muncul di atas layar saat user klik track
      ======================= */}
      {currentTrack && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-2xl w-96 flex flex-col items-center p-6 relative transform animate-slide-up border border-white/20">
            
            {/* Tombol Close */}
            <button
              onClick={() => setCurrentTrack(null)}
              className="absolute top-3 right-3 p-2 rounded-full hover:bg-red-500 transition"
            >
              <X size={22} />
            </button>

            {/* Cover Track */}
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-72 h-72 object-cover rounded-2xl mb-5 shadow-lg"
            />

            {/* Judul & artis */}
            <h2 className="text-2xl font-extrabold text-center drop-shadow-lg">{currentTrack.title}</h2>
            <p className="text-gray-300 text-center italic mb-2">{currentTrack.artist}</p>

            {/* Audio Player */}
            <audio
              ref={audioRef}
              src={currentTrack.preview}
              controls
              autoPlay
              className="w-full mt-3 rounded-lg"
            />

            {/* Kontrol Prev / Favorite / Next */}
            <div className="flex gap-4 mt-5">
              <button onClick={handlePrev} className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md">
                <SkipBack size={22} />
              </button>
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
              <button onClick={handleNext} className="p-3 rounded-full bg-blue-500 hover:bg-blue-600 shadow-md">
                <SkipForward size={22} />
              </button>
            </div>

            {/* Toggle Repeat */}
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

// =======================
// 4. EXPORT COMPONENT
// =======================
export default Discover;
