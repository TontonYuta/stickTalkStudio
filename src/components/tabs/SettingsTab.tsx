import React from 'react';
import { useEditorStore } from '../../store';

export const SettingsTab = () => {
  const { project, setAspect } = useEditorStore();

  return (
    <div className="overflow-y-auto h-full p-4 custom-scrollbar">
      <h3 className="font-semibold mb-4 text-gray-800">Cài đặt Dự án</h3>
      <div className="space-y-6 max-w-sm">
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-2">Tên dự án</label>
          <input 
            type="text" 
            placeholder="Nhập tên dự án..."
            value={project.title || ''}
            onChange={(e) => useEditorStore.getState().setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded p-2 text-sm bg-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-700 block mb-2">Kích thước video</label>
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <button 
                onClick={() => setAspect('9:16')}
                className={`flex-1 py-2 text-xs rounded border ${project.aspectRatio === '9:16' ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                9:16 (TikTok/Shorts)
              </button>
              <button 
                onClick={() => setAspect('16:9')}
                className={`flex-1 py-2 text-xs rounded border ${project.aspectRatio === '16:9' ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                16:9 (YouTube)
              </button>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setAspect('1:1')}
                className={`flex-1 py-2 text-xs rounded border ${project.aspectRatio === '1:1' ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                1:1 (Instagram)
              </button>
              <button 
                onClick={() => setAspect('4:3')}
                className={`flex-1 py-2 text-xs rounded border ${project.aspectRatio === '4:3' ? 'bg-blue-50 border-blue-500 text-blue-700 font-medium' : 'bg-white border-gray-200 text-gray-600'}`}
              >
                4:3 (Cổ điển)
              </button>
            </div>
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-gray-700">Tổng thời lượng (giây)</label>
            <span className="text-xs text-blue-600 font-semibold">{project.duration}s</span>
          </div>
          <input 
            type="number" 
            min="1" step="1"
            value={project.duration}
            onChange={(e) => {
              const val = Math.max(1, Number(e.target.value) || 1);
              const store = useEditorStore.getState();
              store.project.duration = val;
              useEditorStore.setState({ project: { ...store.project } });
            }}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm bg-white focus:ring-2 focus:ring-blue-500 font-mono"
            placeholder="Không giới hạn thời gian (ví dụ: 60, 180, 600...)"
          />
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {[15, 30, 60, 120, 300].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  const store = useEditorStore.getState();
                  store.project.duration = d;
                  useEditorStore.setState({ project: { ...store.project } });
                }}
                className={`text-[11px] px-2 py-1 rounded border transition-colors ${project.duration === d ? 'bg-blue-600 text-white border-blue-600 font-bold' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'}`}
              >
                {d < 60 ? `${d}s` : `${d / 60}p`}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-gray-400 mt-1">Không giới hạn thời gian — hỗ trợ video dài tùy thích.</p>
        </div>
      </div>
    </div>
  );
};
