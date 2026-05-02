import { create } from 'zustand';
import { 
  collection, 
  addDoc, 
  getDocs, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot
} from 'firebase/firestore';
import { onAuthStateChanged, User } from 'firebase/auth';
import { db, auth, loginWithGoogle, logout as firebaseLogout } from '@/src/lib/firebase';

interface Competition {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'closed';
  createdAt: any;
}

interface AdminStore {
  competitions: Competition[];
  loading: boolean;
  subscribeCompetitions: () => () => void;
  createCompetition: (name: string, description: string) => Promise<void>;
  deleteCompetition: (id: string) => Promise<void>;
}

export const useAdminStore = create<AdminStore>((set) => ({
  competitions: [],
  loading: false,
  subscribeCompetitions: () => {
    if (!db) {
      console.warn("Firestore not initialized");
      return () => {};
    }
    set({ loading: true });
    const q = query(collection(db, 'competitions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const comps = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Competition[];
      set({ competitions: comps, loading: false });
    }, (error) => {
      console.error("Firestore error:", error);
      set({ loading: false });
    });
    return unsubscribe;
  },
  createCompetition: async (name, description) => {
    if (!db) return;
    try {
      await addDoc(collection(db, 'competitions'), {
        name,
        description,
        status: 'active',
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error creating competition:", error);
    }
  },
  deleteCompetition: async (id) => {
    if (!db) return;
    try {
      await deleteDoc(doc(db, 'competitions', id));
    } catch (error) {
      console.error("Error deleting competition:", error);
    }
  }
}));

interface AuthStore {
  user: User | null;
  loading: boolean;
  isLoggingIn: boolean;
  initAuth: () => void;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  loading: true,
  isLoggingIn: false,
  initAuth: () => {
    if (!auth) {
      set({ loading: false });
      return;
    }
    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
    });
  },
  login: async () => {
    if (get().isLoggingIn) return;
    set({ isLoggingIn: true });
    try {
      await loginWithGoogle();
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error("Login error:", error);
      }
    } finally {
      set({ isLoggingIn: false });
    }
  },
  logout: async () => {
    try {
      await firebaseLogout();
      set({ user: null });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }
}));
