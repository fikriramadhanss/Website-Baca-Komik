import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, User, Menu, LogOut, X, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import { useComicStore } from "../store/comicStore";

export default function Navbar() {
  const { isAdmin, isAuthenticated, logout } = useAuthStore();
  const { comics } = useComicStore();
  const navigate = useNavigate();
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchResults = searchQuery.trim() === "" 
    ? [] 
    : comics.filter(c => c.title.toLowerCase().includes(searchQuery.toLowerCase()) || c.genre?.some(g => g.toLowerCase().includes(searchQuery.toLowerCase())));

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-2 group" onClick={() => setIsMobileMenuOpen(false)}>
                <span className="text-2xl font-black tracking-tighter text-white">
                  FR<span className="text-primary ml-1 group-hover:text-white transition-colors duration-300">STUDIO</span>
                </span>
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Beranda</Link>
              <Link to="/genres" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Genre</Link>
              <Link to="/popular" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">Populer</Link>
              {isAdmin && (
                <Link to="/admin" className="text-sm font-medium text-primary hover:text-white transition-colors">Admin</Link>
              )}
            </div>

            <div className="flex items-center space-x-4">
              <button onClick={() => setIsSearchOpen(true)} className="text-gray-300 hover:text-white p-2">
                <Search size={20} />
              </button>
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-300 hover:text-white p-2 md:hidden">
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              {isAuthenticated ? (
                <button 
                  onClick={logout}
                  className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-sm font-medium"
                >
                  <LogOut size={16} />
                  <span>Keluar</span>
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="hidden md:flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2 rounded-full text-sm font-medium"
                >
                  <User size={16} />
                  <span>Masuk Admin</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-dark border-b border-white/10 overflow-hidden"
            >
              <div className="px-4 py-6 flex flex-col space-y-4">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">Beranda</Link>
                <Link to="/genres" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">Genre</Link>
                <Link to="/popular" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-gray-300 hover:text-white">Populer</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium text-primary hover:text-white">Admin Dashboard</Link>
                )}
                <div className="pt-4 border-t border-white/10">
                  {isAuthenticated ? (
                    <button onClick={handleLogout} className="flex items-center gap-2 text-gray-300 hover:text-white w-full">
                      <LogOut size={20} /> Keluar Admin
                    </button>
                  ) : (
                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 text-gray-300 hover:text-white w-full">
                      <User size={20} /> Masuk Admin
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Search Modal */}
      <AnimatePresence>
        {isSearchOpen && (
          <div className="fixed inset-0 z-[100] flex flex-col bg-dark/95 backdrop-blur-sm">
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center gap-4 border-b border-white/20 pb-4 mb-8 pt-10 md:pt-4">
                  <Search size={28} className="text-gray-400" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Cari judul komik atau genre..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 bg-transparent border-none text-2xl md:text-4xl font-bold text-white focus:outline-none focus:ring-0 placeholder-gray-600"
                  />
                  <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                    <X size={24} />
                  </button>
                </div>

                {searchQuery && searchResults.length === 0 && (
                  <div className="text-center py-10 text-gray-500 text-lg">
                    Tidak ada komik yang sesuai dengan pencarian "{searchQuery}"
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {searchResults.map((comic) => (
                    <div 
                      key={comic.id}
                      onClick={() => {
                        setIsSearchOpen(false);
                        setSearchQuery("");
                        navigate(`/comic/${comic.id}`);
                      }}
                      className="cursor-pointer group"
                    >
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2">
                        <img src={comic.cover} alt={comic.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
                        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-white">
                          <Star size={10} className="text-yellow-500" fill="currentColor" /> {comic.rating}
                        </div>
                      </div>
                      <h3 className="font-bold text-white text-sm line-clamp-1 group-hover:text-primary transition-colors">{comic.title}</h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{comic.genre?.join(", ")}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
