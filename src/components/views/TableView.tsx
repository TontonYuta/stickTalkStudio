import React from 'react';
import { TableConfig } from '../../types';
import katex from 'katex';

interface TableViewProps {
  config?: TableConfig;
  width?: number;
}

function renderMathOrText(content: string, isBlock: boolean = false): string {
  if (!content) return '';
  try {
    return katex.renderToString(content, { throwOnError: false, displayMode: isBlock });
  } catch {
    return content;
  }
}

export const TableView: React.FC<TableViewProps> = ({
  config,
  width = 380
}) => {
  const cfg = (config || {}) as TableConfig;
  const {
    tableType = 'variation',
    title = 'Bảng Biến Thiên',
    headers = ['Hàm số', 'Tập xác định', 'Đạo hàm'],
    rows = [
      ['y = x^2', '\\mathbb{R}', 'y\' = 2x'],
      ['y = \\frac{1}{x}', '\\mathbb{R} \\setminus \\{0\\}', 'y\' = -\\frac{1}{x^2}']
    ],
    variation = {
      xRow: ['-\\infty', '-1', '1', '+\\infty'],
      yPrimeRow: ['+', '0', '-', '0', '+'],
      yRow: [
        { val: '-\\infty', dir: 'up' },
        { val: '2', dir: 'down' },
        { val: '-2', dir: 'up' },
        { val: '+\\infty', dir: 'none' }
      ]
    }
  } = cfg;

  // Bảng biến thiên 3 tầng chuẩn Toán THPT
  if (tableType === 'variation') {
    return (
      <div 
        className="bg-slate-950/95 text-white rounded-2xl shadow-2xl border border-emerald-500/30 backdrop-blur-md overflow-hidden select-none"
        style={{ width: `${width}px` }}
      >
        {/* Title */}
        <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center text-xs">
          <span className="font-bold text-emerald-400 flex items-center gap-1.5">
            📊 {title}
          </span>
          <span className="text-[10px] text-slate-400 font-mono">3-Tier Variation</span>
        </div>

        <div className="p-3">
          <div className="border border-slate-700 rounded-xl overflow-hidden bg-slate-900/50">
            {/* Row 1: x */}
            <div className="flex border-b border-slate-700 items-center text-xs">
              <div className="w-14 shrink-0 py-2 text-center font-bold text-slate-300 border-r border-slate-700 bg-slate-800/40">
                <span dangerouslySetInnerHTML={{ __html: renderMathOrText('x') }} />
              </div>
              <div className="flex-1 flex justify-between px-3 py-1.5 font-mono text-cyan-300">
                {variation.xRow.map((val, i) => (
                  <span key={`x-${i}`} dangerouslySetInnerHTML={{ __html: renderMathOrText(val) }} />
                ))}
              </div>
            </div>

            {/* Row 2: y' */}
            <div className="flex border-b border-slate-700 items-center text-xs">
              <div className="w-14 shrink-0 py-2 text-center font-bold text-slate-300 border-r border-slate-700 bg-slate-800/40">
                <span dangerouslySetInnerHTML={{ __html: renderMathOrText('y\'') }} />
              </div>
              <div className="flex-1 flex justify-around px-2 py-1.5 font-bold">
                {variation.yPrimeRow.map((sign, i) => {
                  let color = 'text-slate-400';
                  if (sign === '+') color = 'text-emerald-400 text-sm';
                  else if (sign === '-') color = 'text-rose-400 text-sm';
                  else if (sign === '0') color = 'text-amber-400';
                  return (
                    <span key={`yp-${i}`} className={color}>
                      {sign}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Row 3: y with visual variation arrows */}
            <div className="flex items-center min-h-[64px]">
              <div className="w-14 shrink-0 py-4 text-center font-bold text-slate-300 border-r border-slate-700 bg-slate-800/40 self-stretch flex items-center justify-center">
                <span dangerouslySetInnerHTML={{ __html: renderMathOrText('y') }} />
              </div>
              <div className="flex-1 flex justify-between items-center px-3 py-2 text-xs">
                {variation.yRow.map((item, i) => {
                  const isUp = item.dir === 'up';
                  const isDown = item.dir === 'down';
                  return (
                    <div key={`y-${i}`} className="flex items-center gap-1.5">
                      <div className="flex flex-col items-center">
                        {isDown && <span className="text-[10px] text-amber-300 font-bold">CĐ</span>}
                        <span 
                          className="font-bold text-white" 
                          dangerouslySetInnerHTML={{ __html: renderMathOrText(item.val) }} 
                        />
                        {isUp && <span className="text-[10px] text-cyan-300 font-bold">CT</span>}
                      </div>
                      {isUp && (
                        <span className="text-emerald-400 font-bold text-lg animate-pulse">↗</span>
                      )}
                      {isDown && (
                        <span className="text-rose-400 font-bold text-lg animate-pulse">↘</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bảng dữ liệu / so sánh khoa học
  return (
    <div 
      className="bg-slate-950/95 text-white rounded-2xl shadow-2xl border border-indigo-500/30 backdrop-blur-md overflow-hidden select-none"
      style={{ width: `${width}px` }}
    >
      <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center text-xs">
        <span className="font-bold text-indigo-300 flex items-center gap-1.5">
          📋 {title}
        </span>
        <span className="text-[10px] text-slate-400 font-mono">Table</span>
      </div>

      <div className="p-2.5 overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-700 bg-slate-900/80 text-cyan-300">
              {headers.map((h, idx) => (
                <th key={idx} className="p-2 font-bold whitespace-nowrap">
                  <span dangerouslySetInnerHTML={{ __html: renderMathOrText(h) }} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rIdx) => (
              <tr 
                key={rIdx} 
                className={`border-b border-slate-800/80 ${rIdx % 2 === 0 ? 'bg-slate-900/20' : 'bg-slate-900/40'} hover:bg-slate-800/40`}
              >
                {row.map((cell, cIdx) => (
                  <td key={cIdx} className="p-2 text-slate-200">
                    <span dangerouslySetInnerHTML={{ __html: renderMathOrText(cell) }} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
