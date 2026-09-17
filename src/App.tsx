/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef, useState } from 'react';
import { PreviewArea } from './components/PreviewArea';
import { TabMenu } from './components/TabMenu';
import { Timeline } from './components/Timeline';
import { useEditorStore } from './store';
import { ChevronDown, ChevronUp, Save, Film, Upload, HelpCircle, Sparkles, RefreshCw, PlusCircle } from 'lucide-react';
import { useExportVideo } from './hooks/useExportVideo';
import { useProjectActions } from './hooks/useProjectActions';
import { HelpModal } from './components/HelpModal';
import { AIModal } from './components/AIModal';
import { ExportModal } from './components/ExportModal';
import { QuickRerenderBar } from './components/QuickRerenderBar';
import { QuickCreateBar } from './components/QuickCreateBar';

export default function App() {
  const { project, currentTime, isPlaying } = useEditorStore();
  const audioRefs = useRef<{ [id: string]: HTMLAudioElement }>({});
  const { handleExportVideo, isExporting, isConverting, exportProgress } = useExportVideo();
  const { handleExport, handleImport } = useProjectActions();

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isAIOpen, setIsAIOpen] = useState(false);
  const [aiModalMode, setAiModalMode] = useState<'create' | 'rerender'>('create');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isExportMode, setIsExportMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).get('exportMode') === '1';
    }
    return false;
  });

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setIsExportOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleExport();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
        e.preventDefault();
        handleImport();
      }
    };
    
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleExport, handleImport]);
  const [isTimelineOpen, setIsTimelineOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

  useEffect(() => {
    (window as any).__STICKTALK_IMPORT__ = (projectData: any) => {
      useEditorStore.getState().setProject(projectData);
    };
    (window as any).__STICKTALK_START_PLAYBACK__ = () => {
      (window as any).__PLAYBACK_STARTED_AT__ = performance.now();
      useEditorStore.setState({ currentTime: 0, isPlaying: true });
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('exportMode') === '1') {
      const initial = (window as any).__STICKTALK_INITIAL_PROJECT__;
      if (initial) {
        useEditorStore.getState().setProject(initial);
      } else {
        const cached = localStorage.getItem('sticktalk_export_project');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            useEditorStore.getState().setProject(parsed);
          } catch {}
        }
      }
      if (urlParams.get('autoPlay') === '1') {
        setTimeout(() => {
          useEditorStore.setState({ isPlaying: true });
        }, 500);
      }
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsTimelineOpen(true);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Sync audios safely
    const audios = project.audios || [];
    audios.forEach(audio => {
      if (!audioRefs.current[audio.id]) {
        const audioEl = new Audio(audio.url);
        audioRefs.current[audio.id] = audioEl;
      }
      
      const audioEl = audioRefs.current[audio.id];
      audioEl.volume = audio.volume;

      // Logic to play/pause based on currentTime and isPlaying
      const isWithinTime = currentTime >= audio.startTime && currentTime < audio.startTime + audio.duration;
      
      if (isPlaying && isWithinTime) {
        if (audioEl.paused) {
          // Calculate exact position
          audioEl.currentTime = currentTime - audio.startTime;
          audioEl.play().catch(e => console.log('Audio play prevented:', e));
        }
      } else {
        if (!audioEl.paused) {
          audioEl.pause();
        }
      }
    });

    // Cleanup removed audios
    Object.keys(audioRefs.current).forEach(id => {
      if (!audios.find(a => a.id === id)) {
        audioRefs.current[id].pause();
        delete audioRefs.current[id];
      }
    });
  }, [project.audios, currentTime, isPlaying]);

  if (isExportMode) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-black overflow-hidden select-none">
        <PreviewArea />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden font-sans">
      {isConverting && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm">
          <div className="bg-white p-6 rounded-xl shadow-xl flex flex-col items-center max-w-xs w-full">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <h3 className="text-lg font-bold text-gray-800">Đang xuất video MP4</h3>
            <p className="text-sm text-gray-500 mt-2 text-center">Vui lòng chờ trong giây lát. Đừng đóng tab này...</p>
            {exportProgress > 0 && <p className="font-medium text-blue-600 mt-2">{exportProgress}%</p>}
          </div>
        </div>
      )}
      {/* Header */}
      <header className="h-12 sm:h-14 bg-white border-b border-gray-200 flex items-center justify-between px-3 sm:px-4 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-base sm:text-lg">
            S
          </div>
          <h1 className="font-bold text-gray-800 tracking-tight text-sm sm:text-base hidden sm:block">
            {project.title || 'StickTalk Studio'}
          </h1>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button 
            onClick={() => {
              setAiModalMode('create');
              setIsAIOpen(true);
            }}
            className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md shadow-indigo-500/25 flex items-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-95"
            title="Tự động tạo video hoạt hình bằng Gemini & Antigravity"
          >
            <Sparkles size={15} className="animate-pulse" />
            <span>Tạo Bằng AI</span>
          </button>

          {/* Rerender AI - Direct Outside Access Button */}
          <button 
            onClick={() => {
              setAiModalMode('rerender');
              setIsAIOpen(true);
            }}
            className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-600 hover:to-purple-700 text-white px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all shadow-md shadow-rose-500/20 flex items-center gap-1 cursor-pointer hover:scale-[1.02] active:scale-95"
            title="Sửa đổi, rerender video hiện tại bằng AI (bảo toàn phần đã ổn)"
          >
            <RefreshCw size={14} className="hover:rotate-180 transition-transform duration-500" />
            <span>Rerender AI</span>
          </button>

          {/* Clean New Project Button */}
          <button 
            onClick={() => {
              if (confirm('Tạo dự án mới hoàn toàn sạch sẽ (xóa mọi nhân vật, đạo cụ cũ để tránh bị dính)?')) {
                useEditorStore.getState().resetToCleanProject(project.aspectRatio);
              }
            }}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors flex items-center justify-center"
            title="Dự án mới (Dọn sạch 100% đối tượng cũ)"
          >
            <PlusCircle size={18} />
          </button>

          <button 
            onClick={() => setIsHelpOpen(true)}
            className="p-1.5 sm:p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors flex items-center justify-center"
            title="Hướng dẫn sử dụng"
          >
            <HelpCircle size={18} />
          </button>

          <button 
            onClick={() => setIsExportOpen(true)}
            className="bg-gradient-to-r from-slate-900 to-indigo-900 hover:from-black hover:to-indigo-950 text-white px-2.5 sm:px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all shadow-sm flex items-center gap-1 hover:shadow"
            title="Xuất video tự động chất lượng cao hoặc quay màn hình (Ctrl+E)"
          >
            <Film size={15} className="text-blue-400" /> 
            <span>Xuất Video</span>
            <span className="hidden md:inline-block text-[9px] bg-blue-500/30 text-blue-300 font-mono px-1.5 py-0.2 rounded-full border border-blue-400/20">Pro</span>
          </button>

          <button 
            onClick={handleImport}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors shadow-sm flex items-center gap-1"
            title="Nhập file JSON dự án"
          >
            <Upload size={15} className="hidden sm:block" /> 
            <span className="hidden sm:inline">Nhập Code</span>
          </button>
          
          <button 
            onClick={handleExport}
            className="bg-blue-600 hover:bg-blue-700 text-white px-2.5 sm:px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-colors shadow-sm flex items-center gap-1"
            title="Lưu dự án về máy tính dạng JSON"
          >
            <Save size={15} className="hidden sm:block" /> 
            <span className="hidden sm:inline">Lưu Dự Án</span>
          </button>
        </div>
      </header>

      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <AIModal 
        isOpen={isAIOpen} 
        initialMode={aiModalMode}
        onClose={() => setIsAIOpen(false)} 
        onStartExport={() => setIsExportOpen(true)} 
      />
      <ExportModal 
        isOpen={isExportOpen} 
        onClose={() => setIsExportOpen(false)} 
        onOpenRerender={() => {
          setAiModalMode('rerender');
          setIsAIOpen(true);
        }}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
        {/* Left/Top: Preview Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <PreviewArea />
          
          {/* Timeline Toggle Button (Mobile) */}
          <button 
            onClick={() => setIsTimelineOpen(!isTimelineOpen)}
            className="absolute bottom-2 right-2 bg-gray-800 text-white px-2 py-1.5 rounded-md shadow-md z-40 flex items-center justify-center md:hidden"
          >
            {isTimelineOpen ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
            <span className="text-[10px] ml-1 font-medium">Timeline</span>
          </button>
        </div>

        {/* Right/Bottom: Tools Menu */}
        <div className="flex-1 flex flex-col border-t md:border-t-0 md:border-l border-gray-200 bg-white overflow-hidden z-20">
          <TabMenu />
        </div>
      </div>

      {/* Outside Quick AI Rerender Bar */}
      <QuickRerenderBar 
        onOpenFullModal={() => {
          setAiModalMode('rerender');
          setIsAIOpen(true);
        }} 
      />

      {/* Outside Quick AI Create Video Bar (with custom duration & instant generation) */}
      <QuickCreateBar 
        onOpenFullModal={() => {
          setAiModalMode('create');
          setIsAIOpen(true);
        }} 
      />

      {/* Bottom: Timeline */}
      {isTimelineOpen && (
        <div className="h-[30vh] landscape:h-[35vh] md:h-40 shrink-0 flex flex-col transition-all duration-300 z-30 absolute bottom-0 left-0 right-0 landscape:md:relative md:relative shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:shadow-none bg-white">
          <Timeline />
        </div>
      )}
    </div>
  );
}
