import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import { useComicStore } from "../store/comicStore";

export default function Genres() {
  const { comics } = useComicStore();
  const navigate = useNavigate();
  const [activeGenre, setActiveGenre] = useState("Semua");

  // get unique genres dynamically from comics
  const uniqueGenres = Array.from(new Set(comics.flatMap(c => c.genre || [])));
  const GENRES = ["Semua", ...uniqueGenres];

  const filteredComics = activeGenre === "Semua" 
    ? comics 
    : comics.filter(c => c.genre?.includes(activeGenre));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-black text-white mb-8">Eksplorasi Genre</h1>
      
      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-10">
        {GENRES.map((genre, index) => (
          <motion.button
            key={genre}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            onClick={() => setActiveGenre(genre)}
            className={`px-6 py-2 rounded-full font-bold transition-all ${
              activeGenre === genre
                ? "bg-primary text-white"
                : "bg-dark-card border border-white/10 text-gray-400 hover:border-primary/50 hover:text-white"
            }`}
          >
            {genre}
          </motion.button>
        ))}
      </div>

      {/* Grid of comics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {filteredComics.map((comic, i) => (
          <motion.div
            key={comic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            onClick={() => navigate(`/comic/${comic.id}`)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[2/3] overflow-hidden rounded-xl mb-3">
              <img 
                src={comic.cover} 
                alt={comic.title} 
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-white">
                <Star size={12} className="text-yellow-500" fill="currentColor" /> {comic.rating}
              </div>
            </div>
            <h3 className="text-white font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">{comic.title}</h3>
            <p className="text-gray-400 text-sm mt-1">{comic.genre?.slice(0, 2).join(", ")}</p>
          </motion.div>
        ))}
      </div>
      
      {filteredComics.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          Belum ada komik untuk kategori ini.
        </div>
      )}
    </div>
  );
}
