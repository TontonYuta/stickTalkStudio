import React from 'react';
import { useEditorStore } from '../../store';
import { Trash2, MessageSquare } from 'lucide-react';

export const DialogTab = () => {
  const { 
    project, 
    selectedElementId,
    setSelectedElement,
    updateDialog,
    removeDialog
  } = useEditorStore();

  const selectedDialog = project.dialogBlocks.find(d => d.id === selectedElementId);

  const updateProjectDialogueStyle = (style: any) => {
    useEditorStore.setState(state => ({
      project: { ...state.project, dialogueStyle: style }
    }));
  };

  const updateProjectBoxStyle = (boxStyle: any) => {
    useEditorStore.setState(state => ({
      project: { ...state.project, dialogueBoxStyle: boxStyle }
    }));
  };

  const currentDialogueStyle = project.dialogueStyle || 'pedagogical';
  const currentBoxStyle = project.dialogueBoxStyle || 'bubble';

  return (
    <div className="space-y-4">
      {/* Global Conversation Tone & Box Style Settings */}
      <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 border border-blue-200/80 p-3 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>🎭</span> Phong Cách Hội Thoại
          </span>
          <span className="text-[10px] text-blue-600 font-semibold uppercase tracking-wider">
            {currentDialogueStyle}
          </span>
        </div>

        {/* Style Selector Pills */}
        <div className="grid grid-cols-2 gap-1.5 mb-2.5">
          <button
            onClick={() => updateProjectDialogueStyle('pedagogical')}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium text-left flex items-center gap-1.5 transition-colors ${
              currentDialogueStyle === 'pedagogical'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white text-slate-700 hover:bg-blue-100/60 border border-slate-200'
            }`}
          >
            <span>👨‍🏫</span> Sư phạm / Học thuật
          </button>
          <button
            onClick={() => updateProjectDialogueStyle('witty')}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium text-left flex items-center gap-1.5 transition-colors ${
              currentDialogueStyle === 'witty'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white text-slate-700 hover:bg-blue-100/60 border border-slate-200'
            }`}
          >
            <span>🎭</span> Hài hước / Dí dỏm
          </button>
          <button
            onClick={() => updateProjectDialogueStyle('dramatic')}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium text-left flex items-center gap-1.5 transition-colors ${
              currentDialogueStyle === 'dramatic'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white text-slate-700 hover:bg-blue-100/60 border border-slate-200'
            }`}
          >
            <span>⚡</span> Tranh biện / Kịch tính
          </button>
          <button
            onClick={() => updateProjectDialogueStyle('storytelling')}
            className={`text-xs px-2.5 py-1.5 rounded-lg font-medium text-left flex items-center gap-1.5 transition-colors ${
              currentDialogueStyle === 'storytelling'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white text-slate-700 hover:bg-blue-100/60 border border-slate-200'
            }`}
          >
            <span>📖</span> Truyền cảm hứng
          </button>
          <button
            onClick={() => updateProjectDialogueStyle('conversational')}
            className={`col-span-2 text-xs px-2.5 py-1.5 rounded-lg font-medium text-left flex items-center gap-1.5 transition-colors ${
              currentDialogueStyle === 'conversational'
                ? 'bg-blue-600 text-white shadow-xs font-semibold'
                : 'bg-white text-slate-700 hover:bg-blue-100/60 border border-slate-200'
            }`}
          >
            <span>☕</span> Thân mật / Đời thường
          </button>
        </div>

        {/* Global Box Style Selector */}
        <div className="pt-2 border-t border-blue-200/60">
          <label className="text-[11px] font-semibold text-slate-600 block mb-1.5">
            📦 Kiểu Hộp Thoại Mặc Định:
          </label>
          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => updateProjectBoxStyle('bubble')}
              className={`text-[11px] py-1 px-1.5 rounded-md font-medium text-center border ${
                currentBoxStyle === 'bubble' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              💬 Bubble
            </button>
            <button
              onClick={() => updateProjectBoxStyle('card')}
              className={`text-[11px] py-1 px-1.5 rounded-md font-medium text-center border ${
                currentBoxStyle === 'card' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🎴 Thẻ Kính
            </button>
            <button
              onClick={() => updateProjectBoxStyle('cinema')}
              className={`text-[11px] py-1 px-1.5 rounded-md font-medium text-center border ${
                currentBoxStyle === 'cinema' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🎬 Cinema
            </button>
            <button
              onClick={() => updateProjectBoxStyle('manga')}
              className={`text-[11px] py-1 px-1.5 rounded-md font-medium text-center border ${
                currentBoxStyle === 'manga' ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              🗯️ Manga
            </button>
          </div>
        </div>
      </div>

      <h3 className="font-semibold text-sm text-gray-700">Chi Tiết Lời Thoại</h3>
      {selectedDialog ? (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
           <div className="flex justify-between mb-2">
            <span className="text-xs font-medium text-gray-500">Chỉnh sửa thoại</span>
            <button onClick={() => { setSelectedElement(null); }} className="text-gray-500 hover:text-gray-700 text-xs underline">
              Quay lại danh sách
            </button>
            <button onClick={() => removeDialog(selectedDialog.id)} className="text-red-500 hover:text-red-700">
              <Trash2 size={16} />
            </button>
          </div>
          <textarea 
            className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none min-h-[75px]"
            rows={3}
            value={selectedDialog.text}
            onChange={(e) => updateDialog(selectedDialog.id, { text: e.target.value })}
            placeholder="Nhập nội dung hội thoại..."
          />

          {/* Word Count Indicator & Quick Trim Helper */}
          {(() => {
            const words = selectedDialog.text.trim().split(/\s+/).filter(Boolean);
            const count = words.length;
            const handleQuickTrim = () => {
              const trimmed = selectedDialog.text
                .replace(/^(Như chúng ta đã biết|Theo sách giáo khoa thì|Thầy xin giải thích rằng|Chúng ta có thể thấy rằng|Thực sự là|Hôm nay mình sẽ chia sẻ|Chúng ta cùng tìm hiểu)\s*[,:]?\s*/i, '')
                .replace(/,\s*(như các bạn đã biết|đúng không nào|phải không các em)\s*/gi, ' ')
                .trim();
              updateDialog(selectedDialog.id, { 
                text: trimmed ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1) : selectedDialog.text 
              });
            };

            return (
              <div className="mt-1.5 flex items-center justify-between gap-1 text-[11px]">
                {count <= 10 ? (
                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span>✓</span> {count} từ (Rất gọn đẹp)
                  </span>
                ) : count <= 13 ? (
                  <span className="text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                    {count} từ (Khá tốt)
                  </span>
                ) : (
                  <span className="text-amber-800 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                    <span>⚠️</span> {count} từ (Nên rút gọn &lt; 10 từ)
                  </span>
                )}

                <button
                  type="button"
                  onClick={handleQuickTrim}
                  className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2 py-0.5 rounded-md font-medium transition-colors flex items-center gap-1"
                  title="Tự động loại bỏ từ đệm thừa thãi để câu ngắn gọn hơn"
                >
                  <span>⚡</span> Lọc từ thừa
                </button>
              </div>
            );
          })()}
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">Thời điểm bắt đầu (giây)</label>
              <input 
                type="number" 
                min="0" max={project.duration} step="0.5"
                value={selectedDialog.startTime}
                onChange={(e) => updateDialog(selectedDialog.id, { startTime: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Thời lượng (giây)</label>
              <input 
                type="number" 
                min="0.5" max="10" step="0.5"
                value={selectedDialog.duration}
                onChange={(e) => updateDialog(selectedDialog.id, { duration: Number(e.target.value) })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Cảm xúc nhân vật</label>
              <select 
                value={selectedDialog.emotion}
                onChange={(e) => updateDialog(selectedDialog.id, { emotion: e.target.value as any })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              >
                <option value="neutral">Bình thường</option>
                <option value="questioning">Thắc mắc (?)</option>
                <option value="explaining">Giảng giải</option>
                <option value="angry">Tức giận</option>
                <option value="happy">Vui vẻ</option>
                <option value="sad">Buồn bã</option>
                <option value="surprised">Ngạc nhiên</option>
                <option value="laughing">Cười lớn</option>
                <option value="crying">Khóc</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Kiểu mây thoại</label>
              <select 
                value={selectedDialog.bubbleType}
                onChange={(e) => updateDialog(selectedDialog.id, { bubbleType: e.target.value as any })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              >
                <option value="normal">Bình thường</option>
                <option value="thought">Suy nghĩ</option>
                <option value="shout">Hét lớn</option>
                <option value="manga">Manga/Truyện tranh</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Kiểu Box riêng câu này</label>
              <select 
                value={selectedDialog.boxStyle || ''}
                onChange={(e) => updateDialog(selectedDialog.id, { boxStyle: (e.target.value || undefined) as any })}
                className="w-full border border-gray-300 rounded p-1.5 text-xs bg-white"
              >
                <option value="">Theo mặc định dự án</option>
                <option value="bubble">Bong bóng (Bubble)</option>
                <option value="card">Thẻ kính (Glass Card)</option>
                <option value="cinema">Phụ đề điện ảnh (Cinema)</option>
                <option value="manga">Truyện tranh (Manga)</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">Icon vai trò (Role Badge)</label>
              <div className="flex gap-1 items-center">
                <input 
                  type="text" 
                  value={selectedDialog.roleIcon || ''}
                  onChange={(e) => updateDialog(selectedDialog.id, { roleIcon: e.target.value })}
                  placeholder="👨‍🏫"
                  className="w-14 border border-gray-300 rounded p-1.5 text-xs bg-white text-center"
                />
                <div className="flex gap-0.5 text-sm">
                  {['👨‍🏫', '👨‍🎓', '👔', '💻', '⚡', '🔥'].map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => updateDialog(selectedDialog.id, { roleIcon: icon })}
                      className="p-1 hover:bg-slate-200 rounded text-xs"
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Danh sách các câu thoại</h4>
          {project.dialogBlocks.length > 0 ? (
            <div className="flex flex-col gap-2">
              {project.dialogBlocks.map((dialog) => {
                const char = project.characters.find(c => c.id === dialog.characterId);
                return (
                  <button 
                    key={dialog.id}
                    onClick={() => setSelectedElement(dialog.id)}
                    className="flex flex-col p-2 rounded border border-gray-200 hover:border-blue-500 hover:bg-blue-50 bg-white text-left"
                  >
                    <div className="flex justify-between w-full mb-1">
                      <span className="text-xs font-semibold text-blue-600">{char ? char.type : 'Unknown'}</span>
                      <span className="text-[10px] text-gray-500">{dialog.startTime}s - {dialog.startTime + dialog.duration}s</span>
                    </div>
                    <p className="text-sm text-gray-800 line-clamp-1">{dialog.text || '(Chưa có nội dung)'}</p>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2">
              <MessageSquare size={24} className="text-gray-300" />
              <p>Chọn nhân vật và nhấn "Thêm thoại"<br/>hoặc chọn đoạn thoại trên dòng thời gian.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
