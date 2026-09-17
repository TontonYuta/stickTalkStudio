import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, Bot, Globe, Zap, Check, AlertCircle, Film, Play, Clock, Ratio, RefreshCw, Layers, Sliders } from 'lucide-react';
import { useEditorStore } from '../store';
import { ProjectState } from '../types';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartExport?: () => void;
  initialMode?: 'create' | 'rerender';
}

export const AIModal: React.FC<AIModalProps> = ({ isOpen, onClose, onStartExport, initialMode = 'create' }) => {
  const { project: currentStoreProject, setCurrentTime, togglePlay } = useEditorStore();
  const [activeTab, setActiveTab] = useState<'create' | 'rerender'>(initialMode);
  
  // Creation state
  const [provider, setProvider] = useState<'antigravity' | 'gemini-playwright' | 'gemini-api' | 'fast'>('antigravity');
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState(15);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1' | '4:3'>('16:9');
  const [dialogueStyle, setDialogueStyle] = useState<'pedagogical' | 'witty' | 'dramatic' | 'storytelling' | 'conversational'>('pedagogical');
  const [dialogueBoxStyle, setDialogueBoxStyle] = useState<'bubble' | 'card' | 'cinema' | 'manga'>('bubble');
  
  // Refine / Rerender state
  const [refinePrompt, setRefinePrompt] = useState('');

  // Execution state
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [generatedProject, setGeneratedProject] = useState<ProjectState | null>(null);
  const [isExportingPlaywright, setIsExportingPlaywright] = useState(false);

  // Sync tab when initialMode changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialMode);
      setError(null);
      setGeneratedProject(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const quickPrompts = [
    { title: '🤖 Cách AI chatbot hoạt động', prompt: 'Cách AI chatbot hoạt động' },
    { title: '✈️ Tại sao máy bay bay được', prompt: 'Tại sao máy bay bay được' },
    { title: '💰 Lãi kép là gì', prompt: 'Bản chất sức mạnh của lãi kép' },
    { title: '📐 Đạo hàm là gì', prompt: 'Đạo hàm là gì và ý nghĩa tiếp tuyến đổi màu' },
    { title: '🍎 Định luật 3 Newton', prompt: 'Định luật 3 Newton và phản lực' },
    { title: '🎲 Nghịch lý Monty Hall', prompt: 'Nghịch lý chọn cửa Monty Hall' },
  ];

  const quickRefineTags = [
    { label: '👨‍🏫 Văn phong Sư phạm chuẩn chỉ', text: 'Viết lại toàn bộ lời thoại theo phong cách sư phạm chuẩn mực, khúc chiết, mạch lạc, có tính logic và chiều sâu khoa học cao.' },
    { label: '🎭 Văn phong Hài hước & bẻ lái', text: 'Viết lại lời thoại theo phong cách dí dỏm, đối đáp nhanh trí, châm biếm sâu sắc và có cú bẻ lái bất ngờ ở phút chót.' },
    { label: '⚡ Tranh biện sắc bén & kịch tính', text: 'Tăng tính tranh biện, câu từ đanh thép, lập luận logic và phản biện dồn dập.' },
    { label: '🎴 Đổi sang kiểu Thẻ Kính (Card)', text: 'Đổi kiểu hiển thị hộp thoại sang phong cách Thẻ Kính hiện đại (card).' },
    { label: '🎬 Đổi sang Phụ Đề Điện Ảnh (Cinema)', text: 'Đổi kiểu hiển thị hộp thoại sang phong cách Phụ Đề Điện Ảnh (cinema).' },
    { label: '🧍 Đứng yên đối thoại (Không đi lại)', text: 'Cho nhân vật đứng yên vững chãi tại vị trí đối thoại, không đi qua đi lại lăng xăng, chỉ cử động tay chân và biểu cảm tại chỗ.' },
    { label: '🧹 Dọn sạch emoji che đầu & bóng thoại', text: 'Dời toàn bộ đạo cụ emoji ra giữa sân khấu hoặc lệch hông, không để che vào bóng thoại hay mặt nhân vật.' },
    { label: '🌙 Đổi sang nền đen tối (Dark Mode)', text: 'Đổi phông nền sang màu tối bg-gray-900 để phong cách điện ảnh hơn.' },
  ];

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setIsLoading(true);
    setError(null);
    setCurrentStep('Gửi yêu cầu tới AI Director...');
    setGeneratedProject(null);

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          topic,
          duration,
          aspectRatio,
          dialogueStyle,
          dialogueBoxStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể tạo kịch bản.');
      }

      setGeneratedProject(data.project);
      setCurrentStep('Đã hoàn thành tạo kịch bản!');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi gọi AI API.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRerender = async () => {
    if (!refinePrompt.trim()) {
      setError('Vui lòng nhập nội dung hoặc chọn gợi ý cần sửa đổi.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentStep('AI đang phân tích và tinh chỉnh kịch bản theo yêu cầu...');
    setGeneratedProject(null);

    try {
      const res = await fetch('/api/ai/rerender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider,
          currentProject: currentStoreProject,
          modificationPrompt: refinePrompt,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể tinh chỉnh kịch bản.');
      }

      setGeneratedProject(data.project);
      setCurrentStep('Đã tinh chỉnh kịch bản thành công!');
    } catch (err: any) {
      setError(err.message || 'Lỗi khi rerender kịch bản.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyToCanvas = () => {
    if (generatedProject) {
      useEditorStore.setState({ project: generatedProject, currentTime: 0 });
      onClose();
      // Auto play preview
      setTimeout(() => {
        useEditorStore.setState({ isPlaying: true });
      }, 300);
    }
  };

  const handleAutoExportPlaywright = () => {
    if (generatedProject) {
      useEditorStore.setState({ project: generatedProject, currentTime: 0 });
    }
    onClose();
    if (onStartExport) {
      onStartExport();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/65 z-50 flex items-center justify-center backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
              {activeTab === 'create' ? <Sparkles size={20} /> : <RefreshCw size={20} />}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-800">
                {activeTab === 'create' ? 'Tạo Hoạt Hình Người Que Bằng AI' : 'Rerender & Sửa Đổi Video Thông Minh'}
              </h2>
              <p className="text-xs text-gray-500">
                {activeTab === 'create' 
                  ? 'Tự động hóa từ kịch bản, lời thoại, biểu cảm đến cử động tay chân' 
                  : 'Sửa code theo yêu cầu, bảo toàn phần đã ổn, không bắt nhân vật đi lại vô thức'}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-white rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex border-b border-gray-200 bg-gray-50/60 px-4 pt-2 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('create');
              setError(null);
              setGeneratedProject(null);
            }}
            className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'create'
                ? 'border-blue-600 text-blue-600 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <Wand2 size={14} />
            <span>Tạo Kịch Bản Mới</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('rerender');
              setError(null);
              setGeneratedProject(null);
            }}
            className={`pb-2.5 px-3.5 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-all ${
              activeTab === 'rerender'
                ? 'border-indigo-600 text-indigo-600 bg-white rounded-t-lg shadow-xs'
                : 'border-transparent text-gray-500 hover:text-gray-800'
            }`}
          >
            <RefreshCw size={14} />
            <span>Rerender / Sửa Video Này (AI Refine)</span>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-bold px-1.5 py-0.2 rounded-full ml-0.5">
              Mới
            </span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-5 custom-scrollbar">
          
          {/* AI Engine Selection */}
          <div>
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-2">
              Chọn AI Engine
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              
              <button
                type="button"
                onClick={() => setProvider('antigravity')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  provider === 'antigravity'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Bot size={18} className={provider === 'antigravity' ? 'text-blue-600' : 'text-gray-400'} />
                  {provider === 'antigravity' && <Check size={14} className="text-blue-600" />}
                </div>
                <div>
                  <span className="font-bold text-xs block">Antigravity</span>
                  <span className="text-[10px] text-gray-500 line-clamp-1">CLI siêu tốc</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini-playwright')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  provider === 'gemini-playwright'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Globe size={18} className={provider === 'gemini-playwright' ? 'text-blue-600' : 'text-gray-400'} />
                  {provider === 'gemini-playwright' && <Check size={14} className="text-blue-600" />}
                </div>
                <div>
                  <span className="font-bold text-xs block">Gemini Web</span>
                  <span className="text-[10px] text-gray-500 line-clamp-1">Playwright (No Key)</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('gemini-api')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  provider === 'gemini-api'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Zap size={18} className={provider === 'gemini-api' ? 'text-blue-600' : 'text-gray-400'} />
                  {provider === 'gemini-api' && <Check size={14} className="text-blue-600" />}
                </div>
                <div>
                  <span className="font-bold text-xs block">Gemini API</span>
                  <span className="text-[10px] text-gray-500 line-clamp-1">2.5 Flash SDK</span>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProvider('fast')}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  provider === 'fast'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 ring-2 ring-blue-500/20 shadow-sm'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Wand2 size={18} className={provider === 'fast' ? 'text-blue-600' : 'text-gray-400'} />
                  {provider === 'fast' && <Check size={14} className="text-blue-600" />}
                </div>
                <div>
                  <span className="font-bold text-xs block">Bộ Quy Chuẩn</span>
                  <span className="text-[10px] text-gray-500 line-clamp-1">Tức thì & Chuẩn xác</span>
                </div>
              </button>

            </div>
          </div>

          {/* TAB 1: CREATE NEW */}
          {activeTab === 'create' && (
            <div className="space-y-4">
              {/* Topic input */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                  <span>Nội dung / Khái niệm cần làm rõ</span>
                  <span className="text-[11px] font-semibold text-indigo-600 lowercase bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">mặc định: thầy vs trò</span>
                </label>
                <textarea
                  rows={2}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="VD: Cách AI chatbot hoạt động, Tại sao máy bay bay được, Đạo hàm là gì, Lãi kép hoạt động thế nào..."
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50/40"
                />
                
                {/* Quick prompt badges */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {quickPrompts.map((qp, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setTopic(qp.prompt)}
                      className="text-[11px] bg-gray-100 hover:bg-blue-50 hover:text-blue-700 text-gray-600 px-2.5 py-1 rounded-full border border-gray-200 transition-colors"
                    >
                      {qp.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings: Duration & Ratio */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                      <Clock size={14} /> Thời lượng: <span className="text-blue-600 font-semibold">{duration}s</span>
                    </label>
                    <span className="text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded font-medium">Không giới hạn</span>
                  </div>
                  <div className="grid grid-cols-5 gap-1.5 mb-2">
                    {[15, 30, 60, 90, 120].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDuration(d)}
                        className={`py-1.5 text-xs rounded-lg font-medium border transition-colors ${
                          duration === d
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {d}s
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="180"
                    step="5"
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <Ratio size={14} /> Tỉ lệ khung hình
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setAspectRatio('16:9')}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors ${
                        aspectRatio === '16:9'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>16:9 (Ngang/YouTube)</span>
                      {aspectRatio === '16:9' && <Check size={14} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAspectRatio('9:16')}
                      className={`py-2 px-3 rounded-xl border text-xs font-medium flex items-center justify-between transition-colors ${
                        aspectRatio === '9:16'
                          ? 'border-blue-600 bg-blue-50 text-blue-700 font-bold'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>9:16 (Dọc/TikTok/Reels)</span>
                      {aspectRatio === '9:16' && <Check size={14} />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dialogue Style & Box Style Controls */}
              <div className="pt-3 border-t border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <span>🎭</span> Phong Cách Hội Thoại
                  </label>
                  <div className="grid grid-cols-1 gap-1">
                    {[
                      { id: 'pedagogical', label: '👨‍🏫 Sư phạm & Học thuật', desc: 'Khúc chiết, logic, chuẩn mực giáo dục' },
                      { id: 'witty', label: '🎭 Hài hước & Châm biếm', desc: 'Dí dỏm, đối đáp sắc bén, bẻ lái bất ngờ' },
                      { id: 'dramatic', label: '⚡ Tranh biện & Kịch tính', desc: 'Đanh thép, phản biện quyết liệt, dồn dập' },
                      { id: 'storytelling', label: '📖 Truyền cảm hứng', desc: 'Ấm áp, sâu lắng, giàu hình ảnh triết lý' },
                      { id: 'conversational', label: '☕ Thân mật & Đời thường', desc: 'Tự nhiên, gần gũi, văn phong chân thực' }
                    ].map(st => (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setDialogueStyle(st.id as any)}
                        className={`py-1.5 px-2.5 rounded-lg border text-left transition-colors flex items-center justify-between ${
                          dialogueStyle === st.id
                            ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <span className="text-xs block">{st.label}</span>
                          <span className="text-[10px] text-gray-500 font-normal">{st.desc}</span>
                        </div>
                        {dialogueStyle === st.id && <Check size={14} className="text-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5 flex items-center gap-1.5">
                    <span>📦</span> Kiểu Hộp Thoại (Box Style)
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'bubble', label: '💬 Bong Bóng', desc: 'Có đuôi nhọn trỏ chuẩn xác' },
                      { id: 'card', label: '🎴 Thẻ Kính (Card)', desc: 'Glassmorphism sang trọng' },
                      { id: 'cinema', label: '🎬 Phụ Đề Điện Ảnh', desc: 'Thanh cinema tương phản cao' },
                      { id: 'manga', label: '🗯️ Truyện Tranh', desc: 'Viền mực đen đậm Comic' }
                    ].map(bs => (
                      <button
                        key={bs.id}
                        type="button"
                        onClick={() => setDialogueBoxStyle(bs.id as any)}
                        className={`p-2 rounded-xl border text-left transition-colors flex flex-col justify-between ${
                          dialogueBoxStyle === bs.id
                            ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                            : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">{bs.label}</span>
                          {dialogueBoxStyle === bs.id && <Check size={14} className="text-indigo-600" />}
                        </div>
                        <span className="text-[10px] text-gray-500 font-normal">{bs.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: RERENDER / AI REFINE */}
          {activeTab === 'rerender' && (
            <div className="space-y-4">
              {/* Current Project Summary Card */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Layers size={15} className="text-indigo-600" />
                    Kịch Bản Hiện Tại Trên Sân Khấu:
                  </span>
                  <span className="text-[11px] bg-white border border-slate-200 px-2 py-0.5 rounded-full text-slate-600 font-medium">
                    {currentStoreProject.aspectRatio || '16:9'} • {currentStoreProject.duration}s
                  </span>
                </div>
                <div className="text-slate-700 font-semibold">
                  "{currentStoreProject.title || 'Dự án Người Que Chưa Đặt Tên'}"
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
                  <span>👥 {currentStoreProject.characters.length} nhân vật</span>
                  <span>💬 {currentStoreProject.dialogBlocks.length} câu thoại</span>
                  <span>🎨 Đạo cụ: {currentStoreProject.props.length} đối tượng</span>
                </div>
              </div>

              {/* Refinement Prompt Input */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block mb-1.5 flex items-center justify-between">
                  <span>Yêu cầu sửa đổi kịch bản (AI sẽ giữ nguyên phần đã ổn):</span>
                  <span className="text-[10px] text-indigo-600 font-medium">Bảo toàn cấu trúc</span>
                </label>
                <textarea
                  rows={3}
                  value={refinePrompt}
                  onChange={(e) => setRefinePrompt(e.target.value)}
                  placeholder="VD: Cho 2 nhân vật đứng yên nói chuyện không đi qua đi lại; sửa câu thoại cuối hài hước hơn; dời emoji ra giữa sân khấu..."
                  className="w-full border border-indigo-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none bg-indigo-50/20"
                />
              </div>

              {/* Quick Refine Tags */}
              <div>
                <label className="text-[11px] font-bold text-gray-600 block mb-1.5">
                  Gợi ý yêu cầu tinh chỉnh nhanh:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {quickRefineTags.map((tag, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setRefinePrompt(tag.text)}
                      className="text-left text-[11px] bg-white hover:bg-indigo-50 hover:border-indigo-300 text-gray-700 p-2.5 rounded-xl border border-gray-200 transition-all group"
                    >
                      <div className="font-bold text-indigo-700 group-hover:text-indigo-900">{tag.label}</div>
                      <div className="text-gray-500 text-[10px] line-clamp-1 mt-0.5">{tag.text}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-fade-in">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {isLoading && (
            <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-xl flex items-center gap-3 animate-fade-in">
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin shrink-0"></div>
              <span className="text-xs text-blue-800 font-medium">{currentStep}</span>
            </div>
          )}

          {/* Generated/Refined Result Preview Box */}
          {generatedProject && (
            <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
                  <Check size={16} className="text-emerald-600" />
                  {activeTab === 'create' ? 'Kịch bản đã sẵn sàng!' : 'Đã tinh chỉnh kịch bản thành công!'}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {generatedProject.characters.length} nhân vật • {generatedProject.dialogBlocks.length} câu thoại
                </span>
              </div>
              <h4 className="text-sm font-bold text-gray-800">{generatedProject.title}</h4>
              <p className="text-xs text-gray-600">
                Nhân vật: {generatedProject.characters.map((c) => c.name || c.id).join(', ')}
              </p>
              
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleApplyToCanvas}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Play size={14} /> Áp dụng vào dự án & Xem ngay
                </button>
                <button
                  type="button"
                  disabled={isExportingPlaywright}
                  onClick={handleAutoExportPlaywright}
                  className="bg-gray-900 hover:bg-black disabled:opacity-50 text-white py-2 px-3 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Film size={14} /> Xuất Video Ngay (MP4)
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Đóng
          </button>
          
          {activeTab === 'create' ? (
            <button
              type="button"
              disabled={isLoading || !topic.trim()}
              onClick={handleGenerate}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-blue-500/20 flex items-center gap-1.5"
            >
              <Wand2 size={15} />
              {isLoading ? 'Đang tạo kịch bản...' : 'Tạo Kịch Bản Hoạt Hình'}
            </button>
          ) : (
            <button
              type="button"
              disabled={isLoading || !refinePrompt.trim()}
              onClick={handleRerender}
              className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md shadow-indigo-500/20 flex items-center gap-1.5"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              {isLoading ? 'Đang tinh chỉnh...' : 'Bắt Đầu Rerender & Sửa Code'}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
