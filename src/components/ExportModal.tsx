import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Film, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Play, 
  Video, 
  Check, 
  Clock, 
  Zap, 
  Layers, 
  MonitorPlay,
  FileVideo,
  Music,
  Volume2
} from 'lucide-react';
import { useEditorStore } from '../store';
import { useExportVideo } from '../hooks/useExportVideo';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenRerender?: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, onOpenRerender }) => {
  const project = useEditorStore(s => s.project);
  const { handleExportVideo: handleBrowserExport, isExporting: isBrowserExporting, isConverting: isBrowserConverting, exportProgress: browserProgress } = useExportVideo();

  const [activeTab, setActiveTab] = useState<'smart' | 'browser'>('smart');
  const [resolution, setResolution] = useState<'1080p' | '720p'>('1080p');
  const [fps, setFps] = useState<60 | 30>(60);
  const [bgmTrack, setBgmTrack] = useState<'lofi' | 'pedagogy' | 'upbeat' | 'dramatic' | 'none'>('lofi');
  const [bgmVolume, setBgmVolume] = useState<number>(0.35);
  
  // Job status
  const [status, setStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [jobId, setJobId] = useState<string | null>(null);
  const [result, setResult] = useState<{ filePath?: string; downloadUrl?: string; fileName?: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  
  const pollingRef = useRef<any>(null);

  // Stop polling on unmount
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  if (!isOpen) return null;

  const startSmartExport = async () => {
    setStatus('exporting');
    setProgress(5);
    setStatusMessage('Đang khởi tạo tác vụ xuất video thông minh...');
    setErrorMessage('');
    setResult(null);

    try {
      const res = await fetch('/api/export-video/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project,
          resolution,
          fps,
          bgmTrack,
          bgmVolume
        })
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Không thể khởi động tác vụ xuất video.');
      }

      setJobId(data.jobId);

      // Start polling status
      pollingRef.current = setInterval(async () => {
        try {
          const pollRes = await fetch(`/api/export-video/status/${data.jobId}`);
          if (!pollRes.ok) return;
          const pollData = await pollRes.json();
          if (pollData.success && pollData.job) {
            const j = pollData.job;
            setProgress(j.progress || 0);
            setStatusMessage(j.message || 'Đang xử lý...');

            if (j.status === 'completed') {
              clearInterval(pollingRef.current);
              setStatus('success');
              setResult(j.result);

              // Auto download to client
              if (j.result?.downloadUrl) {
                const a = document.createElement('a');
                a.href = j.result.downloadUrl;
                a.download = j.result.fileName || 'sticktalk_video.mp4';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              }
            } else if (j.status === 'failed') {
              clearInterval(pollingRef.current);
              setStatus('error');
              setErrorMessage(j.error || 'Quá trình xuất video thất bại.');
            }
          }
        } catch (err: any) {
          console.error('Error polling status:', err);
        }
      }, 700);

    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Lỗi khi kết nối tới máy chủ render.');
    }
  };

  const handleManualDownload = () => {
    if (result?.downloadUrl) {
      const a = document.createElement('a');
      a.href = result.downloadUrl;
      a.download = result.fileName || 'sticktalk_video.mp4';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden border border-gray-100 animate-scale-in flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-slate-900 to-indigo-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-400/30">
              <Film size={20} />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                Xuất Video StickTalk Studio
                <span className="text-[10px] bg-blue-500/30 text-blue-300 font-mono px-2 py-0.5 rounded-full border border-blue-400/20">
                  v2.0 Pro
                </span>
              </h2>
              <p className="text-xs text-slate-400">Playwright Automated Background Recorder & FFmpeg MP4</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (pollingRef.current) clearInterval(pollingRef.current);
              onClose();
            }}
            className="p-1.5 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selection */}
        {status === 'idle' && (
          <div className="flex border-b border-gray-100 bg-gray-50/70 p-1.5 gap-1.5 px-6">
            <button
              onClick={() => setActiveTab('smart')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'smart'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-200/80'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <Zap size={14} className="text-amber-500 fill-amber-500" />
              <span>⚡ Xuất Tự Động Thông Minh</span>
              <span className="text-[9px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-bold ml-1">Khuyên dùng</span>
            </button>
            <button
              onClick={() => setActiveTab('browser')}
              className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'browser'
                  ? 'bg-white text-blue-600 shadow-sm border border-gray-200/80'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              <MonitorPlay size={14} className="text-gray-500" />
              <span>Quay Thẻ Trình Duyệt</span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* Smart Export Tab */}
          {activeTab === 'smart' && status === 'idle' && (
            <div className="space-y-4">
              {/* Project Card */}
              <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex items-center justify-between">
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-bold text-gray-800 truncate mb-1">
                    {project.title || "Kịch bản hoạt hình người que"}
                  </h4>
                  <div className="flex items-center gap-2 text-[11px] text-gray-500 flex-wrap">
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                      <Layers size={11} /> {project.aspectRatio}
                    </span>
                    <span className="inline-flex items-center gap-1 font-mono font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      <Clock size={11} /> {project.duration}s
                    </span>
                    <span>{project.characters.length} Nhân vật</span>
                    <span>•</span>
                    <span>{project.dialogBlocks.length} Bóng thoại</span>
                  </div>
                </div>
              </div>

              {/* Quality & Resolution Settings */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Độ phân giải video xuất:</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setResolution('1080p')}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      resolution === '1080p'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-gray-900">Full HD (1080p)</span>
                      {resolution === '1080p' && <Check size={16} className="text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {project.aspectRatio === '9:16' ? '1080 × 1920 (TikTok/Shorts)' : '1920 × 1080 (YouTube/FB)'}
                    </p>
                    <span className="text-[10px] text-blue-700 bg-blue-100 font-semibold px-1.5 py-0.2 rounded mt-1.5 inline-block">
                      Siêu nét chuẩn Studio
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setResolution('720p')}
                    className={`p-3 rounded-xl border text-left transition-all relative ${
                      resolution === '720p'
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-sm'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-gray-900">HD (720p)</span>
                      {resolution === '720p' && <Check size={16} className="text-blue-600" />}
                    </div>
                    <p className="text-[11px] text-gray-500">
                      {project.aspectRatio === '9:16' ? '720 × 1280 (Shorts)' : '1280 × 720 (HD)'}
                    </p>
                    <span className="text-[10px] text-gray-600 bg-gray-100 font-semibold px-1.5 py-0.2 rounded mt-1.5 inline-block">
                      Xuất siêu nhanh
                    </span>
                  </button>
                </div>
              </div>

              {/* Framerate Selection */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Tốc độ khung hình (FPS):</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFps(60)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                      fps === 60
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>60 FPS (Mượt mà đỉnh cao)</span>
                    {fps === 60 && <Check size={14} className="text-blue-600" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFps(30)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-between transition-all ${
                      fps === 30
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span>30 FPS (Tiêu chuẩn phổ thông)</span>
                    {fps === 30 && <Check size={14} className="text-blue-600" />}
                  </button>
                </div>
              </div>

              {/* Background Music (BGM) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                    <Music size={14} className="text-blue-600" />
                    <span>Nhạc nền video (BGM):</span>
                  </label>
                  {bgmTrack !== 'none' && (
                    <span className="text-[11px] font-mono text-blue-600 font-semibold">
                      Âm lượng: {Math.round(bgmVolume * 100)}%
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2 mb-2">
                  <button
                    type="button"
                    onClick={() => setBgmTrack('lofi')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      bgmTrack === 'lofi'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-900 flex items-center justify-between">
                      <span>Lo-Fi Chill</span>
                      {bgmTrack === 'lofi' && <Check size={13} className="text-blue-600" />}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Thư thái, ấm áp (Gợi ý)</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBgmTrack('pedagogy')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      bgmTrack === 'pedagogy'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-900 flex items-center justify-between">
                      <span>Sư phạm</span>
                      {bgmTrack === 'pedagogy' && <Check size={13} className="text-blue-600" />}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Giảng dạy, truyền cảm</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBgmTrack('upbeat')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      bgmTrack === 'upbeat'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-900 flex items-center justify-between">
                      <span>Vui tươi</span>
                      {bgmTrack === 'upbeat' && <Check size={13} className="text-blue-600" />}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Năng động, cuốn hút</p>
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setBgmTrack('dramatic')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      bgmTrack === 'dramatic'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-900 flex items-center justify-between">
                      <span>Kịch tính</span>
                      {bgmTrack === 'dramatic' && <Check size={13} className="text-blue-600" />}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Tạo bất ngờ, kịch tích</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBgmTrack('none')}
                    className={`p-2.5 rounded-lg border text-left transition-all ${
                      bgmTrack === 'none'
                        ? 'border-blue-600 bg-blue-50/70 ring-2 ring-blue-500/20 shadow-xs'
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-900 flex items-center justify-between">
                      <span>Không nhạc nền</span>
                      {bgmTrack === 'none' && <Check size={13} className="text-blue-600" />}
                    </div>
                    <p className="text-[10px] text-gray-500 mt-0.5">Chỉ giọng đọc / yên lặng</p>
                  </button>
                </div>

                {bgmTrack !== 'none' && (
                  <div className="mt-2.5 p-2.5 bg-gray-50 border border-gray-200 rounded-lg flex items-center gap-3">
                    <Volume2 size={15} className="text-gray-500 shrink-0" />
                    <input
                      type="range"
                      min="0.05"
                      max="1.0"
                      step="0.05"
                      value={bgmVolume}
                      onChange={(e) => setBgmVolume(parseFloat(e.target.value))}
                      className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-gray-700 w-10 text-right">
                      {Math.round(bgmVolume * 100)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Automation highlights */}
              <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/60 rounded-xl p-3.5 text-xs text-blue-900 space-y-1.5">
                <div className="font-bold flex items-center gap-1.5 text-blue-800">
                  <Sparkles size={14} className="text-blue-600" />
                  Ưu điểm của Trình Xuất Video Thông Minh:
                </div>
                <div className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Tự động 100% (Zero-Touch):</strong> Chạy ngầm trong Playwright, không cần mở hộp thoại chia sẻ màn hình.</span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Không giới hạn thời gian:</strong> Hỗ trợ video dài từ 5 giây tới 600+ giây không lo gián đoạn.</span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Tự động tối ưu tỉ lệ:</strong> Nhân vật, đạo cụ, phụ đề được căn chỉnh kích thước vàng chuẩn xác.</span>
                </div>
                <div className="flex items-start gap-1.5 text-slate-700 text-[11px]">
                  <CheckCircle2 size={13} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Tự lưu trữ:</strong> Lưu thẳng vào thư mục <code className="bg-blue-100/80 px-1 py-0.5 rounded font-mono text-[10px]">~/Videos/StickTalk/</code> và tự động tải về trình duyệt.</span>
                </div>
              </div>

              {/* Start button */}
              <button
                type="button"
                onClick={startSmartExport}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm"
              >
                <Zap size={16} className="fill-white" />
                <span>Bắt Đầu Xuất Video MP4 ({resolution})</span>
              </button>
            </div>
          )}

          {/* Exporting Progress Screen */}
          {status === 'exporting' && (
            <div className="py-6 flex flex-col items-center text-center space-y-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/25 animate-pulse">
                  <Film size={28} className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 p-1 bg-white rounded-full shadow-sm">
                  <RefreshCw size={14} className="text-blue-600 animate-spin" />
                </div>
              </div>

              <div>
                <h3 className="text-base font-bold text-gray-900 mb-1">Đang Xuất Video Hoạt Hình Người Que</h3>
                <p className="text-xs text-blue-600 font-medium">{statusMessage || 'Đang tiến hành dựng hình...'}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-gray-500">Tiến trình</span>
                  <span className="font-bold text-blue-600">{progress}%</span>
                </div>
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden p-0.5 border border-gray-200">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
                  />
                </div>
              </div>

              {/* Pipeline Steps */}
              <div className="w-full grid grid-cols-4 gap-1.5 pt-2 text-[10px]">
                <div className={`p-2 rounded-lg border text-center ${progress >= 10 ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  1. Khởi động
                </div>
                <div className={`p-2 rounded-lg border text-center ${progress >= 40 ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  2. Ghi hình {project.duration}s
                </div>
                <div className={`p-2 rounded-lg border text-center ${progress >= 85 ? 'bg-blue-50 border-blue-300 text-blue-700 font-bold' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  3. FFmpeg MP4
                </div>
                <div className={`p-2 rounded-lg border text-center ${progress >= 100 ? 'bg-emerald-50 border-emerald-300 text-emerald-700 font-bold' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                  4. Hoàn tất
                </div>
              </div>

              <p className="text-[11px] text-gray-400">Quá trình diễn ra ngầm hoàn toàn. Bạn có thể để ứng dụng tự chạy.</p>
            </div>
          )}

          {/* Success Screen */}
          {status === 'success' && result && (
            <div className="py-2 space-y-4">
              <div className="text-center">
                <div className="inline-flex p-2.5 bg-emerald-100 text-emerald-600 rounded-2xl mb-2">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-base font-bold text-gray-900">Xuất Video MP4 Thành Công!</h3>
                <p className="text-xs text-gray-500 mt-0.5">Tệp video chuẩn H.264 sẵn sàng để chia sẻ lên TikTok, YouTube, Reels.</p>
              </div>

              {/* Video Preview Player */}
              {result.downloadUrl && (
                <div className="rounded-xl overflow-hidden shadow-md bg-black border border-gray-800">
                  <video 
                    src={result.downloadUrl} 
                    controls 
                    autoPlay 
                    className="w-full max-h-[260px] object-contain mx-auto"
                  />
                </div>
              )}

              {/* File Info */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-1">
                <div className="flex items-center gap-2 text-gray-700">
                  <FileVideo size={14} className="text-blue-600 shrink-0" />
                  <span className="font-semibold truncate">{result.fileName}</span>
                </div>
                <div className="text-[11px] text-gray-500 font-mono break-all pl-5">
                  Đường dẫn: {result.filePath}
                </div>
              </div>

              {/* Rerender with AI Refine Box */}
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200/80 rounded-xl p-3.5 flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles size={14} className="text-indigo-600" />
                    Chưa ưng ý? Rerender & Sửa Code Bằng AI
                  </h4>
                  <p className="text-[11px] text-indigo-700/80 mt-0.5">
                    Yêu cầu AI cho đứng yên tại chỗ, đổi câu thoại cuối, hoặc dời emoji đè chữ — bảo toàn phần đã ổn.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    onClose();
                    onOpenRerender?.();
                  }}
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shrink-0 shadow-sm transition-all"
                >
                  <RefreshCw size={13} />
                  <span>Sửa & Rerender</span>
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={handleManualDownload}
                  className="flex-1 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <Download size={14} />
                  <span>Tải Lại Tệp Video MP4</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStatus('idle');
                    onClose();
                  }}
                  className="py-2.5 px-5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Đóng
                </button>
              </div>
            </div>
          )}

          {/* Error Screen */}
          {status === 'error' && (
            <div className="py-6 text-center space-y-4">
              <div className="inline-flex p-3 bg-red-100 text-red-600 rounded-2xl">
                <AlertCircle size={32} />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">Không Thể Xuất Video</h3>
                <p className="text-xs text-red-600 mt-1 max-w-md mx-auto">{errorMessage}</p>
              </div>
              <div className="flex justify-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStatus('idle')}
                  className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <RefreshCw size={14} /> Thử lại
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('browser')}
                  className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl text-xs transition-colors"
                >
                  Dùng Quay Thẻ Trình Duyệt
                </button>
              </div>
            </div>
          )}

          {/* Fallback Browser Recording Tab */}
          {activeTab === 'browser' && status === 'idle' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3.5 text-xs text-amber-900">
                <div className="font-bold flex items-center gap-1.5 mb-1 text-amber-800">
                  <MonitorPlay size={15} />
                  Chế độ quay thủ công từ màn hình trình duyệt:
                </div>
                <ol className="list-decimal pl-4 space-y-1 text-[11px] text-amber-800/90">
                  <li>Nhấn nút <strong>"Bắt đầu quay thẻ trình duyệt"</strong> bên dưới.</li>
                  <li>Tại popup chia sẻ, chọn tab <strong>"StickTalk Studio"</strong> và tích chọn <strong>"Chia sẻ âm thanh"</strong>.</li>
                  <li>Video sẽ tự động ghi hình theo thời gian thực và tải về máy khi kết thúc.</li>
                </ol>
              </div>

              <button
                type="button"
                onClick={() => {
                  onClose();
                  handleBrowserExport();
                }}
                disabled={isBrowserExporting || isBrowserConverting}
                className="w-full py-3 px-4 rounded-xl font-bold text-white bg-gray-800 hover:bg-gray-900 shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
              >
                <Video size={16} />
                <span>{isBrowserExporting ? 'Đang quay màn hình...' : isBrowserConverting ? `Đang nén MP4 (${browserProgress}%)...` : 'Bắt Đầu Quay Thẻ Trình Duyệt'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
