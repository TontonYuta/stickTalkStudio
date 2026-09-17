import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../store';
import { Sparkles, Wand2, Clock, Check, AlertCircle, ArrowRight, SlidersHorizontal, Settings2, ChevronDown, ChevronUp, GraduationCap } from 'lucide-react';
import { AspectRatio } from '../types';
import { capstone15WeeksTemplate } from '../templates/capstone15Weeks';

interface QuickCreateBarProps {
  onOpenFullModal: () => void;
}

export const QuickCreateBar: React.FC<QuickCreateBarProps> = ({ onOpenFullModal }) => {
  const project = useEditorStore(s => s.project);
  const setProject = useEditorStore(s => s.setProject);
  const setStoreDuration = useEditorStore(s => s.setDuration);
  const setStoreAspect = useEditorStore(s => s.setAspect);

  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState<number>(project.duration || 15);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>(project.aspectRatio || '16:9');
  const [engineMode, setEngineMode] = useState<'fast' | 'antigravity'>('fast');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Sync with project duration when project changes
  useEffect(() => {
    if (project.duration && project.duration > 0) {
      setDuration(project.duration);
    }
  }, [project.duration]);

  // Sync with project aspect ratio
  useEffect(() => {
    if (project.aspectRatio) {
      setAspectRatio(project.aspectRatio);
    }
  }, [project.aspectRatio]);

  const durationPresets = [10, 15, 20, 30, 60];

  const quickTopicChips = [
    { label: '🤖 Cách AI chatbot hoạt động', topic: 'Cách AI chatbot hoạt động', defaultSec: 15 },
    { label: '✈️ Tại sao máy bay bay được', topic: 'Tại sao máy bay bay được', defaultSec: 15 },
    { label: '💰 Lãi kép là gì', topic: 'Bản chất sức mạnh của lãi kép', defaultSec: 15 },
    { label: '📐 Đạo hàm là gì', topic: 'Đạo hàm là gì và ý nghĩa tiếp tuyến đổi màu', defaultSec: 15 },
    { label: '🍎 Định luật 3 Newton', topic: 'Định luật 3 Newton và phản lực', defaultSec: 15 },
    { label: '🎲 Nghịch lý Monty Hall', topic: 'Nghịch lý chọn cửa Monty Hall', defaultSec: 20 },
  ];

  const handleCreateVideo = async (topicToRun?: string, customDuration?: number) => {
    const chosenTopic = (topicToRun || topic).trim();
    if (!chosenTopic) return;

    const chosenDuration = customDuration || duration;
    setIsLoading(true);
    setIsError(false);
    setStatusMessage(engineMode === 'fast' ? '⚡ Đang tạo kịch bản tức thì...' : '✨ Antigravity đang sáng tạo kịch bản...');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          provider: engineMode,
          topic: chosenTopic,
          duration: chosenDuration,
          aspectRatio,
          dialogueStyle: 'pedagogical',
          dialogueBoxStyle: 'bubble',
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể tạo kịch bản video.');
      }

      setProject(data.project);
      setStatusMessage(`✓ Đã tạo video mới thành công (${chosenDuration}s)!`);
      setTopic('');

      // Auto play preview from start
      setTimeout(() => {
        useEditorStore.setState({ currentTime: 0, isPlaying: true });
        setTimeout(() => setStatusMessage(null), 3500);
      }, 300);
    } catch (err: any) {
      setIsError(true);
      setStatusMessage(err.message || 'Lỗi khi tạo video.');
      setTimeout(() => setStatusMessage(null), 4000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyDurationToCurrent = (sec: number) => {
    const validSec = Math.max(3, Math.min(300, sec));
    setDuration(validSec);
    setStoreDuration(validSec);
    setIsError(false);
    setStatusMessage(`✓ Đã cập nhật thời lượng video này: ${validSec}s`);
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleLoadCapstoneTemplate = () => {
    setProject(capstone15WeeksTemplate);
    setDuration(capstone15WeeksTemplate.duration || 60);
    setStoreDuration(capstone15WeeksTemplate.duration || 60);
    setIsError(false);
    setStatusMessage('✓ Đã nạp thành công mẫu Đồ án 15 tuần! Đang phát preview...');
    setTimeout(() => {
      useEditorStore.setState({ currentTime: 0, isPlaying: true });
      setTimeout(() => setStatusMessage(null), 4000);
    }, 200);
  };

  return (
    <div className="bg-slate-50/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 shadow-xs shrink-0 z-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-1.5">
        {/* Main Controls Row - One-Box Concept Clarification */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {/* Badge: Thầy vs Trò */}
          <div className="flex items-center gap-1.5 text-xs font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-2.5 py-1.5 rounded-lg shadow-xs shrink-0">
            <GraduationCap size={15} className="text-amber-300" />
            <span className="hidden sm:inline">Thầy vs Trò</span>
            <span className="sm:hidden">Thầy-Trò</span>
          </div>

          {/* Core Concept Input */}
          <div className="flex-1 min-w-[220px] relative">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !isLoading) {
                  e.preventDefault();
                  handleCreateVideo();
                }
              }}
              disabled={isLoading}
              placeholder="Nhập nội dung cần làm rõ (VD: Cách AI chatbot hoạt động, Tại sao máy bay bay được, Đạo hàm là gì...)"
              className="w-full bg-white hover:bg-white/90 focus:bg-white border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 outline-none transition-all disabled:opacity-50 shadow-xs"
            />
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => handleCreateVideo()}
            disabled={isLoading || !topic.trim()}
            className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed shrink-0 active:scale-95 cursor-pointer"
          >
            {isLoading ? (
              <>
                <Wand2 size={13} className="animate-spin" />
                <span>Đang làm rõ...</span>
              </>
            ) : (
              <>
                <Sparkles size={13} className="text-amber-300" />
                <span>Làm Rõ Ngay</span>
                <ArrowRight size={12} className="hidden sm:inline" />
              </>
            )}
          </button>

          {/* Toggle Advanced Settings */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer shrink-0 ${
              showAdvanced 
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-xs' 
                : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
            title="Tùy biến bổ sung (Thời lượng, Tỉ lệ, AI Engine)"
          >
            <Settings2 size={13} className={showAdvanced ? 'text-indigo-600' : 'text-slate-500'} />
            <span className="hidden md:inline">Tùy biến</span>
            {showAdvanced ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>

          {/* Full Modal Trigger */}
          <button
            type="button"
            onClick={onOpenFullModal}
            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-200/60 rounded-lg transition-colors shrink-0 cursor-pointer"
            title="Mở bảng thiết kế kịch bản đầy đủ (Nâng cao)"
          >
            <SlidersHorizontal size={16} />
          </button>
        </div>

        {/* Collapsible Advanced Settings Strip (Only visible when user toggles 'Tùy biến') */}
        {showAdvanced && (
          <div className="flex items-center gap-2.5 flex-wrap bg-white border border-indigo-100 rounded-lg p-2 text-xs animate-fade-in shadow-2xs">
            {/* Duration Adjuster & Presets */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-md">
              <Clock size={13} className="text-indigo-600 shrink-0" />
              <span className="text-[11px] font-semibold text-slate-600">Thời lượng:</span>
              
              <button
                type="button"
                onClick={() => setDuration(Math.max(5, duration - 5))}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 font-bold active:scale-95"
              >
                -
              </button>
              <div className="flex items-center">
                <input
                  type="number"
                  min={3}
                  max={300}
                  value={duration}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val)) setDuration(val);
                  }}
                  className="w-10 text-center font-bold text-indigo-700 bg-transparent outline-none text-xs"
                />
                <span className="text-[11px] font-medium text-slate-500">s</span>
              </div>
              <button
                type="button"
                onClick={() => setDuration(Math.min(300, duration + 5))}
                className="w-5 h-5 flex items-center justify-center rounded hover:bg-slate-200 text-slate-600 font-bold active:scale-95"
              >
                +
              </button>

              <div className="flex items-center gap-0.5 border-l border-slate-200 pl-1.5 ml-1">
                {durationPresets.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setDuration(p)}
                    className={`px-1.5 py-0.5 text-[10px] rounded transition-colors ${
                      duration === p 
                        ? 'bg-indigo-600 text-white font-bold' 
                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-200'
                    }`}
                  >
                    {p}s
                  </button>
                ))}
              </div>

              {project.duration !== duration && (
                <button
                  type="button"
                  onClick={() => handleApplyDurationToCurrent(duration)}
                  className="ml-1.5 bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-800 text-[10px] font-semibold px-2 py-0.5 rounded transition-colors cursor-pointer"
                >
                  Đổi video này
                </button>
              )}
            </div>

            {/* Aspect Ratio Selector */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-md text-[11px]">
              <span className="text-[11px] font-semibold text-slate-600 px-1">Khung hình:</span>
              <button
                type="button"
                onClick={() => {
                  setAspectRatio('16:9');
                  setStoreAspect('16:9');
                }}
                className={`px-2 py-0.5 rounded transition-all ${
                  aspectRatio === '16:9' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                16:9 Ngang
              </button>
              <button
                type="button"
                onClick={() => {
                  setAspectRatio('9:16');
                  setStoreAspect('9:16');
                }}
                className={`px-2 py-0.5 rounded transition-all ${
                  aspectRatio === '9:16' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                9:16 Dọc
              </button>
            </div>

            {/* Engine Mode */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1 rounded-md text-[11px]">
              <span className="text-[11px] font-semibold text-slate-600 px-1">Chế độ:</span>
              <button
                type="button"
                onClick={() => setEngineMode('fast')}
                className={`px-2 py-0.5 rounded transition-all ${
                  engineMode === 'fast' ? 'bg-indigo-600 text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                ⚡ Nhanh (200ms)
              </button>
              <button
                type="button"
                onClick={() => setEngineMode('antigravity')}
                className={`px-2 py-0.5 rounded transition-all ${
                  engineMode === 'antigravity' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold shadow-xs' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                ✨ AI Sâu
              </button>
            </div>
          </div>
        )}

        {/* Quick Topics & Status Row */}
        <div className="flex items-center justify-between gap-2 overflow-hidden">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
            <span className="text-[10px] text-slate-500 font-semibold shrink-0 flex items-center gap-1">
              Gợi ý:
            </span>
            {quickTopicChips.map((chip, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setTopic(chip.topic);
                  setDuration(chip.defaultSec);
                  handleCreateVideo(chip.topic, chip.defaultSec);
                }}
                disabled={isLoading}
                className="bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 border border-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors cursor-pointer shrink-0 active:scale-95 shadow-2xs"
              >
                {chip.label}
              </button>
            ))}
            {/* 1-Click 15-Week Capstone Template Button */}
            <button
              type="button"
              onClick={handleLoadCapstoneTemplate}
              className="bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 font-semibold px-2 py-0.5 rounded-full whitespace-nowrap transition-all cursor-pointer shrink-0 active:scale-95 text-[11px]"
              title="Nhấp để tải kịch bản Đồ án mẫu 15 tuần (60s)"
            >
              <span>🎓 Mẫu 15 Tuần</span>
            </button>
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
