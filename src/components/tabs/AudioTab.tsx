import React, { useRef } from 'react';
import { useEditorStore } from '../../store';
import { Upload, Trash2, Volume2, Music } from 'lucide-react';

export const AudioTab = () => {
  const { project, addAudio, updateAudio, removeAudio, selectedElementId, setSelectedElement } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedAudio = project.audios.find(a => a.id === selectedElementId);

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addAudio(url, file.name);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const presetAudios = [
    { name: 'Nhạc nền Lo-fi Chill (Ấm áp)', url: '/audio/bgm-lofi.mp3' },
    { name: 'Nhạc nền Sư phạm (Thuyết trình)', url: '/audio/bgm-pedagogy.mp3' },
    { name: 'Nhạc nền Vui tươi (Năng động)', url: '/audio/bgm-upbeat.mp3' },
    { name: 'Nhạc nền Kịch tính (Hồi hộp)', url: '/audio/bgm-dramatic.mp3' },
  ];

  return (
    <div>
      <h3 className="font-semibold mb-3 text-sm text-gray-700">Âm thanh & Nhạc</h3>
      
      <div className="mb-4">
        <input 
          type="file" 
          accept="audio/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleAudioUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-blue-300 bg-blue-50 text-blue-700 rounded-lg p-3 text-sm hover:bg-blue-100 transition-colors"
        >
          <Upload size={16} />
          <span>Tải file âm thanh từ máy</span>
        </button>
      </div>

      <h4 className="text-xs font-semibold text-gray-700 mb-2">Thư viện mẫu</h4>
      <div className="flex flex-col gap-2 mb-6">
        {presetAudios.map((audio, i) => (
          <div key={i} className="flex items-center justify-between p-2 border rounded bg-gray-50 text-xs">
            <span className="truncate flex-1">{audio.name}</span>
            <button 
              onClick={() => addAudio(audio.url, audio.name)}
              className="bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded ml-2"
            >
              Thêm
            </button>
          </div>
        ))}
      </div>

      {selectedAudio && (
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
          <div className="flex justify-between items-center mb-3 border-b border-blue-200 pb-2">
            <h4 className="font-semibold text-sm text-blue-900 flex items-center gap-2">
              <Music size={14} /> Chỉnh sửa Âm thanh
            </h4>
            <button 
              onClick={() => setSelectedElement(null)}
              className="text-xs text-blue-500 hover:text-blue-800"
            >
              Đóng
            </button>
          </div>

          <div className="mb-3">
            <span className="text-xs font-medium text-blue-800">{selectedAudio.name}</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-[10px] text-gray-600 block mb-1">Bắt đầu (s)</label>
              <input 
                type="number" min="0" max={project.duration} step="0.5" 
                value={selectedAudio.startTime} 
                onChange={(e) => updateAudio(selectedAudio.id, { startTime: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-600 block mb-1">Thời lượng (s)</label>
              <input 
                type="number" min="0.5" max={project.duration} step="0.5" 
                value={selectedAudio.duration} 
                onChange={(e) => updateAudio(selectedAudio.id, { duration: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="text-[10px] text-gray-600 flex items-center gap-1 mb-1">
              <Volume2 size={12} /> Âm lượng
            </label>
            <input 
              type="range" min="0" max="1" step="0.1" 
              value={selectedAudio.volume} 
              onChange={(e) => updateAudio(selectedAudio.id, { volume: Number(e.target.value) })}
              className="w-full"
            />
          </div>

          <button 
            onClick={() => removeAudio(selectedAudio.id)}
            className="w-full bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded text-xs font-medium flex items-center justify-center gap-1 mt-2"
          >
            <Trash2 size={14} /> Xóa âm thanh
          </button>
        </div>
      )}
    </div>
  );
};
