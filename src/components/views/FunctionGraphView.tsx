import React, { useMemo } from 'react';
import { ChartConfig } from '../../types';
import katex from 'katex';

interface FunctionGraphViewProps {
  config?: ChartConfig;
  currentTime: number;
  width?: number;
  height?: number;
}

// Safely evaluates math expressions like "x^3 - 3*x", "sin(x)", "x^2 - 2"
function createMathEvaluator(fnStr: string): (x: number) => number {
  const sanitized = (fnStr || 'x^2')
    .replace(/\^/g, '**')
    .replace(/\bsin\b/g, 'Math.sin')
    .replace(/\bcos\b/g, 'Math.cos')
    .replace(/\btan\b/g, 'Math.tan')
    .replace(/\babs\b/g, 'Math.abs')
    .replace(/\bsqrt\b/g, 'Math.sqrt')
    .replace(/\bexp\b/g, 'Math.exp')
    .replace(/\bln\b/g, 'Math.log')
    .replace(/\blog\b/g, 'Math.log10')
    .replace(/\bpi\b/gi, 'Math.PI')
    .replace(/\be\b/g, 'Math.E');

  try {
    // eslint-disable-next-line no-new-func
    const evaluator = new Function('x', `"use strict"; return (${sanitized});`);
    evaluator(1); // test evaluation
    return (x: number) => {
      try {
        const val = evaluator(x);
        return isFinite(val) ? val : NaN;
      } catch {
        return NaN;
      }
    };
  } catch {
    return (x: number) => x * x; // fallback parabol
  }
}

export const FunctionGraphView: React.FC<FunctionGraphViewProps> = ({
  config,
  currentTime,
  width = 340,
  height = 240
}) => {
  const cfg = (config || {}) as ChartConfig;
  const {
    chartType = 'function',
    fn = 'x^3 - 3*x',
    xMin = -3,
    xMax = 3,
    yMin = -3.5,
    yMax = 3.5,
    showGrid = true,
    showAxis = true,
    showTangent = true,
    showExtrema = true,
    color = '#3b82f6',
    label,
    dynamicTrace = true,
    data = []
  } = cfg;

  const padding = 34;
  const plotW = width - padding * 2;
  const plotH = height - padding * 2;

  // Coordinate mapping functions
  const toSvgX = (x: number) => padding + ((x - xMin) / (xMax - xMin)) * plotW;
  const toSvgY = (y: number) => padding + ((yMax - y) / (yMax - yMin)) * plotH;

  const evalFn = useMemo(() => createMathEvaluator(fn), [fn]);

  // Generate curve path
  const { curvePath, samplePoints } = useMemo(() => {
    const points: Array<{ x: number; y: number; svgX: number; svgY: number }> = [];
    const steps = 140;
    const dx = (xMax - xMin) / steps;
    let path = '';

    for (let i = 0; i <= steps; i++) {
      const x = xMin + i * dx;
      const y = evalFn(x);
      if (!isNaN(y) && y >= yMin - 15 && y <= yMax + 15) {
        const sx = toSvgX(x);
        const sy = toSvgY(y);
        points.push({ x, y, svgX: sx, svgY: sy });
        if (path === '') {
          path += `M ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        } else {
          path += ` L ${sx.toFixed(1)} ${sy.toFixed(1)}`;
        }
      }
    }
    return { curvePath: path, samplePoints: points };
  }, [evalFn, xMin, xMax, yMin, yMax, plotW, plotH]);

  // Dynamic moving trace point & color-changing tangent line
  const traceInfo = useMemo(() => {
    if (!dynamicTrace || samplePoints.length === 0) return null;
    const cycleDuration = 4.5;
    const phase = ((currentTime % cycleDuration) / cycleDuration);
    const traceX = xMin + phase * (xMax - xMin);
    const traceY = evalFn(traceX);
    if (isNaN(traceY) || traceY < yMin || traceY > yMax) return null;

    const svgX = toSvgX(traceX);
    const svgY = toSvgY(traceY);

    // Compute numerical derivative f'(x)
    const h = 0.001;
    const yPlus = evalFn(traceX + h);
    const yMinus = evalFn(traceX - h);
    const slope = (yPlus - yMinus) / (2 * h);

    // Color based on slope:
    // Emerald green for increasing, Rose red for decreasing, Amber for extrema (slope ~ 0)
    let tangentColor = '#eab308'; // Amber (flat / extrema)
    let slopeText = 'f\'(x) = 0';
    if (slope > 0.08) {
      tangentColor = '#10b981'; // Emerald
      slopeText = 'f\'(x) > 0';
    } else if (slope < -0.08) {
      tangentColor = '#ef4444'; // Red
      slopeText = 'f\'(x) < 0';
    }

    // Tangent line segment
    const tDeltaX = (xMax - xMin) * 0.22;
    const tX1 = traceX - tDeltaX;
    const tY1 = traceY - slope * tDeltaX;
    const tX2 = traceX + tDeltaX;
    const tY2 = traceY + slope * tDeltaX;

    return {
      x: traceX,
      y: traceY,
      svgX,
      svgY,
      slope,
      tangentColor,
      slopeText,
      tX1: toSvgX(tX1),
      tY1: toSvgY(tY1),
      tX2: toSvgX(tX2),
      tY2: toSvgY(tY2)
    };
  }, [currentTime, dynamicTrace, evalFn, samplePoints, xMin, xMax, yMin, yMax]);

  // Detected extrema (Max/Min points)
  const extremaPoints = useMemo(() => {
    if (!showExtrema || samplePoints.length < 3) return [];
    const results: Array<{ x: number; y: number; svgX: number; svgY: number; type: 'max' | 'min' }> = [];
    for (let i = 1; i < samplePoints.length - 1; i++) {
      const prev = samplePoints[i - 1].y;
      const curr = samplePoints[i].y;
      const next = samplePoints[i + 1].y;
      if (curr > prev && curr > next && Math.abs(curr - prev) > 0.0001) {
        results.push({ ...samplePoints[i], type: 'max' });
      } else if (curr < prev && curr < next && Math.abs(curr - prev) > 0.0001) {
        results.push({ ...samplePoints[i], type: 'min' });
      }
    }
    return results;
  }, [samplePoints, showExtrema]);

  // If Bar Chart mode
  if (chartType === 'bar' && data.length > 0) {
    const maxVal = Math.max(...data.map(d => d.value), 1);
    return (
      <div 
        className="bg-slate-900/95 text-white p-3 rounded-2xl shadow-xl border border-slate-700/60 backdrop-blur-md"
        style={{ width: `${width}px`, minHeight: `${height}px` }}
      >
        <div className="text-xs font-bold text-slate-300 mb-2 border-b border-slate-700 pb-1 flex justify-between items-center">
          <span>{label || 'Biểu đồ Số liệu'}</span>
          <span className="text-[10px] text-blue-400 font-mono">Bar Chart</span>
        </div>
        <div className="flex items-end justify-around gap-2 h-[160px] pt-4 px-2">
          {data.map((item, idx) => {
            const barH = (item.value / maxVal) * 120;
            return (
              <div key={idx} className="flex flex-col items-center flex-1 h-full justify-end">
                <span className="text-[10px] font-mono text-cyan-300 font-bold mb-1">{item.value}</span>
                <div 
                  className="w-full rounded-t-md transition-all duration-300 shadow-md"
                  style={{ 
                    height: `${barH}px`, 
                    backgroundColor: item.color || '#3b82f6',
                    boxShadow: `0 0 12px ${item.color || '#3b82f6'}66`
                  }}
                />
                <span className="text-[10px] text-slate-400 mt-1 truncate max-w-[50px] text-center">{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const originSvgX = toSvgX(0);
  const originSvgY = toSvgY(0);

  // Render LaTeX label if available
  const renderedLabelHtml = useMemo(() => {
    const text = label || `f(x) = ${fn}`;
    try {
      return katex.renderToString(text, { throwOnError: false, displayMode: false });
    } catch {
      return text;
    }
  }, [label, fn]);

  return (
    <div 
      className="bg-slate-950/95 text-white rounded-2xl shadow-2xl border border-blue-500/30 backdrop-blur-md select-none overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px` }}
    >
      {/* Header Bar */}
      <div className="px-3 py-1.5 bg-slate-900/90 border-b border-slate-800 flex justify-between items-center text-xs">
        <div 
          className="font-bold text-blue-300 tracking-wide flex items-center gap-1.5"
          dangerouslySetInnerHTML={{ __html: renderedLabelHtml }}
        />
        {traceInfo && showTangent && (
          <span 
            className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs"
            style={{ backgroundColor: `${traceInfo.tangentColor}22`, color: traceInfo.tangentColor, border: `1px solid ${traceInfo.tangentColor}55` }}
          >
            {traceInfo.slopeText}
          </span>
        )}
      </div>

      {/* SVG Canvas */}
      <svg width={width} height={height - 28} className="w-full h-full">
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Grid lines */}
        {showGrid && (
          <g stroke="#334155" strokeWidth="0.7" strokeDasharray="3 3" opacity="0.45">
            {/* Vertical grid lines */}
            {Array.from({ length: Math.floor(xMax - xMin) + 1 }).map((_, i) => {
              const val = Math.ceil(xMin) + i;
              if (val === 0) return null;
              const sx = toSvgX(val);
              return <line key={`gx-${i}`} x1={sx} y1={padding} x2={sx} y2={height - padding} />;
            })}
            {/* Horizontal grid lines */}
            {Array.from({ length: Math.floor(yMax - yMin) + 1 }).map((_, i) => {
              const val = Math.ceil(yMin) + i;
              if (val === 0) return null;
              const sy = toSvgY(val);
              return <line key={`gy-${i}`} x1={padding} y1={sy} x2={width - padding} y2={sy} />;
            })}
          </g>
        )}

        {/* Axes */}
        {showAxis && (
          <g stroke="#94a3b8" strokeWidth="1.5">
            {/* Ox Axis */}
            {originSvgY >= padding && originSvgY <= height - padding && (
              <g>
                <line x1={padding - 6} y1={originSvgY} x2={width - padding + 8} y2={originSvgY} />
                {/* Arrowhead */}
                <polygon 
                  points={`${width - padding + 10},${originSvgY} ${width - padding + 4},${originSvgY - 3} ${width - padding + 4},${originSvgY + 3}`} 
                  fill="#94a3b8" 
                />
                <text x={width - padding + 4} y={originSvgY - 6} fill="#cbd5e1" fontSize="10" fontWeight="bold">x</text>
              </g>
            )}

            {/* Oy Axis */}
            {originSvgX >= padding && originSvgX <= width - padding && (
              <g>
                <line x1={originSvgX} y1={height - padding + 6} x2={originSvgX} y2={padding - 8} />
                {/* Arrowhead */}
                <polygon 
                  points={`${originSvgX},${padding - 10} ${originSvgX - 3},${padding - 4} ${originSvgX + 3},${padding - 4}`} 
                  fill="#94a3b8" 
                />
                <text x={originSvgX + 6} y={padding - 4} fill="#cbd5e1" fontSize="10" fontWeight="bold">y</text>
                <text x={originSvgX - 10} y={originSvgY + 12} fill="#94a3b8" fontSize="9" fontWeight="bold">O</text>
              </g>
            )}
          </g>
        )}

        {/* Function Curve */}
        {curvePath && (
          <g>
            {/* Subtle glow background for curve */}
            <path 
              d={curvePath} 
              fill="none" 
              stroke="#60a5fa" 
              strokeWidth="5" 
              opacity="0.25"
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
            {/* Crisp Main Curve */}
            <path 
              d={curvePath} 
              fill="none" 
              stroke="url(#curveGradient)" 
              strokeWidth="2.6" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          </g>
        )}

        {/* Extrema Points (Cực trị) */}
        {extremaPoints.map((pt, idx) => (
          <g key={`ext-${idx}`}>
            <circle 
              cx={pt.svgX} 
              cy={pt.svgY} 
              r="4.5" 
              fill={pt.type === 'max' ? '#f43f5e' : '#06b6d4'} 
              stroke="#ffffff" 
              strokeWidth="1.5" 
            />
            <text 
              x={pt.svgX + (pt.type === 'max' ? -12 : 6)} 
              y={pt.svgY + (pt.type === 'max' ? -7 : 12)} 
              fill={pt.type === 'max' ? '#fda4af' : '#67e8f9'} 
              fontSize="9" 
              fontWeight="bold"
            >
              {pt.type === 'max' ? 'CĐ' : 'CT'}
            </text>
          </g>
        ))}

        {/* Dynamic Trace Point & Tangent Line */}
        {traceInfo && (
          <g>
            {/* Orthogonal projection lines to axes */}
            <line 
              x1={traceInfo.svgX} 
              y1={traceInfo.svgY} 
              x2={traceInfo.svgX} 
              y2={originSvgY} 
              stroke="#64748b" 
              strokeWidth="1" 
              strokeDasharray="2 2" 
            />
            <line 
              x1={traceInfo.svgX} 
              y1={traceInfo.svgY} 
              x2={originSvgX} 
              y2={traceInfo.svgY} 
              stroke="#64748b" 
              strokeWidth="1" 
              strokeDasharray="2 2" 
            />

            {/* Tangent line */}
            {showTangent && (
              <line 
                x1={traceInfo.tX1} 
                y1={traceInfo.tY1} 
                x2={traceInfo.tX2} 
                y2={traceInfo.tY2} 
                stroke={traceInfo.tangentColor} 
                strokeWidth="2.2" 
                strokeLinecap="round"
                filter="url(#glow)"
              />
            )}

            {/* Trace Point P(x, y) */}
            <circle 
              cx={traceInfo.svgX} 
              cy={traceInfo.svgY} 
              r="5.5" 
              fill={traceInfo.tangentColor} 
              stroke="#ffffff" 
              strokeWidth="2" 
              filter="url(#glow)" 
            />

            {/* Realtime Coordinate Tag */}
            <g transform={`translate(${Math.min(width - 70, Math.max(10, traceInfo.svgX - 35))}, ${Math.max(20, traceInfo.svgY - 24)})`}>
              <rect width="68" height="18" rx="4" fill="#0f172a" fillOpacity="0.9" stroke="#475569" strokeWidth="0.8" />
              <text x="34" y="12" fill="#e2e8f0" fontSize="8.5" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                ({traceInfo.x.toFixed(1)}, {traceInfo.y.toFixed(1)})
              </text>
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
