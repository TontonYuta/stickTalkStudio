import React from 'react';
import { PropItem } from '../../types';
import { useEditorStore } from '../../store';

interface PropTrackProps {
  prop: PropItem;
  index: number;
  projectDuration: number;
  onTrackMouseDown: (e: React.MouseEvent) => void;
  setDraggedPropBlockId: (id: string) => void;
}

export const PropTrack: React.FC<PropTrackProps> = ({
  prop, index, projectDuration, onTrackMouseDown, setDraggedPropBlockId
}) => {
  const { selectedElementId, setSelectedElement, setCurrentTime } = useEditorStore();

  return (
    <div className="flex h-8 border-b border-gray-800 relative group">
      {/* Track Label */}
      <div className="w-20 bg-gray-800/30 flex flex-col items-center justify-center border-r border-gray-700 shrink-0 relative z-20 text-[10px] text-gray-500 font-medium">
        ĐC {index + 1}
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

        {/* Prop Lifespan Block */}
        <div
          className={`absolute top-1 bottom-1 rounded-md overflow-hidden ${selectedElementId === prop.id ? 'ring-1 ring-white/50 bg-purple-800/30 border border-purple-500/50' : 'bg-purple-900/20 border border-purple-800/30 hover:bg-purple-800/30'}`}
          style={{
            left: `${(prop.startTime / projectDuration) * 100}%`,
            width: `${(prop.duration / projectDuration) * 100}%`,
            cursor: 'grab'
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            setSelectedElement(prop.id);
            setDraggedPropBlockId(prop.id);
          }}
        >
          <div className="text-[10px] text-purple-200 px-2 py-0.5 truncate pointer-events-none">
            {prop.type === 'emoji' ? prop.content : prop.type === 'text' ? 'Chữ' : 'Ảnh'}
          </div>
        </div>

        {/* Keyframes */}
        {prop.keyframes?.map(kf => (
          <div
            key={kf.id}
            className="absolute top-[50%] -mt-1.5 w-3 h-3 bg-yellow-400 rounded-full border border-yellow-700 z-10 cursor-pointer hover:scale-125 transition-transform"
            style={{ left: `calc(${(kf.time / projectDuration) * 100}% - 6px)` }}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedElement(prop.id);
              setCurrentTime(kf.time);
            }}
            title="Keyframe (Click để nhảy tới)"
          />
        ))}
      </div>
    </div>
  );
};
