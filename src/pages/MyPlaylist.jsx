import React, { useEffect, useState } from "react";
import { X, Trash2, SkipForward, SkipBack } from "lucide-react";

// Mapping warna genre
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

const MyPlaylist = () => {
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);

  // Ambil playlist dari localStorage saat mount
  useEffect(() => {
    const savedPlaylist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
    setMyPlaylist(savedPlaylist);
  }, []);

  // Tambah lagu ke playlist
  const addTrack = (track) => {
    const updated = [...myPlaylist, track];
    setMyPlaylist(updated);
    localStorage.setItem("myPlaylist", JSON.stringify(updated));
  };

  // Hapus lagu dari playlist
  const removeTrack = (trackId) => {
    const updated = myPlaylist.filter((t) => t.id !== trackId);
    setMyPlaylist(updated);
    localStorage.setItem("myPlaylist", JSON.stringify(updated));
    if (currentIndex !== null && myPlaylist[currentIndex]?.id === trackId) {
      setCurrentIndex(null);
    }
  };

  const handlePlayTrack = (index) => setCurrentIndex(index);
  const handleNext = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    setCurrentIndex((currentIndex + 1) % myPlaylist.length);
  const handlePrev = () =>
    currentIndex !== null &&
    myPlaylist.length > 0 &&
    setCurrentIndex((currentIndex - 1 + myPlaylist.length) % myPlaylist.length);

  const playingTrack = currentIndex !== null ? myPlaylist[currentIndex] : null;

  return (
    <div className="min-h-screen p-6 text-white relative bg-gradient-to-br from-black via-purple-900 to-black">
      <h1 className="text-4xl font-bold mb-6 text-center">🎵 My Playlist</h1>

      {/* Tombol Tambah Lagu (Contoh statis) */}
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() =>
            addTrack({
              id: Date.now(),
              title: "Song A",
              artist: "Artist A",
              genre: "Pop",
              cover: "/covers/song-a.jpg",
              preview: "/previews/song-a.mp3",
            })
          }
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Tambah Song A
        </button>
        <button
          onClick={() =>
            addTrack({
              id: Date.now() + 1,
              title: "Song B",
              artist: "Artist B",
              genre: "Rock",
              cover: "/covers/song-b.jpg",
              preview: "/previews/song-b.mp3",
            })
          }
          className="px-4 py-2 bg-pink-600 rounded-lg hover:bg-pink-700 transition"
        >
          Tambah Song B
        </button>
      </div>

      {/* Playlist Grid */}
      {myPlaylist.length === 0 ? (
        <p className="text-center text-gray-400 mt-20">
          Playlist kosong. Tambahkan lagu dulu!
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {myPlaylist.map((track, index) => (
            <div
              key={track.id}
              className={`bg-white/10 backdrop-blur-md p-3 rounded-xl cursor-pointer relative ${
                index === currentIndex
                  ? "ring-2 ring-purple-400 scale-105 shadow-lg"
                  : "hover:scale-105 hover:shadow-md"
              }`}
              onClick={() => handlePlayTrack(index)}
            >
              <img
                src={track.cover}
                alt={track.title}
                className="w-full h-40 object-cover rounded-lg mb-2"
              />
              <h3 className="font-bold text-lg truncate">{track.title}</h3>
              <p className="text-gray-300 text-sm truncate">{track.artist}</p>
              <span
                className={`absolute top-2 left-2 px-2 py-0.5 text-xs font-bold rounded-full text-white ${
                  genreColors[track.genre] || "bg-gray-500"
                }`}
              >
                {track.genre}
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTrack(track.id);
                }}
                className="absolute top-2 right-2 p-1 rounded-full bg-red-600 hover:bg-red-700"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Mini Player */}
      {playingTrack && (
        <div className="fixed bottom-4 left-4 right-4 flex items-center gap-2 p-2 bg-black/80 backdrop-blur-xl rounded-xl z-50 max-w-lg mx-auto">
          <img
            src={playingTrack.cover}
            alt={playingTrack.title}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1">
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
            <button
              onClick={handlePrev}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <SkipBack size={14} />
            </button>
            <button
              onClick={handleNext}
              className="p-1 rounded-full bg-gray-700 hover:bg-gray-600"
            >
              <SkipForward size={14} />
            </button>
            <button
              onClick={() => setCurrentIndex(null)}
              className="p-1 rounded-full bg-red-500 hover:bg-red-600"
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
