# 🎬 StickTalk Studio

> **Studio Sản Xuất Hoạt Hình Người Que Đỉnh Cao Dành Cho Giáo Dục & Video Ngắn (Shorts / TikTok / Reels)**

StickTalk Studio là nền tảng web tạo hoạt hình 2D vector với nhân vật người que linh hoạt, tích hợp sâu mô hình AI (Antigravity & Gemini), hỗ trợ chuyên sâu các chủ đề **Toán học, Khoa học & Đối thoại hài hước**.

---

## ✨ Tính Năng Nổi Bật

- **🧍 Nhân vật Người Que Sinh Động (Articulated Stickman Puppetry):**
  - Đầy đủ khớp động đa tầng: nghiêng đầu, xoay thân, khớp khuỷu tay, chân đứng bám sàn chống trôi.
  - Tùy biến trang phục chỉn chu: áo sơ mi, cà vạt, thắt lưng, bút cài túi, kính mắt, kiểu tóc.
  - Thư viện biểu cảm khuôn mặt phong phú: nói chuyện, thắc mắc, vui mừng, cười, khóc, ngạc nhiên.

- **📐 Đồ Họa Toán Học & Sư Phạm Chuyên Sâu:**
  - **Công thức Toán LaTeX**: Kết xuất mượt mà sắc nét với KaTeX (chế độ inline và display).
  - **Đồ thị hàm số động SVG**: Tiếp tuyến đổi màu theo dấu đạo hàm, bắt điểm cực trị thời gian thực ($y = x^2, x^3 - 3x$,...).
  - **Bảng biến thiên 3 tầng**: Trực quan hóa đạo hàm và chiều biến thiên mũi tên.

- **🛡️ Bố Cục Dual-Zone Chống Đè Chữ (Anti-Overlap Layout):**
  - Tự động tối ưu theo tỷ lệ màn hình (`16:9` ngang hoặc `9:16` dọc).
  - Tách biệt vùng sân khấu trung tâm (đồ thị / bảng biểu) và vùng neo bóng thoại ở 2 cánh ngoài.
  - Neo bóng thoại thông minh với thẻ chức danh người nói, tự động co giãn kích thước chữ.

- **⚡ Thanh Tinh Chỉnh Nhanh (Quick Rerender Bar):**
  - Rerender AI ngay tại giao diện chính, không cần mở popup.
  - 6 thẻ tác vụ 1-click: *Đứng yên đối thoại*, *Xóa sạch emoji cũ*, *Rút ngắn thoại (<10 từ)*, *Nền tối*, *Sư phạm chuẩn*, *Hài hước & bẻ lái*.
  - Chế độ kép: **⚡ Nhanh** (tinh chỉnh tức thì 50ms) & **✨ AI Sâu** (Antigravity biên tập chuyên sâu).

- **🎥 Xuất Video MP4 Chất Lượng Cao:**
  - Kết xuất chuẩn xác từng khung hình qua **Playwright Chrome Headless & FFmpeg**.
  - Tự động cắt sạch pre-roll trễ thời gian, đảm bảo video sạch 100% không dính giao diện editor.
  - Hỗ trợ đa dạng độ phân giải (1080p Full HD, 720p HD) và tốc độ khung hình (30fps / 60fps).

---

## 🚀 Hướng Dẫn Cài Đặt & Khởi Chạy

### Yêu cầu hệ thống
- **Node.js**: phiên bản >= 18
- **Google Chrome** hoặc Chromium
- **FFmpeg**: để chuyển mã và xuất video MP4

### Các bước cài đặt

1. **Cài đặt dependencies**:
   ```bash
   npm install
   ```

2. **Cấu hình biến môi trường** (Tùy chọn nếu dùng Gemini API):
   ```bash
   cp .env.example .env
   # Điền GEMINI_API_KEY nếu bạn muốn gọi trực tiếp Gemini API
   ```

### Chạy App Trực Tiếp (Standalone Desktop App - Không Cần Trình Duyệt / Localhost)

StickTalk Studio đã được build thành **bản ứng dụng máy tính trực tiếp** (Desktop App với cửa sổ riêng, icon độc lập và menu hệ thống, không cần mở trình duyệt web hay gõ localhost):

- **Cách 1: Khởi chạy trực tiếp từ terminal / file manager**:
  ```bash
  ./sticktalk-studio
  # hoặc: npm run app
  ```
- **Cách 2: Mở từ Menu ứng dụng Ubuntu hoặc Desktop**:
  - Nhấn phím `Super` (Windows) trên bàn phím, gõ **StickTalk Studio** và nhấp mở.
  - Hoặc nhấp đúp vào biểu tượng `StickTalk Studio` ngay trên màn hình nền (`Desktop`).

- **Đóng gói lại bản cài đặt độc lập (Packaged Binary)**:
  ```bash
  npm run build:app
  ```
  File thực thi độc lập được tạo tại: `dist-app/StickTalk-Studio-linux-x64/StickTalk-Studio`

---

### Chạy qua Web Server (Nếu muốn mở qua trình duyệt):

1. **Khởi chạy môi trường phát triển**:
   ```bash
   npm run dev
   # Ứng dụng sẽ chạy tại http://localhost:3050
   ```

2. **Biên dịch và chạy bản web sản xuất**:
   ```bash
   npm run build
   npm start
   ```

3. **Chạy bộ kiểm thử tự động**:
   ```bash
   npm test
   ```

---

## ⌨️ Phím Tắt Tiện Dụng

| Phím tắt | Tác vụ |
| :--- | :--- |
| `Space` | Phát / Tạm dừng video (Play / Pause) |
| `Ctrl + E` / `Cmd + E` | Mở hộp thoại Xuất Video MP4 |
| `Ctrl + S` / `Cmd + S` | Lưu dự án xuống máy (Export JSON) |
| `Ctrl + O` / `Cmd + O` | Mở dự án từ file JSON (Import JSON) |
| `Delete` / `Backspace` | Xóa phần tử đang chọn trên sân khấu |

---

## 🛠️ Công Nghệ Sử Dụng

- **Frontend**: React 19, Vite 6, Tailwind CSS 4, Motion, Lucide React, KaTeX
- **State Management**: Zustand
- **Backend & Export Engine**: Express, Playwright Core, FFmpeg, Esbuild, TSX
- **AI Integration**: Antigravity CLI (`agy`), Google GenAI SDK (`@google/genai`)

---

## 📄 Bản Quyền (License)

Dự án được phát hành theo giấy phép [Apache-2.0](LICENSE).
