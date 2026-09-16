import React from 'react';
import { Character, DialogBlock } from '../../types';
import { useEditorStore } from '../../store';

interface CharacterTrackProps {
  track: { character: Character; dialogs: DialogBlock[] };
  index: number;
  projectDuration: number;
  onTrackMouseDown: (e: React.MouseEvent) => void;
  setDraggedCharBlockId: (id: string) => void;
  setDraggedDialogId: (id: string) => void;
}

export const CharacterTrack: React.FC<CharacterTrackProps> = ({
  track, index, projectDuration, onTrackMouseDown, setDraggedCharBlockId, setDraggedDialogId
}) => {
  const { selectedElementId, setSelectedElement, setCurrentTime } = useEditorStore();

  return (
    <div className="flex h-10 border-b border-gray-800 relative group">
      {/* Track Label */}
      <div className="w-20 bg-gray-800/50 flex flex-col items-center justify-center border-r border-gray-700 shrink-0 relative z-20 text-[10px] text-gray-400 font-medium">
        NV {index + 1}
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

        {/* Character Lifespan Block */}
        <div
          className={`absolute top-1 bottom-1 rounded-md overflow-hidden ${selectedElementId === track.character.id ? 'ring-1 ring-white/50 bg-green-800/30 border border-green-500/50' : 'bg-green-900/20 border border-green-800/30 hover:bg-green-800/30'}`}
          style={{
            left: `${(track.character.startTime / projectDuration) * 100}%`,
            width: `${(track.character.duration / projectDuration) * 100}%`,
            cursor: 'grab'
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setSelectedElement(track.character.id);
            setDraggedCharBlockId(track.character.id);
          }}
        >
          {/* Visual indicator of character active time */}
        </div>

        {/* Keyframes */}
        {track.character.keyframes?.map(kf => (
          <div
            key={kf.id}
            className="absolute top-[50%] -mt-1.5 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-700 z-10 cursor-pointer hover:scale-125 transition-transform"
            style={{ left: `calc(${(kf.time / projectDuration) * 100}% - 6px)` }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(track.character.id);
              setCurrentTime(kf.time);
            }}
            title="Keyframe (Click để nhảy tới)"
          />
        ))}

        {/* Dialog Blocks */}
        {track.dialogs.map(dialog => (
          <div
            key={dialog.id}
            className={`absolute top-1 bottom-1 rounded-md shadow-sm overflow-hidden text-[9px] p-0.5 px-1 z-10
              ${selectedElementId === dialog.id ? 'ring-1 ring-white bg-blue-500' : 'bg-blue-600/80 hover:bg-blue-500'}
            `}
            style={{
              left: `${(dialog.startTime / projectDuration) * 100}%`,
              width: `${(dialog.duration / projectDuration) * 100}%`,
              cursor: 'grab'
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              setSelectedElement(dialog.id);
              setDraggedDialogId(dialog.id);
            }}
          >
            <div className="truncate font-semibold text-white/90">{dialog.text || '...'}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
