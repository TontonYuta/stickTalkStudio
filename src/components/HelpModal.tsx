import React from 'react';
import { X, Key, Play, Image, Type, Volume2, Move, Video } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Hướng Dẫn Sử Dụng</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-8">
          
          <section>
            <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
              <Key className="text-yellow-500" /> Đặc biệt: Cơ chế Keyframe (Tạo hoạt ảnh)
            </h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 sm:p-5 text-gray-700 text-sm sm:text-base leading-relaxed space-y-3">
              <p>
                <strong>Keyframe</strong> là tính năng quan trọng nhất để tạo chuyển động (di chuyển, phóng to, xoay) cho Nhân vật và Đạo cụ.
              </p>
              <ol className="list-decimal pl-5 space-y-2">
                <li>Kéo thanh thời gian (playhead màu đỏ) trên Timeline đến vị trí bạn muốn bắt đầu.</li>
                <li>Chọn nhân vật hoặc đạo cụ, chỉnh sửa vị trí, kích thước, góc xoay. Hệ thống sẽ <strong>tự động lưu một Keyframe</strong> tại thời điểm đó (hiển thị là một chấm màu vàng trên Timeline).</li>
                <li>Tiếp tục kéo thanh thời gian đến một thời điểm khác, di chuyển hoặc thay đổi nhân vật/đạo cụ. Một Keyframe mới sẽ được tạo.</li>
                <li>Khi bạn bấm Play, hệ thống sẽ tự động tạo chuyển động mượt mà giữa các Keyframe này!</li>
              </ol>
              <div className="mt-3 bg-white/60 p-3 rounded-lg border border-yellow-200 text-sm italic">
                * Mẹo: Click trực tiếp vào các chấm vàng trên Timeline để nhảy nhanh đến Keyframe đó và chỉnh sửa lại vị trí.
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <section className="space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Image size={18} className="text-blue-500" /> 1. Thêm & Quản lý Nhân vật
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1.5">
                <li>Vào tab <strong>Nhân Vật</strong> để thêm mới. Bạn có thể tự thiết kế (tóc, quần áo, mắt) hoặc tải ảnh lên.</li>
                <li>Mỗi nhân vật có một track riêng trên Timeline (NV 1, NV 2).</li>
                <li>Kéo thả hai đầu của thanh track màu xanh lá để chỉnh <strong>thời gian xuất hiện / biến mất</strong> của nhân vật.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Type size={18} className="text-purple-500" /> 2. Đạo cụ (Props)
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1.5">
                <li>Tab <strong>Đạo cụ</strong> cho phép thêm Emoji, Chữ, hoặc Hình ảnh phụ.</li>
                <li>Cũng giống như nhân vật, đạo cụ có track riêng (màu tím) để chỉnh thời gian xuất hiện.</li>
                <li>Hỗ trợ Keyframe đầy đủ để làm hiệu ứng bay, rơi, xoay vòng.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Type size={18} className="text-blue-500" /> 3. Hội thoại (Dialog)
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1.5">
                <li>Vào tab <strong>Hội thoại</strong>, chọn nhân vật đang nói và nhập nội dung.</li>
                <li>Có nhiều kiểu bóng thoại: Bình thường, Suy nghĩ, Hét lớn, Manga.</li>
                <li>Hội thoại sẽ xuất hiện dưới dạng các khối màu xanh dương trên track của nhân vật đó. Bạn có thể kéo dãn hoặc di chuyển khối hội thoại này trên Timeline.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Volume2 size={18} className="text-green-500" /> 4. Âm thanh (Audio)
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1.5">
                <li>Tải lên các file âm thanh (nhạc nền, lồng tiếng, hiệu ứng).</li>
                <li>Các khối âm thanh (màu xanh nước biển) có thể được dịch chuyển trên Timeline để căn khớp với miệng nhân vật hoặc các sự kiện.</li>
              </ul>
            </section>
            
            <section className="space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Video size={18} className="text-red-500" /> 5. Xuất Video & Quản lý Code
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1.5">
                <li><strong>Xuất Video:</strong> Bấm nút "Xuất Video". Hệ thống sẽ yêu cầu quay màn hình trình duyệt. Hãy đảm bảo chọn <em>"Chia sẻ âm thanh của tab" (Share audio)</em> trên hộp thoại hệ thống để video có tiếng. Đừng thu nhỏ hoặc chuyển tab trong lúc quay.</li>
                <li><strong>Lưu Dự Án (Code):</strong> Bấm "Lưu Dự Án" để tải toàn bộ video về máy dưới dạng file Code (định dạng .json).</li>
                <li><strong>Tạo video bằng AI (MỚI ✨):</strong> Sang tab <strong>Code</strong>, copy "Tài liệu cho AI" và đưa cho ChatGPT/Gemini để nhờ nó tự viết kịch bản, sau đó copy mã JSON dán ngược lại để tạo video hoàn toàn tự động!</li>
              </ul>
            </section>
            <section className="space-y-3">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Key size={18} className="text-gray-600" /> 6. Phím tắt (Shortcuts)
              </h3>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1.5">
                <li><kbd className="bg-gray-100 px-1 py-0.5 rounded border">Space</kbd> : Play / Pause</li>
                <li><kbd className="bg-gray-100 px-1 py-0.5 rounded border">Delete</kbd> : Xóa phần tử đang chọn</li>
                <li><kbd className="bg-gray-100 px-1 py-0.5 rounded border">Ctrl</kbd> + <kbd className="bg-gray-100 px-1 py-0.5 rounded border">S</kbd> : Lưu Dự Án</li>
                <li><kbd className="bg-gray-100 px-1 py-0.5 rounded border">Ctrl</kbd> + <kbd className="bg-gray-100 px-1 py-0.5 rounded border">O</kbd> : Mở Dự Án</li>
                <li><kbd className="bg-gray-100 px-1 py-0.5 rounded border">Ctrl</kbd> + <kbd className="bg-gray-100 px-1 py-0.5 rounded border">E</kbd> : Xuất Video</li>
                <li><kbd className="bg-gray-100 px-1 py-0.5 rounded border">Phím mũi tên</kbd> : Di chuyển phần tử đang chọn (Giữ <kbd className="bg-gray-100 px-1 py-0.5 rounded border">Shift</kbd> để di chuyển nhanh hơn)</li>
              </ul>
            </section>
          </div>

          
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};
