import React from 'react';
import { DialogBlock, Character } from '../../types';
import { MathText } from '../common/MathText';
import { useEditorStore } from '../../store';

interface SpeechBubbleProps {
  block: DialogBlock;
  character: Character;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({ block, character }) => {
  const project = useEditorStore(s => s.project);
  const currentTime = useEditorStore(s => s.currentTime);
  const isVertical = project.aspectRatio === '9:16';

  // Detect if there is a center prop (Chart, Table, Math formula) currently active
  const hasActiveCenterProp = (project.props || []).some(
    p => (p.type === 'chart' || p.type === 'table' || p.type === 'math') &&
         currentTime >= (p.startTime ?? 0) && 
         currentTime <= (p.startTime ?? 0) + (p.duration ?? project.duration ?? 15)
  );

  const textLen = block.text.length;
  let fontClass = "text-xs sm:text-sm font-semibold leading-relaxed tracking-normal";
  if (textLen > 60) {
    fontClass = "text-[11px] sm:text-xs font-medium leading-normal tracking-tight";
  } else if (textLen > 30) {
    fontClass = "text-xs sm:text-sm font-semibold leading-relaxed";
  }

  // Determine Outward Anchor & Direction
  const isLeftSide = character.x <= 48;
  const isRightSide = character.x >= 52;

  // Dynamic max-width based on center occupancy & aspect ratio
  let maxWidthClass = "max-w-[240px] sm:max-w-[280px]";
  let bubbleWidthPercent = 26; // approx percent of 1000px canvas width

  if (hasActiveCenterProp && !isVertical) {
    maxWidthClass = "max-w-[195px] sm:max-w-[215px]";
    bubbleWidthPercent = 21;
  } else if (isVertical) {
    maxWidthClass = "max-w-[220px] sm:max-w-[245px]";
    bubbleWidthPercent = 24;
  }

  const halfWidth = bubbleWidthPercent / 2;

  // Compute clean, non-overlapping center X for the bubble
  let bubbleCenterX = character.x;

  if (hasActiveCenterProp && !isVertical) {
    // 16:9 DUAL-ZONE: Center stage [29%, 71%] is strictly reserved for Graph / Math Card / Table
    if (isLeftSide) {
      // Keep left bubble in [3%, 28%]
      bubbleCenterX = Math.max(2 + halfWidth, Math.min(28 - halfWidth, character.x));
    } else if (isRightSide) {
      // Keep right bubble in [72%, 97%]
      bubbleCenterX = Math.max(72 + halfWidth, Math.min(98 - halfWidth, character.x));
    }
  } else {
    // Standard bounds to avoid clipping off-screen
    bubbleCenterX = Math.max(2 + halfWidth, Math.min(98 - halfWidth, character.x));
  }

  // Calculate exact tail position relative to the bubble so it always points directly at character's head
  const rawTail = ((character.x - (bubbleCenterX - halfWidth)) / bubbleWidthPercent) * 100;
  const tailPositionPercent = `${Math.max(12, Math.min(88, rawTail)).toFixed(1)}%`;

  // Effective Box Style
  const effectiveBoxStyle = block.boxStyle || project.dialogueBoxStyle || 'bubble';

  // Sophisticated Box Styling
  let bubbleClass = '';
  let showTail = true;

  if (effectiveBoxStyle === 'card') {
    // Glassmorphism Premium Card Box
    bubbleClass = `bg-slate-900/95 backdrop-blur-md border border-indigo-500/40 text-slate-100 rounded-2xl p-3.5 sm:p-4 shadow-[0_14px_35px_rgba(0,0,0,0.35)] ${maxWidthClass} text-left break-words relative`;
    showTail = false;
  } else if (effectiveBoxStyle === 'cinema') {
    // Cinematic Subtitle Bar
    bubbleClass = `bg-black/92 backdrop-blur-md border-b-2 border-amber-400 text-white rounded-xl px-4 py-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] ${maxWidthClass} text-center break-words relative`;
    showTail = false;
  } else if (effectiveBoxStyle === 'manga' || block.bubbleType === 'manga') {
    // Bold Comic / Manga Box
    bubbleClass = `bg-white border-2 border-slate-950 rounded-none p-3.5 sm:p-4 font-black text-slate-950 shadow-[4px_4px_0px_rgba(15,23,42,1)] ${maxWidthClass} text-center break-words relative`;
    showTail = true;
  } else {
    // Default High-Contrast Modern Speech Bubble
    if (block.bubbleType === 'thought') {
      bubbleClass = `bg-slate-50/98 backdrop-blur-md border-2 border-dashed border-slate-400 rounded-3xl p-3.5 sm:p-4 shadow-lg ${maxWidthClass} text-center break-words text-slate-800 relative`;
    } else if (block.bubbleType === 'shout') {
      bubbleClass = `bg-red-50/98 backdrop-blur-md border-2 border-red-500 rounded-2xl p-3.5 sm:p-4 font-bold text-red-900 ${maxWidthClass} text-center break-words shadow-[0_12px_28px_rgba(239,68,68,0.25)] relative`;
    } else {
      bubbleClass = `bg-white/98 backdrop-blur-md border-2 border-slate-300 rounded-2xl px-4 py-3 shadow-[0_12px_30px_-5px_rgba(15,23,42,0.18)] ${maxWidthClass} text-center break-words relative text-slate-900`;
    }
    showTail = true;
  }

  // Role Icon Determination (👨‍🏫 Thầy giáo, 👨‍🎓 Học sinh, 👩‍🔬 Chuyên gia...)
  let roleIcon = block.roleIcon;
  if (!roleIcon) {
    if (character.type === 'teacher' || (character.name && character.name.includes('Thầy'))) {
      roleIcon = '👨‍🏫';
    } else if (character.type === 'student' || (character.name && (character.name.includes('Học sinh') || character.name.includes('Sĩ Tử')))) {
      roleIcon = '👨‍🎓';
    } else {
      roleIcon = '💬';
    }
  }

  const charScale = character.scale || 1;
  const topOffsetPx = Math.round(96 * charScale + 18);

  return (
    <div 
      className="absolute flex flex-col pointer-events-none z-30 animate-scale-in select-none"
      style={{
        left: `${bubbleCenterX}%`,
        top: `calc(${character.y}% - ${topOffsetPx}px)`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className={`${bubbleClass} ${fontClass}`} style={{ whiteSpace: 'pre-wrap' }}>
        {/* Elegant Speaker Badge */}
        {character.name && (
          <span 
            className={`absolute -top-3 left-3 text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 ${
              effectiveBoxStyle === 'cinema' 
                ? 'bg-amber-400 text-slate-950 font-bold border border-amber-300' 
                : effectiveBoxStyle === 'card'
                ? 'bg-indigo-600 text-white font-medium border border-indigo-400/50'
                : 'bg-slate-900 text-white border border-slate-700/80'
            }`}
            style={{ letterSpacing: '0.02em' }}
          >
            <span className="text-[11px]">{roleIcon}</span>
            <span>{character.name}</span>
          </span>
        )}
        <MathText text={block.text} />
      </div>

      {/* Elegant Triangular Tail (for bubble & manga) */}
      {showTail && (
        <div 
          className="relative w-full flex" 
          style={{ paddingLeft: `calc(${tailPositionPercent} - 7px)` }}
        >
          {block.bubbleType !== 'thought' ? (
            <svg width="14" height="8" viewBox="0 0 14 8" className="-mt-[1px] relative z-10">
              <polygon points="0,0 7,8 14,0" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1.5" />
            </svg>
          ) : (
            <div className="flex flex-col items-center gap-0.5 -mt-1">
              <div className="w-2.5 h-2.5 bg-white border-2 border-slate-400 rounded-full"></div>
              <div className="w-1.5 h-1.5 bg-white border-2 border-slate-400 rounded-full"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
