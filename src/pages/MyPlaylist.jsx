// ===============================
// IMPORT MODUL
// ===============================
import React, { useState, useEffect } from "react";
import { X, Trash2, SkipForward, SkipBack, Search } from "lucide-react";

// ===============================
// WARNA GENRE
// ===============================
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

// ===============================
// KOMPONEN MyPlaylist
// ===============================
const MyPlaylist = () => {
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [search, setSearch] = useState("");

  // ===============================
  // FETCH DATA DARI public/track.json
  // ===============================
  useEffect(() => {
    fetch("/track.json")
      .then((res) => res.json())
      .then((data) => setMyPlaylist(data))
      .catch((err) => console.error("Failed to load playlist:", err));
  }, []);

  // ===============================
  // HAPUS TRACK
  // ===============================
  const removeTrack = (trackId) => {
    setMyPlaylist((prev) => {
      const updated = prev.filter((t) => t.id !== trackId);
      const removedIndex = prev.findIndex((t) => t.id === trackId);

      if (currentIndex !== null) {
        if (removedIndex === currentIndex) setCurrentIndex(null);
        else if (removedIndex < currentIndex) setCurrentIndex((ci) => ci - 1);
      }

      return updated;
    });
  };

  // ===============================
  // KONTROL PLAYER
  // ===============================
  const handlePlayTrack = (index) => setCurrentIndex(index);

  const handleNext =
    currentIndex !== null && myPlaylist.length > 0
      ? () => setCurrentIndex((currentIndex + 1) % myPlaylist.length)
      : undefined;

  const handlePrev =
    currentIndex !== null && myPlaylist.length > 0
      ? () =>
          setCurrentIndex(
            (currentIndex - 1 + myPlaylist.length) % myPlaylist.length
          )
      : undefined;

  const playingTrack = currentIndex !== null ? myPlaylist[currentIndex] : null;

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
      <h1 className="text-5xl font-extrabold mb-6 text-center tracking-wide 
                     bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-pink-300 to-purple-200 
                     drop-shadow-2xl animate-bounce">
        My Playlist 🎶
      </h1>

      {/* Search */}
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

      {/* Playlist */}
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
              <div className="relative">
                <img
                  src={track.cover}
                  alt={track.title}
                  className="w-full h-40 object-cover rounded-xl transition-transform group-hover:scale-105"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTrack(track.id);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-full bg-red-600/80 hover:bg-red-700 transition shadow-md"
                >
                  <Trash2 size={16} />
                </button>
                <span
                  className={`absolute top-2 left-2 px-2 py-0.5 text-[10px] font-bold rounded-full text-white shadow-md ${
                    genreColors[track.genre] || "bg-gray-500"
                  }`}
                >
                  {track.genre}
                </span>
              </div>
              <h3 className="mt-2 font-bold text-lg truncate">{track.title}</h3>
              <p className="text-gray-300 text-sm italic truncate">{track.artist}</p>
            </div>
          ))}
        </div>
      )}

      {/* Mini Player */}
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
              src={playingTrack.preview}
              controls
              autoPlay
              onEnded={handleNext}
              className="w-full mt-1"
            />
          </div>
          <div className="flex items-center gap-1">
            <button onClick={handlePrev} className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition">
              <SkipBack size={14} />
            </button>
            <button onClick={handleNext} className="p-1 rounded-full bg-gray-700 hover:bg-gray-600 transition">
              <SkipForward size={14} />
            </button>
            <button onClick={() => setCurrentIndex(null)} className="p-1 rounded-full bg-red-500 hover:bg-red-600 transition">
              <X size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPlaylist;
