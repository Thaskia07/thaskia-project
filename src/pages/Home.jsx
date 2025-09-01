import React, { useEffect, useState, useRef } from "react";
// Mengimpor ikon dari lucide-react: Play, Pause, Music, SkipBack, SkipForward, X
// → digunakan untuk tombol kontrol audio dan tampilan mini player
import { Play, Pause, Music, SkipBack, SkipForward, X } from "lucide-react";

// Mengimpor motion dari framer-motion untuk animasi
// motion.div digunakan agar elemen <div> bisa dianimasikan
import { motion } from "framer-motion";

// Alias agar penulisan lebih ringkas
const MotionDiv = motion.div;

const Home = () => {
  /* ------------------------------------------
     STATE & REF
     ------------------------------------------ */
  const [tracks, setTracks] = useState([]); 
  // Menyimpan daftar lagu dari file JSON
  // Awalnya kosong, akan diisi setelah fetch

  const [currentTrack, setCurrentTrack] = useState(null); 
  // Menyimpan track yang sedang diputar
  // null artinya tidak ada lagu yang diputar

  const [isPlaying, setIsPlaying] = useState(false); 
  // Status play/pause untuk audio

  const [search, setSearch] = useState(""); 
  // Kata kunci pencarian untuk filter lagu

  const [genreFilter, setGenreFilter] = useState("All"); 
  // Filter lagu berdasarkan genre
  // Default: "All" = tampil semua genre

  const audioRef = useRef(null); 
  // Ref untuk elemen <audio>
  // Digunakan agar bisa mengontrol audio lewat React (play, pause, set currentTime, dsb)

  const [progress, setProgress] = useState(0); 
  // Progress bar lagu, nilai antara 0–1

  /* ------------------------------------------
     DAFTAR GENRE & WARNA HIGHLIGHT
     ------------------------------------------ */
  const genres = [
    "All", "Pop", "Rock", "Indie", "Dangdut", 
    "K-Pop", "R&B", "Pop Daerah", "Reggae", "Bollywood",
    "Pop Indonesia", // Tambahan baru, bisa dipilih di filter
  ];

  const genreColors = {
    Pop: "#ec4899", 
    Rock: "#ef4444",
    Indie: "#8b5cf6",
    Dangdut: "#facc15",
    "K-Pop": "#60a5fa",
    "R&B": "#6366f1",
    "Pop Daerah": "#f97316",
    Reggae: "#10b981",
    Bollywood: "#f43f5e",
    All: "#22c55e",
    "Pop Indonesia": "#f472b6", // Sesuai tambahan genre
  };

  /* ------------------------------------------
     AMBIL DATA TRACKS DARI FILE JSON
     ------------------------------------------ */
  useEffect(() => {
    // Fetch data dari /tracks.json di public folder
    fetch("/tracks.json")
      .then((res) => res.json()) // Parse JSON menjadi object JS
      .then((data) => setTracks(data)) // Simpan ke state tracks
      .catch((err) => console.error(err)); // Log jika ada error fetch
  }, []); 
  // dependency [] → hanya dijalankan sekali saat component mount

  /* ------------------------------------------
     UPDATE PROGRESS BAR SETIAP 0.5 DETIK
     ------------------------------------------ */
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        const current = audioRef.current.currentTime || 0; // waktu sekarang lagu
        const duration = audioRef.current.duration || 0; // durasi total lagu
        setProgress(duration ? current / duration : 0); // rasio progress 0–1
      }
    }, 500); // update setiap 0.5 detik

    return () => clearInterval(interval); 
    // bersihkan interval saat component unmount agar tidak memory leak
  }, [isPlaying]); 
  // hanya berjalan saat isPlaying berubah

  /* ------------------------------------------
     FILTER TRACKS BERDASARKAN GENRE & SEARCH
     ------------------------------------------ */
  const filteredTracks = tracks
    .filter((t) => genreFilter === "All" || t.genre === genreFilter) 
    // jika filter = All → tampil semua
    // jika filter = genre tertentu → tampil sesuai genre

    .filter((t) => t.title.toLowerCase().includes(search.toLowerCase())); 
    // filter berdasarkan search input, case-insensitive

  const topHits = filteredTracks.slice(0, 6); 
  // 6 lagu pertama → Top Hits

  const recommended = filteredTracks.slice(6, 12); 
  // 6 lagu berikutnya → Recommended

  /* ------------------------------------------
     FORMAT WAKTU (detik → menit:detik)
     ------------------------------------------ */
  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return "0:00"; 
    const minutes = Math.floor(sec / 60);
    const seconds = Math.floor(sec % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  /* ------------------------------------------
     HANDLE PLAY/PAUSE SAAT KLIK CARD
     ------------------------------------------ */
  const handlePlay = (track) => {
    if (!audioRef.current) return; // safety check

    if (currentTrack?.id === track.id) {
      // jika klik lagu yang sama → toggle play/pause
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().catch((err) => console.error(err));
        setIsPlaying(true);
      }
    } else {
      // jika klik lagu baru → ganti src, load, dan play
      setCurrentTrack(track);
      audioRef.current.src = track.preview;
      audioRef.current.load();
      audioRef.current.play().catch((err) => console.error(err));
      setIsPlaying(true);
    }
  };

  /* ------------------------------------------
     TOGGLE PLAY/PAUSE MINI PLAYER
     ------------------------------------------ */
  const togglePlay = () => {
    if (!audioRef.current || !currentTrack) return; 
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch((err) => console.error(err));
      setIsPlaying(true);
    }
  };

  /* ------------------------------------------
     SKIP TRACK (prev / next)
     direction = -1 → prev
     direction = +1 → next
     ------------------------------------------ */
  const skipTrack = (direction) => {
    if (!currentTrack) return;
    const index = filteredTracks.findIndex((t) => t.id === currentTrack.id);
    let newIndex = index + direction;

    // loop jika melebihi batas
    if (newIndex < 0) newIndex = filteredTracks.length - 1;
    if (newIndex >= filteredTracks.length) newIndex = 0;

    const newTrack = filteredTracks[newIndex];
    setCurrentTrack(newTrack);

    if (audioRef.current) {
      audioRef.current.src = newTrack.preview;
      audioRef.current.load();
      audioRef.current.play().catch((err) => console.error(err));
      setIsPlaying(true);
    }
  };

  /* ------------------------------------------
     HANDLE AUDIO ENDED
     ------------------------------------------ */
  const handleEnded = () => {
    skipTrack(1); // otomatis lanjut lagu berikutnya
  };

  /* ------------------------------------------
     RENDER UI
     ------------------------------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-gray-900 text-white px-6 pb-32 overflow-x-hidden">

      {/* HERO SECTION */}
      <motion.div className="text-center py-16">
        {/* Icon musik animasi */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }} 
          transition={{ duration: 6, repeat: Infinity }}
          className="flex justify-center mb-6"
        >
          <Music
            size={60}
            className="text-green-400 drop-shadow-[0_0_25px_rgba(34,197,94,0.7)]"
          />
        </motion.div>

        {/* Judul website */}
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-green-400 via-purple-500 to-pink-500 bg-clip-text text-transparent animate-pulse">
          Welcome to VibeBeat
        </h1>

        <p className="text-gray-400 mt-3 text-lg">
          Discover your sound. Feel the vibes 🎶
        </p>

        {/* Search Input */}
        <div className="mt-6 flex justify-center">
          <input
            type="text"
            placeholder="Search tracks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-xl px-4 py-2 rounded-2xl bg-gray-800/40 text-white placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 transition shadow-lg"
          />
        </div>

        {/* Genre Filter */}
        <div className="flex justify-center gap-2 mt-4 flex-wrap">
          {genres.map((g) => (
            <button
              key={g}
              onClick={() => setGenreFilter(g)}
              style={{ boxShadow: `0 0 10px ${genreColors[g]}` }}
              className={`px-3 py-1 rounded-full text-sm font-semibold transition transform hover:scale-110 ${
                genreFilter === g
                  ? `bg-[${genreColors[g]}] text-white`
                  : "bg-gray-700/40 text-gray-300 hover:bg-green-500 hover:text-white"
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Top Hits Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">🔥 Top Hits</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {topHits.map((track) => (
            <motion.div
              key={track.id}
              className="group relative bg-gray-800/30 hover:bg-gray-800 rounded-xl p-3 cursor-pointer hover:shadow-[0_0_25px_rgba(34,197,94,0.7)] transition transform hover:scale-105"
            >
              {/* Cover lagu */}
              <img
                src={track.cover}
                alt={track.title}
                className="w-full h-44 object-cover rounded-lg mb-2 shadow-lg"
              />
              {/* Info judul + artist */}
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-bold truncate">{track.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                </div>
                {/* Tombol Play/Pause muncul saat hover */}
                <motion.button
                  onClick={() => handlePlay(track)}
                  className="absolute bottom-4 right-4 bg-green-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                  whileHover={{ scale: 1.2 }}
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Recommended Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-6">✨ Recommended For You</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {recommended.map((track) => (
            <motion.div
              key={track.id}
              className="group relative bg-gray-800/30 hover:bg-gray-800 rounded-xl p-3 cursor-pointer hover:shadow-[0_0_25px_rgba(236,72,153,0.7)] transition transform hover:scale-105"
            >
              <img
                src={track.cover}
                alt={track.title}
                className="w-full h-44 object-cover rounded-lg mb-2 shadow-lg"
              />
              <div className="flex flex-col justify-between">
                <div>
                  <h3 className="font-bold truncate">{track.title}</h3>
                  <p className="text-gray-400 text-sm truncate">{track.artist}</p>
                </div>
                <motion.button
                  onClick={() => handlePlay(track)}
                  className="absolute bottom-4 right-4 bg-pink-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition shadow-lg"
                  whileHover={{ scale: 1.2 }}
                >
                  {currentTrack?.id === track.id && isPlaying ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} />
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* MINI PLAYER */}
      {currentTrack && (
        <motion.div
          className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-gray-900/90 rounded-2xl p-4 flex flex-col gap-2 shadow-2xl w-[90%] max-w-xl z-50"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* Info lagu */}
          <div className="flex items-center gap-4">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold truncate">{currentTrack.title}</h3>
              <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
            </div>
            <button
              onClick={() => setCurrentTrack(null)}
              className="p-2 rounded-full text-red-500 hover:text-red-700 transition"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {formatTime(audioRef.current?.currentTime || 0)}
            </span>
            <div
              className="flex-1 h-1 bg-gray-700 rounded-full relative cursor-pointer"
              onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const clickPos = e.clientX - rect.left;
                const width = rect.width;
                if (audioRef.current && audioRef.current.duration) {
                  audioRef.current.currentTime =
                    (clickPos / width) * audioRef.current.duration;
                }
              }}
            >
              <div
                className="h-1 bg-green-500 rounded-full"
                style={{ width: `${progress * 100}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-400">
              {formatTime(audioRef.current?.duration || 0)}
            </span>
          </div>

          {/* Kontrol play/pause & skip */}
          <div className="flex justify-center items-center gap-6 mt-2">
            <button onClick={() => skipTrack(-1)} className="p-2 rounded-full hover:bg-gray-700">
              <SkipBack size={20} />
            </button>
            <button onClick={togglePlay} className="bg-green-500 rounded-full p-2">
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button onClick={() => skipTrack(1)} className="p-2 rounded-full hover:bg-gray-700">
              <SkipForward size={20} />
            </button>
          </div>
        </motion.div>
      )}

      {/* Elemen audio HTML */}
      <audio ref={audioRef} onEnded={handleEnded} />
    </div>
  );
};

export default Home;
