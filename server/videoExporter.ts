import { chromium } from 'playwright-core';
import path from 'path';
import fs from 'fs';
import os from 'os';
import { execFile } from 'child_process';
import { ProjectState } from '../src/types';
import { getSystemBrowserExecutable, normalizeProjectScales } from './playwrightEngine';

export interface ExportVideoOptions {
  project: ProjectState;
  port: number;
  resolution?: '1080p' | '720p';
  fps?: number;
  bgmTrack?: 'none' | 'lofi' | 'pedagogy' | 'upbeat' | 'dramatic' | 'custom';
  bgmVolume?: number;
  customAudioPath?: string;
  onProgress?: (progress: number, statusText: string) => void;
}

export interface ExportVideoResult {
  success: boolean;
  filePath?: string;
  downloadUrl?: string;
  fileName?: string;
  error?: string;
}

export function resolveBgmAudioPath(track: string): string | null {
  if (!track || track === 'none') return null;
  const fileName = `bgm-${track}.mp3`;
  const candidates = [
    path.resolve(process.cwd(), 'public', 'audio', fileName),
    path.resolve(__dirname, '..', 'public', 'audio', fileName),
    path.resolve(__dirname, 'public', 'audio', fileName),
    ...(process.resourcesPath ? [
      path.join(process.resourcesPath, 'app', 'public', 'audio', fileName),
      path.join(process.resourcesPath, 'public', 'audio', fileName)
    ] : [])
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

export async function exportVideoViaPlaywright(options: ExportVideoOptions): Promise<ExportVideoResult> {
  const { port, onProgress, resolution = '1080p', fps = 60, bgmTrack = 'lofi', bgmVolume = 0.35, customAudioPath } = options;
  const project = normalizeProjectScales(options.project, options.project.aspectRatio);
  const duration = project.duration || 15;
  const tempDir = path.join(os.tmpdir(), `sticktalk-export-${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const targetVideosDir = path.join(os.homedir(), 'Videos', 'StickTalk');
  fs.mkdirSync(targetVideosDir, { recursive: true });

  const safeTitle = (project.title || 'sticktalk_video')
    .toLowerCase()
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .slice(0, 40);
  const mp4FileName = `${safeTitle}_${Date.now()}.mp4`;
  const targetMp4Path = path.join(targetVideosDir, mp4FileName);

  // Determine recording resolution (Full HD 1080p default or HD 720p)
  let width = 1920;
  let height = 1080;
  if (resolution === '1080p') {
    if (project.aspectRatio === '9:16') {
      width = 1080;
      height = 1920;
    } else if (project.aspectRatio === '1:1') {
      width = 1080;
      height = 1080;
    } else if (project.aspectRatio === '4:3') {
      width = 1440;
      height = 1080;
    } else {
      width = 1920;
      height = 1080;
    }
  } else {
    // 720p
    if (project.aspectRatio === '9:16') {
      width = 720;
      height = 1280;
    } else if (project.aspectRatio === '1:1') {
      width = 720;
      height = 720;
    } else if (project.aspectRatio === '4:3') {
      width = 960;
      height = 720;
    } else {
      width = 1280;
      height = 720;
    }
  }

  onProgress?.(10, `Khởi động Playwright Engine (${resolution} @ ${fps}fps)...`);

  let browser;
  try {
    const executablePath = getSystemBrowserExecutable();
    browser = await chromium.launch({
      executablePath,
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--autoplay-policy=no-user-gesture-required',
        '--disable-web-security',
        `--window-size=${width},${height}`
      ]
    });

    const context = await browser.newContext({
      viewport: { width, height },
      recordVideo: {
        dir: tempDir,
        size: { width, height }
      }
    });

    const page = await context.newPage();
    onProgress?.(20, 'Tải môi trường render và nạp kịch bản hoạt hình...');

    // Pre-inject project data into window before any script evaluates (eliminates old project cache)
    await page.addInitScript((projData) => {
      try {
        localStorage.clear();
        localStorage.setItem('sticktalk_export_project', JSON.stringify(projData));
      } catch {}
      (window as any).__STICKTALK_INITIAL_PROJECT__ = projData;
      (window as any).__PAGE_OPEN_TIME__ = performance.now();
    }, project);

    // Open export mode
    await page.goto(`http://127.0.0.1:${port}/?exportMode=1`, {
      waitUntil: 'domcontentloaded',
      timeout: 15000
    });

    // Wait for canvas to be fully mounted and ready
    try {
      await page.waitForFunction(() => (window as any).__STICKTALK_READY__ === true, { timeout: 8000 });
    } catch {
      await page.waitForTimeout(800);
    }

    // Start playback and record exact start offset
    onProgress?.(35, `Đang ghi hình chuyển động (${duration}s)...`);
    const playbackOffsetSec = await page.evaluate(() => {
      const now = performance.now();
      (window as any).__STICKTALK_PLAYBACK_START__ = now;
      if ((window as any).__STICKTALK_START_PLAYBACK__) {
        (window as any).__STICKTALK_START_PLAYBACK__();
      }
      const openTime = (window as any).__PAGE_OPEN_TIME__ || 0;
      return Math.max(0, (now - openTime) / 1000);
    });

    // Record for duration + 0.5s safety buffer
    const recordWaitMs = Math.round((duration + 0.5) * 1000);
    await page.waitForTimeout(recordWaitMs);

    onProgress?.(80, 'Hoàn tất ghi hình. Đang đóng trình duyệt...');
    await page.close();
    await context.close();
    await browser.close();
    browser = null;

    // Find the recorded video in tempDir
    const files = fs.readdirSync(tempDir);
    const videoFile = files.find(f => f.endsWith('.webm'));
    if (!videoFile) {
      throw new Error('Không tìm thấy file video ghi hình từ Playwright.');
    }
    const webmPath = path.join(tempDir, videoFile);

    // Transcode to MP4 using ffmpeg, skipping the pre-record loading offset
    onProgress?.(85, 'Đang tối ưu & chuyển đổi sang định dạng MP4...');
    const ffmpegBin = fs.existsSync('/home/tontonyuta/.local/bin/ffmpeg')
      ? '/home/tontonyuta/.local/bin/ffmpeg'
      : 'ffmpeg';

    const safeStartOffset = Math.max(0, Number(playbackOffsetSec) || 0).toFixed(2);

    // Audio / BGM merging configuration
    let audioArgs: string[] = [];
    const resolvedAudio = customAudioPath && fs.existsSync(customAudioPath) 
      ? customAudioPath 
      : resolveBgmAudioPath(bgmTrack);

    if (resolvedAudio) {
      onProgress?.(87, 'Đang hòa trộn nhạc nền (BGM Audio Merging)...');
      const vol = typeof bgmVolume === 'number' ? Math.max(0.05, Math.min(1.0, bgmVolume)) : 0.35;
      const fadeOutStart = Math.max(1, duration - 1.5);

      audioArgs = [
        '-stream_loop', '-1',
        '-i', resolvedAudio,
        '-filter_complex', `[1:a]volume=${vol.toFixed(2)},afade=t=in:st=0:d=0.5,afade=t=out:st=${fadeOutStart.toFixed(1)}:d=1.5[a]`,
        '-map', '0:v',
        '-map', '[a]',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-shortest'
      ];
    }

    await new Promise<void>((resolve, reject) => {
      const ffmpegArgs = [
        '-y',
        '-ss', safeStartOffset, // Skip initial loading/setup phase
        '-i', webmPath,
        ...audioArgs,
        '-t', `${duration}`,
        '-r', `${fps}`,
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-preset', 'fast',
        '-movflags', '+faststart',
        targetMp4Path
      ];

      execFile(ffmpegBin, ffmpegArgs, (err) => {
        if (err) return reject(err);
        resolve();
      });
    });

    // Also copy to public export directory for web download
    const publicExportsDir = path.join(os.homedir(), 'Videos', 'StickTalk', 'exports');
    fs.mkdirSync(publicExportsDir, { recursive: true });
    const publicMp4Path = path.join(publicExportsDir, mp4FileName);
    fs.copyFileSync(targetMp4Path, publicMp4Path);

    // Clean up temp
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}

    onProgress?.(100, 'Xuất video MP4 thành công!');
    return {
      success: true,
      filePath: targetMp4Path,
      downloadUrl: `/exports/${mp4FileName}`,
      fileName: mp4FileName
    };
  } catch (err: any) {
    if (browser) {
      try { await browser.close(); } catch {}
    }
    return {
      success: false,
      error: err.message || 'Lỗi trong quá trình xuất video Playwright.'
    };
  }
}
