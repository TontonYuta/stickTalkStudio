import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import os from 'os';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { generateStickmanVideoScript, GenerationOptions, refineStickmanVideoScript, RerenderOptions } from './server/playwrightEngine';
import { exportVideoViaPlaywright } from './server/videoExporter';

dotenv.config();

const app = express();
let currentPort = parseInt(process.env.PORT || '3050', 10);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

export function getDistPath(): string {
  const candidate1 = path.resolve(__dirname, 'index.html');
  if (fs.existsSync(candidate1)) return __dirname;
  const candidate2 = path.resolve(__dirname, 'dist', 'index.html');
  if (fs.existsSync(candidate2)) return path.resolve(__dirname, 'dist');
  const candidate3 = path.resolve(process.cwd(), 'dist', 'index.html');
  if (fs.existsSync(candidate3)) return path.resolve(process.cwd(), 'dist');
  return path.resolve(process.cwd(), 'dist');
}

export function getExportsDir(): string {
  const custom = path.join(os.homedir(), 'Videos', 'StickTalk', 'exports');
  if (!fs.existsSync(custom)) {
    fs.mkdirSync(custom, { recursive: true });
  }
  return custom;
}

// Static exports directory
const exportsDir = getExportsDir();
app.use('/exports', express.static(exportsDir));

// API Health Check
app.get('/api/health', (_req: Request, res: Response) => {
  const agyExists = fs.existsSync('/home/tontonyuta/.local/bin/agy');
  const chromeExists = fs.existsSync('/home/tontonyuta/.local/bin/google-chrome');
  const ffmpegExists = fs.existsSync('/home/tontonyuta/.local/bin/ffmpeg');

  res.json({
    status: 'ok',
    app: 'StickTalk Studio',
    version: '2.0.0',
    port: currentPort,
    engines: {
      antigravity: agyExists,
      playwrightChrome: chromeExists,
      ffmpeg: ffmpegExists,
      geminiApiKeyConfigured: !!process.env.GEMINI_API_KEY
    },
    timestamp: new Date().toISOString()
  });
});

// POST /api/ai/generate - AI Stickman Script Generator
app.post('/api/ai/generate', async (req: Request, res: Response) => {
  const { 
    provider = 'antigravity', 
    topic = '', 
    duration = 15, 
    aspectRatio = '16:9', 
    dialogueStyle = 'pedagogical', 
    dialogueBoxStyle = 'bubble', 
    headless = true, 
    apiKey 
  } = req.body;

  if (!topic || !topic.trim()) {
    return res.status(400).json({ error: 'Vui lòng cung cấp chủ đề (topic).' });
  }

  const logs: Array<{ step: string; message: string; timestamp: string }> = [];
  const logCollector = (message: string, step: string = 'general') => {
    logs.push({ step, message, timestamp: new Date().toLocaleTimeString() });
    console.log(`[AI Generator][${step}] ${message}`);
  };

  try {
    const options: GenerationOptions = {
      provider,
      topic,
      duration: Number(duration),
      aspectRatio,
      dialogueStyle,
      dialogueBoxStyle,
      headless: headless !== false,
      apiKey: apiKey || process.env.GEMINI_API_KEY,
      onLog: logCollector
    };

    const projectScript = await generateStickmanVideoScript(options);
    res.json({
      success: true,
      provider,
      project: projectScript,
      logs
    });
  } catch (err: any) {
    console.error('[AI Generator Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Lỗi khi tạo kịch bản AI',
      logs
    });
  }
});

// POST /api/ai/rerender - AI Stickman Script Refiner (Rerender based on user feedback)
app.post('/api/ai/rerender', async (req: Request, res: Response) => {
  const { currentProject, modificationPrompt = '', provider = 'antigravity', apiKey } = req.body;

  if (!currentProject || !Array.isArray(currentProject.characters)) {
    return res.status(400).json({ error: 'Thiếu dữ liệu kịch bản hiện tại (currentProject).' });
  }

  if (!modificationPrompt || !modificationPrompt.trim()) {
    return res.status(400).json({ error: 'Vui lòng nhập yêu cầu cần sửa đổi (modificationPrompt).' });
  }

  const logs: Array<{ step: string; message: string; timestamp: string }> = [];
  const logCollector = (message: string, step: string = 'rerender') => {
    logs.push({ step, message, timestamp: new Date().toLocaleTimeString() });
    console.log(`[AI Rerender][${step}] ${message}`);
  };

  try {
    const options: RerenderOptions = {
      provider,
      currentProject,
      modificationPrompt,
      duration: currentProject.duration,
      aspectRatio: currentProject.aspectRatio,
      apiKey: apiKey || process.env.GEMINI_API_KEY,
      onLog: logCollector
    };

    const refinedProject = await refineStickmanVideoScript(options);
    res.json({
      success: true,
      project: refinedProject,
      logs
    });
  } catch (err: any) {
    console.error('[AI Rerender Error]', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Lỗi khi tinh chỉnh kịch bản',
      logs
    });
  }
});

// In-Memory Export Job Store for real-time progress & unlimited video duration
interface ExportJob {
  id: string;
  status: 'pending' | 'recording' | 'transcoding' | 'completed' | 'failed';
  progress: number;
  message: string;
  result?: any;
  error?: string;
  createdAt: number;
}

const exportJobs = new Map<string, ExportJob>();

// Clean up old jobs every 20 minutes
setInterval(() => {
  const now = Date.now();
  for (const [id, job] of exportJobs.entries()) {
    if (now - job.createdAt > 30 * 60 * 1000) {
      exportJobs.delete(id);
    }
  }
}, 20 * 60 * 1000);

// POST /api/export-video/start - Start async video export job (Supports unlimited duration)
app.post('/api/export-video/start', async (req: Request, res: Response) => {
  const { project, resolution = '1080p', fps = 60, bgmTrack = 'lofi', bgmVolume = 0.35, customAudioPath } = req.body;
  if (!project || !Array.isArray(project.characters)) {
    return res.status(400).json({ error: 'Dữ liệu dự án không hợp lệ.' });
  }

  const jobId = `exp_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const job: ExportJob = {
    id: jobId,
    status: 'pending',
    progress: 5,
    message: 'Khởi tạo môi trường render video Playwright...',
    createdAt: Date.now()
  };
  exportJobs.set(jobId, job);

  // Run in background without request timeout limit
  exportVideoViaPlaywright({
    project,
    port: currentPort,
    resolution,
    fps: Number(fps) || 60,
    bgmTrack,
    bgmVolume: typeof bgmVolume === 'number' ? bgmVolume : 0.35,
    customAudioPath,
    onProgress: (progress, statusText) => {
      const cur = exportJobs.get(jobId);
      if (cur) {
        cur.progress = progress;
        cur.message = statusText;
        if (progress >= 85) cur.status = 'transcoding';
        else if (progress >= 20) cur.status = 'recording';
      }
    }
  }).then(result => {
    const cur = exportJobs.get(jobId);
    if (cur) {
      if (result.success) {
        cur.status = 'completed';
        cur.progress = 100;
        cur.message = 'Xuất video hoàn tất thành công!';
        cur.result = result;
      } else {
        cur.status = 'failed';
        cur.error = result.error || 'Lỗi không xác định khi xuất video.';
      }
    }
  }).catch(err => {
    const cur = exportJobs.get(jobId);
    if (cur) {
      cur.status = 'failed';
      cur.error = err.message || 'Lỗi hệ thống khi xuất video.';
    }
  });

  res.json({
    success: true,
    jobId,
    message: 'Tác vụ xuất video đã được khởi động ở chế độ nền.'
  });
});

// GET /api/export-video/status/:jobId - Query progress of export job
app.get('/api/export-video/status/:jobId', (req: Request, res: Response) => {
  const { jobId } = req.params;
  const job = exportJobs.get(jobId);
  if (!job) {
    return res.status(404).json({ error: 'Không tìm thấy tác vụ xuất video này.' });
  }
  res.json(job);
});

// POST /api/export-video - Legacy Synchronous Playwright Video Exporter
app.post('/api/export-video', async (req: Request, res: Response) => {
  const { project, resolution = '1080p', fps = 60, bgmTrack = 'none', bgmVolume = 0.35, customAudioPath } = req.body;
  if (!project || !Array.isArray(project.characters)) {
    return res.status(400).json({ error: 'Dữ liệu dự án không hợp lệ.' });
  }

  try {
    const result = await exportVideoViaPlaywright({
      project,
      port: currentPort,
      resolution,
      fps: Number(fps) || 60,
      bgmTrack,
      bgmVolume: typeof bgmVolume === 'number' ? bgmVolume : 0.35,
      customAudioPath,
      onProgress: (progress, statusText) => {
        console.log(`[Playwright Video Export] [${progress}%] ${statusText}`);
      }
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start Server with Vite or Static
export async function startServer(customPort?: number): Promise<{ server: any; port: number }> {
  if (customPort !== undefined && customPort >= 0) {
    currentPort = customPort;
  }
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        allowedHosts: true,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const dPath = getDistPath();
    app.use(express.static(dPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(dPath, 'index.html'));
    });
  }

  return new Promise((resolve) => {
    const serverInstance = app.listen(currentPort, '127.0.0.1', () => {
      const addr = serverInstance.address();
      if (addr && typeof addr === 'object') {
        currentPort = addr.port;
      }
      console.log(`[StickTalk Studio] Máy chủ hoạt động tại http://127.0.0.1:${currentPort}`);
      console.log(`[StickTalk Studio] Antigravity & Playwright Engine sẵn sàng!`);
      resolve({ server: serverInstance, port: currentPort });
    });
  });
}

export { app };

if (!process.versions.electron && process.env.EMBEDDED_DESKTOP !== 'true') {
  startServer();
}
