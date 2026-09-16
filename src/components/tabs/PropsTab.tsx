import React, { useRef, useState } from 'react';
import { useEditorStore } from '../../store';
import { Plus, Trash2, Upload, Type, Smile, Sigma, LineChart, Table2, Sparkles, Check, Play } from 'lucide-react';
import { PropItem } from '../../types';
import katex from 'katex';

export const PropsTab = () => {
  const { 
    project, 
    currentTime,
    addProp, 
    updateProp, 
    removeProp,
    selectedElementId,
    setSelectedElement
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedProp = project.props.find(p => p.id === selectedElementId);
  const [activeCategory, setActiveCategory] = useState<'math' | 'chart' | 'table' | 'basic'>('math');

  // Basic Text Input
  const [textInput, setTextInput] = useState('');

  // Math Formula Input State
  const [formulaInput, setFormulaInput] = useState('f(x) = x^3 - 3x + 1');
  const [mathTitle, setMathTitle] = useState('Khảo sát hàm số');
  const [mathCardStyle, setMathCardStyle] = useState<'dark' | 'glass' | 'chalkboard' | 'none'>('dark');

  // Chart Input State
  const [chartFn, setChartFn] = useState('x^3 - 3*x');
  const [chartLabel, setChartLabel] = useState('y = x^3 - 3x');
  const [showTangent, setShowTangent] = useState(true);
  const [showExtrema, setShowExtrema] = useState(true);
  const [showGrid, setShowGrid] = useState(true);

  // Table State
  const [tableType, setTableType] = useState<'variation' | 'data'>('variation');
  const [tableTitle, setTableTitle] = useState('Bảng biến thiên');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addProp('image', url);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddText = () => {
    if (textInput.trim()) {
      addProp('text', textInput);
      setTextInput('');
    }
  };

  // Math Presets
  const mathPresets = [
    { label: 'Bậc 3', formula: 'f(x) = x^3 - 3x + 1', title: 'Hàm số bậc ba' },
    { label: 'Đạo hàm', formula: 'y\' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1', title: 'Nghiệm đạo hàm' },
    { label: 'Tích phân', formula: '\\int_0^1 (3x^2 - 2x) dx = [x^3 - x^2]_0^1 = 0', title: 'Tích phân xác định' },
    { label: 'Giới hạn', formula: '\\lim_{x \\to 0} \\frac{\\sin x}{x} = 1', title: 'Giới hạn cơ bản' },
    { label: 'Pythagoras', formula: 'a^2 + b^2 = c^2', title: 'Định lý Pythagoras' },
    { label: 'Delta', formula: '\\Delta = b^2 - 4ac > 0', title: 'Biệt thức Delta' },
    { label: 'Newton 2', formula: '\\vec{F} = m \\cdot \\vec{a}', title: 'Định luật 2 Newton' },
    { label: 'Einstein', formula: 'E = m \\cdot c^2', title: 'Năng lượng tương đối tính' },
  ];

  // Chart Presets
  const chartPresets = [
    { label: 'Bậc 3 (2 cực trị)', fn: 'x^3 - 3*x', title: 'y = x^3 - 3x' },
    { label: 'Parabol', fn: 'x^2 - 2', title: 'y = x^2 - 2' },
    { label: 'Sóng Sin', fn: '2*sin(x)', title: 'y = 2\\sin(x)' },
    { label: 'Hàm mũ', fn: 'exp(x) - 2', title: 'y = e^x - 2' },
    { label: 'Bậc 4 trùng phương', fn: '-x^4 + 2*x^2', title: 'y = -x^4 + 2x^2' },
  ];

  const handleAddMathProp = (formula: string, title?: string, style?: 'dark' | 'glass' | 'chalkboard' | 'none') => {
    addProp('math', formula, {
      scale: 1.1,
      mathConfig: {
        formula,
        title: title || mathTitle,
        cardStyle: style || mathCardStyle,
        displayMode: true
      }
    });
  };

  const handleAddChartProp = (fn: string, labelText?: string) => {
    addProp('chart', fn, {
      scale: 1.1,
      chartConfig: {
        chartType: 'function',
        fn,
        label: labelText || fn,
        showTangent,
        showExtrema,
        showGrid,
        dynamicTrace: true,
        xMin: -3,
        xMax: 3,
        yMin: -3.5,
        yMax: 3.5
      }
    });
  };

  const handleAddBarChart = () => {
    addProp('chart', 'barchart', {
      scale: 1.1,
      chartConfig: {
        chartType: 'bar',
        label: 'Tốc độ tăng trưởng hàm số',
        data: [
          { label: 'x=1', value: 25, color: '#3b82f6' },
          { label: 'x=2', value: 65, color: '#10b981' },
          { label: 'x=3', value: 92, color: '#f59e0b' },
          { label: 'x=4', value: 140, color: '#ef4444' },
        ]
      }
    });
  };

  const handleAddVariationTable = () => {
    addProp('table', 'variation_table', {
      scale: 1.05,
      tableConfig: {
        tableType: 'variation',
        title: 'Bảng biến thiên hàm số y = x^3 - 3x + 1',
        variation: {
          xRow: ['-\\infty', '-1', '1', '+\\infty'],
          yPrimeRow: ['+', '0', '-', '0', '+'],
          yRow: [
            { val: '-\\infty', dir: 'up' },
            { val: '3', dir: 'down' },
            { val: '-1', dir: 'up' },
            { val: '+\\infty', dir: 'none' }
          ]
        }
      }
    });
  };

  const handleAddDataTable = () => {
    addProp('table', 'data_table', {
      scale: 1.05,
      tableConfig: {
        tableType: 'data',
        title: 'Bảng đạo hàm các hàm số sơ cấp',
        headers: ['Hàm số y = f(x)', 'Tập xác định', 'Đạo hàm y\''],
        rows: [
          ['x^n', '\\mathbb{R}', 'n \\cdot x^{n-1}'],
          ['\\sin(x)', '\\mathbb{R}', '\\cos(x)'],
          ['\\cos(x)', '\\mathbb{R}', '-\\sin(x)'],
          ['e^x', '\\mathbb{R}', 'e^x'],
          ['\\ln(x)', '(0; +\\infty)', '\\frac{1}{x}']
        ]
      }
    });
  };

  const commonEmojis = ['😀', '😂', '😍', '😎', '🤔', '💡', '🎓', '📚', '📐', '📏', '📊', '📈', '📉', '✨', '⚡', '💥', '🔥', '⚔️', '🛡️', '☕', '💻', '🍎'];

  return (
    <div className="flex flex-col h-full overflow-y-auto pr-1">
      {/* Category Tabs */}
      <div className="flex bg-gray-100 p-1 rounded-xl gap-1 mb-4 shrink-0 text-xs font-medium">
        <button
          onClick={() => setActiveCategory('math')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeCategory === 'math' ? 'bg-white shadow-xs text-indigo-700 font-bold' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Sigma size={14} className="text-indigo-600" />
          <span>Toán (LaTeX)</span>
        </button>
        <button
          onClick={() => setActiveCategory('chart')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeCategory === 'chart' ? 'bg-white shadow-xs text-blue-700 font-bold' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <LineChart size={14} className="text-blue-600" />
          <span>Đồ thị Oxy</span>
        </button>
        <button
          onClick={() => setActiveCategory('table')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeCategory === 'table' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Table2 size={14} className="text-emerald-600" />
          <span>Bảng biểu</span>
        </button>
        <button
          onClick={() => setActiveCategory('basic')}
          className={`flex-1 py-1.5 px-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
            activeCategory === 'basic' ? 'bg-white shadow-xs text-amber-700 font-bold' : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Smile size={14} className="text-amber-500" />
          <span>Emoji & Ảnh</span>
        </button>
      </div>

      {/* CATEGORY 1: MATH FORMULAS */}
      {activeCategory === 'math' && (
        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Công thức Mẫu (Click để thêm ngay)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {mathPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddMathProp(preset.formula, preset.title)}
                  className="text-left p-2 rounded-lg border border-slate-200 bg-white hover:border-indigo-400 hover:bg-indigo-50/50 transition-all text-xs group"
                >
                  <div className="font-bold text-[11px] text-indigo-700 group-hover:text-indigo-800 flex items-center justify-between">
                    <span>{preset.label}</span>
                    <Plus size={12} />
                  </div>
                  <div className="text-[10px] text-gray-500 truncate font-mono mt-0.5">{preset.formula}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Math Formula */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <label className="text-xs font-bold text-gray-700 block mb-1">Tự nhập mã công thức LaTeX</label>
            <input
              type="text"
              value={formulaInput}
              onChange={(e) => setFormulaInput(e.target.value)}
              placeholder="Nhập mã LaTeX, vd: \int_a^b f(x)dx = F(b) - F(a)"
              className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white font-mono mb-2"
            />
            
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-[10px] text-gray-500 block mb-0.5">Tiêu đề thẻ</label>
                <input
                  type="text"
                  value={mathTitle}
                  onChange={(e) => setMathTitle(e.target.value)}
                  placeholder="Tiêu đề..."
                  className="w-full border border-gray-300 rounded p-1 text-xs bg-white"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 block mb-0.5">Phong cách thẻ</label>
                <select
                  value={mathCardStyle}
                  onChange={(e) => setMathCardStyle(e.target.value as any)}
                  className="w-full border border-gray-300 rounded p-1 text-xs bg-white"
                >
                  <option value="dark">Không gian Tối (Dark Cyan)</option>
                  <option value="chalkboard">Bảng Phấn Đen (Chalkboard)</option>
                  <option value="glass">Kính Mờ (Glass White)</option>
                  <option value="none">Trong suốt (Không nền)</option>
                </select>
              </div>
            </div>

            {/* Live Preview */}
            <div className="bg-slate-900 text-cyan-300 p-2.5 rounded-lg mb-2 text-center overflow-x-auto min-h-[44px] flex items-center justify-center">
              <div 
                dangerouslySetInnerHTML={{
                  __html: (() => {
                    try {
                      return katex.renderToString(formulaInput || 'f(x) = x^2', { displayMode: true, throwOnError: false });
                    } catch {
                      return formulaInput;
                    }
                  })()
                }}
              />
            </div>

            <button
              onClick={() => handleAddMathProp(formulaInput, mathTitle, mathCardStyle)}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
            >
              <Plus size={14} /> Thêm Công Thức Vào Video
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY 2: FUNCTION GRAPH & OXY */}
      {activeCategory === 'chart' && (
        <div className="flex flex-col gap-3 mb-5">
          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">Mẫu Đồ Thị Có Sẵn (Click thêm ngay)</label>
            <div className="grid grid-cols-2 gap-1.5">
              {chartPresets.map((preset, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddChartProp(preset.fn, preset.title)}
                  className="text-left p-2 rounded-lg border border-slate-200 bg-white hover:border-blue-400 hover:bg-blue-50/50 transition-all text-xs group"
                >
                  <div className="font-bold text-[11px] text-blue-700 group-hover:text-blue-800 flex items-center justify-between">
                    <span>{preset.label}</span>
                    <Plus size={12} />
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{preset.fn}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Chart */}
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <label className="text-xs font-bold text-gray-700 block mb-1">Tùy biến Hàm số Đồ thị Oxy</label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <label className="text-[10px] text-gray-500 block mb-0.5">Biểu thức f(x)</label>
                <input
                  type="text"
                  value={chartFn}
                  onChange={(e) => setChartFn(e.target.value)}
                  placeholder="vd: x^3 - 3*x"
                  className="w-full border border-gray-300 rounded p-1 text-xs bg-white font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 block mb-0.5">Nhãn hiển thị</label>
                <input
                  type="text"
                  value={chartLabel}
                  onChange={(e) => setChartLabel(e.target.value)}
                  placeholder="vd: y = x^3 - 3x"
                  className="w-full border border-gray-300 rounded p-1 text-xs bg-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mb-3 text-xs text-gray-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showTangent}
                  onChange={(e) => setShowTangent(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-[11px]">Tiếp tuyến đổi màu</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showExtrema}
                  onChange={(e) => setShowExtrema(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-[11px]">Bắt điểm Cực trị (CĐ/CT)</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showGrid}
                  onChange={(e) => setShowGrid(e.target.checked)}
                  className="rounded text-blue-600"
                />
                <span className="text-[11px]">Lưới tọa độ</span>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleAddChartProp(chartFn, chartLabel)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Thêm Đồ Thị Oxy
              </button>
              <button
                onClick={handleAddBarChart}
                className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              >
                <Plus size={14} /> Thêm Biểu Đồ Cột
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 3: TABLES & VARIATION */}
      {activeCategory === 'table' && (
        <div className="flex flex-col gap-3 mb-5">
          <label className="text-xs font-bold text-gray-700 block">Chọn Mẫu Bảng Biểu Chuẩn Toán Học</label>
          <div className="grid grid-cols-1 gap-2">
            <div className="border border-emerald-200 bg-emerald-50/40 p-3 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-emerald-800 flex items-center gap-1.5">
                  <span>📊</span> Bảng biến thiên 3 tầng (Hàm bậc ba)
                </div>
                <div className="text-[11px] text-emerald-600 mt-0.5">
                  Đầy đủ tầng x, tầng dấu y' (+, 0, -) và tầng mũi tên biến thiên y (↗, ↘).
                </div>
              </div>
              <button
                onClick={handleAddVariationTable}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1"
              >
                <Plus size={14} /> Thêm
              </button>
            </div>

            <div className="border border-indigo-200 bg-indigo-50/40 p-3 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-xs text-indigo-800 flex items-center gap-1.5">
                  <span>📋</span> Bảng số liệu & Đạo hàm các hàm số
                </div>
                <div className="text-[11px] text-indigo-600 mt-0.5">
                  Bảng kẻ 3 cột khoa học, hỗ trợ công thức toán học KaTeX trong từng ô.
                </div>
              </div>
              <button
                onClick={handleAddDataTable}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center gap-1"
              >
                <Plus size={14} /> Thêm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CATEGORY 4: EMOJI, TEXT & IMAGES */}
      {activeCategory === 'basic' && (
        <div className="flex flex-col gap-3 mb-5">
          {/* Emojis */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Emoji / Biểu cảm / Đạo cụ</label>
            <div className="flex flex-wrap gap-2">
              {commonEmojis.map(emoji => (
                <button 
                  key={emoji}
                  onClick={() => addProp('emoji', emoji)}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Text */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Văn bản / Hiệu ứng chữ</label>
            <div className="flex gap-2 mb-2">
              <input 
                type="text" 
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Nhập chữ..."
                className="flex-1 border border-gray-300 rounded p-1.5 text-xs"
                onKeyDown={(e) => e.key === 'Enter' && handleAddText()}
              />
              <button 
                onClick={handleAddText}
                className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded text-xs font-medium hover:bg-blue-200"
              >
                Thêm
              </button>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <button onClick={() => addProp('text', 'BÙM!')} className="text-[10px] px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-bold border border-red-300">BÙM!</button>
              <button onClick={() => addProp('text', 'CHÍUU!')} className="text-[10px] px-2 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 font-bold border border-yellow-300">CHÍUU!</button>
              <button onClick={() => addProp('text', 'KAMEHAMEHA!')} className="text-[10px] px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-bold border border-blue-300">KAMEHAMEHA!</button>
              <button onClick={() => addProp('text', 'QUÁ ĐỈNH!')} className="text-[10px] px-2 py-1 bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 font-bold border border-emerald-300">QUÁ ĐỈNH!</button>
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="text-xs text-gray-500 block mb-1">Tải ảnh từ thiết bị</label>
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-3 text-sm text-gray-600 hover:bg-gray-50 hover:border-orange-400 hover:text-orange-600 transition-colors"
            >
              <Upload size={16} />
              <span>Tải ảnh từ máy tính</span>
            </button>
          </div>
        </div>
      )}

      {/* SELECTED PROP EDITING PANEL */}
      {selectedProp ? (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div className="flex justify-between items-center mb-3 border-b pb-2">
            <h4 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              Chỉnh sửa Đạo cụ
              {selectedProp.type === 'emoji' && <Smile size={14} className="text-amber-500" />}
              {selectedProp.type === 'image' && <Upload size={14} />}
              {selectedProp.type === 'text' && <Type size={14} />}
              {selectedProp.type === 'math' && <Sigma size={14} className="text-indigo-600" />}
              {selectedProp.type === 'chart' && <LineChart size={14} className="text-blue-600" />}
              {selectedProp.type === 'table' && <Table2 size={14} className="text-emerald-600" />}
            </h4>
            <button 
              onClick={() => setSelectedElement(null)}
              className="text-xs text-gray-500 hover:text-gray-800"
            >
              Đóng
            </button>
          </div>

          {/* Specific Editor for MATH Prop */}
          {selectedProp.type === 'math' && (
            <div className="mb-3 bg-indigo-50/50 p-2.5 rounded-lg border border-indigo-200 text-xs">
              <label className="font-bold text-indigo-900 block mb-1">Mã LaTeX công thức</label>
              <input
                type="text"
                value={selectedProp.mathConfig?.formula || selectedProp.content}
                onChange={(e) => {
                  const val = e.target.value;
                  updateProp(selectedProp.id, {
                    content: val,
                    mathConfig: { ...selectedProp.mathConfig, formula: val }
                  });
                }}
                className="w-full border border-gray-300 rounded p-1 font-mono text-xs bg-white mb-2"
              />
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-600 block mb-0.5">Tiêu đề</label>
                  <input
                    type="text"
                    value={selectedProp.mathConfig?.title || ''}
                    onChange={(e) => updateProp(selectedProp.id, {
                      mathConfig: { ...selectedProp.mathConfig!, title: e.target.value }
                    })}
                    className="w-full border border-gray-300 rounded p-1 text-xs bg-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-0.5">Phong cách</label>
                  <select
                    value={selectedProp.mathConfig?.cardStyle || 'dark'}
                    onChange={(e) => updateProp(selectedProp.id, {
                      mathConfig: { ...selectedProp.mathConfig!, cardStyle: e.target.value as any }
                    })}
                    className="w-full border border-gray-300 rounded p-1 text-xs bg-white"
                  >
                    <option value="dark">Tối (Dark Cyan)</option>
                    <option value="chalkboard">Bảng Phấn (Chalkboard)</option>
                    <option value="glass">Kính Mờ (Glass)</option>
                    <option value="none">Trong suốt</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Specific Editor for CHART Prop */}
          {selectedProp.type === 'chart' && (
            <div className="mb-3 bg-blue-50/50 p-2.5 rounded-lg border border-blue-200 text-xs">
              <label className="font-bold text-blue-900 block mb-1">Biểu thức f(x)</label>
              <input
                type="text"
                value={selectedProp.chartConfig?.fn || selectedProp.content}
                onChange={(e) => {
                  const val = e.target.value;
                  updateProp(selectedProp.id, {
                    content: val,
                    chartConfig: { ...selectedProp.chartConfig, fn: val }
                  });
                }}
                className="w-full border border-gray-300 rounded p-1 font-mono text-xs bg-white mb-2"
              />
              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProp.chartConfig?.showTangent !== false}
                    onChange={(e) => updateProp(selectedProp.id, {
                      chartConfig: { ...selectedProp.chartConfig, showTangent: e.target.checked }
                    })}
                  />
                  <span className="text-[10px]">Tiếp tuyến đổi màu</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedProp.chartConfig?.showExtrema !== false}
                    onChange={(e) => updateProp(selectedProp.id, {
                      chartConfig: { ...selectedProp.chartConfig, showExtrema: e.target.checked }
                    })}
                  />
                  <span className="text-[10px]">Điểm cực trị</span>
                </label>
              </div>
            </div>
          )}
          
          <h4 className="text-xs font-semibold text-gray-700 mb-2 mt-2">Thời gian xuất hiện</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Bắt đầu (s)</label>
              <input 
                type="number" min="0" max={project.duration} step="0.5" 
                value={selectedProp.startTime ?? 0} 
                onChange={(e) => updateProp(selectedProp.id, { startTime: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Thời lượng (s)</label>
              <input 
                type="number" min="0.5" max={project.duration} step="0.5" 
                value={selectedProp.duration ?? project.duration} 
                onChange={(e) => updateProp(selectedProp.id, { duration: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              />
            </div>
          </div>

          <h4 className="text-xs font-semibold text-gray-700 mb-2 mt-2">Vị trí & Kích thước</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[10px] text-gray-600 block mb-1">Trục X (%)</label>
              <input 
                type="range" min="-50" max="150" 
                value={selectedProp.x} 
                onChange={(e) => updateProp(selectedProp.id, { x: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 block mb-1">Trục Y (%)</label>
              <input 
                type="range" min="-50" max="150" 
                value={selectedProp.y} 
                onChange={(e) => updateProp(selectedProp.id, { y: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 block mb-1">Kích thước</label>
              <input 
                type="range" min="0.1" max="5" step="0.05" 
                value={selectedProp.scale} 
                onChange={(e) => updateProp(selectedProp.id, { scale: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 block mb-1">Xoay (độ)</label>
              <input 
                type="range" min="-180" max="180" step="1" 
                value={selectedProp.rotation ?? 0} 
                onChange={(e) => updateProp(selectedProp.id, { rotation: Number(e.target.value) })}
                className="w-full"
              />
            </div>
          </div>

          {/* Keyframes */}
          <div className="mt-4 border-t pt-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Chuyển động (Keyframes)</h4>
            <div className="flex items-center justify-between bg-yellow-50 p-2 rounded border border-yellow-200">
              <span className="text-[10px] text-yellow-800">Lưu vị trí tại: <b>{currentTime.toFixed(1)}s</b></span>
              <button 
                onClick={() => {
                  const newKf = {
                    id: Math.random().toString(36).substr(2, 9),
                    time: currentTime,
                    x: selectedProp.x,
                    y: selectedProp.y,
                    scale: selectedProp.scale,
                    rotation: selectedProp.rotation
                  };
                  const existingKfs = selectedProp.keyframes || [];
                  const kfsWithoutCurrentTime = existingKfs.filter(kf => Math.abs(kf.time - currentTime) > 0.01);
                  updateProp(selectedProp.id, { keyframes: [...kfsWithoutCurrentTime, newKf].sort((a,b) => a.time - b.time) });
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-[10px] font-bold"
              >
                + Đặt Keyframe
              </button>
            </div>
            {selectedProp.keyframes && selectedProp.keyframes.length > 0 && (
              <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
                {selectedProp.keyframes.map(kf => (
                  <div key={kf.id} className="flex items-center bg-gray-100 rounded px-2 py-1 text-[10px] shrink-0 border border-gray-200">
                    <span>{kf.time.toFixed(1)}s</span>
                    <button 
                      onClick={() => {
                        updateProp(selectedProp.id, { keyframes: selectedProp.keyframes?.filter(k => k.id !== kf.id) });
                      }}
                      className="ml-1 text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Animations In/Out */}
          <div className="mt-4 border-t pt-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Hiệu ứng vào/ra (Animations)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-600 block mb-1">Lúc xuất hiện (In)</label>
                <select 
                  className="w-full border border-gray-300 rounded p-1 text-[10px] bg-white"
                  value={selectedProp.animation?.in || ''}
                  onChange={(e) => updateProp(selectedProp.id, { animation: { ...selectedProp.animation, in: e.target.value as any || undefined }})}
                >
                  <option value="">Không có</option>
                  <option value="fadeIn">Mờ dần (Fade In)</option>
                  <option value="slideInLeft">Trượt từ trái</option>
                  <option value="slideInRight">Trượt từ phải</option>
                  <option value="slideInTop">Trượt từ trên</option>
                  <option value="slideInBottom">Trượt từ dưới</option>
                  <option value="zoomIn">Phóng to (Zoom In)</option>
                  <option value="bounceIn">Nảy lên (Bounce In)</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] text-gray-600 block mb-1">Lúc biến mất (Out)</label>
                <select 
                  className="w-full border border-gray-300 rounded p-1 text-[10px] bg-white"
                  value={selectedProp.animation?.out || ''}
                  onChange={(e) => updateProp(selectedProp.id, { animation: { ...selectedProp.animation, out: e.target.value as any || undefined }})}
                >
                  <option value="">Không có</option>
                  <option value="fadeOut">Mờ dần (Fade Out)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4 border-t pt-3">
            <button 
              onClick={() => removeProp(selectedProp.id)}
              className="w-full bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1"
            >
              <Trash2 size={14} /> Xóa đạo cụ
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-6 border-t pt-4">
          <h3 className="font-semibold mb-3 text-sm text-gray-700">Danh sách Đạo cụ Trên Sân Khấu</h3>
          {project.props.length === 0 ? (
            <div className="text-xs text-gray-400 text-center py-4 bg-gray-50 rounded border border-dashed border-gray-200">
              Chưa có đạo cụ nào
            </div>
          ) : (
            <div className="flex flex-col gap-2 max-h-48 overflow-y-auto pr-1">
              {project.props.map((prop, index) => (
                <button
                  key={prop.id}
                  onClick={() => setSelectedElement(prop.id)}
                  className="flex items-center justify-between p-2 rounded-lg border border-gray-200 hover:border-blue-500 hover:bg-blue-50 bg-white text-left transition-all"
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-xs font-bold text-gray-800">
                      {index + 1}. {prop.type === 'math' ? 'Công thức' : prop.type === 'chart' ? 'Đồ thị' : prop.type === 'table' ? 'Bảng' : prop.type.toUpperCase()}
                    </span>
                    <span className="text-[11px] text-gray-500 truncate font-mono">
                      {prop.type === 'math' ? prop.mathConfig?.formula : prop.type === 'chart' ? prop.chartConfig?.fn : prop.content}
                    </span>
                  </div>
                  <div className="shrink-0 text-sm">
                    {prop.type === 'emoji' && prop.content}
                    {prop.type === 'text' && <Type size={14} className="text-amber-500" />}
                    {prop.type === 'image' && <Upload size={14} />}
                    {prop.type === 'math' && <Sigma size={14} className="text-indigo-600" />}
                    {prop.type === 'chart' && <LineChart size={14} className="text-blue-600" />}
                    {prop.type === 'table' && <Table2 size={14} className="text-emerald-600" />}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
