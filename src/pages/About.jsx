// Import React dan useState hook
// React → library utama untuk membuat komponen dan JSX
// useState → hook untuk menyimpan dan memperbarui state lokal dalam komponen
import React, { useState } from "react";

// Import icon dari library "lucide-react" untuk visualisasi fitur
// Music → ikon musik
// Headphones → ikon headphone
// List → ikon daftar/playlist
// Heart → ikon favorit/like
import { Music, Headphones, List, Heart } from "lucide-react";

// Deklarasi komponen fungsional bernama "About"
// Komponen ini menampilkan halaman "Tentang/VibeBeat" dengan multibahasa dan fitur
const About = () => {
  // State untuk bahasa aktif
  // language → menyimpan kode bahasa aktif (misal "id", "en")
  // setLanguage → fungsi untuk memperbarui state language
  // Default awal: "id" (Indonesia)
  const [language, setLanguage] = useState("id"); 

  // Objek content → menyimpan konten untuk semua bahasa
  // Struktur:
  // - title → judul halaman
  // - description → deskripsi singkat tentang Vibebeat
  // - features → array 4 string, menjelaskan fitur unggulan
  // Bahasa yang tersedia: id, en, ar, jp, kr, de, fr, es
  const content = {
    id: {
      title: "Tentang Vibebeat",
      description:
        "Vibebeat adalah platform musik interaktif yang memungkinkan Anda menikmati musik favorit dengan pengalaman yang lebih seru dan personal. Temukan lagu, buat playlist, dan bagikan vibemu!",
      features: [
        "Streaming musik tanpa batas",
        "Buat playlist sesuai mood",
        "Jelajahi berbagai genre",
        "Simak lagu populer terbaru",
      ],
    },
    en: {
      title: "About Vibebeat",
      description:
        "Vibebeat is an interactive music platform that lets you enjoy your favorite songs with a fun and personalized experience. Discover tracks, create playlists, and share your vibe!",
      features: [
        "Unlimited music streaming",
        "Create playlists based on mood",
        "Explore various genres",
        "Check out the latest hits",
      ],
    },
    ar: {
      title: "حول Vibebeat",
      description:
        "Vibebeat هو منصة موسيقى تفاعلية تتيح لك الاستمتاع بأغانيك المفضلة بتجربة ممتعة وشخصية. اكتشف الأغاني، أنشئ قوائم تشغيل، وشارك أجواءك!",
      features: [
        "بث موسيقى غير محدود",
        "إنشاء قوائم تشغيل حسب المزاج",
        "استكشاف أنواع موسيقية مختلفة",
        "استمع إلى أحدث الأغاني",
      ],
    },
    jp: {
      title: "Vibebeatについて",
      description:
        "Vibebeatは、お気に入りの音楽をより楽しく、パーソナライズされた体験で楽しめるインタラクティブな音楽プラットフォームです。曲を発見し、プレイリストを作成し、自分のバイブを共有しましょう！",
      features: [
        "無制限の音楽ストリーミング",
        "気分に合わせたプレイリストを作成",
        "さまざまなジャンルを探索",
        "最新のヒット曲をチェック",
      ],
    },
    kr: {
      title: "Vibebeat 소개",
      description:
        "Vibebeat은 좋아하는 음악을 더욱 재미있고 개인화된 경험으로 즐길 수 있는 인터랙티브 음악 플랫폼입니다. 노래를 발견하고, 플레이리스트를 만들고, 당신의 바이브를 공유하세요!",
      features: [
        "무제한 음악 스트리밍",
        "기분에 맞는 플레이리스트 생성",
        "다양한 장르 탐색",
        "최신 인기곡 확인",
      ],
    },
    de: {
      title: "Über Vibebeat",
      description:
        "Vibebeat ist eine interaktive Musikplattform, auf der Sie Ihre Lieblingssongs auf unterhaltsame und persönliche Weise genießen können. Entdecken Sie Tracks, erstellen Sie Playlists und teilen Sie Ihre Stimmung!",
      features: [
        "Unbegrenztes Musikstreaming",
        "Playlists nach Stimmung erstellen",
        "Verschiedene Genres erkunden",
        "Die neuesten Hits anhören",
      ],
    },
    fr: {
      title: "À propos de Vibebeat",
      description:
        "Vibebeat est une plateforme musicale interactive qui vous permet de profiter de vos chansons préférées avec une expérience amusante et personnalisée. Découvrez des morceaux, créez des playlists et partagez vos vibes !",
      features: [
        "Streaming musical illimité",
        "Créez des playlists selon l’humeur",
        "Explorez différents genres",
        "Écoutez les derniers hits",
      ],
    },
    es: {
      title: "Acerca de Vibebeat",
      description:
        "Vibebeat es una plataforma musical interactiva que te permite disfrutar de tus canciones favoritas con una experiencia divertida y personalizada. ¡Descubre canciones, crea playlists y comparte tu vibra!",
      features: [
        "Transmisión de música ilimitada",
        "Crea playlists según tu estado de ánimo",
        "Explora varios géneros",
        "Escucha los últimos éxitos",
      ],
    },
  };

  // Bagian return menentukan UI yang ditampilkan
  return (
    // Section utama
    // min-h-screen → tinggi minimal 100vh
    // bg-gradient-to-b → background gradasi dari ungu ke hitam
    // text-white → teks putih
    // px-8 py-20 → padding
    // flex flex-col items-center → layout kolom dengan konten di tengah
    <section className="min-h-screen bg-gradient-to-b from-purple-900 to-black text-white px-8 py-20 flex flex-col items-center">
      
      {/* Dropdown bahasa */}
      <div className="mb-6">
        <select
          value={language} // nilai dropdown = state language
          onChange={(e) => setLanguage(e.target.value)} // update state saat ganti bahasa
          className="bg-white text-black px-4 py-2 rounded-lg shadow-md"
        >
          {/* Opsi bahasa */}
          <option value="id">Indonesia</option>
          <option value="en">English</option>
          <option value="ar">عربى (Arab)</option>
          <option value="jp">日本語 (Jepang)</option>
          <option value="kr">한국어 (Korea)</option>
          <option value="de">Deutsch (Jerman)</option>
          <option value="fr">Français (Prancis)</option>
          <option value="es">Español (Spanyol)</option>
        </select>
      </div>

      {/* Judul halaman */}
      <h1 className="text-4xl font-bold mb-4">{content[language].title}</h1>

      {/* Deskripsi */}
      <p className="text-lg text-center max-w-3xl mb-8">
        {content[language].description}
      </p>

      {/* Grid fitur */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl">
        
        {/* Fitur 1 */}
        <div className="flex items-center gap-3 bg-purple-800 p-4 rounded-xl shadow-lg">
          <Music />
          <span>{content[language].features[0]}</span>
        </div>

        {/* Fitur 2 */}
        <div className="flex items-center gap-3 bg-purple-800 p-4 rounded-xl shadow-lg">
          <Headphones /> 
          <span>{content[language].features[1]}</span>
        </div>

        {/* Fitur 3 */}
        <div className="flex items-center gap-3 bg-purple-800 p-4 rounded-xl shadow-lg">
          <List /> 
          <span>{content[language].features[2]}</span>
        </div>

        {/* Fitur 4 */}
        <div className="flex items-center gap-3 bg-purple-800 p-4 rounded-xl shadow-lg">
          <Heart /> 
          <span>{content[language].features[3]}</span>
        </div>
      </div>
    </section>
  );
};

// Export komponen agar bisa digunakan di file lain
export default About;
