import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCreateComic from "./pages/AdminCreateComic";
import AdminEditComic from "./pages/AdminEditComic";
import AdminAddChapter from "./pages/AdminAddChapter";
import AdminEditChapter from "./pages/AdminEditChapter";
import Genres from "./pages/Genres";
import Popular from "./pages/Popular";
import Login from "./pages/Login";
import ComicDetail from "./pages/ComicDetail";
import Reader from "./pages/Reader";
import ProtectedRoute from "./components/ProtectedRoute";
import { useComicStore } from "./store/comicStore";
import { useAuthStore } from "./store/authStore";

function App() {
  const fetchComics = useComicStore(state => state.fetchComics);
  const checkSession = useAuthStore(state => state.checkSession);

  useEffect(() => {
    checkSession();
    fetchComics();
  }, [fetchComics, checkSession]);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-dark text-white font-sans">
        <Navbar />
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/popular" element={<Popular />} />
            <Route path="/comic/:id" element={<ComicDetail />} />
            <Route path="/comic/:id/read/:chapterId" element={<Reader />} />
            <Route path="/login" element={<Login />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/create" element={<AdminCreateComic />} />
              <Route path="/admin/edit/:id" element={<AdminEditComic />} />
              <Route
                path="/admin/comic/:id/add-chapter"
                element={<AdminAddChapter />}
              />
              <Route
                path="/admin/comic/:id/edit-chapter/:chapterId"
                element={<AdminEditChapter />}
              />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
