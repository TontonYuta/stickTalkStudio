export function buildStickmanPrompt(userTopic: string, options: {
  aspectRatio?: string;
  duration?: number;
  style?: string;
  dialogueStyle?: 'pedagogical' | 'witty' | 'dramatic' | 'storytelling' | 'conversational';
  dialogueBoxStyle?: 'bubble' | 'card' | 'cinema' | 'manga';
}): string {
  const duration = options.duration || 15;
  const aspectRatio = options.aspectRatio || '16:9';
  const dialogueStyle = options.dialogueStyle || 'pedagogical';
  const dialogueBoxStyle = options.dialogueBoxStyle || 'bubble';
  const isVertical = aspectRatio === '9:16';

  const isExplicitGraphTopic = /đồ thị|vẽ đồ thị|bảng biến thiên|khảo sát hàm|tiếp tuyến|parabol|curve plot|graph/i.test(userTopic);
  const isMathTopic = isExplicitGraphTopic || /toán|đại số|hình học|phương trình|tích phân|đạo hàm|cực trị|tam giác|định lý/i.test(userTopic);

  // Ground level coordinates & Harmonious object scaling (Vừa phải, cân đối)
  const groundY = isVertical ? (isExplicitGraphTopic ? 75 : 72) : 64;
  const char1X = isVertical ? (isExplicitGraphTopic ? 18 : 22) : (isExplicitGraphTopic ? 14 : 20);
  const char2X = isVertical ? (isExplicitGraphTopic ? 82 : 78) : (isExplicitGraphTopic ? 86 : 80);
  const charScale = isVertical ? 1.45 : 1.20;
  const propScale = isVertical ? 1.15 : 1.05;

  // Expected dialog lines based on duration
  const minLines = Math.max(3, Math.floor(duration / 3.0));
  const maxLines = Math.max(4, Math.floor(duration / 2.2));

  // Linguistic Tone Instructions based on dialogueStyle
  let toneGuidance = '';
  if (dialogueStyle === 'pedagogical') {
    toneGuidance = `- PHONG CÁCH SƯ PHẠM & HỌC THUẬT TINH GỌN (PEDAGOGICAL & CONCISE):
  + Ngôn từ khúc chiết, chuẩn mực tiếng Việt văn bản, câu từ sắc lẹm, TUYỆT ĐỐI KHÔNG DÀI DÒNG.
  + Phương pháp đàm thoại Socrates: Nêu bẫy sai lầm -> Đặt câu hỏi ngộ nhận -> Dẫn chứng đồ thị trực quan -> Chốt hạ định lý vàng.
  + Đại từ xưng hô tôn trọng, chuẩn mực sư phạm (Thầy - Em, hoặc Chuyên gia - Thính giả).`;
  } else if (dialogueStyle === 'witty') {
    toneGuidance = `- PHONG CÁCH HÀI HƯỚC & CHÂM BIẾM (WITTY & SATIRICAL):
  + Đối thoại dí dỏm, nhanh trí, "cà khịa" thông minh, lật ngược tình huống bất ngờ ở câu kết (punchline).
  + Lối nói duyên dáng, văn minh, kích thích tiếng cười trí tuệ chứ không thô tục.`;
  } else if (dialogueStyle === 'dramatic') {
    toneGuidance = `- PHONG CÁCH TRANH BIỆN & KỊCH TÍNH (DRAMATIC & DEBATE):
  + Câu từ đanh thép, phản biện quyết liệt, đưa ra dẫn chứng sắc bén để bảo vệ luận điểm.
  + Nhịp độ đối thoại dồn dập, tạo cảm giác đối kháng trí tuệ nghẹt thở.`;
  } else if (dialogueStyle === 'storytelling') {
    toneGuidance = `- PHONG CÁCH TRUYỀN CẢM HỨNG & TRIẾT LÝ (STORYTELLING & INSPIRATIONAL):
  + Giọng văn ấm áp, gợi mở cảm xúc, giàu hình ảnh ẩn dụ và triết lý sống.
  + Đúc kết bài học nhân sinh giá trị, tạo động lực mạnh mẽ cho người xem.`;
  } else {
    toneGuidance = `- PHONG CÁCH ĐỜI THƯỜNG & THÂN MẬT (CONVERSATIONAL & NATURAL):
  + Đối thoại tự nhiên, gần gũi, chân thực như hai người bạn ngoài đời nhưng vẫn lịch sự và chỉn chu.`;
  }

  return `Bạn là Tổng Đạo Diễn & Biên Kịch Hoạt Hình Người Que Đỉnh Cao (StickTalk Director Pro).
Hãy tạo một kịch bản hoạt hình người que 2D (Stickman Animation) làm rõ khái niệm/chủ đề sau theo cấu trúc đối thoại chuẩn mực THẦY VS TRÒ (Socrates Micro-Lesson):
KHÁI NIỆM CẦN LÀM RÕ: "${userTopic}"

=========================================
0. MÔ HÌNH NHÂN VẬT MẶC ĐỊNH: THẦY VS TRÒ (MENTOR & LEARNER)
=========================================
- NHÂN VẬT 1 (BÊN TRÁI - x=${char1X}): "THẦY" (Thầy giáo / Chuyên gia uyên bác phù hợp với chủ đề: vd Thầy Dev, Thầy AI, Thầy Minh, Chuyên Gia).
  + Phong thái: Điềm tĩnh, tự tin, uyên bác, giải thích bằng ví dụ và hình ảnh ẩn dụ đời thường.
  + Trang phục ("appearance"): "outfitStyle": "formal", "hasTie": true, "hasPocketPen": true, "accessory": "glasses", "shirtColor": "#2563eb", "pantsColor": "#1e293b".
  + Vị trí: Đứng vững ở x=${char1X}, y=${groundY}, "scale": ${charScale}, "flipX": false (nhìn sang phải về phía Trò).
- NHÂN VẬT 2 (BÊN PHẢI - x=${char2X}): "TRÒ" (Học sinh / Đồ đệ / Bạn Tí - đại diện cho khán giả tò mò).
  + Phong thái: Năng động, tò mò, hỏi đúng những ngộ nhận/thắc mắc phổ biến nhất của người mới học.
  + Trang phục ("appearance"): "outfitStyle": "polo", "hasTie": false, "hasBelt": true, "accessory": "cap", "shirtColor": "#fbbf24", "pantsColor": "#2563eb".
  + Vị trí: Đứng vững ở x=${char2X}, y=${groundY}, "scale": ${charScale}, "flipX": true (nhìn sang trái về phía Thầy).
- Hai nhân vật luôn nhìn vào nhau tạo thế đối thoại tự nhiên, khoảng cách tối thiểu 50% để sân khấu trung tâm thông thoáng.

=========================================
1. NGUYÊN TẮC BỐ CỤC KHÔNG GIAN & KÍCH THƯỚC VỪA PHẢI (SAFE-ZONE & BALANCED SCALE)
=========================================
- Tỉ lệ khung hình: "${aspectRatio}"
- KÍCH THƯỚC ĐỐI TƯỢNG VỪA PHẢI, CÂN ĐỐI (QUAN TRỌNG):
  + NHÂN VẬT ("scale"): ĐẶT CHUẨN XÁC "scale": ${charScale} (và trong mọi keyframes). Kích thước chiếm 35-40% chiều cao sân khấu trong 16:9 hoặc 28-32% trong 9:16 — vừa vặn để nhìn rõ tay chân và cử chỉ, TUYỆT ĐỐI KHÔNG để scale > 1.8 khiến nhân vật bị khổng lồ choán hết màn hình, và KHÔNG để scale < 0.9 khiến nhân vật tí hon.
  + ĐẠO CỤ / EMOJI ("scale"): ĐẶT CHUẨN XÁC "scale": ${propScale} đến ${(propScale * 1.15).toFixed(2)}. Kích thước đạo cụ vừa vặn cỡ quả cầu hoặc bàn tay nhân vật (~50-65px), KHÔNG để scale > 1.5 làm đạo cụ to đè lên mặt nhân vật.
- Mặt sàn đứng: Tọa độ Y nhân vật phải đặt chuẩn xác tại y=${groundY} để đứng vững trên sàn, không bay lơ lửng.
- Nhân vật 1 (Bên trái): Đứng tại x=${char1X}, y=${groundY}, "scale": ${charScale}, "flipX": false (hướng mặt sang phải).
- Nhân vật 2 (Bên phải): Đứng tại x=${char2X}, y=${groundY}, "scale": ${charScale}, "flipX": true (hướng mặt sang trái).
- Hai nhân vật luôn nhìn vào nhau tạo thế đối thoại tự nhiên, khoảng cách giữa 2 nhân vật tối thiểu 50% để sân khấu thông thoáng.
- BÓNG THOẠI KHÔNG ĐÈ NHAU (ZERO-OVERLAP): Khi Nhân vật A nói xong thì Nhân vật B mới được nói (startTime_B >= startTime_A + duration_A - 0.15s). Tuyệt đối không để 2 bóng thoại xuất hiện cùng lúc gây rối mắt.
- CHỐNG ĐÈ CHỮ VỚI ĐẠO CỤ (ANTI-OVERLAP VỚI PROPS):
  + Tuyệt đối KHÔNG đặt đạo cụ/emoji trên đỉnh đầu nhân vật (vùng x=15-30% hoặc x=70-85%, y=30-46%) vì đây là KHÔNG GIAN BÓNG THOẠI.
  + Đạo cụ minh họa / Emoji cảm xúc PHẢI ĐẶT Ở SÂN KHẤU TRUNG TÂM (x = 48-52%, y = 50-58%) hoặc LỆCH HÔNG (x = 36% hoặc x = 64%, y = 50-56%) để hoàn toàn thông thoáng, tôn lên nội dung câu thoại.

=========================================
2. QUY TẮC DIỄN HOẠT DỨT KHOÁT & ĐỨNG YÊN ĐỐI THOẠI (KHÔNG TRÔI VÔ THỨC)
=========================================
- ĐỨNG YÊN ĐỐI THOẠI (STATIONARY DIALOGUE STANCE): Trong hầu hết các cảnh đối thoại, nhân vật ĐỨNG YÊN VỮNG CHÃI tại vị trí của mình (NV1 ở x=${char1X}, NV2 ở x=${char2X}). KHÔNG TỰ Ý THAY ĐỔI TỌA ĐỘ X LĂNG XĂNG khiến nhân vật phải bước đi luân phiên. Chỉ thay đổi cử chỉ hai tay (armL, armR), góc nghiêng người (bodyLean), biểu cảm và góc nghiêng đầu (headTilt) tại chỗ. Chỉ di chuyển x khi kịch bản có lý do rõ ràng (ví dụ: lao tới chưởng, giật lùi té xỉu, bỏ chạy).
- CHỐNG TRÔI VÔ THỨC: Mọi Keyframe phải có mốc thời gian ("time") trùng khớp chính xác với thời điểm bắt đầu câu thoại hoặc sự kiện kịch bản ("startTime"). Nhân vật giữ vững tư thế, khi đến mốc thoại thì chuyển động dứt khoát vào tư thế mới.
- ĐỘ NGHIÊNG NGƯỜI ("bodyLean") & NGHIÊNG ĐẦU ("headTilt"):
  + Cơ thể phải có độ nghiêng người ("bodyLean": -10 đến +10) và nghiêng đầu ("headTilt": -15 đến +15) để tạo sinh khí, không đứng thẳng đơ như khúc gỗ.
- THƯ VIỆN TƯ THẾ DIỄN XUẤT CHUẨN:
  + Lúc chỉ tay tranh luận / giải thích: x giữ nguyên x=${char1X}, "armL": -110, "armR": 20, "bodyLean": 5, "headTilt": 0.
  + Lúc ngạc nhiên / bàng hoàng: x giữ nguyên x=${char2X}, "armL": -140, "armR": 140, "bodyLean": -6, "headTilt": -4.
  + Lúc thắc mắc / nghi hoặc: "armL": -30, "armR": 30, "bodyLean": 2, "headTilt": 8.
  + Lúc suy nghĩ / đăm chiêu: "armL": -130, "armR": -30, "bodyLean": 3, "headTilt": 4.
  + Lúc ăn mừng / đắc thắng: "armL": -150, "armR": 150, "bodyLean": 0, "headTilt": 0.
  + Lúc phóng chiêu / ra đòn: "armL": -120, "armR": -20, "bodyLean": 8, "legL": 25, "legR": -25.
  + Lúc trúng đòn / ngã ngửa (té xỉu): x lùi 4-8%, "rotation": 65-80, "armL": 120, "armR": -60, "bodyLean": -10, "headTilt": -8.
- Đạo cụ cảm xúc (Props emoji: 💡, ❓, 💻, 📚, ☕, 💢, 💧) xuất hiện đúng nhịp ở giữa sân khấu (x=50, y=52) với hiệu ứng "bounceIn" / "zoomIn".
- QUY TẮC ĐẠO CỤ VÀ ĐỒ THỊ (RẤT QUAN TRỌNG):
${isExplicitGraphTopic ? `  + CHỦ ĐỀ YÊU CẦU ĐỒ THỊ RÕ RÀNG: Phải tạo prop "type": "chart" với "chartConfig": { "chartType": "function", "fn": "x^3 - 3*x", "label": "y = x^3 - 3x", "showTangent": true, "showExtrema": true, "showGrid": true, "dynamicTrace": true } hoặc "type": "table" (Bảng biến thiên 3 tầng).
  + BỐ CỤC DUAL-ZONE CHỐNG ĐÈ: Trung tâm (x=28-72%) dành riêng cho Đồ thị/Bảng.` : `  + CẢNH BÁO: TUYỆT ĐỐI KHÔNG TỰ Ý TẠO ĐỒ THỊ HÀM SỐ (prop "type": "chart") HAY BẢNG BIẾN THIÊN (prop "type": "table")!
  + Người dùng KHÔNG yêu cầu đồ thị toán học. Sân khấu trung tâm phải để hoàn toàn thoáng đãng, chỉ điểm xuyết đạo cụ cảm xúc/emoji (💡, 🤖, 💻, 📚...) xuất hiện đúng nhịp rồi mờ dần!`}

=========================================
3. QUY TẮC CÔ ĐỌNG NGÔN TỪ & ĐỐI THOẠI SOCRATIC (CHỐNG TỪ NGỮ NHIỀU)
=========================================
${toneGuidance}

- QUY TẮC BẮT BUỘC: GIỚI HẠN SỐ TỪ CỰC KỲ NGHIÊM NGẶT (MAX 6 - 10 TỪ/CÂU):
  + CẢNH BÁO: Không bao giờ viết câu dài lê thê (> 12 từ)! Câu dài sẽ làm phình bóng thoại và che kín nhân vật/đồ thị.
  + MỖI CÂU THOẠI CHỈ ĐƯỢC PHÉP DÀI TỪ 6 ĐẾN 10 TỪ (tối đa 12 từ).
  + TRIỆT TIÊU 100% CÁC TỪ ĐỆM RƯỜM RÀ: CẤM các từ như "như chúng ta đã biết", "theo lý thuyết sách giáo khoa thì", "thầy xin giải thích rằng", "chúng ta có thể dễ dàng nhận thấy".
  + DÙNG LỐI NÓI THỰC CHIẾN, GÃY GỌN, GIÀU TÍNH HÀNH ĐỘNG: Mỗi câu như một đòn đánh sắc sảo, hỏi thẳng, đáp ngay, chốt gọn!

- CÔNG THỨC 4 HỒI SOCRATIC LÀM RÕ MỌI KHÁI NIỆM (THẦY & TRÒ):
  + CÂU 1 (HOOK / ĐẶT VẤN ĐỀ HOẶC NGỘ NHẬN - Trò hỏi, Max 7-10 từ): Trò nêu câu hỏi ngây thơ hoặc ngộ nhận phổ biến nhất về khái niệm "${userTopic}".
    Ví dụ: "Thầy ơi, AI Chatbot có bộ não thật không mà cái gì cũng biết?"
    Hoặc: "Ơ kìa Thầy! Tiếp tuyến nằm ngang là đạt cực trị ngay chứ ạ?"
  + CÂU 2 (ẨN DỤ ĐƠN GIẢN HÓA - Thầy đáp, Max 8-10 từ): Thầy giải thích điểm mấu chốt bằng một phép so sánh đời thường dễ hiểu.
    Ví dụ: "Không có não đâu em! Nó là cỗ máy đoán từ tiếp theo siêu tốc!"
    Hoặc: "Sai lầm nhé! Nhìn $y = x^3$: Tiếp tuyến ngang nhưng không đổi dấu!"
  + CÂU 3 (DẪN CHỨNG TRỰC QUAN - Đạo cụ/Sơ đồ hiện ra, Max 8-10 từ): Xuất hiện đạo cụ minh họa ở giữa sân khấu (Dual-Zone), Thầy giơ tay chỉ vào dẫn chứng.
    Ví dụ: "Giống bàn phím đoán từ, nhưng AI đọc cả triệu cuốn sách!"
  + CÂU 4 (BÍ KÍP CHỐT HẠ & GIÁC NGỘ - Max 6-9 từ): Trò giác ngộ nguyên lý, Thầy chốt câu khẩu quyết đúc kết.
    Ví dụ: "Biết nguyên lý rồi thì không sợ bị AI lừa nữa nhé!"
  + NHỊP ĐỐI THOẠI: Phải có từ ${minLines} đến ${maxLines} câu thoại tung hứng đối đáp (mỗi câu từ 6 - 10 từ, thời lượng 2.2s - 3.2s).
  + KIỂU HỘP THOẠI ("boxStyle"): Đặt mặc định "${dialogueBoxStyle}" (hoặc "card", "cinema", "bubble", "manga").

=========================================
4. PHỐI MÀU & TRANG PHỤC CHỈN CHU, LỊCH LÃM (DAPPER ATTIRE & AESTHETIC)
=========================================
- Trang phục chỉn chu ("appearance"):
  + "outfitStyle": "formal" (sơ mi cổ V chuẩn mực), "polo" (áo có cổ thanh lịch), "vest" (áo gile), hoặc "casual".
  + "hasTie": true/false kèm "tieColor" (vd: "#dc2626", "#2563eb", "#059669") tạo điểm nhấn quý phái.
  + "hasBelt": true kèm "beltColor" (vd: "#1e293b", "#334155") với mặt khóa kim loại vàng sang trọng ở vòng eo.
  + "hasPocketPen": true (túi áo ngực gài bút bi mạ vàng cho thầy giáo / chuyên gia / kỹ sư).
  + "shoeColor": (vd: "#0f172a", "#1e293b") giày da công sở bóng loáng có đế đứng phom.
- Màu sắc tương phản: NV1 và NV2 phối màu tương phản rõ rệt để khán giả phân biệt tức thì.
- Phụ kiện: Cho ít nhất 1 nhân vật đeo kính ("glasses"), nón kết ("cap") hoặc mũ cử nhân ("hat").
- Bối cảnh ("background"): Chọn class Tailwind phù hợp nhất ("bg-blue-50", "bg-gray-900", "bg-gradient-to-b from-blue-100 to-blue-300", "bg-green-50", "bg-white").
- Cử chỉ điềm đạm, vững chãi: Giữ tư thế đĩnh đạc, không rung giật lắc lư, chỉ đổi cử chỉ tay dứt khoát khi bắt đầu câu thoại.
- Lời nói khúc chiết, chuẩn mực: Đối thoại tự nhiên, câu từ gãy gọn, giàu tính tranh biện và trí tuệ, tránh sáo rỗng.
- Mỗi câu thoại trong "dialogBlocks" BẮT BUỘC có "roleIcon" định danh vai trò (ví dụ: "👨‍🏫", "👨‍🎓", "💼", "💻", "🔬", "📊") và "boxStyle": "${dialogueBoxStyle}".

=========================================
5. YÊU CẦU ĐẦU RA BẮT BUỘC
=========================================
CHỈ TRẢ VỀ DUY NHẤT 1 KHỐI JSON HỢP LỆ trong cặp thẻ \`\`\`json và \`\`\`. TUYỆT ĐỐI không có văn bản giải thích nào khác ngoài JSON.

Schema mẫu chuẩn xác:
{
  "title": "Tên video hấp dẫn, cuốn hút",
  "aspectRatio": "${aspectRatio}",
  "dialogueStyle": "${dialogueStyle}",
  "dialogueBoxStyle": "${dialogueBoxStyle}",
  "background": "bg-blue-50",
  "duration": ${duration},
  "filters": { "brightness": 100, "contrast": 105, "grayscale": 0, "sepia": 0, "blur": 0 },
  "characters": [
    {
      "id": "char-1",
      "name": "Tên NV1",
      "showName": true,
      "type": "basic",
      "x": ${char1X},
      "y": ${groundY},
      "scale": ${charScale},
      "rotation": 0,
      "flipX": false,
      "color": "#000000",
      "appearance": {
        "skinColor": "#ffddc1",
        "hairColor": "#1f2937",
        "hairStyle": "short",
        "shirtColor": "#2563eb",
        "pantsColor": "#1f2937",
        "accessory": "glasses",
        "outfitStyle": "formal",
        "hasTie": true,
        "tieColor": "#dc2626",
        "hasBelt": true,
        "beltColor": "#1f2937",
        "hasPocketPen": true,
        "shoeColor": "#0f172a"
      },
      "pose": { "armL": 20, "armR": -30, "legL": 10, "legR": -10, "bodyLean": 2, "headTilt": 0 },
      "startTime": 0,
      "duration": ${duration},
      "animation": { "in": "fadeIn", "inDuration": 0.5 },
      "keyframes": [
        { "id": "kf-1", "time": 0, "x": ${char1X}, "y": ${groundY}, "scale": ${charScale}, "rotation": 0, "pose": { "armL": 20, "armR": -30, "legL": 10, "legR": -10, "bodyLean": 2, "headTilt": 0 } },
        { "id": "kf-2", "time": 4, "x": ${char1X}, "y": ${groundY}, "scale": ${charScale}, "rotation": 0, "pose": { "armL": -110, "armR": 20, "legL": 10, "legR": -10, "bodyLean": 5, "headTilt": 0 } },
        { "id": "kf-3", "time": 9, "x": ${char1X}, "y": ${groundY}, "scale": ${charScale}, "rotation": 0, "pose": { "armL": -140, "armR": 140, "legL": 0, "legR": 0, "bodyLean": 0, "headTilt": 0 } }
      ]
    },
    {
      "id": "char-2",
      "name": "Tên NV2",
      "showName": true,
      "type": "basic",
      "x": ${char2X},
      "y": ${groundY},
      "scale": ${charScale},
      "rotation": 0,
      "flipX": true,
      "color": "#000000",
      "appearance": {
        "skinColor": "#ffffff",
        "hairColor": "#000000",
        "hairStyle": "short",
        "shirtColor": "#fbbf24",
        "pantsColor": "#2563eb",
        "accessory": "cap",
        "outfitStyle": "polo",
        "hasTie": false,
        "hasBelt": true,
        "beltColor": "#2563eb",
        "hasPocketPen": false,
        "shoeColor": "#1e293b"
      },
      "pose": { "armL": -20, "armR": 30, "legL": -10, "legR": 10, "bodyLean": -2, "headTilt": 0 },
      "startTime": 0,
      "duration": ${duration},
      "animation": { "in": "fadeIn", "inDuration": 0.5 },
      "keyframes": [
        { "id": "kf-21", "time": 0, "x": ${char2X}, "y": ${groundY}, "scale": ${charScale}, "rotation": 0, "pose": { "armL": -20, "armR": 30, "legL": -10, "legR": 10, "bodyLean": -2, "headTilt": 0 } },
        { "id": "kf-22", "time": 4.5, "x": ${char2X}, "y": ${groundY}, "scale": ${charScale}, "rotation": 0, "pose": { "armL": -140, "armR": -20, "legL": 0, "legR": 0, "bodyLean": 4, "headTilt": 8 } }
      ]
    }
  ],
  "props": ${isExplicitGraphTopic ? `[
    {
      "id": "prop-graph",
      "type": "chart",
      "content": "x^3 - 3*x",
      "x": 50,
      "y": ${isVertical ? 26 : 44},
      "scale": ${isVertical ? 0.92 : 1.0},
      "rotation": 0,
      "startTime": 0.5,
      "duration": ${Math.max(6, duration - 1)},
      "animation": { "in": "zoomIn", "out": "fadeOut" },
      "chartConfig": {
        "chartType": "function",
        "fn": "x^3 - 3*x",
        "label": "y = x^3 - 3x",
        "showTangent": true,
        "showExtrema": true,
        "showGrid": true,
        "dynamicTrace": true
      }
    }
  ]` : `[
    {
      "id": "prop-1",
      "type": "emoji",
      "content": "💡",
      "x": 50,
      "y": 52,
      "scale": ${propScale},
      "rotation": 0,
      "startTime": 3.8,
      "duration": 3,
      "animation": { "in": "bounceIn", "out": "fadeOut" }
    }
  ]`},
  "dialogBlocks": ${isMathTopic ? `[
    {
      "id": "d1",
      "characterId": "char-1",
      "roleIcon": "👨‍🏫",
      "boxStyle": "${dialogueBoxStyle}",
      "text": "$f'(x_0) = 0$ là đạt cực trị ngay? Sai lầm chết người!",
      "startTime": 0.5,
      "duration": 3.0,
      "emotion": "explaining",
      "bubbleType": "normal"
    },
    {
      "id": "d2",
      "characterId": "char-2",
      "roleIcon": "👨‍🎓",
      "boxStyle": "${dialogueBoxStyle}",
      "text": "Ủa kìa Thầy? Tiếp tuyến nằm ngang cơ mà?",
      "startTime": 3.7,
      "duration": 3.0,
      "emotion": "surprised",
      "bubbleType": "normal"
    },
    {
      "id": "d3",
      "characterId": "char-1",
      "roleIcon": "👨‍🏫",
      "boxStyle": "${dialogueBoxStyle}",
      "text": "Nhìn $y = x^3$: Tiếp tuyến ngang nhưng không hề đổi dấu!",
      "startTime": 7.0,
      "duration": 3.2,
      "emotion": "explaining",
      "bubbleType": "normal"
    },
    {
      "id": "d4",
      "characterId": "char-2",
      "roleIcon": "👨‍🎓",
      "boxStyle": "${dialogueBoxStyle}",
      "text": "A! Phải thực sự đổi dấu mới là cực trị!",
      "startTime": 10.4,
      "duration": 3.0,
      "emotion": "happy",
      "bubbleType": "normal"
    }
  ]` : `[
    {
      "id": "d1",
      "characterId": "char-1",
      "roleIcon": "👨‍🏫",
      "boxStyle": "${dialogueBoxStyle}",
      "text": "Mở màn sắc sảo, đánh thẳng vào trọng tâm!",
      "startTime": 0.5,
      "duration": 3.0,
      "emotion": "explaining",
      "bubbleType": "normal"
    },
    {
      "id": "d2",
      "characterId": "char-2",
      "roleIcon": "👨‍🎓",
      "boxStyle": "${dialogueBoxStyle}",
      "text": "Câu đối đáp bất ngờ, bắt bẻ thông minh!",
      "startTime": 3.8,
      "duration": 3.0,
      "emotion": "surprised",
      "bubbleType": "normal"
    }
  ]`},
  "audios": []
}
`;
}

export function buildRerenderPrompt(
  currentProject: any,
  modificationPrompt: string,
  options?: { duration?: number; aspectRatio?: string }
): string {
  const currentJsonStr = JSON.stringify(currentProject, null, 2);
  const aspectRatio = options?.aspectRatio || currentProject.aspectRatio || '16:9';
  const duration = options?.duration || currentProject.duration || 15;

  return `Bạn là Tổng Đạo Diễn & Biên Kịch Hoạt Hình Người Que Đỉnh Cao (StickTalk Director Pro).
Người dùng đã render video lần 1 và muốn bạn RERENDER / TINH CHỈNH LẠI KỊCH BẢN dựa trên yêu cầu sau:

=========================================
YÊU CẦU ĐIỀU CHỈNH CỦA NGƯỜI DÙNG:
"${modificationPrompt}"
=========================================

KỊCH BẢN HIỆN TẠI CỦA VIDEO LẦN 1:
\`\`\`json
${currentJsonStr}
\`\`\`

=========================================
QUY TẮC CỐT LÕI KHI RERENDER (BẢO TOÀN PHẦN ĐÃ ỔN):
=========================================
1. BẢO TOÀN PHẦN ĐÃ ỔN (CONSERVATIVE PRESERVATION):
   - GIỮ NGUYÊN các nhân vật (ID, màu sắc, phong cách trang phục) và thời lượng nếu người dùng không yêu cầu thay đổi.
   - GIỮ NGUYÊN các câu thoại hoặc đạo cụ đã hợp lý.
   - CHỈ SỬA HOẶC BỔ SUNG đúng các phần mà người dùng yêu cầu điều chỉnh.
2. ĐỨNG YÊN ĐỐI THOẠI (STATIONARY DIALOGUE STANCE):
   - Nếu người dùng yêu cầu "cho nhân vật đứng yên", "không đi lại", "không trôi lăng xăng": Toàn bộ keyframes của nhân vật giữ nguyên tọa độ X ban đầu (NV1 ở x ≈ 22, NV2 ở x ≈ 78). Hai chân (legL: 10, legR: -10) đứng thẳng bám sàn, chỉ cử động tay (armL, armR), nghiêng người (bodyLean), nghiêng đầu (headTilt) và biểu cảm tự nhiên.
3. CHỐNG ĐÈ CHỮ & ĐẠO CỤ (ANTI-OVERLAP):
   - Đạo cụ/emoji PHẢI ở trung tâm sân khấu (x=48-52, y=50-58) hoặc lệch hông. Tuyệt đối không đặt trên đỉnh đầu nhân vật gây đè bóng thoại.
   - Các câu thoại ("dialogBlocks") không được chồng lấn thời gian (startTime_B >= startTime_A + duration_A - 0.15s).
4. CÔ ĐỌNG NGÔN TỪ (ANTI-WORDINESS & CONCISENESS):
   - Mọi câu thoại mới hoặc chỉnh sửa BẮT BUỘC chỉ dài từ 6 ĐẾN 10 TỪ (tối đa 12 từ).
   - Triệt tiêu hoàn toàn từ đệm dài dòng để bóng thoại luôn nhỏ gọn, thanh thoát, không che khuất nhân vật hoặc đồ thị.
5. ĐẦU RA BẮT BUỘC:
   - CHỈ TRẢ VỀ DUY NHẤT 1 KHỐI JSON HỢP LỆ trong cặp thẻ \`\`\`json và \`\`\`.
   - TUYỆT ĐỐI không có bất kỳ văn bản giải thích nào khác ngoài JSON.
`;
}

