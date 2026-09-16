import React, { useRef } from 'react';
import { useEditorStore } from '../../store';
import { Upload } from 'lucide-react';

export const BackgroundTab = () => {
  const { project, setBackground } = useEditorStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const backgrounds = [
    'bg-white', 
    'bg-gray-800', 
    'bg-blue-200',
    'bg-green-200',
    'bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-100 to-blue-300', 
    'bg-[linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6),linear-gradient(45deg,#f3f4f6_25%,transparent_25%,transparent_75%,#f3f4f6_75%,#f3f4f6)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] bg-white', 
    'bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] bg-[length:16px_16px] bg-white', 
    'bg-gradient-to-b from-purple-100 to-purple-300'
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setBackground(`url(${url})`);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <h3 className="font-semibold mb-3 text-sm text-gray-700">Chọn Bối Cảnh (Background)</h3>
      <div className="grid grid-cols-4 gap-3 mb-4">
        {backgrounds.map(bg => (
          <button 
            key={bg} 
            onClick={() => setBackground(bg)}
            className={`h-16 rounded-lg border-2 ${bg} ${project.background === bg ? 'border-blue-500' : 'border-gray-200 hover:border-blue-300'}`}
          />
        ))}
      </div>
      
      <div className="border-t pt-4">
        <h4 className="text-xs font-semibold text-gray-700 mb-2">Tải ảnh lên làm bối cảnh</h4>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-600 hover:bg-gray-50 hover:border-blue-400 hover:text-blue-600 transition-colors"
        >
          <Upload size={18} />
          <span>Tải ảnh từ máy tính</span>
        </button>
      </div>
    </div>
  );
};
