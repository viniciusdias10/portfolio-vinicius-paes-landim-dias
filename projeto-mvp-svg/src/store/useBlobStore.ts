import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Point {
  x: number;
  y: number;
  handleIn?: Point;
  handleOut?: Point;
}

export interface BlobShape {
  id: string;
  name: string;
  complexity: number;
  contrast: number;
  color: string;
  seed: number;
  path: string;
  points: Point[];
  isAnimated: boolean;
  isFavorite: boolean;
  tags: string[];
  createdAt: number;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  fontSize: 'sm' | 'base' | 'lg';
  cleanInterface: boolean;
  reducedMotion: boolean;
}

interface AnimationKeyframe {
  id: string;
  shape: BlobShape;
  duration: number;
}

interface BlobState {
  complexity: number;
  contrast: number;
  color: string;
  seed: number;
  isAnimated: boolean;
  editMode: 'auto' | 'manual';
  history: BlobShape[];
  favorites: BlobShape[];
  savedDesigns: BlobShape[];
  keyframes: AnimationKeyframe[];
  currentPoints: Point[];
  currentPath: string;
  isPlaying: boolean;
  playbackSpeed: number;
  isDark: boolean;
  accessibility: AccessibilitySettings;
  
  setComplexity: (val: number) => void;
  setContrast: (val: number) => void;
  setColor: (val: string) => void;
  setAnimated: (val: boolean) => void;
  setEditMode: (mode: 'auto' | 'manual') => void;
  setCurrentPoints: (points: Point[]) => void;
  setCurrentPath: (path: string) => void;
  setCurrentShape: (shape: BlobShape) => void;
  setPlaying: (val: boolean) => void;
  setPlaybackSpeed: (val: number) => void;
  setDark: (val: boolean) => void;
  setAccessibility: (settings: Partial<AccessibilitySettings>) => void;
  randomize: () => void;
  generateAutoDesign: () => void;
  saveToHistory: (shape: BlobShape) => void;
  saveDesign: (shape: BlobShape) => void;
  removeSavedDesign: (id: string) => void;
  toggleFavorite: (id: string) => void;
  removeFromHistory: (id: string) => void;
  updateName: (id: string, name: string) => void;
  addKeyframe: (shape: BlobShape) => void;
  updateKeyframe: (id: string, duration: number) => void;
  removeKeyframe: (id: string) => void;
  clearKeyframes: () => void;
}

export const useBlobStore = create<BlobState>()(
  persist(
    (set) => ({
      complexity: 6,
      contrast: 4,
      color: '#474bff',
      seed: Math.random(),
      isAnimated: false,
      editMode: 'auto',
      history: [],
      favorites: [],
      savedDesigns: [],
      keyframes: [],
      currentPoints: [],
      currentPath: '',
      isPlaying: false,
      playbackSpeed: 1,
      isDark: false,
      accessibility: {
        highContrast: false,
        fontSize: 'base',
        cleanInterface: false,
        reducedMotion: false
      },

      setComplexity: (complexity) => set({ complexity }),
      setContrast: (contrast) => set({ contrast }),
      setColor: (color) => set({ color }),
      setAnimated: (isAnimated) => set({ isAnimated }),
      setEditMode: (editMode) => set({ editMode }),
      setCurrentPoints: (currentPoints) => set({ currentPoints }),
      setCurrentPath: (currentPath) => set({ currentPath }),
      setCurrentShape: (shape) => set({
        complexity: shape.complexity,
        contrast: shape.contrast,
        color: shape.color,
        seed: shape.seed,
        currentPoints: shape.points,
        currentPath: shape.path,
        editMode: 'manual'
      }),
      setPlaying: (isPlaying) => set({ isPlaying }),
      setPlaybackSpeed: (playbackSpeed) => set({ playbackSpeed }),
      setDark: (isDark) => set({ isDark }),
      setAccessibility: (newSettings) => set((state) => ({
        accessibility: { ...state.accessibility, ...newSettings }
      })),
      randomize: () => set({ seed: Math.random() }),
      generateAutoDesign: () => {
        const palettes = [
          '#474bff', '#ff4747', '#47ff47', '#ff47ff', '#f0932b', '#eb4d4b', '#6ab04c', '#130f40'
        ];
        set({
          color: palettes[Math.floor(Math.random() * palettes.length)],
          complexity: 3 + Math.floor(Math.random() * 10),
          contrast: 2 + Math.floor(Math.random() * 6),
          seed: Math.random()
        });
      },
      saveToHistory: (shape) => set((state) => ({ 
        history: [shape, ...state.history].slice(0, 30) 
      })),
      saveDesign: (shape) => set((state) => ({
        savedDesigns: [shape, ...state.savedDesigns]
      })),
      removeSavedDesign: (id) => set((state) => ({
        savedDesigns: state.savedDesigns.filter(s => s.id !== id)
      })),
      toggleFavorite: (id) => set((state) => {
        const item = state.history.find(s => s.id === id) || state.favorites.find(s => s.id === id);
        if (!item) return state;
        const index = state.favorites.findIndex(s => s.id === id);
        if (index > -1) {
          return { favorites: state.favorites.filter(s => s.id !== id) };
        } else {
          return { favorites: [...state.favorites, { ...item, isFavorite: true }] };
        }
      }),
      removeFromHistory: (id) => set((state) => ({ 
        history: state.history.filter((s) => s.id !== id) 
      })),
      updateName: (id, name) => set((state) => ({
        history: state.history.map(s => s.id === id ? { ...s, name } : s),
        favorites: state.favorites.map(s => s.id === id ? { ...s, name } : s)
      })),
      addKeyframe: (shape) => set((state) => ({
        keyframes: [...state.keyframes, { id: Math.random().toString(36), shape, duration: 1000 }]
      })),
      updateKeyframe: (id, duration) => set((state) => ({
        keyframes: state.keyframes.map(k => k.id === id ? { ...k, duration } : k)
      })),
      removeKeyframe: (id) => set((state) => ({
        keyframes: state.keyframes.filter(k => k.id !== id)
      })),
      clearKeyframes: () => set({ keyframes: [] }),
    }),
    {
      name: 'blob-maker-ultra-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
