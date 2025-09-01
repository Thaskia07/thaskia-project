// Import dasar React dan ReactDOM untuk merender aplikasi
import React from "react";
import ReactDOM from "react-dom/client";

// Import router dari react-router-dom
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import komponen utama App yang menjadi layout dasar aplikasi
import App from "./App";

// Import styling global
import "./index.css";

// Import halaman-halaman (pages) yang akan digunakan di routing
import Home from "./pages/Home";                   // Halaman utama setelah login
import Login from "./pages/Login";                 // Halaman login
import Register from "./pages/Register";           // Halaman register
import ProtectedRoute from "./components/ProtectedRoute"; // Komponen wrapper untuk route yang hanya bisa diakses user login
import Discover from "./pages/Discover";           // Halaman Discover (musik/fitur tambahan)
import MyPlaylistPage from "./pages/MyPlaylist";   // Halaman playlist user
import Favorites from "./pages/Favorites";         // Halaman lagu favorit
import Start from "./pages/Start";                 // Halaman start / landing page sebelum login
import Settings from "./pages/Settings";           // Halaman pengaturan user
import About from "./pages/About";                 // Halaman About (informasi aplikasi)

// Buat router utama menggunakan createBrowserRouter
// Array di dalamnya menentukan semua route dan sub-route di aplikasi
const router = createBrowserRouter([
  {
    path: "/",           // Root path aplikasi
    element: <App />,    // Komponen App menjadi layout utama
    children: [          // Daftar route anak (nested routes) di bawah App
      {
        path: "/",       // Root path setelah login
        element: (
          <ProtectedRoute> {/* Hanya bisa diakses jika user sudah login */}
            <Home />      {/* Render halaman Home */}
          </ProtectedRoute>
        ),
      },
      {
        path: "/discover",
        element: (
          <ProtectedRoute>
            <Discover />   {/* Halaman Discover */}
          </ProtectedRoute>
        ),
      },
      {
        path: "/my-playlist",
        element: (
          <ProtectedRoute>
            <MyPlaylistPage />  {/* Halaman My Playlist */}
          </ProtectedRoute>
        ),
      },
      {
        path: "/favorites",
        element: (
          <ProtectedRoute>
            <Favorites />       {/* Halaman Favorites */}
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />        {/* Halaman Settings */}
          </ProtectedRoute>
        ),
      },
      {
        path: "/about",         // Tambahkan route About
        element: (
          <ProtectedRoute>
            <About />           {/* Halaman About */}
          </ProtectedRoute>
        ),
      },

      // Public routes (bisa diakses tanpa login)
      { path: "start", element: <Start /> },         // Halaman landing/start
      { path: "login", element: <Login /> },         // Halaman login
      { path: "register", element: <Register /> },   // Halaman register
    ],
  },
]);

// Render aplikasi ke root div di index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>       {/* StrictMode membantu mendeteksi masalah potensial di development */}
    <RouterProvider router={router} /> {/* Pasang router utama ke aplikasi */}
  </React.StrictMode>
);
