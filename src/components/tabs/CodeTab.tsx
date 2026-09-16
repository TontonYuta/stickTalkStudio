import React, { useState, useEffect } from 'react';
import { useEditorStore } from '../../store';
import { Check, AlertTriangle, FileJson, BookOpen } from 'lucide-react';
import { defaultTemplate } from '../../defaultTemplate';

export const CodeTab = () => {
  const { project, currentTime } = useEditorStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showGuide, setShowGuide] = useState(false);

  useEffect(() => {
    setCode(JSON.stringify(project, null, 2));
  }, [project]);

  const handleApply = () => {
    try {
      const parsed = JSON.parse(code);
      useEditorStore.setState({ project: parsed });
      setError(null);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err: any) {
      setError('Lỗi JSON: ' + err.message);
      setSuccess(false);
    }
  };

  const handleLoadTemplate = () => {
    const template = defaultTemplate;
    setCode(JSON.stringify(template, null, 2));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="mb-4 flex justify-between items-start gap-2">
        <div>
          <h3 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
            <FileJson size={16} /> Code Editor (JSON)
          </h3>
          <p className="text-[11px] text-gray-500 mt-1 leading-relaxed">
            Bạn có thể tự viết hoặc dán mã JSON vào đây để tạo toàn bộ video (bao gồm nhân vật, hiệu ứng, hội thoại, keyframe) thay vì dùng giao diện kéo thả.
          </p>
        </div>
        <div className="flex flex-col gap-2 shrink-0">
          <button
            onClick={() => setShowGuide(!showGuide)}
            className={`px-3 py-1.5 rounded text-xs font-medium border flex items-center justify-center gap-1.5 ${showGuide ? 'bg-indigo-50 border-indigo-200 text-indigo-700' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
          >
            <BookOpen size={14} /> AI Cheat Sheet
          </button>
          <button
            onClick={handleLoadTemplate}
            className="px-3 py-1.5 rounded text-xs font-medium border bg-white border-gray-300 text-gray-700 hover:bg-gray-50 flex items-center justify-center"
          >
            Tải mẫu Kịch bản
          </button>
        </div>
      </div>

      {showGuide && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-xs text-indigo-900 overflow-y-auto max-h-48 custom-scrollbar">
          <h4 className="font-bold mb-2 text-indigo-800">Tài liệu cho AI (Prompt Guide)</h4>
          <p className="mb-2">Copy hướng dẫn dưới đây đưa cho AI (ChatGPT/Claude/Gemini) để tự động sinh file JSON tạo phim:</p>
          <pre className="whitespace-pre-wrap bg-white/60 p-2 rounded border border-indigo-100 font-mono text-[10px] select-all">
{`Tạo một kịch bản JSON hợp lệ cho ứng dụng tạo video theo cấu trúc sau. TUYỆT ĐỐI không dùng markdown block, chỉ in ra JSON hợp lệ.

1. "aspectRatio": "16:9" | "9:16" | "1:1" | "4:3"
2. "background": Các class màu Tailwind (VD: "bg-white", "bg-gray-900", "bg-blue-200")
3. "duration": Tổng thời lượng video (giây).
4. "characters": Mảng các nhân vật.
   - id: Chuỗi duy nhất (VD: "char-1")
   - type: "basic" hoặc "custom"
   - name, showName: Tên nhân vật.
   - appearance: { skinColor, hairColor, shirtColor, pantsColor (mã HEX), hairStyle ("none", "short", "long", "spiky", "curly", "bun"), accessory ("none", "glasses", "hat", "cap") }
   - pose: { armL, armR, legL, legR } (Góc quay tay chân từ -180 đến 180).
     + Tư thế đánh: armL: -120, armR: -20, legL: 20, legR: -20
   - animation: { in: "fadeIn" | "slideInLeft" | "slideInRight" | "zoomIn" | "bounceIn", inDuration }
   - keyframes: Chuyển động. Mảng các { time, x, y, scale, rotation, pose }.
5. "props": Đạo cụ / Vũ khí / Toán học / Đồ thị / Bảng biểu:
   - type: "emoji" | "text" | "image" | "math" | "chart" | "table"
   - Khi type = "math": mathConfig: { formula: "f(x) = x^3 - 3x", title: "Khảo sát hàm số", cardStyle: "dark" | "chalkboard" | "glass" }
   - Khi type = "chart": chartConfig: { chartType: "function", fn: "x^3 - 3*x", label: "y = x^3 - 3x", showTangent: true, showExtrema: true, showGrid: true, dynamicTrace: true }
   - Khi type = "table": tableConfig: { tableType: "variation", title: "Bảng biến thiên", variation: { xRow: ["-\\infty", "-1", "1", "+\\infty"], yPrimeRow: ["+", "0", "-", "0", "+"], yRow: [{ val: "-\\infty", dir: "up" }, { val: "2", dir: "down" }, { val: "-2", dir: "up" }, { val: "+\\infty", dir: "none" }] } }
6. "dialogBlocks": Khối hội thoại (Hỗ trợ công thức KaTeX dạng $inline$ hoặc $$block$$).
   - characterId: ID nhân vật.
   - text: "Chào các em! Hôm nay ta học hàm số $y = x^3 - 3x + 1$!"
   - emotion: "neutral", "questioning", "explaining", "angry", "happy", "sad", "surprised", "laughing", "crying"
   - bubbleType: "normal", "thought", "shout", "manga"`}
          </pre>
        </div>
      )}

      <textarea
        className="flex-1 w-full bg-gray-900 text-gray-100 p-3 rounded-lg font-mono text-[11px] custom-scrollbar resize-none border border-gray-700 focus:outline-none focus:border-blue-500"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        spellCheck={false}
      />

      {error && (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 text-red-600 rounded text-xs flex items-start gap-1.5">
          <AlertTriangle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <button
        onClick={handleApply}
        className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-sm"
      >
        {success ? <Check size={16} /> : <FileJson size={16} />}
        {success ? 'Đã áp dụng kịch bản thành công!' : 'Áp dụng Code JSON'}
      </button>
    </div>
  );
};
