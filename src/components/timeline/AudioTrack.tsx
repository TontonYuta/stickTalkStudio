import React from 'react';
import { AudioTrack as AudioTrackType } from '../../types';
import { useEditorStore } from '../../store';
import { Music } from 'lucide-react';

interface AudioTrackProps {
  audio: AudioTrackType;
  index: number;
  projectDuration: number;
  onTrackMouseDown: (e: React.MouseEvent) => void;
  setDraggedAudioBlockId: (id: string) => void;
}

export const AudioTrack: React.FC<AudioTrackProps> = ({
  audio, index, projectDuration, onTrackMouseDown, setDraggedAudioBlockId
}) => {
  const { selectedElementId, setSelectedElement } = useEditorStore();

  return (
    <div className="flex h-8 border-b border-gray-800 relative group">
      {/* Track Label */}
      <div className="w-20 bg-gray-800/30 flex flex-col items-center justify-center border-r border-gray-700 shrink-0 relative z-20 text-[10px] text-gray-500 font-medium">
        Âm {index + 1}
      </div>
      
      {/* Track Timeline */}
      <div 
        className="flex-1 relative cursor-pointer hover:bg-gray-800/30"
        onMouseDown={onTrackMouseDown}
      >
        {/* Grid lines */}
        {[...Array(Math.ceil(projectDuration) + 1)].map((_, j) => (
          <div key={j} className="absolute top-0 bottom-0 w-px bg-gray-800/50 pointer-events-none" style={{ left: `${(j / projectDuration) * 100}%` }}></div>
        ))}

        {/* Audio Lifespan Block */}
        <div
          className={`absolute top-1 bottom-1 rounded-md overflow-hidden ${selectedElementId === audio.id ? 'ring-1 ring-white/50 bg-blue-800/30 border border-blue-500/50' : 'bg-blue-900/20 border border-blue-800/30 hover:bg-blue-800/30'}`}
          style={{
            left: `${(audio.startTime / projectDuration) * 100}%`,
            width: `${(audio.duration / projectDuration) * 100}%`,
            cursor: 'grab'
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setSelectedElement(audio.id);
            setDraggedAudioBlockId(audio.id);
          }}
        >
          <div className="text-[10px] text-blue-200 px-2 py-0.5 truncate pointer-events-none flex items-center gap-1">
            <Music size={10} /> {audio.name}
          </div>
        </div>
      </div>
    </div>
  );
};
