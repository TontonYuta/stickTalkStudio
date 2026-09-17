import { chromium, BrowserContext, Page } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import { buildStickmanPrompt, buildRerenderPrompt } from './promptBuilder';
import { getFallbackScenario } from './fallbackScenarios';
import { ProjectState } from '../src/types';

export interface GenerationOptions {
  provider: 'antigravity' | 'gemini-playwright' | 'gemini-api' | 'fast';
  topic: string;
  duration?: number;
  aspectRatio?: string;
  style?: string;
  dialogueStyle?: 'pedagogical' | 'witty' | 'dramatic' | 'storytelling' | 'conversational';
  dialogueBoxStyle?: 'bubble' | 'card' | 'cinema' | 'manga';
  headless?: boolean;
  apiKey?: string;
  onLog?: (msg: string, step?: string) => void;
}

export function normalizeProjectScales(project: ProjectState, targetRatio: string = '16:9'): ProjectState {
  if (!project) return project;
  const ratio = project.aspectRatio || targetRatio;
  project.duration = Number(project.duration) || 15;
  project.background = project.background || 'bg-blue-50';

  const isVertical = ratio === '9:16';
  const targetCharScale = isVertical ? 1.40 : 1.20;
  const targetPropScale = isVertical ? 1.15 : 1.05;

  // Sanitize characters and guarantee valid time bounds covering full video duration
  if (Array.isArray(project.characters)) {
    project.characters.forEach((char, idx) => {
      char.startTime = typeof char.startTime === 'number' ? char.startTime : 0;
      // If char was intended to span the whole video or its duration is smaller than project.duration when starting at 0
      if (char.startTime === 0 || !char.duration || char.duration < project.duration) {
        char.duration = project.duration;
      }
      char.x = typeof char.x === 'number' ? char.x : (idx === 0 ? 15 : 85);
      char.y = typeof char.y === 'number' ? char.y : 75;
      char.scale = typeof char.scale === 'number' ? char.scale : 1;
    });
  }

  // Sanitize props and guarantee valid time bounds
  if (Array.isArray(project.props)) {
    project.props.forEach((prop) => {
      prop.startTime = typeof prop.startTime === 'number' ? prop.startTime : 0;
      prop.duration = typeof prop.duration === 'number' ? prop.duration : project.duration;
      prop.x = typeof prop.x === 'number' ? prop.x : 50;
      prop.y = typeof prop.y === 'number' ? prop.y : 45;
      prop.scale = typeof prop.scale === 'number' ? prop.scale : 1;
    });
  }

  // Sanitize dialog blocks and scale if needed to fit project duration
  if (Array.isArray(project.dialogBlocks) && project.dialogBlocks.length > 0) {
    const maxDialogEnd = Math.max(...project.dialogBlocks.map(db => (db.startTime || 0) + (db.duration || 3)));
    const targetMax = Math.max(3, project.duration - 0.5);
    const needCompression = maxDialogEnd > targetMax;
    const compressionRatio = needCompression ? targetMax / maxDialogEnd : 1;

    project.dialogBlocks.forEach((db) => {
      db.startTime = typeof db.startTime === 'number' ? Number((db.startTime * compressionRatio).toFixed(2)) : 0;
      db.duration = typeof db.duration === 'number' ? Math.max(1.8, Number((db.duration * compressionRatio).toFixed(2))) : 3;
      db.text = db.text || '';
    });
  }

  // Check if project contains large stage props (chart, table, math)
  const hasStageProps = Array.isArray(project.props) && project.props.some(
    p => p.type === 'chart' || p.type === 'table' || p.type === 'math'
  );

  // 1. SMART STAGING FOR CHARACTERS (Chống bó cứng và đè lên nhau ở giữa sân khấu)
  if (Array.isArray(project.characters)) {
    project.characters.forEach((char, idx) => {
      const currentScale = char.scale || 1;
      
      // When large stage props exist, widen character positions to the safe wings (Dual-Zone Layout)
      if (hasStageProps) {
        if (!isVertical) {
          // 16:9 WIDE STAGING: Push characters to outer wings (13% and 87%)
          if (idx === 0 || char.x < 50) {
            if (char.x > 16) {
              const deltaX = 14 - char.x;
              char.x = 14;
              if (Array.isArray(char.keyframes)) {
                char.keyframes.forEach(kf => { if (kf.x !== undefined) kf.x = Math.max(8, kf.x + deltaX); });
              }
            }
          } else {
            if (char.x < 84) {
              const deltaX = 86 - char.x;
              char.x = 86;
              if (Array.isArray(char.keyframes)) {
                char.keyframes.forEach(kf => { if (kf.x !== undefined) kf.x = Math.min(92, kf.x + deltaX); });
              }
            }
          }
        } else {
          // 9:16 VERTICAL STACKED STAGING: Characters firmly on bottom tier (y: 74-76%)
          char.y = 75;
          if (idx === 0 || char.x < 50) {
            char.x = Math.min(char.x, 20);
          } else {
            char.x = Math.max(char.x, 80);
          }
          if (Array.isArray(char.keyframes)) {
            char.keyframes.forEach(kf => {
              kf.y = 75;
              if (idx === 0) kf.x = Math.min(kf.x ?? 20, 26);
              else kf.x = Math.max(kf.x ?? 80, 74);
            });
          }
        }
      }

      // Normalize Scale to avoid giant or microscopic stickmen
      if (currentScale < 0.85) {
        const mult = targetCharScale / currentScale;
        char.scale = targetCharScale;
        if (Array.isArray(char.keyframes)) {
          char.keyframes.forEach(kf => {
            if (kf.scale) kf.scale = Number((kf.scale * mult).toFixed(2));
            else kf.scale = targetCharScale;
          });
        }
      } else if (currentScale > 1.85) {
        const mult = targetCharScale / currentScale;
        char.scale = targetCharScale;
        if (Array.isArray(char.keyframes)) {
          char.keyframes.forEach(kf => {
            if (kf.scale) kf.scale = Number((kf.scale * mult).toFixed(2));
          });
        }
      }
    });
  }

  // 2. SMART POSITIONING & SCALING FOR PROPS (Chống đè lên nhau ở giữa)
  if (Array.isArray(project.props)) {
    project.props.forEach((prop, pIdx) => {
      const isSpecialProp = prop.type === 'chart' || prop.type === 'table' || prop.type === 'math';
      const maxAllowedScale = isSpecialProp ? (isVertical ? 0.95 : 1.05) : 1.4;

      if (isVertical && isSpecialProp) {
        // In 9:16, place large props in top tier (y: 24-30%) to leave bottom tier clean for dialogue
        prop.x = 50;
        if (prop.y > 40) prop.y = 26;
        prop.scale = Math.min(prop.scale || 1, 0.95);
        if (Array.isArray(prop.keyframes)) {
          prop.keyframes.forEach(kf => {
            kf.x = 50;
            if ((kf.y ?? 50) > 40) kf.y = 26;
            if ((kf.scale ?? 1) > 0.95) kf.scale = 0.95;
          });
        }
      } else if (!isVertical && isSpecialProp) {
        // In 16:9, center the stage prop comfortably
        prop.x = 50;
        prop.y = 44;
        prop.scale = Math.min(prop.scale || 1, 1.02);
      }

      // Check collision between overlapping props
      for (let j = 0; j < pIdx; j++) {
        const other = project.props[j];
        // If they overlap in time
        const overlapTime = Math.max(0, Math.min(prop.startTime + prop.duration, other.startTime + other.duration) - Math.max(prop.startTime, other.startTime));
        if (overlapTime > 0.5) {
          // If they collide vertically in center
          if (Math.abs(prop.x - other.x) < 25 && Math.abs(prop.y - other.y) < 22) {
            if (isVertical) {
              prop.y = Math.min(48, other.y + 24);
            } else {
              prop.y = Math.min(72, other.y + 26);
            }
          }
        }
      }

      // Clamp scale
      if (prop.scale > maxAllowedScale) {
        prop.scale = maxAllowedScale;
      }
    });
  }

  // 3. SMART DIALOGUE SANITIZATION & BREVITY ENFORCER (Chống từ ngữ nhiều & rườm rà)
  if (Array.isArray(project.dialogBlocks)) {
    project.dialogBlocks.forEach((dialog) => {
      // Ensure boxStyle is valid
      if (!dialog.boxStyle) {
        dialog.boxStyle = project.dialogueBoxStyle || 'bubble';
      }

      // Ensure roleIcon
      if (!dialog.roleIcon) {
        const char = project.characters?.find(c => c.id === dialog.characterId);
        if (char?.type === 'teacher' || char?.name?.includes('Thầy')) {
          dialog.roleIcon = '👨‍🏫';
        } else if (char?.type === 'student' || char?.name?.includes('Học sinh') || char?.name?.includes('Sĩ Tử')) {
          dialog.roleIcon = '👨‍🎓';
        } else {
          dialog.roleIcon = '💬';
        }
      }

      // Clean verbose clichés and prune excess words
      if (dialog.text && typeof dialog.text === 'string') {
        let cleaned = dialog.text
          .replace(/^(Như chúng ta đã biết|Theo sách giáo khoa thì|Thầy xin giải thích rằng|Chúng ta có thể thấy rằng|Thực sự là|Hôm nay mình sẽ chia sẻ|Chúng ta cùng tìm hiểu)\s*[,:]?\s*/i, '')
          .replace(/,\s*(như các bạn đã biết|đúng không nào|phải không các em)\s*/gi, ' ')
          .trim();

        if (cleaned.length > 0) {
          cleaned = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
        }
        dialog.text = cleaned;
      }
    });
  }

  // 4. SANITIZE UNSOLICITED CHARTS (Tuyệt đối không tự ý thêm đồ thị hàm số trừ khi người dùng yêu cầu rõ ràng)
  const isExplicitGraphTopic = /đồ thị|vẽ đồ thị|bảng biến thiên|khảo sát hàm|tiếp tuyến|parabol|function graph|curve plot/i.test(
    (project.title || '') + ' ' + (project.dialogBlocks?.map(d => d.text).join(' ') || '')
  );

  if (!isExplicitGraphTopic && Array.isArray(project.props)) {
    // Loại bỏ hoàn toàn đồ thị hàm số nếu chủ đề không yêu cầu rõ ràng
    project.props = project.props.filter(p => p.type !== 'chart');
  }

  return project;
}

export function parseJsonFromAiResponse(raw: string, targetRatio: string = '16:9'): ProjectState | null {
  if (!raw) return null;
  try {
    // Try regex markdown json
    const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
    let candidate = match ? match[1].trim() : raw.trim();

    // If candidate still contains braces
    const firstBrace = candidate.indexOf('{');
    const lastBrace = candidate.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      candidate = candidate.substring(firstBrace, lastBrace + 1);
    }

    const parsed = JSON.parse(candidate);
    if (parsed && Array.isArray(parsed.characters) && Array.isArray(parsed.dialogBlocks)) {
      return normalizeProjectScales(parsed as ProjectState, targetRatio);
    }
  } catch (err) {
    console.error('[JSON Parser] Failed to parse raw string:', err);
  }
  return null;
}

export async function runAntigravityEngine(options: GenerationOptions): Promise<ProjectState> {
  const { topic, duration = 15, aspectRatio = '16:9', dialogueStyle, dialogueBoxStyle, onLog } = options;
  onLog?.('Khởi tạo Antigravity (agy) CLI Engine...', 'init');

  const agyBin = fs.existsSync('/home/tontonyuta/.local/bin/agy')
    ? '/home/tontonyuta/.local/bin/agy'
    : 'agy';

  const prompt = buildStickmanPrompt(topic, { duration, aspectRatio, dialogueStyle, dialogueBoxStyle });
  onLog?.(`Đang gửi yêu cầu tới Antigravity Agent (${prompt.length} ký tự)...`, 'dispatch');

  try {
    const rawOutput = await new Promise<string>((resolve, reject) => {
      execFile(
        agyBin,
        ['-p', prompt, '--output-format', 'text'],
        { maxBuffer: 30 * 1024 * 1024, timeout: 180000 },
        (err, stdout) => {
          if (err) return reject(err);
          resolve(stdout || '');
        }
      );
    });

    onLog?.(`Antigravity phản hồi thành công (${rawOutput.length} ký tự). Đang phân tích JSON...`, 'parse');
    const parsed = parseJsonFromAiResponse(rawOutput, aspectRatio);
    if (parsed) {
      onLog?.('Kịch bản video đã được khởi tạo hoàn hảo!', 'success');
      return normalizeProjectScales(parsed, aspectRatio);
    }
  } catch (err: any) {
    onLog?.(`Antigravity CLI cảnh báo: ${err.message}. Chuyển sang kịch bản thông minh...`, 'fallback');
  }

  return normalizeProjectScales(getFallbackScenario(topic, { duration, aspectRatio, dialogueStyle, dialogueBoxStyle }), aspectRatio);
}

export function getSystemBrowserExecutable(): string | undefined {
  const platform = process.platform;
  const home = process.env.HOME || '';
  if (platform === 'win32') {
    const prefixes = [process.env.LOCALAPPDATA, process.env.PROGRAMFILES, process.env['PROGRAMFILES(X86)']].filter(Boolean) as string[];
    for (const prefix of prefixes) {
      const p = path.join(prefix, 'Google', 'Chrome', 'Application', 'chrome.exe');
      if (fs.existsSync(p)) return p;
    }
  } else if (platform === 'darwin') {
    const p = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(p)) return p;
  } else {
    const candidates = [
      path.join(home, '.local/bin/google-chrome'),
      path.join(home, '.local/bin/chromium'),
      path.join(home, '.cache/ms-playwright/chromium-1243/chrome-linux64/chrome'),
      '/usr/bin/google-chrome',
      '/usr/bin/google-chrome-stable',
      '/usr/bin/chromium',
      '/usr/bin/chromium-browser',
    ];
    for (const c of candidates) {
      if (fs.existsSync(c)) return c;
    }
  }
  return undefined;
}

export async function runGeminiPlaywrightEngine(options: GenerationOptions): Promise<ProjectState> {
  const { topic, duration = 15, aspectRatio = '16:9', headless = true, onLog } = options;
  onLog?.('Khởi tạo Playwright Chromium context...', 'init');

  const userDataDir = path.resolve(process.cwd(), '.playwright-profile');
  if (!fs.existsSync(userDataDir)) {
    fs.mkdirSync(userDataDir, { recursive: true });
  }

  let context: BrowserContext | null = null;
  try {
    const executablePath = getSystemBrowserExecutable();
    context = await chromium.launchPersistentContext(userDataDir, {
      executablePath,
      headless,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--window-size=1280,840'
      ],
      viewport: { width: 1280, height: 840 },
    });

    onLog?.('Điều hướng tới Gemini Web (https://gemini.google.com/app)...', 'navigate');
    const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();

    await page.addInitScript(() => {
      Object.defineProperty(navigator, 'webdriver', { get: () => false });
    });

    await page.goto('https://gemini.google.com/app', { waitUntil: 'domcontentloaded', timeout: 12000 });

    const { topic, duration = 15, aspectRatio = '16:9', dialogueStyle, dialogueBoxStyle } = options;
    const prompt = buildStickmanPrompt(topic, { duration, aspectRatio, dialogueStyle, dialogueBoxStyle });
    onLog?.('Nhập prompt kịch bản người que vào Gemini...', 'inject');

    // Input selector
    const inputSelector = 'div[role="textbox"], textarea, rich-textarea textarea, div.ql-editor';
    await page.waitForSelector(inputSelector, { timeout: 8000 });
    const inputEl = await page.$(inputSelector);
    if (inputEl) {
      await inputEl.fill(prompt);
      await page.keyboard.press('Enter');
      onLog?.('Đã gửi prompt. Đang đợi Gemini tạo kịch bản JSON...', 'wait');

      // Wait for response
      await page.waitForTimeout(5000);
      const responseSelector = 'message-content, .model-response-text, div.markdown';
      await page.waitForSelector(responseSelector, { timeout: 20000 });
      await page.waitForTimeout(2000);

      const rawText = await page.$$eval(responseSelector, elements => {
        const last = elements[elements.length - 1];
        return last ? last.textContent || '' : '';
      });

      if (rawText) {
        onLog?.(`Đã trích xuất phản hồi từ Gemini Web (${rawText.length} ký tự).`, 'parse');
        const parsed = parseJsonFromAiResponse(rawText);
        if (parsed) {
          await context.close();
          return parsed;
        }
      }
    }
  } catch (err: any) {
    onLog?.(`Playwright Gemini Web ghi nhận: ${err.message}. Sử dụng kịch bản dự phòng chất lượng cao.`, 'fallback');
  } finally {
    if (context) {
      try { await context.close(); } catch {}
    }
  }

  return getFallbackScenario(options.topic, { 
    duration: options.duration, 
    aspectRatio: options.aspectRatio,
    dialogueStyle: options.dialogueStyle,
    dialogueBoxStyle: options.dialogueBoxStyle 
  });
}

export async function runGeminiApiEngine(options: GenerationOptions): Promise<ProjectState> {
  const { topic, duration = 15, aspectRatio = '16:9', dialogueStyle, dialogueBoxStyle, apiKey = process.env.GEMINI_API_KEY, onLog } = options;

  if (!apiKey) {
    onLog?.('Không tìm thấy GEMINI_API_KEY. Chuyển sang mô hình thay thế...', 'warn');
    return getFallbackScenario(topic, { duration, aspectRatio, dialogueStyle, dialogueBoxStyle });
  }

  onLog?.('Kết nối Google Gemini API...', 'init');
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey });
    const prompt = buildStickmanPrompt(topic, { duration, aspectRatio, dialogueStyle, dialogueBoxStyle });

    onLog?.('Đang gửi prompt kịch bản tới Gemini 2.5 Flash...', 'dispatch');
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    onLog?.(`Gemini API đã phản hồi (${text.length} ký tự).`, 'parse');
    const parsed = parseJsonFromAiResponse(text);
    if (parsed) return parsed;
  } catch (err: any) {
    onLog?.(`Lỗi kết nối Gemini API: ${err.message}`, 'error');
  }

  return getFallbackScenario(topic, { duration, aspectRatio, dialogueStyle, dialogueBoxStyle });
}

export async function generateStickmanVideoScript(options: GenerationOptions): Promise<ProjectState> {
  let project: ProjectState;
  switch (options.provider) {
    case 'antigravity':
      project = await runAntigravityEngine(options);
      break;
    case 'gemini-playwright':
      project = await runGeminiPlaywrightEngine(options);
      break;
    case 'gemini-api':
      project = await runGeminiApiEngine(options);
      break;
    case 'fast':
    default:
      options.onLog?.('Khởi tạo kịch bản tức thì (Fast Mode)...', 'success');
      await new Promise(r => setTimeout(r, 200));
      project = getFallbackScenario(options.topic, { 
        duration: options.duration, 
        aspectRatio: options.aspectRatio,
        dialogueStyle: options.dialogueStyle,
        dialogueBoxStyle: options.dialogueBoxStyle 
      });
      break;
  }
  return normalizeProjectScales(project, options.aspectRatio);
}

export interface RerenderOptions {
  provider: 'antigravity' | 'gemini-playwright' | 'gemini-api' | 'fast';
  currentProject: ProjectState;
  modificationPrompt: string;
  duration?: number;
  aspectRatio?: string;
  apiKey?: string;
  headless?: boolean;
  onLog?: (msg: string, step?: string) => void;
}

export function applySmartLocalModifications(
  currentProject: ProjectState,
  modificationPrompt: string
): ProjectState {
  const project: ProjectState = JSON.parse(JSON.stringify(currentProject));
  const text = modificationPrompt.toLowerCase();

  // 1. Nếu yêu cầu "đứng yên", "không đi lại", "bỏ đi lại", "ở yên", "tại chỗ"
  const wantsStationary =
    /(đứng yên|không đi|bỏ đi lại|ở yên|tại chỗ|không di chuyển|đứng tại chỗ|chân đứng im|đứng im)/i.test(text);
  if (wantsStationary) {
    if (Array.isArray(project.characters)) {
      project.characters.forEach(char => {
        const baseX = char.x;
        if (Array.isArray(char.keyframes)) {
          char.keyframes.forEach(kf => {
            kf.x = baseX; // Giữ nguyên tọa độ X ban đầu, không thay đổi
            kf.pose = kf.pose || { armL: 20, armR: -20, legL: 10, legR: -10, bodyLean: 0, headTilt: 0 };
            kf.pose.legL = 10;
            kf.pose.legR = -10;
          });
        }
        if (char.pose) {
          (char.pose as any).legL = 10;
          (char.pose as any).legR = -10;
        }
      });
    }
  }

  // 2. Xóa sạch đạo cụ cũ / emoji dính từ dự án trước hoặc dọn dẹp
  const wantsPruneProps =
    /(xóa|bỏ|dọn|loại|clear|remove|delete|clean).*(emoji|đạo cụ|icon|prop|sticker|thừa|dự án cũ|dính)/i.test(text) ||
    /(emoji|đạo cụ|icon|prop).*(cũ|thừa|dính|bỏ|xóa|dọn)/i.test(text) ||
    text.includes('dọn sạch') ||
    text.includes('xóa sạch') ||
    text.includes('làm sạch') ||
    text.includes('dự án cũ') ||
    text.includes('bị dính') ||
    text.includes('dính');
  if (wantsPruneProps) {
    if (Array.isArray(project.props)) {
      // Xóa sạch hoàn toàn các emoji / props thừa thãi bị dính
      project.props = project.props.filter(p => p.type === 'chart' || p.type === 'table' || p.type === 'math');
    }
  } else if (text.includes('đè') || text.includes('dọn đạo cụ') || text.includes('che chữ') || text.includes('chống đè')) {
    if (Array.isArray(project.props)) {
      // Dời các emoji về trung tâm x=50, y=52 an toàn
      project.props.forEach(prop => {
        if (prop.type === 'emoji') {
          prop.x = 50;
          prop.y = 52;
        }
      });
    }
  }

  // 2b. Rút ngắn lời thoại nếu yêu cầu
  const wantsShorten =
    /(rút ngắn|ngắn gọn|cô đọng|bớt chữ|ít chữ|ngắn lại|gãy gọn)/i.test(text);
  if (wantsShorten) {
    if (Array.isArray(project.dialogBlocks)) {
      project.dialogBlocks.forEach(dialog => {
        const words = dialog.text.trim().split(/\s+/);
        if (words.length > 10) {
          dialog.text = words.slice(0, 10).join(' ') + '!';
        }
      });
    }
  }

  // 3. Đổi nền / background
  if (text.includes('nền tối') || text.includes('dark mode') || text.includes('nền đen')) {
    project.background = 'bg-gray-900';
  } else if (text.includes('nền xanh') || text.includes('blue')) {
    project.background = 'bg-blue-50';
  } else if (text.includes('nền trắng') || text.includes('white')) {
    project.background = 'bg-white';
  }

  // 4. Nếu yêu cầu sửa thoại hài hơn hoặc thay câu kết
  if (text.includes('hài hơn') || text.includes('bẻ lái') || text.includes('câu thoại cuối') || text.includes('lời thoại')) {
    if (Array.isArray(project.dialogBlocks) && project.dialogBlocks.length > 0) {
      const lastBlock = project.dialogBlocks[project.dialogBlocks.length - 1];
      if (text.includes('hài') || text.includes('bẻ lái')) {
        lastBlock.text = 'Ủa khoan... hình như tình huống này có gì đó bất ổn rồi anh em ơi! 😂';
        lastBlock.bubbleType = 'shout';
      }
    }
  }

  return normalizeProjectScales(project, project.aspectRatio || '16:9');
}

export async function refineStickmanVideoScript(options: RerenderOptions): Promise<ProjectState> {
  const { currentProject, modificationPrompt, provider = 'antigravity', onLog } = options;
  const aspectRatio = options.aspectRatio || currentProject.aspectRatio || '16:9';
  const duration = options.duration || currentProject.duration || 15;
  const prompt = buildRerenderPrompt(currentProject, modificationPrompt, { duration, aspectRatio });

  onLog?.(`Bắt đầu Rerender với AI Engine: ${provider}...`, 'init');

  if (provider === 'antigravity') {
    const agyBin = fs.existsSync('/home/tontonyuta/.local/bin/agy') ? '/home/tontonyuta/.local/bin/agy' : 'agy';
    try {
      onLog?.('Đang gửi yêu cầu Rerender tới Antigravity Agent...', 'dispatch');
      const rawOutput = await new Promise<string>((resolve, reject) => {
        execFile(
          agyBin,
          ['-p', prompt, '--output-format', 'text'],
          { maxBuffer: 30 * 1024 * 1024, timeout: 180000 },
          (err, stdout) => {
            if (err) return reject(err);
            resolve(stdout || '');
          }
        );
      });

      const parsed = parseJsonFromAiResponse(rawOutput, aspectRatio);
      if (parsed) {
        onLog?.('Antigravity đã tinh chỉnh kịch bản thành công!', 'success');
        const refined = applySmartLocalModifications(parsed, modificationPrompt);
        return normalizeProjectScales(refined, aspectRatio);
      }
    } catch (err: any) {
      onLog?.(`Antigravity cảnh báo: ${err.message}. Áp dụng bộ điều chỉnh thông minh cục bộ.`, 'fallback');
    }
  } else if (provider === 'gemini-api') {
    const apiKey = options.apiKey || process.env.GEMINI_API_KEY;
    if (apiKey) {
      try {
        onLog?.('Gửi yêu cầu Rerender tới Gemini 2.5 Flash API...', 'dispatch');
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });
        const parsed = parseJsonFromAiResponse(response.text || '', aspectRatio);
        if (parsed) {
          onLog?.('Gemini API đã tinh chỉnh kịch bản thành công!', 'success');
          const refined = applySmartLocalModifications(parsed, modificationPrompt);
          return normalizeProjectScales(refined, aspectRatio);
        }
      } catch (err: any) {
        onLog?.(`Lỗi Gemini API Rerender: ${err.message}`, 'warn');
      }
    }
  } else if (provider === 'gemini-playwright') {
    try {
      onLog?.('Gửi yêu cầu Rerender tới Playwright Gemini Web...', 'dispatch');
      const userDataDir = path.resolve(process.cwd(), '.playwright-profile');
      const context = await chromium.launchPersistentContext(userDataDir, {
        executablePath: getSystemBrowserExecutable(),
        headless: options.headless !== false,
        args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
      });
      const page = context.pages().length > 0 ? context.pages()[0] : await context.newPage();
      await page.goto('https://gemini.google.com/app', { waitUntil: 'domcontentloaded', timeout: 12000 });
      const inputSelector = 'div[role="textbox"], textarea, rich-textarea textarea, div.ql-editor';
      await page.waitForSelector(inputSelector, { timeout: 8000 });
      const inputEl = await page.$(inputSelector);
      if (inputEl) {
        await inputEl.fill(prompt);
        await page.keyboard.press('Enter');
        await page.waitForTimeout(5000);
        const responseSelector = 'message-content, .model-response-text, div.markdown';
        await page.waitForSelector(responseSelector, { timeout: 20000 });
        const rawText = await page.$$eval(responseSelector, elements => {
          const last = elements[elements.length - 1];
          return last ? last.textContent || '' : '';
        });
        await context.close();
        const parsed = parseJsonFromAiResponse(rawText, aspectRatio);
        if (parsed) {
          onLog?.('Gemini Web đã cập nhật kịch bản thành công!', 'success');
          const refined = applySmartLocalModifications(parsed, modificationPrompt);
          return normalizeProjectScales(refined, aspectRatio);
        }
      } else {
        await context.close();
      }
    } catch (err: any) {
      onLog?.(`Gemini Web Rerender thông báo: ${err.message}`, 'fallback');
    }
  }

  // Fallback: Xử lý thông minh bảo toàn phần cũ
  onLog?.('Đang áp dụng tinh chỉnh thông minh bảo toàn kịch bản...', 'success');
  return applySmartLocalModifications(currentProject, modificationPrompt);
}

