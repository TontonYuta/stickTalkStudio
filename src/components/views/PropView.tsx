import React from 'react';
import { PropItem } from '../../types';
import { getAnimationStyles } from '../../utils/animation';
import { useEditorStore } from '../../store';
import { FunctionGraphView } from './FunctionGraphView';
import { TableView } from './TableView';
import { MathText } from '../common/MathText';
import katex from 'katex';

interface PropViewProps {
  prop: PropItem;
  isSelected: boolean;
  currentTime: number;
  onPointerDown: (e: React.PointerEvent) => void;
}

export const PropView: React.FC<PropViewProps> = ({ prop, isSelected, currentTime, onPointerDown }) => {
  const animStyles = getAnimationStyles(prop, currentTime);
  const isExporting = useEditorStore(s => s.isExporting);

  // Render Math Formula helper
  const renderMathContent = () => {
    const mathCfg = prop.mathConfig || {
      formula: prop.content || 'f(x) = x^2',
      displayMode: true,
      cardStyle: 'dark'
    };

    const formula = mathCfg.formula || prop.content || 'f(x) = x^2';
    const cardStyle = mathCfg.cardStyle || 'dark';

    let html = '';
    try {
      html = katex.renderToString(formula, {
        displayMode: mathCfg.displayMode !== false,
        throwOnError: false,
        output: 'htmlAndMathml'
      });
    } catch {
      html = `<span class="text-red-400 font-mono">${formula}</span>`;
    }

    let cardClass = 'bg-slate-950/95 text-cyan-200 border border-cyan-500/40 shadow-2xl rounded-2xl px-5 py-3.5 backdrop-blur-md';
    if (cardStyle === 'chalkboard') {
      cardClass = 'bg-emerald-950/95 text-emerald-100 border-2 border-emerald-600/60 shadow-2xl rounded-2xl px-6 py-4 font-serif backdrop-blur-md';
    } else if (cardStyle === 'glass') {
      cardClass = 'bg-white/90 text-gray-900 border border-slate-200/80 shadow-2xl rounded-2xl px-5 py-3.5 backdrop-blur-md';
    } else if (cardStyle === 'none') {
      cardClass = 'p-1 text-cyan-300 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]';
    }

    return (
      <div className={`${cardClass} select-none transition-all`}>
        {mathCfg.title && (
          <div className="text-[11px] font-bold text-slate-400 mb-1 tracking-wider uppercase border-b border-slate-700/60 pb-1 flex items-center gap-1.5">
            <span>📐</span> {mathCfg.title}
          </div>
        )}
        <div 
          className="text-base sm:text-xl font-medium tracking-wide flex items-center justify-center"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </div>
    );
  };

  return (
    <div
      className={`absolute cursor-grab active:cursor-grabbing ${isExporting ? '' : 'transition-transform duration-75'} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-transparent rounded-2xl z-30 bg-black/5' : 'hover:ring-2 hover:ring-gray-300 hover:rounded-2xl z-20'}`}
      style={{
        ...animStyles,
        left: `${prop.x}%`,
        top: `${prop.y}%`,
        transform: `${animStyles.transform} scale(${prop.scale}) rotate(${prop.rotation}deg)`,
        touchAction: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onPointerDown={onPointerDown}
    >
      {prop.type === 'emoji' && (
        <span 
          style={{ 
            fontSize: '52px', 
            lineHeight: 1, 
            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.22))' 
          }}
        >
          {prop.content}
        </span>
      )}

      {prop.type === 'text' && (
        <span 
          className="font-black text-2xl sm:text-3xl whitespace-nowrap tracking-wider select-none text-amber-300" 
          style={{ 
            textShadow: '2px 2px 0 #000, -1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 0 3px 6px rgba(0,0,0,0.4)',
            letterSpacing: '0.04em'
          }}
        >
          <MathText text={prop.content} />
        </span>
      )}

      {prop.type === 'image' && (
        <img 
          src={prop.content} 
          alt="Prop" 
          className="max-w-[130px] max-h-[130px] object-contain pointer-events-none drop-shadow-md" 
        />
      )}

      {prop.type === 'math' && renderMathContent()}

      {prop.type === 'chart' && (
        <FunctionGraphView config={prop.chartConfig} currentTime={currentTime} />
      )}

      {prop.type === 'table' && (
        <TableView config={prop.tableConfig} />
      )}
    </div>
  );
};
