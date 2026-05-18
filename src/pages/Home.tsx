import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useComicStore } from "../store/comicStore";

export default function Home() {
  const navigate = useNavigate();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const { comics } = useComicStore();
  const HERO_COMICS = comics.slice(0, 3); // Top 3 newest for hero carousel
  const activeHero = HERO_COMICS.length > 0 ? HERO_COMICS[currentHeroIndex] : null;

  useEffect(() => {
    if (HERO_COMICS.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % HERO_COMICS.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [HERO_COMICS.length]);
  const NEW_RELEASES = comics.slice(0, 4);
  const POPULAR_COMICS = [...comics].sort((a, b) => Number(b.rating) - Number(a.rating)).slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section */}
      {activeHero && (
      <section className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeHero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${activeHero.cover})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-dark via-dark/50 to-transparent" />
            
            <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="max-w-2xl"
              >
                <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary text-xs font-bold tracking-wider mb-4 border border-primary/30">
                  FEATURED
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white mb-4 leading-tight">
                  {activeHero.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-300 mb-6">
                  <span className="flex items-center gap-1 text-yellow-500">
                    <Star size={16} fill="currentColor" /> {activeHero.rating || "9.9"}
                  </span>
                  <span>•</span>
                  <span>{activeHero.genre?.join(" / ") || "Lainnya"}</span>
                </div>
                <p className="text-gray-300 text-lg mb-8 line-clamp-3">
                  {activeHero.description}
                </p>
                <div className="flex items-center gap-4">
                  <button onClick={() => navigate(`/comic/${activeHero.id}`)} className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-primary/30">
                    Baca Sekarang
                  </button>
                  <button onClick={() => navigate(`/comic/${activeHero.id}`)} className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-full font-bold transition-all backdrop-blur-sm">
                    Detail
                  </button>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
          {HERO_COMICS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentHeroIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentHeroIndex ? "w-8 bg-primary" : "w-2 bg-white/30 hover:bg-white/50"
              }`}
            />
          ))}
        </div>
      </section>
      )}

      {/* New Releases Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-b border-white/5">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Rilis Terbaru</h2>
            <p className="text-gray-400 text-sm">Komik yang baru saja dirilis atau diupdate</p>
          </div>
          <button className="text-primary hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
            Lihat Semua <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {NEW_RELEASES.map((comic, i) => (
            <motion.div
              key={`new-${comic.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate(`/comic/${comic.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3">
                <img 
                  src={comic.cover} 
                  alt={comic.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 bg-primary/90 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-white">
                  NEW
                </div>
              </div>
              <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{comic.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{comic.genre?.slice(0, 2).join(" / ") || "Lainnya"}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Popular Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">Sedang Populer</h2>
            <p className="text-gray-400 text-sm">Komik yang paling banyak dibaca minggu ini</p>
          </div>
          <button className="text-primary hover:text-white text-sm font-medium flex items-center gap-1 transition-colors">
            Lihat Semua <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {POPULAR_COMICS.map((comic, i) => (
            <motion.div
              key={comic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => navigate(`/comic/${comic.id}`)}
              className="group cursor-pointer"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-3">
                <img 
                  src={comic.cover} 
                  alt={comic.title} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-white">
                  <Star size={12} className="text-yellow-500" fill="currentColor" /> {comic.rating}
                </div>
              </div>
              <h3 className="font-bold text-white group-hover:text-primary transition-colors line-clamp-1">{comic.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{comic.genre?.slice(0, 2).join(" / ") || "Lainnya"}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
