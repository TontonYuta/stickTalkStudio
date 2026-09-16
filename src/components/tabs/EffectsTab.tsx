import React from 'react';
import { useEditorStore } from '../../store';

export const EffectsTab = () => {
  const { project, setFilters } = useEditorStore();

  return (
    <div>
      <h3 className="font-semibold mb-4 text-sm text-gray-700">Hiệu ứng Video (Video Effects)</h3>
      
      <div className="flex flex-col gap-4">
        <div>
          <label className="text-xs text-gray-600 block mb-1 flex justify-between">
            Độ sáng
            <span>{project.filters.brightness}%</span>
          </label>
          <input 
            type="range" min="0" max="200" 
            value={project.filters.brightness} 
            onChange={(e) => setFilters({ brightness: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1 flex justify-between">
            Tương phản
            <span>{project.filters.contrast}%</span>
          </label>
          <input 
            type="range" min="0" max="200" 
            value={project.filters.contrast} 
            onChange={(e) => setFilters({ contrast: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1 flex justify-between">
            Màu trắng đen (Grayscale)
            <span>{project.filters.grayscale}%</span>
          </label>
          <input 
            type="range" min="0" max="100" 
            value={project.filters.grayscale} 
            onChange={(e) => setFilters({ grayscale: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1 flex justify-between">
            Cổ điển (Sepia)
            <span>{project.filters.sepia}%</span>
          </label>
          <input 
            type="range" min="0" max="100" 
            value={project.filters.sepia} 
            onChange={(e) => setFilters({ sepia: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <div>
          <label className="text-xs text-gray-600 block mb-1 flex justify-between">
            Độ mờ (Blur)
            <span>{project.filters.blur}px</span>
          </label>
          <input 
            type="range" min="0" max="20" 
            value={project.filters.blur} 
            onChange={(e) => setFilters({ blur: Number(e.target.value) })}
            className="w-full"
          />
        </div>

        <button 
          onClick={() => setFilters({ brightness: 100, contrast: 100, grayscale: 0, sepia: 0, blur: 0 })}
          className="mt-4 bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-xs font-medium"
        >
          Đặt lại mặc định
        </button>
      </div>
    </div>
  );
};
