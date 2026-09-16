import { ProjectState } from '../src/types';

export function getFallbackScenario(topic: string = '', options: {
  aspectRatio?: string;
  duration?: number;
  dialogueStyle?: 'pedagogical' | 'witty' | 'dramatic' | 'storytelling' | 'conversational';
  dialogueBoxStyle?: 'bubble' | 'card' | 'cinema' | 'manga';
} = {}): ProjectState {
  const duration = options.duration || 16;
  const aspectRatio = (options.aspectRatio as any) || '16:9';
  const dialogueStyle = options.dialogueStyle || 'pedagogical';
  const dialogueBoxStyle = options.dialogueBoxStyle || 'bubble';
  const isVertical = aspectRatio === '9:16';
  const groundY = isVertical ? 72 : 64;
  const char1X = isVertical ? 24 : 22;
  const char2X = isVertical ? 76 : 78;
  const charScale = isVertical ? 1.55 : 1.22;
  const propScale = isVertical ? 1.25 : 1.15;
  const lower = topic.toLowerCase();

  // Scenario 0: Mathematics, Function Graph & Simulation (Toán học & Mô phỏng Đồ thị)
  if (lower.includes('toán') || lower.includes('hàm') || lower.includes('đồ thị') || lower.includes('math') || lower.includes('graph') || lower.includes('công thức') || lower.includes('parabol') || lower.includes('giải tích')) {
    const mathChar1X = isVertical ? 18 : 13;
    const mathChar2X = isVertical ? 82 : 87;
    const mathGroundY = isVertical ? 75 : 64;
    const mathPropY = isVertical ? 26 : 44;

    return {
      title: "Bí Kíp Khảo Sát Đồ Thị & Tiếp Tuyến Đổi Màu",
      aspectRatio,
      dialogueStyle,
      dialogueBoxStyle,
      background: "bg-slate-900",
      duration,
      filters: { brightness: 100, contrast: 105, grayscale: 0, sepia: 0, blur: 0 },
      characters: [
        {
          id: "char-teacher",
          name: "Thầy Giải Tích",
          showName: true,
          type: "basic",
          x: mathChar1X,
          y: mathGroundY,
          scale: charScale,
          flipX: false,
          color: "#38bdf8",
          appearance: {
            skinColor: "#ffedd5",
            hairColor: "#1e293b",
            hairStyle: "short",
            shirtColor: "#2563eb",
            pantsColor: "#0f172a",
            accessory: "glasses",
            outfitStyle: "formal",
            hasTie: true,
            tieColor: "#dc2626",
            hasBelt: true,
            beltColor: "#0f172a",
            hasPocketPen: true,
            shoeColor: "#020617"
          },
          pose: { armL: -110, armR: 20, legL: 10, legR: -10, bodyLean: 4, headTilt: 0 },
          startTime: 0,
          duration,
          animation: { in: "slideInLeft", inDuration: 0.8 },
          keyframes: [
            { id: "kf-t1", time: 0, x: mathChar1X, y: mathGroundY, scale: charScale, rotation: 0, pose: { armL: 20, armR: -30, legL: 10, legR: -10, bodyLean: 2, headTilt: 0 } },
            { id: "kf-t2", time: 3, x: mathChar1X, y: mathGroundY, scale: charScale, rotation: 0, pose: { armL: -110, armR: 20, legL: 10, legR: -10, bodyLean: 5, headTilt: 0 } },
            { id: "kf-t3", time: 9, x: mathChar1X, y: mathGroundY, scale: charScale, rotation: 0, pose: { armL: -140, armR: 140, legL: 0, legR: 0, bodyLean: 0, headTilt: 0 } }
          ]
        },
        {
          id: "char-student",
          name: "Sĩ Tử 2K",
          showName: true,
          type: "basic",
          x: mathChar2X,
          y: mathGroundY,
          scale: charScale,
          flipX: true,
          color: "#f59e0b",
          appearance: {
            skinColor: "#ffffff",
            hairColor: "#0f172a",
            hairStyle: "spiky",
            shirtColor: "#f59e0b",
            pantsColor: "#1e293b",
            accessory: "cap",
            outfitStyle: "polo",
            hasTie: false,
            hasBelt: true,
            beltColor: "#334155",
            hasPocketPen: false,
            shoeColor: "#0f172a"
          },
          pose: { armL: -20, armR: 30, legL: -10, legR: 10, bodyLean: -2, headTilt: 0 },
          startTime: 0,
          duration,
          animation: { in: "slideInRight", inDuration: 0.8 },
          keyframes: [
            { id: "kf-s1", time: 0, x: mathChar2X, y: mathGroundY, scale: charScale, rotation: 0, pose: { armL: -20, armR: 30, legL: -10, legR: 10, bodyLean: -2, headTilt: 0 } },
            { id: "kf-s2", time: 4, x: mathChar2X, y: mathGroundY, scale: charScale, rotation: 0, pose: { armL: -140, armR: 140, legL: 0, legR: 0, bodyLean: -6, headTilt: -4 } },
            { id: "kf-s3", time: 13, x: mathChar2X + (isVertical ? 3 : 5), y: mathGroundY + 4, scale: charScale, rotation: 75, pose: { armL: 120, armR: -60, legL: 30, legR: -30, bodyLean: -10, headTilt: -8 } }
          ]
        }
      ],
      props: [
        {
          id: "prop-graph",
          type: "chart",
          content: "x^3 - 3*x",
          x: 50,
          y: mathPropY,
          scale: isVertical ? 0.92 : 0.98,
          rotation: 0,
          startTime: 0.8,
          duration: 7.5,
          animation: { in: "zoomIn", out: "fadeOut" },
          chartConfig: {
            chartType: "function",
            fn: "x^3 - 3*x",
            label: "y = x^3 - 3x",
            showTangent: true,
            showExtrema: true,
            showGrid: true,
            dynamicTrace: true,
            xMin: -3,
            xMax: 3,
            yMin: -3.5,
            yMax: 3.5
          }
        },
        {
          id: "prop-math-1",
          type: "math",
          content: "y' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1",
          x: 50,
          y: isVertical ? 50 : 78,
          scale: 0.88,
          rotation: 0,
          startTime: 3.2,
          duration: 5.2,
          animation: { in: "fadeIn", out: "fadeOut" },
          mathConfig: {
            formula: "y' = 3x^2 - 3 = 0 \\Leftrightarrow x = \\pm 1",
            title: "Nghiệm Đạo Hàm",
            cardStyle: "dark",
            displayMode: true
          }
        },
        {
          id: "prop-table",
          type: "table",
          content: "bbt",
          x: 50,
          y: mathPropY,
          scale: isVertical ? 0.92 : 1.0,
          rotation: 0,
          startTime: 8.8,
          duration: 6.5,
          animation: { in: "bounceIn", out: "fadeOut" },
          tableConfig: {
            tableType: "variation",
            title: "Bảng Biến Thiên Hàm Bậc Ba",
            variation: {
              xRow: ["-\\infty", "-1", "1", "+\\infty"],
              yPrimeRow: ["+", "0", "-", "0", "+"],
              yRow: [
                { val: "-\\infty", dir: "up" },
                { val: "2", dir: "down" },
                { val: "-2", dir: "up" },
                { val: "+\\infty", dir: "none" }
              ]
            }
          }
        }
      ],
      dialogBlocks: [
        {
          id: "d-1",
          characterId: "char-teacher",
          roleIcon: "👨‍🏫",
          boxStyle: dialogueBoxStyle,
          text: "$f'(x_0) = 0$ là đạt cực trị ngay? Sai lầm chết người!",
          startTime: 0.5,
          duration: 3.1,
          emotion: "explaining",
          bubbleType: "normal"
        },
        {
          id: "d-2",
          characterId: "char-student",
          roleIcon: "👨‍🎓",
          boxStyle: dialogueBoxStyle,
          text: "Ơ kìa Thầy! Tiếp tuyến nằm ngang cơ mà?",
          startTime: 3.8,
          duration: 2.9,
          emotion: "surprised",
          bubbleType: "normal"
        },
        {
          id: "d-3",
          characterId: "char-teacher",
          roleIcon: "👨‍🏫",
          boxStyle: dialogueBoxStyle,
          text: "Nhìn $y = x^3$: Tiếp tuyến ngang nhưng không hề đổi dấu!",
          startTime: 6.9,
          duration: 3.2,
          emotion: "happy",
          bubbleType: "normal"
        },
        {
          id: "d-4",
          characterId: "char-student",
          roleIcon: "👨‍🎓",
          boxStyle: dialogueBoxStyle,
          text: "A ha! Bắt buộc $y'$ phải đổi dấu mới là cực trị!",
          startTime: 10.3,
          duration: 2.8,
          emotion: "laughing",
          bubbleType: "manga"
        },
        {
          id: "d-5",
          characterId: "char-teacher",
          roleIcon: "👨‍🏫",
          boxStyle: dialogueBoxStyle,
          text: "Chuẩn luôn! Nắm chắc bản chất là ăn trọn điểm thi!",
          startTime: 13.3,
          duration: 2.7,
          emotion: "explaining",
          bubbleType: "normal"
        }
      ],
      audios: []
    };
  }

  // Scenario 1: Martial Arts Duel / Chưởng Pháp
  if (lower.includes('võ') || lower.includes('chưởng') || lower.includes('đấu') || lower.includes('chiến') || lower.includes('fight')) {
    return {
      title: "Trận Đấu Võ Thuật Người Que Đỉnh Cao",
      aspectRatio,
      dialogueStyle,
      dialogueBoxStyle,
      background: "bg-gray-900",
      duration,
      filters: { brightness: 105, contrast: 110, grayscale: 0, sepia: 0, blur: 0 },
      characters: [
        {
          id: "char-blue",
          name: "Lam Hiệp",
          showName: true,
          type: "basic",
          x: char1X,
          y: groundY,
          scale: charScale,
          flipX: false,
          color: "#38bdf8",
          appearance: {
            skinColor: "#ffffff",
            hairColor: "#0284c7",
            hairStyle: "spiky",
            shirtColor: "#0284c7",
            pantsColor: "#0f172a",
            accessory: "none",
            outfitStyle: "casual",
            hasTie: false,
            hasBelt: true,
            beltColor: "#0284c7",
            hasPocketPen: false,
            shoeColor: "#0f172a"
          },
          pose: { armL: -45, armR: 45, legL: 20, legR: -20 },
          startTime: 0,
          duration,
          animation: { in: "slideInLeft", inDuration: 0.8 },
          keyframes: [
            { id: "kf-b1", time: 0, x: char1X, y: groundY, scale: charScale, rotation: 0, pose: { armL: -45, armR: 45, legL: 20, legR: -20, bodyLean: 2, headTilt: 0 } },
            { id: "kf-b2", time: 2.5, x: char1X + 4, y: groundY, scale: charScale, rotation: 0, pose: { armL: -120, armR: -20, legL: 30, legR: -30, bodyLean: 6, headTilt: 0 } },
            { id: "kf-b3", time: 7.5, x: char1X + 18, y: groundY - 5, scale: Number((charScale * 1.05).toFixed(2)), rotation: 0, pose: { armL: -140, armR: 20, legL: 15, legR: -15, bodyLean: 4, headTilt: 0 } },
            { id: "kf-b4", time: 12.5, x: char1X + 10, y: groundY, scale: charScale, rotation: 0, pose: { armL: -150, armR: 150, legL: 0, legR: 0, bodyLean: 0, headTilt: 0 } }
          ]
        },
        {
          id: "char-red",
          name: "Hồng Ma",
          showName: true,
          type: "basic",
          x: char2X,
          y: groundY,
          scale: charScale,
          flipX: true,
          color: "#f87171",
          appearance: {
            skinColor: "#ffffff",
            hairColor: "#dc2626",
            hairStyle: "bun",
            shirtColor: "#ef4444",
            pantsColor: "#111827",
            accessory: "none",
            outfitStyle: "casual",
            hasTie: false,
            hasBelt: true,
            beltColor: "#b91c1c",
            hasPocketPen: false,
            shoeColor: "#111827"
          },
          pose: { armL: 40, armR: -40, legL: -20, legR: 20 },
          startTime: 0,
          duration,
          animation: { in: "slideInRight", inDuration: 0.8 },
          keyframes: [
            { id: "kf-r1", time: 0, x: char2X, y: groundY, scale: charScale, rotation: 0, pose: { armL: 40, armR: -40, legL: -20, legR: 20, bodyLean: -2, headTilt: 0 } },
            { id: "kf-r2", time: 3.0, x: char2X - 2, y: groundY, scale: charScale, rotation: 0, pose: { armL: -30, armR: 90, legL: -25, legR: 25, bodyLean: 3, headTilt: 0 } },
            { id: "kf-r3", time: 4.8, x: char2X + 6, y: groundY, scale: Number((charScale * 0.95).toFixed(2)), rotation: 60, pose: { armL: 120, armR: -60, legL: 40, legR: -10, bodyLean: -12, headTilt: -8 } },
            { id: "kf-r4", time: 8.5, x: char2X - 6, y: groundY, scale: charScale, rotation: 0, pose: { armL: -120, armR: -20, legL: 20, legR: -20, bodyLean: 4, headTilt: 0 } }
          ]
        }
      ],
      props: [
        {
          id: "prop-sfx-start",
          type: "text",
          content: "FIGHT!",
          x: 50,
          y: 28,
          scale: Number((propScale * 1.2).toFixed(2)),
          rotation: 0,
          startTime: 0.2,
          duration: 1.8,
          animation: { in: "bounceIn", out: "fadeOut" }
        },
        {
          id: "prop-ball",
          type: "emoji",
          content: "⚡",
          x: char1X + 8,
          y: groundY - 12,
          scale: propScale,
          rotation: 0,
          startTime: 2.8,
          duration: 1.8,
          keyframes: [
            { id: "kf-p1", time: 2.8, x: char1X + 8, y: groundY - 12, scale: Number((propScale * 0.5).toFixed(2)) },
            { id: "kf-p2", time: 4.6, x: char2X - 4, y: groundY - 12, scale: Number((propScale * 1.3).toFixed(2)) }
          ]
        },
        {
          id: "prop-boom",
          type: "emoji",
          content: "💥",
          x: char2X,
          y: groundY - 12,
          scale: Number((propScale * 1.4).toFixed(2)),
          rotation: 0,
          startTime: 4.6,
          duration: 1.5,
          animation: { in: "zoomIn", out: "fadeOut" }
        }
      ],
      dialogBlocks: [
        {
          id: "d1",
          characterId: "char-blue",
          roleIcon: "⚡",
          boxStyle: dialogueBoxStyle,
          text: "Tiếp lấy Lôi Điện Chưởng vô ảnh của ta!",
          startTime: 0.8,
          duration: 2.6,
          emotion: "angry",
          bubbleType: "shout"
        },
        {
          id: "d2",
          characterId: "char-red",
          roleIcon: "🔥",
          boxStyle: dialogueBoxStyle,
          text: "Hừ! Chiêu thức hoa mỹ đấy, nhưng chưa đủ đâu!",
          startTime: 4.8,
          duration: 2.8,
          emotion: "laughing",
          bubbleType: "manga"
        },
        {
          id: "d3",
          characterId: "char-blue",
          roleIcon: "⚡",
          boxStyle: dialogueBoxStyle,
          text: "Đừng vội đắc ý, tầng chưởng pháp thứ hai xuất thế!",
          startTime: 8.0,
          duration: 2.8,
          emotion: "explaining",
          bubbleType: "normal"
        },
        {
          id: "d4",
          characterId: "char-red",
          roleIcon: "🔥",
          boxStyle: dialogueBoxStyle,
          text: "Được lắm! Quyết chiến đỉnh phong phân thắng bại!",
          startTime: 11.2,
          duration: 2.8,
          emotion: "angry",
          bubbleType: "shout"
        }
      ],
      audios: []
    };
  }

  // Scenario 2: Tech / Dev Comedy / Bug
  if (lower.includes('code') || lower.includes('bug') || lower.includes('dev') || lower.includes('lập trình') || lower.includes('sếp') || lower.includes('it')) {
    return {
      title: "Chuyện Lập Trình Viên & Bug Đêm Release",
      aspectRatio,
      dialogueStyle,
      dialogueBoxStyle,
      background: "bg-blue-50",
      duration,
      filters: { brightness: 100, contrast: 100, grayscale: 0, sepia: 0, blur: 0 },
      characters: [
        {
          id: "char-dev",
          name: "Dev Tuấn",
          showName: true,
          type: "basic",
          x: char1X,
          y: groundY,
          scale: charScale,
          flipX: false,
          color: "#1e293b",
          appearance: {
            skinColor: "#ffedd5",
            hairColor: "#0f172a",
            hairStyle: "short",
            shirtColor: "#3b82f6",
            pantsColor: "#1e293b",
            accessory: "glasses",
            outfitStyle: "polo",
            hasTie: false,
            hasBelt: true,
            beltColor: "#1e293b",
            hasPocketPen: true,
            shoeColor: "#0f172a"
          },
          pose: { armL: 20, armR: -40, legL: 10, legR: -10 },
          startTime: 0,
          duration,
          animation: { in: "fadeIn", inDuration: 0.5 },
          keyframes: [
            { id: "kf-d1", time: 0, x: char1X, y: groundY, scale: charScale, rotation: 0, pose: { armL: 20, armR: -40, legL: 10, legR: -10, bodyLean: 2, headTilt: 0 } },
            { id: "kf-d2", time: 3.5, x: char1X + 3, y: groundY, scale: charScale, rotation: 0, pose: { armL: -120, armR: 120, legL: 0, legR: 0, bodyLean: 5, headTilt: 0 } },
            { id: "kf-d3", time: 7.5, x: char1X - 2, y: groundY, scale: charScale, rotation: 0, pose: { armL: -140, armR: -140, legL: 20, legR: -20, bodyLean: -4, headTilt: 6 } },
            { id: "kf-d4", time: 11.5, x: char1X, y: groundY, scale: charScale, rotation: 0, pose: { armL: -130, armR: -30, legL: 5, legR: -5, bodyLean: 2, headTilt: 0 } }
          ]
        },
        {
          id: "char-pm",
          name: "Sếp PM",
          showName: true,
          type: "basic",
          x: char2X,
          y: groundY,
          scale: charScale,
          flipX: true,
          color: "#0f172a",
          appearance: {
            skinColor: "#ffffff",
            hairColor: "#78350f",
            hairStyle: "short",
            shirtColor: "#10b981",
            pantsColor: "#374151",
            accessory: "none",
            outfitStyle: "formal",
            hasTie: true,
            tieColor: "#047857",
            hasBelt: true,
            beltColor: "#111827",
            hasPocketPen: true,
            shoeColor: "#1f2937"
          },
          pose: { armL: -20, armR: 30, legL: -10, legR: 10 },
          startTime: 0,
          duration,
          animation: { in: "slideInRight", inDuration: 0.6 },
          keyframes: [
            { id: "kf-pm1", time: 0, x: char2X, y: groundY, scale: charScale, rotation: 0, pose: { armL: -20, armR: 30, legL: -10, legR: 10, bodyLean: -2, headTilt: 0 } },
            { id: "kf-pm2", time: 6.8, x: char2X - 5, y: groundY, scale: charScale, rotation: 0, pose: { armL: -110, armR: 40, legL: 15, legR: -15, bodyLean: 6, headTilt: -4 } }
          ]
        }
      ],
      props: [
        {
          id: "prop-laptop",
          type: "emoji",
          content: "💻",
          x: char1X + 9,
          y: groundY - 8,
          scale: propScale,
          rotation: 0,
          startTime: 0,
          duration,
        },
        {
          id: "prop-bug",
          type: "emoji",
          content: "🐛",
          x: 50,
          y: groundY - 22,
          scale: Number((propScale * 1.3).toFixed(2)),
          rotation: 0,
          startTime: 7.2,
          duration: 4,
          animation: { in: "bounceIn", out: "fadeOut" }
        }
      ],
      dialogBlocks: [
        {
          id: "db-1",
          characterId: "char-pm",
          roleIcon: "👔",
          boxStyle: dialogueBoxStyle,
          text: "Tuấn ơi, bản dựng này đã sẵn sàng release tối nay chưa?",
          startTime: 0.5,
          duration: 2.8,
          emotion: "explaining",
          bubbleType: "normal"
        },
        {
          id: "db-2",
          characterId: "char-dev",
          roleIcon: "💻",
          boxStyle: dialogueBoxStyle,
          text: "Mọi unit test và e2e trên local đều xanh mượt 100% sếp nhé!",
          startTime: 3.5,
          duration: 2.8,
          emotion: "happy",
          bubbleType: "normal"
        },
        {
          id: "db-3",
          characterId: "char-pm",
          roleIcon: "👔",
          boxStyle: dialogueBoxStyle,
          text: "Sao vừa deploy lên Production là server báo sập database vậy?! 😭",
          startTime: 6.6,
          duration: 3.6,
          emotion: "angry",
          bubbleType: "shout"
        },
        {
          id: "db-4",
          characterId: "char-dev",
          roleIcon: "💻",
          boxStyle: dialogueBoxStyle,
          text: "Kỳ lạ thật... Em cam đoan trên máy em chạy cực kỳ ổn định mà?!",
          startTime: 10.5,
          duration: 3.5,
          emotion: "surprised",
          bubbleType: "thought"
        }
      ],
      audios: []
    };
  }

  // Default / Educational: Thầy giáo & Học sinh (Newton / Khoa Học)
  return {
    title: topic || "Bí Mật Chuyển Động & Định Luật Newton",
    aspectRatio,
    dialogueStyle,
    dialogueBoxStyle,
    background: "bg-blue-50",
    duration,
    filters: { brightness: 100, contrast: 105, grayscale: 0, sepia: 0, blur: 0 },
    characters: [
      {
        id: "char-teacher",
        name: "Thầy Minh",
        showName: true,
        type: "teacher",
        x: char1X,
        y: groundY,
        scale: charScale,
        flipX: false,
        color: "#000000",
        appearance: {
          skinColor: "#ffddc1",
          hairColor: "#111827",
          hairStyle: "short",
          shirtColor: "#2563eb",
          pantsColor: "#1f2937",
          accessory: "glasses",
          outfitStyle: "formal",
          hasTie: true,
          tieColor: "#dc2626",
          hasBelt: true,
          beltColor: "#1e293b",
          hasPocketPen: true,
          shoeColor: "#0f172a"
        },
        pose: { armL: 20, armR: -35, legL: 10, legR: -10 },
        startTime: 0,
        duration,
        animation: { in: "slideInLeft", inDuration: 0.7 },
        keyframes: [
          { id: "kf-t1", time: 0, x: char1X, y: groundY, scale: charScale, rotation: 0, pose: { armL: 20, armR: -35, legL: 10, legR: -10, bodyLean: 2, headTilt: 0 } },
          { id: "kf-t2", time: 3.8, x: char1X + 4, y: groundY, scale: charScale, rotation: 0, pose: { armL: -110, armR: 20, legL: 15, legR: -15, bodyLean: 5, headTilt: 0 } },
          { id: "kf-t3", time: 9.0, x: char1X, y: groundY, scale: charScale, rotation: 0, pose: { armL: -30, armR: -40, legL: 5, legR: -5, bodyLean: 0, headTilt: 0 } }
        ]
      },
      {
        id: "char-student",
        name: "Bạn Tí",
        showName: true,
        type: "student",
        x: char2X,
        y: groundY,
        scale: Number((charScale * 0.95).toFixed(2)),
        flipX: true,
        color: "#000000",
        appearance: {
          skinColor: "#ffffff",
          hairColor: "#000000",
          hairStyle: "short",
          shirtColor: "#fbbf24",
          pantsColor: "#2563eb",
          accessory: "cap",
          outfitStyle: "polo",
          hasTie: false,
          hasBelt: true,
          beltColor: "#334155",
          hasPocketPen: false,
          shoeColor: "#1f2937"
        },
        pose: { armL: -15, armR: 30, legL: -10, legR: 10 },
        startTime: 0,
        duration,
        animation: { in: "slideInRight", inDuration: 0.7 },
        keyframes: [
          { id: "kf-s1", time: 0, x: char2X, y: groundY, scale: Number((charScale * 0.95).toFixed(2)), rotation: 0, pose: { armL: -15, armR: 30, legL: -10, legR: 10, bodyLean: -2, headTilt: 0 } },
          { id: "kf-s2", time: 3.6, x: char2X, y: groundY, scale: Number((charScale * 0.95).toFixed(2)), rotation: 0, pose: { armL: -140, armR: -20, legL: 0, legR: 0, bodyLean: 4, headTilt: 8 } },
          { id: "kf-s3", time: 8.0, x: char2X - 4, y: groundY, scale: Number((charScale * 0.95).toFixed(2)), rotation: 0, pose: { armL: -150, armR: 150, legL: 0, legR: 0, bodyLean: 0, headTilt: 0 } }
        ]
      }
    ],
    props: [
      {
        id: "prop-bulb",
        type: "emoji",
        content: "💡",
        x: char1X + 4,
        y: groundY - 24,
        scale: Number((propScale * 1.2).toFixed(2)),
        rotation: 0,
        startTime: 4.2,
        duration: 3.5,
        animation: { in: "bounceIn", out: "fadeOut" }
      },
      {
        id: "prop-book",
        type: "emoji",
        content: "📚",
        x: 50,
        y: groundY - 5,
        scale: propScale,
        rotation: 0,
        startTime: 0,
        duration,
      }
    ],
    dialogBlocks: [
      {
        id: "d-1",
        characterId: "char-student",
        roleIcon: "🎒",
        boxStyle: dialogueBoxStyle,
        text: topic ? `Thầy ơi, bản chất khoa học của "${topic}" là gì ạ?` : "Thầy ơi, vì sao bước từ thuyền lên bờ thì thuyền bị lùi lại ạ?",
        startTime: 0.5,
        duration: 3.2,
        emotion: "questioning",
        bubbleType: "normal"
      },
      {
        id: "d-2",
        characterId: "char-teacher",
        roleIcon: "👨‍🏫",
        boxStyle: dialogueBoxStyle,
        text: "Đó chính là Định luật 3 Newton: Lực tác dụng luôn đi kèm phản lực tương đương!",
        startTime: 3.9,
        duration: 3.8,
        emotion: "explaining",
        bubbleType: "normal"
      },
      {
        id: "d-3",
        characterId: "char-student",
        roleIcon: "🎒",
        boxStyle: dialogueBoxStyle,
        text: "À! Chân em đẩy thuyền về sau, thì thuyền đẩy người em về trước đúng không thầy?",
        startTime: 7.9,
        duration: 3.6,
        emotion: "happy",
        bubbleType: "manga"
      },
      {
        id: "d-4",
        characterId: "char-teacher",
        roleIcon: "👨‍🏫",
        boxStyle: dialogueBoxStyle,
        text: "Chuẩn xác 100%! Em thông minh lắm, giờ hãy thử áp dụng vào bài tập nhé!",
        startTime: 11.8,
        duration: 3.2,
        emotion: "explaining",
        bubbleType: "normal"
      }
    ],
    audios: []
  };
}
