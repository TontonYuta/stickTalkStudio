import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../store';
import { Character, DialogBlock, PropItem } from '../types';
import { Maximize, Minimize } from 'lucide-react';
import { getInterpolatedCharacter, getInterpolatedProp } from '../utils/animation';
import { PropView } from './views/PropView';
import { CharacterView } from './views/CharacterView';
import { SpeechBubble } from './views/SpeechBubble';

export const PreviewArea = () => {
  const { project, currentTime, isPlaying, setCurrentTime, selectedElementId, setSelectedElement, updateCharacter, updateProp, removeCharacter, removeProp, togglePlay } = useEditorStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [draggedElementId, setDraggedElementId] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const BASE_WIDTH = 1000;
  const [w, h] = project.aspectRatio.split(':').map(Number);
  const targetRatio = w / h;
  const BASE_HEIGHT = BASE_WIDTH / targetRatio;
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      wrapperRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // Calculate perfect fit dimensions
  useEffect(() => {
    if (!wrapperRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        const isExportModeActive = typeof window !== 'undefined' && window.location.search.includes('exportMode=1');
        // In export mode, fill 100% without 32px margins
        const availableWidth = isExportModeActive ? width : Math.max(10, width - 32);
        const availableHeight = isExportModeActive ? height : Math.max(10, height - 32);
        
        const containerRatio = availableWidth / availableHeight;
        
        let newScale = 1;
        if (containerRatio > targetRatio) {
          // Height is the bottleneck
          newScale = availableHeight / BASE_HEIGHT;
        } else {
          // Width is the bottleneck
          newScale = availableWidth / BASE_WIDTH;
        }
        setScale(newScale);

        if (isExportModeActive && typeof window !== 'undefined') {
          (window as any).__STICKTALK_READY__ = true;
          (window as any).__STICKTALK_SCALE__ = newScale;
        }
      }
    });
    observer.observe(wrapperRef.current);
    return () => observer.disconnect();
  }, [project.aspectRatio]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't move if typing in an input or textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
        return;
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedElementId) {
          e.preventDefault();
          const char = project.characters.find(c => c.id === selectedElementId);
          const prop = project.props.find(p => p.id === selectedElementId);
          if (char) {
            removeCharacter(selectedElementId);
            setSelectedElement(null);
          } else if (prop) {
            removeProp(selectedElementId);
            setSelectedElement(null);
          }
        }
        return;
      }

      if (!selectedElementId) return;
      const char = project.characters.find(c => c.id === selectedElementId);
      const prop = project.props.find(p => p.id === selectedElementId);
      
      if (!char && !prop) return;

      const step = e.shiftKey ? 5 : 1;
      let newX = char ? char.x : prop!.x;
      let newY = char ? char.y : prop!.y;

      if (e.key === 'ArrowLeft') newX -= step;
      if (e.key === 'ArrowRight') newX += step;
      if (e.key === 'ArrowUp') newY -= step;
      if (e.key === 'ArrowDown') newY += step;

      const currentX = char ? char.x : prop!.x;
      const currentY = char ? char.y : prop!.y;

      if (newX !== currentX || newY !== currentY) {
        e.preventDefault();
        if (char) {
          updateCharacter(char.id, { x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
        } else if (prop) {
          updateProp(prop.id, { x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedElementId, project.characters, project.props, updateCharacter, updateProp, removeCharacter, removeProp, togglePlay]);

  // Animation loop
  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();

    const loop = (time: number) => {
      const state = useEditorStore.getState();
      if (state.isPlaying) {
        const delta = (time - lastTime) / 1000;
        const newTime = (state.currentTime + delta) % state.project.duration;
        state.setCurrentTime(newTime);
      }
      lastTime = time;
      animationFrame = requestAnimationFrame(loop);
    };

    if (isPlaying) {
      lastTime = performance.now();
      animationFrame = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationFrame);
  }, [isPlaying]);

  const aspectClass = project.aspectRatio === '9:16' ? 'aspect-[9/16]' : project.aspectRatio === '1:1' ? 'aspect-square' : project.aspectRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-video';

  // Find active elements at current time with safe defaults
  const activeDialogs = (project.dialogBlocks || []).filter((db) => {
    const start = typeof db.startTime === 'number' ? db.startTime : 0;
    const dur = typeof db.duration === 'number' ? db.duration : 3;
    return currentTime >= start && currentTime <= start + dur;
  });

  const activeCharacters = (project.characters || []).filter((char) => {
    const start = typeof char.startTime === 'number' ? char.startTime : 0;
    const dur = typeof char.duration === 'number' ? char.duration : (project.duration || 15);
    return currentTime >= start && currentTime <= start + dur;
  });

  const activeProps = (project.props || []).filter((prop) => {
    const start = typeof prop.startTime === 'number' ? prop.startTime : 0;
    const dur = typeof prop.duration === 'number' ? prop.duration : (project.duration || 15);
    return currentTime >= start && currentTime <= start + dur;
  });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (draggedElementId && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const char = project.characters.find(c => c.id === draggedElementId);
      const prop = project.props.find(p => p.id === draggedElementId);

      if (char) {
        updateCharacter(draggedElementId, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
      } else if (prop) {
        updateProp(draggedElementId, { x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (draggedElementId) {
      e.currentTarget.releasePointerCapture(e.pointerId);
      setDraggedElementId(null);
    }
  };

  const backgroundVal = project.background || 'bg-blue-50';
  const isCustomBg = typeof backgroundVal === 'string' && backgroundVal.startsWith('url');
  
  const getContainerStyle = () => {
    return {
      width: `${BASE_WIDTH}px`,
      height: `${BASE_HEIGHT}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
      ...(isCustomBg ? { backgroundImage: backgroundVal, backgroundSize: 'cover', backgroundPosition: 'center' } : {}),
      filter: `brightness(${project.filters?.brightness ?? 100}%) contrast(${project.filters?.contrast ?? 100}%) grayscale(${project.filters?.grayscale ?? 0}%) sepia(${project.filters?.sepia ?? 0}%) blur(${project.filters?.blur ?? 0}px)`
    };
  };

  const isExporting = useEditorStore(s => s.isExporting);
  const isExportMode = typeof window !== 'undefined' && window.location.search.includes('exportMode=1');
  const isCleanRender = isExporting || isExportMode;

  return (
    <div 
      ref={wrapperRef} 
      className={`w-full h-full flex-1 flex flex-col items-center justify-center ${isCleanRender ? 'bg-black' : 'bg-gray-100'} overflow-hidden relative`}
    >
      {/* Workspace Background Pattern */}
      {!isCleanRender && (
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[length:16px_16px]"></div>
      )}

      {/* Fullscreen toggle button */}
      {!isCleanRender && (
        <button 
          onClick={toggleFullscreen}
          className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg z-50 transition-colors shadow-sm backdrop-blur-sm"
          title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      )}

      <div 
        id="preview-area-container"
        ref={containerRef}
        className={`shrink-0 relative shadow-2xl overflow-hidden touch-none z-10 ${isCustomBg ? '' : backgroundVal}`}
        style={getContainerStyle()}
        onPointerDown={(e) => {
          if (e.target === e.currentTarget) {
            setSelectedElement(null);
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      >
        {/* Characters */}
        {activeCharacters.map((char) => {
          const interpolatedChar = getInterpolatedCharacter(char, currentTime);
          const activeDialog = activeDialogs.find(d => d.characterId === char.id);
          const isSpeaking = !!activeDialog;
          const emotion = activeDialog?.emotion;
          return (
            <CharacterView 
              key={char.id} 
              character={interpolatedChar} 
              isSelected={!isCleanRender && selectedElementId === char.id}
              isSpeaking={isSpeaking}
              emotion={emotion}
              currentTime={currentTime}
              onPointerDown={(e) => {
                if (isCleanRender) return;
                e.stopPropagation();
                setSelectedElement(char.id);
                setDraggedElementId(char.id);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
            />
          );
        })}

        {/* Props */}
        {activeProps.map((prop) => {
          const interpolatedProp = getInterpolatedProp(prop, currentTime);
          return (
            <PropView
              key={prop.id}
              prop={interpolatedProp}
              isSelected={!isCleanRender && selectedElementId === prop.id}
              currentTime={currentTime}
              onPointerDown={(e) => {
                if (isCleanRender) return;
                e.stopPropagation();
                setSelectedElement(prop.id);
                setDraggedElementId(prop.id);
                e.currentTarget.setPointerCapture(e.pointerId);
              }}
            />
          );
        })}

        {/* Speech Bubbles */}
        {activeDialogs.map((dialog) => {
          const char = activeCharacters.find(c => c.id === dialog.characterId);
          if (!char) return null;
          const interpolatedChar = getInterpolatedCharacter(char, currentTime);
          return <SpeechBubble key={dialog.id} block={dialog} character={interpolatedChar} />;
        })}
      </div>
    </div>
  );
};
