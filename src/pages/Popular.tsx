import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { useComicStore } from "../store/comicStore";

export default function Popular() {
  const navigate = useNavigate();
  const { comics } = useComicStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <h1 className="text-3xl font-black text-white mb-2">Komik Terpopuler</h1>
      <p className="text-gray-400 mb-8">Peringkat berdasarkan jumlah tayangan terbanyak sepanjang masa.</p>
      
      <div className="flex flex-col gap-4">
        {comics.map((comic, index) => (
          <motion.div
            key={comic.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            onClick={() => navigate(`/comic/${comic.id}`)}
            className="flex items-center gap-4 bg-dark-card p-4 rounded-2xl border border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
          >
            <div className="w-12 text-center text-2xl font-black text-gray-500">
              {index + 1}
            </div>
            <div className="w-20 h-28 flex-shrink-0 rounded-lg overflow-hidden">
              <img src={comic.cover} alt={comic.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-grow">
              <h2 className="text-xl font-bold text-white mb-1 hover:text-primary transition-colors">{comic.title}</h2>
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <span className="flex items-center gap-1 text-yellow-500">
                  <Star size={14} fill="currentColor" /> {comic.rating}
                </span>
                <span>•</span>
                <span>Action, Fantasy</span>
                <span>•</span>
                <span>{comic.views} tayangan</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
