import { create } from 'zustand';
import { supabase } from '../lib/supabase';

interface AuthState {
  isAuthenticated: boolean;
  isAdmin: boolean;
  userEmail: string | null;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (isAuthenticated: boolean, userEmail: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  isAdmin: false,
  userEmail: null,
  setAuth: (isAuthenticated, userEmail) => set({ 
    isAuthenticated, 
    isAdmin: isAuthenticated, // For now, any logged-in user is considered an admin
    userEmail 
  }),
  checkSession: async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      set({ isAuthenticated: true, isAdmin: true, userEmail: session.user.email || null });
    } else {
      set({ isAuthenticated: false, isAdmin: false, userEmail: null });
    }
    
    // Set up a listener for auth changes (e.g. login/logout from another tab)
    supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        set({ isAuthenticated: true, isAdmin: true, userEmail: session.user.email || null });
      } else {
        set({ isAuthenticated: false, isAdmin: false, userEmail: null });
      }
    });
  },
  logout: async () => {
    await supabase.auth.signOut();
    set({ isAuthenticated: false, isAdmin: false, userEmail: null });
  },
}));
