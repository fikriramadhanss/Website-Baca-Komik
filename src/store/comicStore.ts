import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Comic {
  id: string | number;
  title: string;
  subtitle?: string;
  description: string;
  status: string;
  chapters: number;
  cover: string;
  rating: string;
  views: string;
  audioUrl?: string;
  genre?: string[];
}

interface ComicState {
  comics: Comic[];
  isLoading: boolean;
  fetchComics: () => Promise<void>;
  addComic: (comic: Omit<Comic, 'id' | 'status' | 'rating' | 'views'>) => Promise<void>;
  deleteComic: (id: string | number) => Promise<void>;
  updateComic: (id: string | number, updatedData: Partial<Comic>) => Promise<void>;
}

export const useComicStore = create<ComicState>((set, get) => ({
  comics: [],
  isLoading: false,
  fetchComics: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('comics')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error("Supabase Error:", error);
        throw error;
      }
      
      // Map data from database to our app format (camelCase)
      const mappedComics = (data || []).map(comic => ({
        id: comic.id,
        title: comic.title,
        subtitle: comic.subtitle,
        description: comic.description,
        status: comic.status,
        chapters: comic.chapters,
        cover: comic.cover,
        rating: comic.rating,
        views: comic.views,
        audioUrl: comic.audio_url,
        genre: comic.genre,
      }));
      
      set({ comics: mappedComics, isLoading: false });
    } catch (error) {
      console.error('Error fetching comics:', error);
      set({ isLoading: false });
    }
  },
  addComic: async (comic) => {
    try {
      const newComic = {
        title: comic.title,
        subtitle: comic.subtitle,
        description: comic.description,
        cover: comic.cover,
        audio_url: comic.audioUrl,
        genre: comic.genre,
        chapters: comic.chapters || 1,
        status: "Ongoing",
        rating: "0.0",
        views: "0",
      };
      
      const { data, error } = await supabase
        .from('comics')
        .insert([newComic])
        .select();
        
      if (error) throw error;
      
      if (data) {
        get().fetchComics();
      }
    } catch (error) {
      console.error('Error adding comic:', error);
      alert('Gagal menambah komik ke database Supabase. Pastikan URL dan Key sudah benar.');
    }
  },
  deleteComic: async (id) => {
    try {
      const { error } = await supabase
        .from('comics')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      set((state) => ({
        comics: state.comics.filter((c) => c.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting comic:', error);
      alert('Gagal menghapus komik.');
    }
  },
  updateComic: async (id, updatedData) => {
    try {
      // Convert camelCase to snake_case for Supabase
      const payload: any = { ...updatedData };
      if (updatedData.audioUrl !== undefined) {
        payload.audio_url = updatedData.audioUrl;
        delete payload.audioUrl;
      }
      
      const { error } = await supabase
        .from('comics')
        .update(payload)
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state instead of refetching for speed
      set((state) => ({
        comics: state.comics.map((c) => (c.id === id ? { ...c, ...updatedData } : c)),
      }));
    } catch (error) {
      console.error('Error updating comic:', error);
      alert('Gagal memperbarui komik.');
    }
  },
}));
