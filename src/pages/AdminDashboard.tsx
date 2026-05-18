import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, Image as ImageIcon, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

import { useComicStore } from "../store/comicStore";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("comics");
  const { comics, deleteComic } = useComicStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
          <p className="text-gray-400">Kelola komik, chapter, dan pengguna platform FR STUDIO.</p>
        </div>
        <Link to="/admin/create" className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 transition-all">
          <Plus size={18} /> Tambah Komik
        </Link>
      </div>

      <div className="bg-dark-card rounded-2xl border border-white/5 overflow-hidden">
        <div className="flex border-b border-white/5">
          <button 
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === "comics" ? "text-primary" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("comics")}
          >
            Daftar Komik
            {activeTab === "comics" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
          <button 
            className={`px-6 py-4 text-sm font-medium transition-colors relative ${activeTab === "users" ? "text-primary" : "text-gray-400 hover:text-white"}`}
            onClick={() => setActiveTab("users")}
          >
            Pengguna
            {activeTab === "users" && (
              <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
            )}
          </button>
        </div>

        <div className="p-6">
          {activeTab === "comics" && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-gray-400 border-b border-white/5">
                    <th className="pb-4 font-medium">Judul</th>
                    <th className="pb-4 font-medium">Status</th>
                    <th className="pb-4 font-medium">Chapter</th>
                    <th className="pb-4 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {comics.map((comic) => (
                    <tr key={comic.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-dark rounded overflow-hidden flex items-center justify-center text-gray-500 flex-shrink-0">
                            {comic.cover ? <img src={comic.cover} alt="Cover" className="w-full h-full object-cover" /> : <ImageIcon size={20} />}
                          </div>
                          <span className="font-bold text-white line-clamp-1">{comic.title}</span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                          comic.status === "Ongoing" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                        }`}>
                          {comic.status}
                        </span>
                      </td>
                      <td className="py-4 text-gray-300">{comic.chapters} Ch.</td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/comic/${comic.id}/add-chapter`} title="Tambah Chapter" className="p-2 text-green-400 hover:text-white hover:bg-green-500/20 rounded-lg transition-colors block">
                            <PlusCircle size={16} />
                          </Link>
                          <Link to={`/admin/edit/${comic.id}`} title="Edit Komik" className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors block">
                            <Edit2 size={16} />
                          </Link>
                          <button 
                            onClick={() => {
                              if (window.confirm(`Yakin ingin menghapus komik "${comic.title}"?`)) {
                                deleteComic(comic.id);
                              }
                            }} 
                            className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === "users" && (
            <div className="text-center py-12 text-gray-400">
              Fitur manajemen pengguna sedang dalam pengembangan.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
