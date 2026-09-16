import { defaultTemplate } from './defaultTemplate';
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { ProjectState, Character, DialogBlock, AspectRatio, PropItem, AudioTrack, CharacterAppearance, PropType } from './types';

interface EditorStore {
  project: ProjectState;
  currentTime: number;
  isPlaying: boolean;
  isExporting: boolean;
  selectedElementId: string | null;
  
  setProject: (project: ProjectState) => void;
  resetToCleanProject: (aspectRatio?: AspectRatio) => void;
  setAspect: (aspect: AspectRatio) => void;
  setBackground: (bg: string) => void;
  setFilters: (filters: Partial<ProjectState['filters']>) => void;
  setTitle: (title: string) => void;
  setDuration: (duration: number) => void;
  setIsExporting: (isExporting: boolean) => void;
  addCharacter: (type: string, imageUrl?: string) => void;
  updateCharacter: (id: string, updates: Partial<Character>) => void;
  removeCharacter: (id: string) => void;
  addDialog: (characterId: string, text: string) => void;
  updateDialog: (id: string, updates: Partial<DialogBlock>) => void;
  removeDialog: (id: string) => void;
  addProp: (type: PropType, content: string, extraOptions?: Partial<PropItem>) => void;
  updateProp: (id: string, updates: Partial<PropItem>) => void;
  removeProp: (id: string) => void;
  addAttackEffect: (characterId: string, emoji: string) => void;
  addAudio: (url: string, name: string) => void;
  updateAudio: (id: string, updates: Partial<AudioTrack>) => void;
  removeAudio: (id: string) => void;
  splitElement: (id: string, time: number) => void;
  setCurrentTime: (time: number) => void;
  togglePlay: () => void;
  setSelectedElement: (id: string | null) => void;
}

export const sanitizeProject = (raw: any): ProjectState => {
  if (!raw) return defaultTemplate;
  return {
    ...raw,
    title: raw.title || 'StickTalk Video',
    characters: Array.isArray(raw.characters) ? raw.characters : [],
    props: Array.isArray(raw.props) ? raw.props : [],
    dialogBlocks: Array.isArray(raw.dialogBlocks) ? raw.dialogBlocks : [],
    audios: Array.isArray(raw.audios) ? raw.audios : [],
    background: raw.background || 'bg-blue-50',
    duration: Number(raw.duration) || 15,
    aspectRatio: raw.aspectRatio || '16:9',
    filters: raw.filters || { brightness: 100, contrast: 100, grayscale: 0, sepia: 0, blur: 0 }
  };
};

const getInitialProject = (): ProjectState => {
  if (typeof window !== 'undefined') {
    if ((window as any).__STICKTALK_INITIAL_PROJECT__) {
      return sanitizeProject((window as any).__STICKTALK_INITIAL_PROJECT__);
    }
    const isExport = new URLSearchParams(window.location.search).get('exportMode') === '1';
    if (isExport) {
      const cached = localStorage.getItem('sticktalk_export_project');
      if (cached) {
        try {
          return sanitizeProject(JSON.parse(cached));
        } catch {}
      }
    }
  }
  return defaultTemplate;
};

export const useEditorStore = create<EditorStore>((set) => ({
  project: getInitialProject(),
  currentTime: 0,
  isPlaying: false,
  isExporting: false,
  selectedElementId: null,

  setProject: (newProject) => set({
    project: sanitizeProject(newProject),
    currentTime: 0,
    isPlaying: false,
    selectedElementId: null
  }),

  resetToCleanProject: (aspectRatio = '16:9') => set({
    project: {
      title: 'Dự án mới',
      aspectRatio,
      duration: 15,
      background: 'bg-blue-50',
      dialogueStyle: 'pedagogical',
      dialogueBoxStyle: 'bubble',
      filters: { brightness: 100, contrast: 100, grayscale: 0, sepia: 0, blur: 0 },
      characters: [],
      props: [],
      dialogBlocks: [],
      audios: []
    },
    currentTime: 0,
    isPlaying: false,
    selectedElementId: null
  }),

  setAspect: (aspect) => set((state) => ({ project: { ...state.project, aspectRatio: aspect } })),
  setBackground: (bg) => set((state) => ({ project: { ...state.project, background: bg } })),
  setFilters: (filters) => set((state) => ({ project: { ...state.project, filters: { ...state.project.filters, ...filters } } })),
  setTitle: (title) => set((state) => ({ project: { ...state.project, title } })),
  setDuration: (duration) => set((state) => ({ project: { ...state.project, duration } })),
  setIsExporting: (isExporting) => set({ isExporting }),
  addCharacter: (type, imageUrl) => set((state) => {
    let appearance: CharacterAppearance = {
      skinColor: '#ffffff',
      hairColor: '#000000',
      hairStyle: 'none',
      shirtColor: 'transparent',
      pantsColor: 'transparent',
      accessory: 'none'
    };
    
    if (type === 'student') {
      appearance = {
        ...appearance,
        hairStyle: 'short',
        shirtColor: '#ffffff',
        pantsColor: '#3b82f6',
        accessory: 'hat'
      };
    } else if (type === 'teacher') {
      appearance = {
        ...appearance,
        hairStyle: 'bun',
        shirtColor: '#f3f4f6',
        pantsColor: '#1f2937',
        accessory: 'glasses'
      };
    }

    const defaultDuration = Math.max(5, state.project.duration - state.currentTime);
    const newDuration = Math.max(state.project.duration, state.currentTime + defaultDuration);
    const isVertical = state.project.aspectRatio === '9:16';
    const defaultScale = isVertical ? 1.55 : 1.22;
    const defaultY = isVertical ? 72 : 64;

    return {
      project: {
        ...state.project,
        duration: newDuration,
        characters: [
          ...state.project.characters,
          { 
            id: uuidv4(), 
            type, 
            imageUrl,
            x: 50, 
            y: defaultY, 
            scale: defaultScale, 
            flipX: false,
            pose: { armL: 45, armR: -45, legL: 25, legR: -25 },
            color: '#000000',
            appearance,
            startTime: state.currentTime,
            duration: defaultDuration
          }
        ]
      }
    };
  }),
  updateCharacter: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      characters: state.project.characters.map((c) => c.id === id ? { ...c, ...updates } : c)
    }
  })),
  removeCharacter: (id) => set((state) => ({
    project: {
      ...state.project,
      characters: state.project.characters.filter((c) => c.id !== id),
      dialogBlocks: state.project.dialogBlocks.filter((d) => d.characterId !== id)
    },
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
  })),
  addDialog: (characterId, text) => set((state) => {
    const newId = uuidv4();
    const newDuration = Math.max(state.project.duration, state.currentTime + 2);
    return {
      project: {
        ...state.project,
        duration: newDuration,
        dialogBlocks: [
          ...state.project.dialogBlocks,
          {
            id: newId,
            characterId,
            text,
            startTime: state.currentTime,
            duration: 2,
            emotion: 'neutral',
            bubbleType: 'normal'
          }
        ]
      },
      selectedElementId: newId
    };
  }),
  updateDialog: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      dialogBlocks: state.project.dialogBlocks.map((d) => d.id === id ? { ...d, ...updates } : d)
    }
  })),
  removeDialog: (id) => set((state) => ({
    project: {
      ...state.project,
      dialogBlocks: state.project.dialogBlocks.filter((d) => d.id !== id)
    },
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
  })),
  addProp: (type, content, extraOptions = {}) => set((state) => {
    const newId = uuidv4();
    const defaultDuration = Math.max(3, state.project.duration - state.currentTime);
    const newDuration = Math.max(state.project.duration, state.currentTime + defaultDuration);

    const isVertical = state.project.aspectRatio === '9:16';
    const defaultScale = isVertical ? 1.25 : 1.15;

    return {
      project: {
        ...state.project,
        duration: newDuration,
        props: [
          ...state.project.props,
          {
            id: newId,
            type,
            content,
            x: extraOptions.x ?? 50,
            y: extraOptions.y ?? (isVertical ? 55 : 45),
            scale: extraOptions.scale ?? defaultScale,
            rotation: extraOptions.rotation ?? 0,
            startTime: extraOptions.startTime ?? state.currentTime,
            duration: extraOptions.duration ?? defaultDuration,
            ...extraOptions
          }
        ]
      },
      selectedElementId: newId
    };
  }),
  updateProp: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      props: state.project.props.map((p) => p.id === id ? { ...p, ...updates } : p)
    }
  })),
  removeProp: (id) => set((state) => ({
    project: {
      ...state.project,
      props: state.project.props.filter((p) => p.id !== id)
    },
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
  })),
  addAttackEffect: (characterId, emoji) => set((state) => {
    const char = state.project.characters.find(c => c.id === characterId);
    if (!char) return state;

    const newId = uuidv4();
    const effectDuration = 1.2;
    const startX = char.x + (char.flipX ? -5 : 5);
    const endX = char.x + (char.flipX ? -40 : 40);

    return {
      project: {
        ...state.project,
        props: [
          ...state.project.props,
          {
            id: newId,
            type: 'emoji',
            content: emoji,
            x: startX,
            y: char.y - 10,
            scale: 1.15,
            rotation: 0,
            startTime: state.currentTime,
            duration: effectDuration,
            keyframes: [
              {
                id: uuidv4(),
                time: state.currentTime,
                x: startX,
                y: char.y - 10,
                scale: 0.6,
              },
              {
                id: uuidv4(),
                time: state.currentTime + effectDuration,
                x: endX,
                y: char.y - 10,
                scale: 1.25,
              }
            ]
          }
        ]
      },
      selectedElementId: newId
    };
  }),
  addAudio: (url, name) => set((state) => {
    const newId = uuidv4();
    const newDuration = Math.max(state.project.duration, state.currentTime + 5);
    return {
      project: {
        ...state.project,
        duration: newDuration,
        audios: [
          ...state.project.audios,
          {
            id: newId,
            name,
            url,
            startTime: state.currentTime,
            duration: 5,
            volume: 1
          }
        ]
      },
      selectedElementId: newId
    };
  }),
  updateAudio: (id, updates) => set((state) => ({
    project: {
      ...state.project,
      audios: state.project.audios.map((a) => a.id === id ? { ...a, ...updates } : a)
    }
  })),
  removeAudio: (id) => set((state) => ({
    project: {
      ...state.project,
      audios: state.project.audios.filter((a) => a.id !== id)
    },
    selectedElementId: state.selectedElementId === id ? null : state.selectedElementId
  })),
  splitElement: (id, time) => set((state) => {
    const char = state.project.characters.find(c => c.id === id);
    const prop = state.project.props.find(p => p.id === id);
    const audio = state.project.audios.find(a => a.id === id);

    if (char && time > char.startTime && time < char.startTime + char.duration) {
      const newChar = { ...char, id: uuidv4(), startTime: time, duration: char.startTime + char.duration - time };
      return {
        project: {
          ...state.project,
          characters: [...state.project.characters.map(c => c.id === id ? { ...c, duration: time - c.startTime } : c), newChar]
        }
      };
    } else if (prop && time > prop.startTime && time < prop.startTime + prop.duration) {
      const newProp = { ...prop, id: uuidv4(), startTime: time, duration: prop.startTime + prop.duration - time };
      return {
        project: {
          ...state.project,
          props: [...state.project.props.map(p => p.id === id ? { ...p, duration: time - p.startTime } : p), newProp]
        }
      };
    } else if (audio && time > audio.startTime && time < audio.startTime + audio.duration) {
      const newAudio = { ...audio, id: uuidv4(), startTime: time, duration: audio.startTime + audio.duration - time };
      return {
        project: {
          ...state.project,
          audios: [...state.project.audios.map(a => a.id === id ? { ...a, duration: time - a.startTime } : a), newAudio]
        }
      };
    }
    return state;
  }),
  setCurrentTime: (time) => set((state) => ({ currentTime: Math.max(0, Math.min(time, state.project.duration)) })),
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setSelectedElement: (id) => set({ selectedElementId: id }),
}));
