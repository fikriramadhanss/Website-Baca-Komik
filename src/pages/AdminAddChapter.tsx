import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronLeft, Upload, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useComicStore } from "../store/comicStore";

export default function AdminAddChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { comics, updateComic } = useComicStore();
  const comic = comics.find((c) => c.id.toString() === id);

  const [chapterNumber, setChapterNumber] = useState(
    comic ? comic.chapters + 1 : 1,
  );
  const [chapterImages, setChapterImages] = useState<string[]>([]);

  if (!comic) {
    return (
      <div className="text-center py-20 text-white">
        <p>Komik tidak ditemukan.</p>
        <button
          onClick={() => navigate("/admin")}
          className="text-primary mt-4 underline"
        >
          Kembali ke Dashboard
        </button>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedChapterData = {
      ...(comic.chapterData || {}),
      [chapterNumber]: chapterImages
    };
    
    updateComic(comic.id, { 
      chapters: Math.max(comic.chapters, chapterNumber),
      chapterData: updatedChapterData
    });
    alert(`Chapter ${chapterNumber} berhasil ditambahkan ke "${comic.title}"!`);
    navigate("/admin");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <Link
        to="/admin"
        className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 w-fit transition-colors"
      >
        <ChevronLeft size={20} />
        <span>Kembali ke Dashboard</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-dark-card rounded-2xl border border-white/5 p-6 md:p-8 shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-24 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={comic.cover}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white line-clamp-1">
              {comic.title}
            </h1>
            <p className="text-primary font-bold text-sm mb-1">
              {comic.subtitle || "Tambah Chapter Baru"}
            </p>
            <p className="text-gray-400 text-xs">
              Saat ini memiliki {comic.chapters} Chapter
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Nomor Chapter *
            </label>
            <input
              type="number"
              min="1"
              required
              value={chapterNumber}
              onChange={(e) => setChapterNumber(parseInt(e.target.value) || 1)}
              className="w-full bg-dark border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Upload Gambar Chapter (Halaman Komik) *
            </label>
            <div className="border-2 border-dashed border-white/10 rounded-lg p-10 flex flex-col items-center justify-center text-center hover:border-primary/50 transition-colors cursor-pointer bg-dark relative">
              <Upload className="text-gray-400 mb-3" size={32} />
              <span className="text-base text-gray-300 font-medium">
                Pilih gambar-gambar untuk chapter ini
              </span>
              <span className="text-sm text-gray-500 mt-1">
                Bisa pilih banyak file sekaligus (Multiple)
              </span>
              <input
                type="file"
                multiple
                required
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  Promise.all(files.map(file => {
                    return new Promise<string>((resolve) => {
                      const reader = new FileReader();
                      reader.onloadend = () => resolve(reader.result as string);
                      reader.readAsDataURL(file);
                    });
                  })).then(base64Images => {
                    setChapterImages(base64Images);
                  });
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept="image/*"
              />
            </div>
            {chapterImages && chapterImages.length > 0 && (
              <p className="text-xs text-green-400 mt-2">
                ✓ {chapterImages.length} file gambar dipilih.
              </p>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t border-white/5">
            <button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-lg font-bold flex items-center gap-2 transition-transform transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <PlusCircle size={20} /> Publikasikan Chapter
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
