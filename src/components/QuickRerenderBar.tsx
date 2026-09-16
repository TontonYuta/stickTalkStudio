import React, { useState } from 'react';
import { useEditorStore } from '../store';
import { RefreshCw, Sparkles, Check, AlertCircle, ArrowRight, SlidersHorizontal } from 'lucide-react';

interface QuickRerenderBarProps {
  onOpenFullModal: () => void;
}

export const QuickRerenderBar: React.FC<QuickRerenderBarProps> = ({ onOpenFullModal }) => {
  const project = useEditorStore(s => s.project);
  const setProject = useEditorStore(s => s.setProject);
  
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);
  const [engineMode, setEngineMode] = useState<'fast' | 'antigravity'>('fast');

  const quickChips = [
    { label: '🧍 Đứng yên đối thoại', text: 'Cho nhân vật đứng yên vững chãi tại chỗ, không di chuyển qua lại, chỉ cử động tay và biểu cảm.', isFast: true },
    { label: '🧹 Xóa sạch emoji cũ', text: 'Xóa sạch tất cả các đạo cụ và emoji cũ bị dính từ dự án trước để sân khấu hoàn toàn sạch sẽ.', isFast: true },
    { label: '⚡ Rút ngắn thoại (<10 từ)', text: 'Rút ngắn tất cả các câu thoại xuống chỉ còn 6-10 từ cực kỳ gãy gọn, bỏ toàn bộ từ đệm rườm rà.', isFast: true },
    { label: '🌙 Nền tối', text: 'Đổi nền sang màu tối bg-gray-900 chuyên nghiệp.', isFast: true },
    { label: '👨‍🏫 Sư phạm chuẩn chỉ', text: 'Viết lại kịch bản theo phong cách sư phạm chuẩn mực, khúc chiết, có phản ví dụ và bí kíp vàng.', isFast: false },
    { label: '🎭 Hài hước & Bẻ lái', text: 'Thêm chất hài hước dí dỏm, đối đáp cà khịa thông minh và cú bẻ lái bất ngờ ở câu cuối.', isFast: false }
  ];

  const handleExecuteRerender = async (textToRun?: string, forcedProvider?: 'fast' | 'antigravity') => {
    const text = (textToRun || prompt).trim();
    if (!text) return;

    const chosenProvider = forcedProvider || engineMode;
    setIsLoading(true);
    setIsError(false);
    setStatusMessage(chosenProvider === 'fast' ? '⚡ Đang áp dụng tức thì...' : '✨ AI đang phân tích & tinh chỉnh video...');

    try {
      const res = await fetch('/api/ai/rerender', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: chosenProvider,
          currentProject: project,
          modificationPrompt: text,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể tinh chỉnh video.');
      }

      setProject(data.project);
      setStatusMessage('✓ Đã cập nhật video thành công!');
      setPrompt('');

      // Auto play preview
      setTimeout(() => {
        useEditorStore.setState({ isPlaying: true });
        setTimeout(() => setStatusMessage(null), 3500);
      }, 300);
    } catch (err: any) {
      setIsError(true);
      setStatusMessage(err.message || 'Lỗi khi rerender.');
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-md border-t border-slate-200/80 px-3 py-2 shadow-xs shrink-0 z-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
        {/* Input Row */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-rose-500 text-white px-2 py-1 rounded-md shadow-xs shrink-0">
            <Sparkles size={13} className="animate-pulse" />
            <span className="hidden sm:inline">Rerender Nhanh</span>
          </div>

          <div className="flex-1 relative">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  e.preventDefault();
                  handleExecuteRerender();
                }
              }}
              disabled={isLoading}
              placeholder="Nhập yêu cầu AI sửa video (vd: đứng yên đối thoại, dọn sạch emoji cũ, rút ngắn thoại...)"
              className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/20 rounded-lg px-3 py-1 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-all disabled:opacity-50"
            />
          </div>

          <div className="flex items-center gap-0.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[11px] shrink-0">
            <button
              type="button"
              onClick={() => setEngineMode('fast')}
              className={`px-1.5 py-0.5 rounded-md transition-all ${
                engineMode === 'fast' ? 'bg-white text-slate-800 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Áp dụng tinh chỉnh tức thì trong 50ms"
            >
              ⚡ Nhanh
            </button>
            <button
              type="button"
              onClick={() => setEngineMode('antigravity')}
              className={`px-1.5 py-0.5 rounded-md transition-all ${
                engineMode === 'antigravity' ? 'bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-xs font-bold' : 'text-slate-500 hover:text-slate-700'
              }`}
              title="Dùng AI sâu Antigravity viết lại toàn diện"
            >
              ✨ AI Sâu
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleExecuteRerender()}
            disabled={isLoading || !prompt.trim()}
            className="bg-gradient-to-r from-amber-500 to-rose-600 hover:from-amber-600 hover:to-rose-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 active:scale-95"
          >
            {isLoading ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span className="hidden sm:inline">Đang xử lý...</span>
              </>
            ) : (
              <>
                <RefreshCw size={13} />
                <span>Rerender</span>
                <ArrowRight size={12} className="hidden sm:inline" />
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenFullModal}
            className="p-1 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors shrink-0"
            title="Mở toàn bộ tùy chọn Rerender nâng cao"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Quick Suggestion Chips Row */}
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
            <span className="text-[10px] text-slate-400 font-medium shrink-0 flex items-center gap-1">
              Gợi ý:
            </span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setPrompt(chip.text);
                  handleExecuteRerender(chip.text, chip.isFast ? 'fast' : 'antigravity');
                }}
                disabled={isLoading}
                className="bg-slate-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 border border-slate-200/70 text-slate-600 px-2 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 active:scale-95"
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div className={`text-[11px] font-medium px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1 ${
              isError 
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-fade-in'
            }`}>
              {isError ? <AlertCircle size={12} /> : <Check size={12} />}
              <span>{statusMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
