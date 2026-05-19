import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight, Settings, Music, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useComicStore } from "../store/comicStore";

export default function Reader() {
  const { id, chapterId } = useParams();
  const navigate = useNavigate();
  const { comics } = useComicStore();
  const comic = comics.find((c) => c.id.toString() === id);

  if (!comic) return <div className="text-white text-center py-20">Comic not found</div>;
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen">
      {/* Reader Header */}
      <motion.div 
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        className="sticky top-0 z-40 bg-dark/90 backdrop-blur-md border-b border-white/5 py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center"
      >
        <button onClick={() => navigate(`/comic/${comic.id}`)} className="text-gray-400 hover:text-white transition-colors flex items-center gap-2">
          <ChevronLeft size={20} />
          <span className="font-medium hidden sm:inline">Kembali</span>
        </button>
        <div className="text-center">
          <h1 className="text-white font-bold line-clamp-1">{comic.title}</h1>
          <p className="text-primary text-sm font-medium">Chapter {chapterId}</p>
        </div>
        <button className="text-gray-400 hover:text-white transition-colors p-2">
          <Settings size={20} />
        </button>
      </motion.div>

      {/* Comic Images */}
      <div className="max-w-3xl mx-auto flex flex-col items-center py-8">
        {comic.chapterData && comic.chapterData[Number(chapterId)] ? (
          comic.chapterData[Number(chapterId)].map((imgBase64, index) => (
            <img 
              key={index}
              src={imgBase64}
              alt={`Page ${index + 1}`}
              className="w-full h-auto object-cover border-b border-white/5"
              loading="lazy"
            />
          ))
        ) : (
          <div className="text-gray-400 py-20 text-center">
            <p className="mb-2">Gambar untuk chapter ini belum ditambahkan.</p>
            <p className="text-sm">Admin belum mengunggah halaman untuk chapter ini.</p>
          </div>
        )}
      </div>

      {/* Reader Footer */}
      <div className="max-w-3xl mx-auto py-8 px-4 flex justify-between items-center border-t border-white/10">
        <Link 
          to={`/comic/${comic.id}/read/${Number(chapterId) - 1}`}
          className={`flex items-center gap-2 text-white bg-white/5 hover:bg-white/10 px-6 py-3 rounded-full transition-colors ${Number(chapterId) <= 1 ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <ChevronLeft size={20} /> Prev
        </Link>
        <Link 
          to={`/comic/${comic.id}/read/${Number(chapterId) + 1}`}
          className={`flex items-center gap-2 text-white bg-primary hover:bg-primary/90 px-6 py-3 rounded-full transition-colors font-bold ${Number(chapterId) >= comic.chapters ? 'opacity-50 pointer-events-none' : ''}`}
        >
          Next <ChevronRight size={20} />
        </Link>
      </div>

      {/* Floating Audio Player */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-6 left-4 sm:left-6 z-50 flex items-center gap-3 bg-dark/80 border border-white/10 p-2 rounded-full shadow-2xl backdrop-blur-md"
      >
        <button 
          onClick={toggleAudio}
          className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full transition-transform transform hover:scale-105 active:scale-95 flex items-center justify-center shadow-lg shadow-primary/30"
        >
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
        </button>
        <div className="pr-4 hidden sm:block text-sm cursor-default">
          <p className="text-white font-bold flex items-center gap-1.5"><Music size={14} className="text-primary" /> BGM Track</p>
          <p className="text-gray-400 text-xs">Mainkan untuk pengalaman maksimal</p>
        </div>
        {/* Mock Audio Source */}
        <audio 
          ref={audioRef} 
          loop 
          src={comic.audioUrl || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} 
        />
      </motion.div>
    </div>
  );
}
