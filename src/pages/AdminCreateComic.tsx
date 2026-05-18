import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Upload, Save, Music } from "lucide-react";
import { motion } from "framer-motion";
import { useComicStore } from "../store/comicStore";

const AVAILABLE_GENRES = [
  "Action", "Fantasy", "Romance", "Comedy", 
  "Slice of Life", "Thriller", "Horror", "Sci-Fi", 
  "Drama", "Mystery", "Sports", "Historical"
];

export default function AdminCreateComic() {
  const navigate = useNavigate();
  const addComic = useComicStore((state) => state.addComic);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    description: "",
    coverImage: "",
    audioUrl: "",
    chapterImages: "",
    genre: [] as string[],
    chapters: 1,
  });

  const handleGenreToggle = (g: string) => {
    setFormData(prev => ({
      ...prev,
      genre: prev.genre.includes(g) 
        ? prev.genre.filter(x => x !== g) 
        : [...prev.genre, g]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addComic({
      title: formData.title,
      subtitle: formData.subtitle,
      description: formData.description,
      cover: "https://images.unsplash.com/photo-1542442828-287217bfb09f?q=80&w=500&auto=format&fit=crop", // Mock cover for local test
      audioUrl: formData.audioUrl,
      genre: formData.genre,
      chapters: formData.chapters,
    });
    alert("Komik berhasil diterbitkan!");
    navigate("/admin");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <Link to="/admin" className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors">
        <ChevronLeft size={20} />
        <span>Kembali ke Dashboard</span>
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card rounded-2xl border border-white/5 p-6 md:p-8"
      >
        <h1 className="text-3xl font-black text-white mb-2">Terbitkan Komik Baru</h1>
        <p className="text-gray-400 mb-8">Isi detail di bawah untuk mempublikasikan komik karya Anda ke platform FR STUDIO.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Judul Komik *</label>
                <input 
                  type="text" 
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Contoh: The Beginning After The End"
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Subjudul (Opsional)</label>
                <input 
                  type="text" 
                  value={formData.subtitle}
                  onChange={(e) => setFormData({...formData, subtitle: e.target.value})}
                  placeholder="Contoh: Season 1"
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Jumlah Chapter Awal *</label>
                <input 
                  type="number" 
                  min="1"
                  required
                  value={formData.chapters}
                  onChange={(e) => setFormData({...formData, chapters: parseInt(e.target.value) || 1})}
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Kategori / Genre *</label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_GENRES.map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => handleGenreToggle(g)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors border ${
                        formData.genre.includes(g) 
                          ? "bg-primary border-primary text-white" 
                          : "bg-dark border-white/10 text-gray-400 hover:border-primary/50 hover:text-white"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Keterangan / Sinopsis *</label>
                <textarea 
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={4}
                  placeholder="Ceritakan sinopsis komik Anda..."
                  className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none"
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Cover Komik *</label>
                <div className="border-2 border-dashed border-white/10 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-dark relative">
                  <Upload className="text-gray-400 mb-2" size={24} />
                  <span className="text-sm text-gray-300 font-medium">Klik untuk upload cover</span>
                  <span className="text-xs text-gray-500 mt-1">PNG, JPG up to 5MB</span>
                  <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Background Music (BGM) *</label>
                <div className="border border-white/10 rounded-lg p-4 flex items-center gap-4 bg-dark">
                  <div className="bg-white/5 p-3 rounded-lg">
                    <Music className="text-primary" size={20} />
                  </div>
                  <div className="flex-grow">
                    <span className="block text-sm text-gray-300 font-medium mb-1">Upload File Audio</span>
                    <input 
                      type="file" 
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setFormData({...formData, audioUrl: URL.createObjectURL(file)});
                        }
                      }}
                      className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/20 file:text-primary hover:file:bg-primary/30" 
                      accept="audio/*" 
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-2">Audio ini bisa diputar secara manual oleh pembaca saat membaca chapter komik.</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <h3 className="text-lg font-bold text-white mb-4">Upload Gambar Chapter *</h3>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-dark relative">
              <Upload className="text-gray-400 mb-3" size={32} />
              <span className="text-base text-gray-300 font-medium">Pilih gambar chapter komik Anda</span>
              <span className="text-sm text-gray-500 mt-1">Bisa pilih banyak file sekaligus (Multiple)</span>
              <input type="file" multiple className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              type="submit" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Save size={20} /> Terbitkan Komik
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
