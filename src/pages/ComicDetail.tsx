import { useParams, Link } from "react-router-dom";
import { Star, Eye, List } from "lucide-react";
import { motion } from "framer-motion";
import { useComicStore } from "../store/comicStore";

export default function ComicDetail() {
  const { id } = useParams();
  const { comics } = useComicStore();
  const comic = comics.find((c) => c.id.toString() === id) || comics[0];
  
  if (!comic) return <div className="text-white text-center py-20">Comic not found</div>;
  
  return (
    <div className="w-full pb-12">
      {/* Banner */}
      <div className="w-full h-80 relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center blur-sm" 
          style={{ backgroundImage: `url('${comic.cover}')` }}
        />
        <div className="absolute inset-0 bg-dark/80" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-32">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cover */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-48 h-72 md:w-64 md:h-96 flex-shrink-0 rounded-2xl overflow-hidden shadow-2xl border-4 border-dark"
          >
            <img src={comic.cover} alt="Cover" className="w-full h-full object-cover" />
          </motion.div>
          
          {/* Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-grow pt-4 md:pt-32"
          >
            <h1 className="text-4xl font-black text-white mb-2">{comic.title}</h1>
            <p className="text-primary font-bold mb-4">
              {comic.subtitle || "Karya Original"} 
              {comic.genre && comic.genre.length > 0 && ` • ${comic.genre.join(", ")}`}
            </p>
            
            <div className="flex items-center gap-6 mb-6 text-sm">
              <span className="flex items-center gap-1 text-yellow-500 font-bold">
                <Star size={16} fill="currentColor" /> {comic.rating}
              </span>
              <span className="flex items-center gap-1 text-gray-300">
                <Eye size={16} /> {comic.views} Tayangan
              </span>
              <span className={`px-3 py-1 rounded-full font-bold ${
                comic.status === "Ongoing" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
              }`}>
                {comic.status}
              </span>
            </div>

            <p className="text-gray-300 leading-relaxed mb-8 whitespace-pre-wrap">
              {comic.description}
            </p>

            <Link to={`/comic/${id}/read/1`} className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-full font-bold transition-transform transform hover:scale-105">
              Baca Chapter 1
            </Link>
          </motion.div>
        </div>

        {/* Chapters */}
        <div className="mt-16">
          <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4">
            <List className="text-primary" />
            <h2 className="text-2xl font-bold text-white">Daftar Chapter</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[...Array(comic.chapters)].map((_, i) => (
              <Link 
                key={i} 
                to={`/comic/${comic.id}/read/${comic.chapters - i}`}
                className="bg-dark-card border border-white/5 p-4 rounded-xl flex justify-between items-center hover:bg-white/[0.02] hover:border-primary/30 transition-all"
              >
                <div>
                  <h3 className="font-bold text-white">Chapter {comic.chapters - i}</h3>
                  <p className="text-xs text-gray-400 mt-1">2 hari yang lalu</p>
                </div>
                <span className="text-primary text-sm font-medium">Baca</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
