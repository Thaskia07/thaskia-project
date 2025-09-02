import { useState, useEffect } from "react";
import tracksData from "../data/tracks.json";

export default function Discover() {
  const [tracks] = useState(tracksData);
  const [favorites, setFavorites] = useState([]);
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [notification, setNotification] = useState("");

  // Load favorites & playlist dari localStorage
  useEffect(() => {
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const savedPlaylist = JSON.parse(localStorage.getItem("myPlaylist")) || [];
    setFavorites(savedFavorites);
    setMyPlaylist(savedPlaylist);
  }, []);

  // Notifikasi kecil
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 2000);
  };

  // ✅ Simpan hanya ID track untuk Favorite
  const toggleFavorite = (track) => {
    const isFav = favorites.includes(track.id);
    const updated = isFav
      ? favorites.filter((id) => id !== track.id)
      : [...favorites, track.id];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));

    showNotification(
      isFav
        ? `${track.title} removed from Favorites`
        : `${track.title} added to Favorites!`
    );
  };

  // ✅ Simpan hanya ID track untuk MyPlaylist
  const addToMyPlaylist = (track) => {
    if (!myPlaylist.includes(track.id)) {
      const updated = [...myPlaylist, track.id];
      setMyPlaylist(updated);
      localStorage.setItem("myPlaylist", JSON.stringify(updated));
      showNotification(`${track.title} added to My Playlist!`);
    } else {
      showNotification(`${track.title} is already in My Playlist!`);
    }
  };

  return (
    <div className="p-6 text-white">
      <h2 className="text-3xl font-bold mb-6">Discover</h2>

      {/* Notifikasi */}
      {notification && (
        <div className="mb-4 p-2 bg-pink-600 text-white rounded-lg shadow-md">
          {notification}
        </div>
      )}

      {/* List Lagu */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {tracks.map((track) => (
          <div
            key={track.id}
            className="bg-white/10 rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform relative"
          >
            <img
              src={track.cover}
              alt={track.title}
              className="w-full h-40 object-cover"
            />
            <div className="p-4">
              <span className="absolute top-2 left-2 bg-pink-500 text-xs px-2 py-1 rounded-full">
                {track.genre}
              </span>
              <h3 className="text-lg font-semibold">{track.title}</h3>
              <p className="text-sm text-gray-300">{track.artist}</p>

              <div className="mt-3 flex justify-between items-center">
                {/* Tombol Favorite */}
                <button
                  onClick={() => toggleFavorite(track)}
                  className={`px-3 py-1 rounded-lg text-sm ${
                    favorites.includes(track.id)
                      ? "bg-red-500 text-white"
                      : "bg-white/20 text-gray-200 hover:bg-white/30"
                  }`}
                >
                  {favorites.includes(track.id) ? "♥" : "♡"}
                </button>

                {/* Tombol Tambah Playlist */}
                <button
                  onClick={() => addToMyPlaylist(track)}
                  className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                  + Playlist
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
