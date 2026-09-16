import React, { useRef, useEffect, useState } from 'react';
import { useEditorStore } from '../store';
import { Play, Pause, SkipBack, Scissors, Music } from 'lucide-react';
import { CharacterTrack } from './timeline/CharacterTrack';
import { PropTrack } from './timeline/PropTrack';
import { AudioTrack } from './timeline/AudioTrack';

export const Timeline = () => {
  const { 
    project, 
    currentTime, 
    isPlaying, 
    togglePlay, 
    setCurrentTime,
    selectedElementId,
    setSelectedElement,
    updateDialog,
    updateCharacter,
    updateProp,
    updateAudio,
    splitElement
  } = useEditorStore();
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const [isDraggingPlayhead, setIsDraggingPlayhead] = useState(false);
  const [draggedDialogId, setDraggedDialogId] = useState<string | null>(null);
  const [draggedCharBlockId, setDraggedCharBlockId] = useState<string | null>(null);
  const [draggedPropBlockId, setDraggedPropBlockId] = useState<string | null>(null);
  const [draggedAudioBlockId, setDraggedAudioBlockId] = useState<string | null>(null);

  // Group dialogs by character
  const tracks = project.characters.map(char => ({
    character: char,
    dialogs: project.dialogBlocks.filter(d => d.characterId === char.id)
  }));

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const trackStartX = rect.left + 80; // account for 80px track label column
    const trackWidth = rect.width - 80;
    const x = Math.max(0, Math.min(e.clientX - trackStartX, trackWidth));
    const percentage = x / trackWidth;
    setCurrentTime(percentage * project.duration);
  };

  const handleDragPlayhead = (e: React.MouseEvent | MouseEvent) => {
    if (!isDraggingPlayhead || !timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const trackStartX = rect.left + 80;
    const trackWidth = rect.width - 80;
    const x = Math.max(0, Math.min(e.clientX - trackStartX, trackWidth));
    const percentage = x / trackWidth;
    setCurrentTime(percentage * project.duration);
  };

  const handleSplit = () => {
    if (selectedElementId) {
      splitElement(selectedElementId, currentTime);
    }
  };

  useEffect(() => {
    const onMouseUp = () => {
      setIsDraggingPlayhead(false);
      setDraggedDialogId(null);
      setDraggedCharBlockId(null);
      setDraggedPropBlockId(null);
      setDraggedAudioBlockId(null);
    };
    const onMouseMove = (e: MouseEvent) => {
      if (isDraggingPlayhead) {
        handleDragPlayhead(e);
      } else if (draggedDialogId && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const trackStartX = rect.left + 80;
        const trackWidth = rect.width - 80;
        const x = Math.max(0, Math.min(e.clientX - trackStartX, trackWidth));
        const percentage = x / trackWidth;
        let newStartTime = percentage * project.duration;
        newStartTime = Math.round(newStartTime * 2) / 2;
        updateDialog(draggedDialogId, { startTime: newStartTime });
      } else if (draggedCharBlockId && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const trackStartX = rect.left + 80;
        const trackWidth = rect.width - 80;
        const x = Math.max(0, Math.min(e.clientX - trackStartX, trackWidth));
        const percentage = x / trackWidth;
        let newStartTime = percentage * project.duration;
        newStartTime = Math.round(newStartTime * 2) / 2;
        updateCharacter(draggedCharBlockId, { startTime: newStartTime });
      } else if (draggedPropBlockId && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const trackStartX = rect.left + 80;
        const trackWidth = rect.width - 80;
        const x = Math.max(0, Math.min(e.clientX - trackStartX, trackWidth));
        const percentage = x / trackWidth;
        let newStartTime = percentage * project.duration;
        newStartTime = Math.round(newStartTime * 2) / 2;
        updateProp(draggedPropBlockId, { startTime: newStartTime });
      } else if (draggedAudioBlockId && timelineRef.current) {
        const rect = timelineRef.current.getBoundingClientRect();
        const trackStartX = rect.left + 80;
        const trackWidth = rect.width - 80;
        const x = Math.max(0, Math.min(e.clientX - trackStartX, trackWidth));
        const percentage = x / trackWidth;
        let newStartTime = percentage * project.duration;
        newStartTime = Math.round(newStartTime * 2) / 2;
        updateAudio(draggedAudioBlockId, { startTime: newStartTime });
      }
    };

    if (isDraggingPlayhead || draggedDialogId || draggedCharBlockId || draggedPropBlockId || draggedAudioBlockId) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [isDraggingPlayhead, draggedDialogId, draggedCharBlockId, draggedPropBlockId, draggedAudioBlockId, project.duration, updateDialog, updateCharacter, updateProp, updateAudio]);

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col border-t border-gray-800">
      {/* Controls */}
      <div className="flex items-center gap-3 p-1.5 px-3 bg-gray-950 border-b border-gray-800 shrink-0">
        <button onClick={() => setCurrentTime(0)} className="p-1 hover:bg-gray-800 rounded text-gray-400 hover:text-white">
          <SkipBack size={14} />
        </button>
        <button onClick={togglePlay} className="p-1.5 bg-blue-600 hover:bg-blue-500 rounded text-white shadow-sm">
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <div className="font-mono text-xs text-blue-400 ml-2">
          {currentTime.toFixed(1)}s / {project.duration}s
        </div>
      </div>

        {/* Tracks Container */}
      <div className="flex-1 overflow-y-auto flex flex-col relative" ref={timelineRef}>
        {/* Track Headers (Time ticks) */}
        <div 
          className="flex h-6 border-b border-gray-800 bg-gray-900/50 sticky top-0 z-30 cursor-pointer"
          onMouseDown={(e) => {
            setIsDraggingPlayhead(true);
            handleTimelineClick(e);
          }}
        >
          <div className="w-20 border-r border-gray-700 shrink-0 bg-gray-900/80"></div>
          <div className="flex-1 relative overflow-hidden">
            {[...Array(Math.ceil(project.duration) + 1)].map((_, i) => (
              <div key={i} className="absolute top-0 bottom-0 border-l border-gray-600/50 text-[10px] text-gray-500 pl-1" style={{ left: `${(i / project.duration) * 100}%` }}>
                {i}s
              </div>
            ))}
          </div>
        </div>
        
        {/* Playhead Container */}
        <div 
          className="absolute top-0 bottom-0 left-[80px] right-0 z-40 pointer-events-none"
        >
          <div 
            className="absolute top-0 bottom-0 w-[2px] bg-red-500 pointer-events-none"
            style={{ left: `${(currentTime / project.duration) * 100}%`, transform: 'translateX(-50%)' }}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-red-500 rounded-b-sm"></div>
          </div>
        </div>

        {/* Tracks */}
        <div className="flex-1 flex flex-col pt-1">
          {tracks.map((track, i) => (
            <CharacterTrack 
              key={track.character.id}
              track={track}
              index={i}
              projectDuration={project.duration}
              onTrackMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setIsDraggingPlayhead(true);
                  handleTimelineClick(e as any);
                }
              }}
              setDraggedCharBlockId={setDraggedCharBlockId}
              setDraggedDialogId={setDraggedDialogId}
            />
          ))}

          {/* Props Tracks */}
          {project.props.map((prop, i) => (
            <PropTrack 
              key={prop.id}
              prop={prop}
              index={i}
              projectDuration={project.duration}
              onTrackMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setIsDraggingPlayhead(true);
                  handleTimelineClick(e as any);
                }
              }}
              setDraggedPropBlockId={setDraggedPropBlockId}
            />
          ))}

          {/* Audio Tracks */}
        {project.audios.map((audio, i) => (
          <AudioTrack 
              key={audio.id}
              audio={audio}
              index={i}
              projectDuration={project.duration}
              onTrackMouseDown={(e) => {
                if (e.target === e.currentTarget) {
                  setIsDraggingPlayhead(true);
                  handleTimelineClick(e as any);
                }
              }}
              setDraggedAudioBlockId={setDraggedAudioBlockId}
            />
        ))}

        {tracks.length === 0 && project.props.length === 0 && project.audios.length === 0 && (
          <div className="flex-1 flex items-center justify-center text-gray-600 text-sm">
            Thêm nhân vật, đạo cụ hoặc âm thanh để bắt đầu
          </div>
        )}
        </div>
      </div>

      {/* Toolbar for Splitting */}
      <div className="h-10 bg-gray-800 border-t border-gray-700 flex items-center px-4 gap-4 shrink-0">
        <button 
          className="text-xs text-gray-300 hover:text-white flex items-center gap-1 disabled:opacity-50"
          onClick={handleSplit}
          disabled={!selectedElementId}
          title="Tách phần tử đang chọn tại vị trí con trỏ thời gian"
        >
          <Scissors size={14} /> Tách (Split)
        </button>
      </div>
    </div>
  );
};
