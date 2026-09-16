import React, { useRef } from 'react';
import { useEditorStore } from '../../store';
import { Plus, Trash2, FlipHorizontal, Upload } from 'lucide-react';

export const CharacterTab = ({ setActiveTab }: { setActiveTab: (tab: any) => void }) => {
  const { 
    project, 
    currentTime,
    addCharacter, 
    updateCharacter, 
    removeCharacter,
    addDialog,
    addAttackEffect,
    selectedElementId,
    setSelectedElement
  } = useEditorStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const selectedChar = project.characters.find(c => c.id === selectedElementId);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      addCharacter('custom', url);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div>
      <div className="flex flex-col gap-2 mb-4">
        <h3 className="font-semibold text-sm text-gray-700">Thêm Nhân Vật</h3>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => addCharacter('basic')}
            className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 hover:bg-blue-200"
          >
            <Plus size={14} /> Cơ bản
          </button>
          <button 
            onClick={() => addCharacter('student')}
            className="bg-green-100 text-green-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 hover:bg-green-200"
          >
            <Plus size={14} /> Học sinh
          </button>
          <button 
            onClick={() => addCharacter('teacher')}
            className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 hover:bg-purple-200"
          >
            <Plus size={14} /> Giáo viên
          </button>
          <div className="relative">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded text-xs font-medium flex items-center gap-1 hover:bg-orange-200"
            >
              <Upload size={14} /> Tải ảnh
            </button>
          </div>
        </div>
      </div>

      {selectedChar ? (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
          <div className="flex justify-between mb-2 border-b pb-2">
            <span className="text-xs font-medium text-gray-500">Đang chọn nhân vật ({selectedChar.type})</span>
            <button onClick={() => { setSelectedElement(null); }} className="text-gray-500 hover:text-gray-700 text-xs underline">
              Quay lại danh sách
            </button>
            <button onClick={() => removeCharacter(selectedChar.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
          
          <h4 className="text-xs font-semibold text-gray-700 mb-2 mt-2">Thông tin nhân vật</h4>
          <div className="flex gap-2 items-center mb-4">
            <input 
              type="text" 
              placeholder="Nhập tên nhân vật..." 
              value={selectedChar.name || ''} 
              onChange={(e) => updateCharacter(selectedChar.id, { name: e.target.value })}
              className="flex-1 border border-gray-300 rounded p-1.5 text-xs bg-white"
            />
            <label className="flex items-center gap-1 text-xs text-gray-700 cursor-pointer">
              <input 
                type="checkbox" 
                checked={selectedChar.showName || false}
                onChange={(e) => updateCharacter(selectedChar.id, { showName: e.target.checked })}
              />
              Hiện tên
            </label>
          </div>

          <h4 className="text-xs font-semibold text-gray-700 mb-2 mt-2">Thời gian xuất hiện</h4>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Thời điểm bắt đầu (s)</label>
              <input 
                type="number" min="0" max={project.duration} step="0.5" 
                value={selectedChar.startTime ?? 0} 
                onChange={(e) => updateCharacter(selectedChar.id, { startTime: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Thời lượng (s)</label>
              <input 
                type="number" min="0.5" max={project.duration} step="0.5" 
                value={selectedChar.duration ?? project.duration} 
                onChange={(e) => updateCharacter(selectedChar.id, { duration: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              />
            </div>
          </div>

          <h4 className="text-xs font-semibold text-gray-700 mb-2 mt-2">Vị trí & Kích thước</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Vị trí ngang (X)</label>
              <input 
                type="range" min="0" max="100" 
                value={selectedChar.x} 
                onChange={(e) => updateCharacter(selectedChar.id, { x: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Vị trí dọc (Y)</label>
              <input 
                type="range" min="0" max="100" 
                value={selectedChar.y} 
                onChange={(e) => updateCharacter(selectedChar.id, { y: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Màu sắc nét vẽ</label>
              <input 
                type="color"
                value={selectedChar.color || '#000000'} 
                onChange={(e) => updateCharacter(selectedChar.id, { color: e.target.value })}
                className="w-full h-6 p-0 border-0 rounded cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Kích cỡ</label>
              <input 
                type="range" min="0.5" max="3" step="0.1" 
                value={selectedChar.scale} 
                onChange={(e) => updateCharacter(selectedChar.id, { scale: Number(e.target.value) })}
                className="w-full"
              />
            </div>
            <div className="flex items-end pb-1">
              <button 
                onClick={() => updateCharacter(selectedChar.id, { flipX: !selectedChar.flipX })}
                className="flex items-center gap-1 bg-white border border-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-50 w-full justify-center"
              >
                <FlipHorizontal size={14} /> Lật hướng
              </button>
            </div>
          </div>

          <div className="mt-4 border-t pt-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Chuyển động (Keyframes)</h4>
            <div className="flex items-center justify-between bg-yellow-50 p-2 rounded border border-yellow-200">
              <span className="text-[10px] text-yellow-800">Lưu vị trí/tư thế tại: <b>{currentTime.toFixed(1)}s</b></span>
              <button 
                onClick={() => {
                  const newKf = {
                    id: Math.random().toString(36).substr(2, 9),
                    time: currentTime,
                    x: selectedChar.x,
                    y: selectedChar.y,
                    scale: selectedChar.scale,
                    flipX: selectedChar.flipX,
                    pose: selectedChar.pose
                  };
                  const existingKfs = selectedChar.keyframes || [];
                  const kfsWithoutCurrentTime = existingKfs.filter(kf => Math.abs(kf.time - currentTime) > 0.01);
                  updateCharacter(selectedChar.id, { keyframes: [...kfsWithoutCurrentTime, newKf].sort((a,b) => a.time - b.time) });
                }}
                className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-2 py-1 rounded text-[10px] font-bold"
              >
                + Đặt Keyframe
              </button>
            </div>
            {selectedChar.keyframes && selectedChar.keyframes.length > 0 && (
              <div className="mt-2 flex gap-1 overflow-x-auto pb-1">
                {selectedChar.keyframes.map(kf => (
                  <div key={kf.id} className="flex items-center bg-gray-100 rounded px-2 py-1 text-[10px] shrink-0 border border-gray-200">
                    <span>{kf.time.toFixed(1)}s</span>
                    <button 
                      onClick={() => {
                        updateCharacter(selectedChar.id, { keyframes: selectedChar.keyframes?.filter(k => k.id !== kf.id) });
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

          <div className="mt-4 border-t pt-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Hiệu ứng vào/ra (Animations)</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] text-gray-600 block mb-1">Lúc xuất hiện (In)</label>
                <select 
                  className="w-full border border-gray-300 rounded p-1 text-[10px] bg-white"
                  value={selectedChar.animation?.in || ''}
                  onChange={(e) => updateCharacter(selectedChar.id, { animation: { ...selectedChar.animation, in: e.target.value as any || undefined }})}
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
                  value={selectedChar.animation?.out || ''}
                  onChange={(e) => updateCharacter(selectedChar.id, { animation: { ...selectedChar.animation, out: e.target.value as any || undefined }})}
                >
                  <option value="">Không có</option>
                  <option value="fadeOut">Mờ dần (Fade Out)</option>
                </select>
              </div>
            </div>
          </div>

          {selectedChar.type !== 'custom' && (
            <>
              <h4 className="text-xs font-semibold text-gray-700 mb-2 mt-4 border-t pt-3">Ngoại hình & Quần áo</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Kiểu tóc</label>
                  <select 
                    className="w-full border border-gray-300 rounded p-1 text-[10px] bg-white"
                    value={selectedChar.appearance?.hairStyle || 'none'}
                    onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...(selectedChar.appearance || { skinColor: '#ffffff', hairColor: '#000000', hairStyle: 'none', shirtColor: 'transparent', pantsColor: 'transparent', accessory: 'none' }), hairStyle: e.target.value as any }})}
                  >
                    <option value="none">Trọc</option>
                    <option value="short">Tóc ngắn</option>
                    <option value="long">Tóc dài</option>
                    <option value="spiky">Tóc gai</option>
                    <option value="curly">Tóc xoăn</option>
                    <option value="bun">Búi tóc</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Màu tóc</label>
                  <input 
                    type="color"
                    value={selectedChar.appearance?.hairColor || '#000000'} 
                    onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...(selectedChar.appearance || { skinColor: '#ffffff', hairColor: '#000000', hairStyle: 'none', shirtColor: 'transparent', pantsColor: 'transparent', accessory: 'none' }), hairColor: e.target.value }})}
                    className="w-full h-6 p-0 border-0 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Màu da</label>
                  <input 
                    type="color"
                    value={selectedChar.appearance?.skinColor || '#ffffff'} 
                    onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...(selectedChar.appearance || { skinColor: '#ffffff', hairColor: '#000000', hairStyle: 'none', shirtColor: 'transparent', pantsColor: 'transparent', accessory: 'none' }), skinColor: e.target.value }})}
                    className="w-full h-6 p-0 border-0 rounded cursor-pointer"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Màu áo</label>
                  <div className="flex items-center gap-1">
                    <input type="checkbox" checked={selectedChar.appearance?.shirtColor === 'transparent'} onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...(selectedChar.appearance || { skinColor: '#ffffff', hairColor: '#000000', hairStyle: 'none', shirtColor: 'transparent', pantsColor: 'transparent', accessory: 'none' }), shirtColor: e.target.checked ? 'transparent' : '#ef4444' }})} />
                    <span className="text-[10px]">Cởi trần</span>
                    {selectedChar.appearance?.shirtColor !== 'transparent' && (
                      <input 
                        type="color"
                        value={selectedChar.appearance?.shirtColor || '#ef4444'} 
                        onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...(selectedChar.appearance || { skinColor: '#ffffff', hairColor: '#000000', hairStyle: 'none', shirtColor: 'transparent', pantsColor: 'transparent', accessory: 'none' }), shirtColor: e.target.value }})}
                        className="w-full h-6 p-0 border-0 rounded cursor-pointer ml-1"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Màu quần</label>
                  <div className="flex items-center gap-1">
                    <input type="checkbox" checked={selectedChar.appearance?.pantsColor === 'transparent'} onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...(selectedChar.appearance || { skinColor: '#ffffff', hairColor: '#000000', hairStyle: 'none', shirtColor: 'transparent', pantsColor: 'transparent', accessory: 'none' }), pantsColor: e.target.checked ? 'transparent' : '#3b82f6' }})} />
                    <span className="text-[10px]">Trần</span>
                    {selectedChar.appearance?.pantsColor !== 'transparent' && (
                      <input 
                        type="color"
                        value={selectedChar.appearance?.pantsColor || '#3b82f6'} 
                        onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...(selectedChar.appearance || { skinColor: '#ffffff', hairColor: '#000000', hairStyle: 'none', shirtColor: 'transparent', pantsColor: 'transparent', accessory: 'none' }), pantsColor: e.target.value }})}
                        className="w-full h-6 p-0 border-0 rounded cursor-pointer ml-1"
                      />
                    )}
                  </div>
                </div>
                <div className="col-span-2 bg-white p-2.5 rounded-lg border border-slate-200 mt-2">
                  <div className="font-semibold text-[11px] text-slate-800 mb-2 flex items-center justify-between">
                    <span>👔 Trang phục Chỉn chu</span>
                    <span className="text-[10px] text-indigo-600 font-mono">Dapper Attire</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="text-[10px] text-gray-600 block mb-0.5">Kiểu trang phục</label>
                      <select
                        className="w-full border border-gray-300 rounded p-1 text-[10px] bg-white"
                        value={selectedChar.appearance?.outfitStyle || 'formal'}
                        onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...selectedChar.appearance!, outfitStyle: e.target.value as any }})}
                      >
                        <option value="formal">Sơ mi Công sở</option>
                        <option value="vest">Áo Vest / Blazer</option>
                        <option value="polo">Áo Polo Lịch sự</option>
                        <option value="casual">Áo Thun Năng động</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-600 block mb-0.5">Màu giày da</label>
                      <input 
                        type="color"
                        value={selectedChar.appearance?.shoeColor || '#090d16'} 
                        onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...selectedChar.appearance!, shoeColor: e.target.value }})}
                        className="w-full h-6 p-0 border-0 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-700">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedChar.appearance?.hasTie ?? true} 
                        onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...selectedChar.appearance!, hasTie: e.target.checked }})} 
                      />
                      <span>Đeo Cà vạt</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedChar.appearance?.hasBelt ?? true} 
                        onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...selectedChar.appearance!, hasBelt: e.target.checked }})} 
                      />
                      <span>Thắt lưng da</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={selectedChar.appearance?.hasPocketPen ?? true} 
                        onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...selectedChar.appearance!, hasPocketPen: e.target.checked }})} 
                      />
                      <span>Bút gài túi</span>
                    </label>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-[10px] text-gray-600 block mb-1">Phụ kiện</label>
                  <select 
                    className="w-full border border-gray-300 rounded p-1 text-[10px] bg-white mb-2"
                    value={selectedChar.appearance?.accessory || 'none'}
                    onChange={(e) => updateCharacter(selectedChar.id, { appearance: { ...(selectedChar.appearance || { skinColor: '#ffffff', hairColor: '#000000', hairStyle: 'none', shirtColor: 'transparent', pantsColor: 'transparent', accessory: 'none' }), accessory: e.target.value as any }})}
                  >
                    <option value="none">Không có</option>
                    <option value="glasses">Kính mắt trí thức</option>
                    <option value="hat">Mũ cử nhân</option>
                    <option value="cap">Mũ lưỡi trai</option>
                    <option value="custom">Tùy chỉnh (Hình ảnh)</option>
                  </select>

                  {selectedChar.appearance?.accessory === 'custom' && (
                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] text-gray-600 block">Tải ảnh phụ kiện lên:</label>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="text-[10px]"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              updateCharacter(selectedChar.id, { appearance: { ...(selectedChar.appearance || { skinColor: '#ffffff', hairColor: '#000000', hairStyle: 'none', shirtColor: 'transparent', pantsColor: 'transparent', accessory: 'none' }), customAccessoryUrl: e.target?.result as string }});
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                      {selectedChar.appearance?.customAccessoryUrl && (
                         <img src={selectedChar.appearance.customAccessoryUrl} alt="Custom accessory" className="w-12 h-12 object-contain bg-gray-100 rounded border border-gray-200" />
                      )}
                    </div>
                  )}
                </div>
              </div>

              <h4 className="text-xs font-semibold text-gray-700 mb-2 mt-4 border-t pt-3">Tư thế Thuyết trình & Đàm thoại Chuẩn mực</h4>
              <div className="grid grid-cols-2 gap-1.5 mb-3">
                <button 
                  onClick={() => updateCharacter(selectedChar.id, { pose: { armL: -110, armR: 20, legL: 10, legR: -10, bodyLean: 1, headTilt: 0 }})} 
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs px-2.5 py-2 rounded-lg font-medium text-left flex items-center gap-1.5"
                >
                  <span>👨‍🏫</span> Chỉ bảng / Thuyết trình
                </button>
                <button 
                  onClick={() => updateCharacter(selectedChar.id, { pose: { armL: -45, armR: -25, legL: 10, legR: -10, bodyLean: 1, headTilt: 0 }})} 
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs px-2.5 py-2 rounded-lg font-medium text-left flex items-center gap-1.5"
                >
                  <span>🤝</span> Mở lời / Giải thích
                </button>
                <button 
                  onClick={() => updateCharacter(selectedChar.id, { pose: { armL: 15, armR: -15, legL: 10, legR: -10, bodyLean: 0, headTilt: 2 }})} 
                  className="bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs px-2.5 py-2 rounded-lg font-medium text-left flex items-center gap-1.5"
                >
                  <span>👂</span> Lắng nghe chăm chú
                </button>
                <button 
                  onClick={() => updateCharacter(selectedChar.id, { pose: { armL: -130, armR: -25, legL: 5, legR: -5, bodyLean: 1, headTilt: 4 }})} 
                  className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-xs px-2.5 py-2 rounded-lg font-medium text-left flex items-center gap-1.5"
                >
                  <span>🤔</span> Chống cằm suy ngẫm
                </button>
                <button 
                  onClick={() => updateCharacter(selectedChar.id, { pose: { armL: 15, armR: -15, legL: 10, legR: -10, bodyLean: 0, headTilt: 0 }})} 
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs px-2.5 py-2 rounded-lg font-medium text-left flex items-center gap-1.5"
                >
                  <span>🧍</span> Đứng thẳng nghiêm đính
                </button>
                <button 
                  onClick={() => updateCharacter(selectedChar.id, { pose: { armL: -140, armR: -20, legL: 10, legR: -10, bodyLean: 0, headTilt: 0 }})} 
                  className="bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs px-2.5 py-2 rounded-lg font-medium text-left flex items-center gap-1.5"
                >
                  <span>👋</span> Giơ tay chào
                </button>
              </div>

              <h4 className="text-xs font-semibold text-gray-700 mb-2 mt-4 border-t pt-3">Tinh chỉnh tư thế</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Tay Trái</label>
                  <input 
                    type="range" min="-180" max="180" 
                    value={selectedChar.pose?.armL ?? 45} 
                    onChange={(e) => updateCharacter(selectedChar.id, { pose: { ...(selectedChar.pose || { armL: 45, armR: -45, legL: 25, legR: -25 }), armL: Number(e.target.value) }})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Tay Phải</label>
                  <input 
                    type="range" min="-180" max="180" 
                    value={selectedChar.pose?.armR ?? -45} 
                    onChange={(e) => updateCharacter(selectedChar.id, { pose: { ...(selectedChar.pose || { armL: 45, armR: -45, legL: 25, legR: -25 }), armR: Number(e.target.value) }})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Chân Trái</label>
                  <input 
                    type="range" min="-90" max="90" 
                    value={selectedChar.pose?.legL ?? 25} 
                    onChange={(e) => updateCharacter(selectedChar.id, { pose: { ...(selectedChar.pose || { armL: 45, armR: -45, legL: 25, legR: -25 }), legL: Number(e.target.value) }})}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-600 block mb-1">Chân Phải</label>
                  <input 
                    type="range" min="-90" max="90" 
                    value={selectedChar.pose?.legR ?? -25} 
                    onChange={(e) => updateCharacter(selectedChar.id, { pose: { ...(selectedChar.pose || { armL: 45, armR: -45, legL: 25, legR: -25 }), legR: Number(e.target.value) }})}
                    className="w-full"
                  />
                </div>
              </div>
            </>
          )}

          <div className="mt-4 border-t pt-3">
            <button 
              onClick={() => {
                addDialog(selectedChar.id, "Nhập thoại vào đây...");
                setActiveTab('dialog');
              }}
              className="w-full bg-indigo-50 text-indigo-600 border border-indigo-200 py-1.5 rounded text-xs font-medium hover:bg-indigo-100"
            >
              + Thêm Lời Thoại
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Danh sách nhân vật trong cảnh</h4>
          {project.characters.length > 0 ? (
            <div className="flex flex-col gap-2">
              {project.characters.map((char, index) => (
                <button 
                  key={char.id}
                  onClick={() => setSelectedElement(char.id)}
                  className="flex items-center justify-between p-2 rounded border border-gray-200 hover:border-blue-500 hover:bg-blue-50 bg-white"
                >
                  <span className="text-sm font-medium line-clamp-1">Nhân vật {index + 1} ({char.type})</span>
                  {char.type === 'custom' && char.imageUrl ? (
                    <img src={char.imageUrl} alt="preview" className="w-6 h-6 object-cover rounded shadow-sm" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-gray-300 shadow-sm shrink-0" style={{ backgroundColor: char.color || '#000' }}></div>
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
              Chưa có nhân vật nào.<br/>Nhấn nút "Thêm" ở trên.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
