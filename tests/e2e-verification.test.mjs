import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';

const execFileAsync = promisify(execFile);
const BASE_URL = 'http://127.0.0.1:3050';
let serverProcess = null;

before(async () => {
  try {
    const res = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(1000) });
    if (res.ok) return;
  } catch {}

  serverProcess = spawn('node', ['dist/server.cjs'], {
    cwd: process.cwd(),
    env: { ...process.env, NODE_ENV: 'production', PORT: '3050' },
    stdio: 'ignore'
  });

  const start = Date.now();
  while (Date.now() - start < 15000) {
    try {
      const res = await fetch(`${BASE_URL}/api/health`, { signal: AbortSignal.timeout(500) });
      if (res.ok) break;
    } catch {}
    await new Promise(r => setTimeout(r, 200));
  }
});

after(() => {
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
});

test('1. Health Check Endpoint', async () => {
  const res = await fetch(`${BASE_URL}/api/health`);
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.status, 'ok');
  assert.equal(data.app, 'StickTalk Studio');
  assert.equal(data.engines.antigravity, true);
  assert.equal(data.engines.playwrightChrome, true);
  assert.equal(data.engines.ffmpeg, true);
});

test('2. Rerender Endpoint - Pruning Sticky Props & Enforcing Standing Pose', async () => {
  const testProject = {
    id: 'test-rerender-project',
    title: 'Toán Khảo Sát Hàm Số',
    aspectRatio: '16:9',
    duration: 5,
    background: 'bg-slate-900',
    characters: [
      {
        id: 'char-gv',
        name: 'Thầy Hưng',
        color: '#3b82f6',
        scale: 1,
        flipX: false,
        x: 18,
        y: 75,
        startTime: 0,
        duration: 5,
        keyframes: [
          { id: 'kf-1', time: 0, x: 18, y: 75 },
          { id: 'kf-2', time: 4, x: 60, y: 75 }
        ]
      }
    ],
    dialogBlocks: [
      {
        id: 'd-1',
        characterId: 'char-gv',
        text: 'Hôm nay chúng ta sẽ cùng nhau tìm hiểu định nghĩa cực trị của hàm số một cách chi tiết và dễ hiểu nhất có thể nhé các em học sinh yêu quý',
        startTime: 0,
        duration: 5,
        bubbleType: 'normal',
        emotion: 'explaining'
      }
    ],
    props: [
      { id: 'sticky-emoji-1', type: 'emoji', content: '🍕', x: 50, y: 50, scale: 1.5, startTime: 0, duration: 5 },
      { id: 'sticky-emoji-2', type: 'emoji', content: '🎉', x: 70, y: 30, scale: 1.5, startTime: 0, duration: 5 },
      { id: 'math-chart', type: 'chart', content: 'x^3 - 3*x', x: 50, y: 44, scale: 1, startTime: 0, duration: 5 }
    ]
  };

  const res = await fetch(`${BASE_URL}/api/ai/rerender`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'fast',
      currentProject: testProject,
      modificationPrompt: 'Xóa sạch emoji cũ và đạo cụ thừa, cho nhân vật đứng yên đối thoại, rút ngắn lời thoại'
    })
  });

  assert.equal(res.status, 200);
  const result = await res.json();
  assert.equal(result.success, true);
  assert.ok(result.project);

  // Emojis must be pruned completely
  const emojis = result.project.props.filter(p => p.type === 'emoji');
  assert.equal(emojis.length, 0, 'All sticky emojis should be pruned');

  // Math chart must be preserved
  const charts = result.project.props.filter(p => p.type === 'chart');
  assert.equal(charts.length, 1, 'Math chart must be preserved');

  // Character keyframes must be converted to stationary stance
  const char = result.project.characters[0];
  assert.ok(char.keyframes);
  char.keyframes.forEach(kf => {
    assert.equal(kf.pose?.legL, 10);
    assert.equal(kf.pose?.legR, -10);
  });

  // Dialog must be shortened
  const dialog = result.project.dialogBlocks[0];
  const wordCount = dialog.text.trim().split(/\s+/).length;
  assert.ok(wordCount <= 11, `Shortened dialog has ${wordCount} words, expected <= 11`);
});

test('3. Video Export via Playwright & Trimming Verification', { timeout: 45000 }, async () => {
  const exportProject = {
    id: 'export-verify-project',
    title: 'KiemTraXuatVideo',
    aspectRatio: '16:9',
    duration: 3,
    background: 'bg-slate-900',
    characters: [
      {
        id: 'char-1',
        name: 'Giảng Viên',
        color: '#2563eb',
        scale: 1.2,
        flipX: false,
        x: 14,
        y: 75,
        startTime: 0,
        duration: 3,
        pose: {
          headAngle: 0,
          bodyAngle: 0,
          leftArm: { upperAngle: -20, lowerAngle: -30 },
          rightArm: { upperAngle: 45, lowerAngle: 90 },
          leftLeg: { upperAngle: 0, lowerAngle: 0 },
          rightLeg: { upperAngle: 0, lowerAngle: 0 }
        }
      },
      {
        id: 'char-2',
        name: 'Học Sinh',
        color: '#10b981',
        scale: 1.2,
        flipX: true,
        x: 86,
        y: 75,
        startTime: 0,
        duration: 3,
        pose: {
          headAngle: 0,
          bodyAngle: 0,
          leftArm: { upperAngle: 0, lowerAngle: 0 },
          rightArm: { upperAngle: -30, lowerAngle: -45 },
          leftLeg: { upperAngle: 0, lowerAngle: 0 },
          rightLeg: { upperAngle: 0, lowerAngle: 0 }
        }
      }
    ],
    dialogBlocks: [
      {
        id: 'diag-1',
        characterId: 'char-1',
        text: 'Hàm số đồng biến khi đạo hàm dương!',
        startTime: 0.2,
        duration: 2.6,
        bubbleType: 'normal',
        emotion: 'explaining'
      }
    ],
    props: [
      {
        id: 'chart-1',
        type: 'chart',
        content: 'x^2',
        x: 50,
        y: 44,
        scale: 1,
        startTime: 0,
        duration: 3,
        chartConfig: {
          chartType: 'function',
          fn: 'x^2',
          label: 'y = x^2'
        }
      }
    ]
  };

  const res = await fetch(`${BASE_URL}/api/export-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project: exportProject,
      resolution: '720p',
      fps: 30
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.filePath, 'Export must return a filePath');
  assert.ok(fs.existsSync(data.filePath), `Exported file must exist at ${data.filePath}`);

  const stat = fs.statSync(data.filePath);
  assert.ok(stat.size > 10000, `Video file size (${stat.size} bytes) must be substantial`);

  // Probe video file using ffprobe
  const ffprobeBin = fs.existsSync('/home/tontonyuta/.local/bin/ffprobe')
    ? '/home/tontonyuta/.local/bin/ffprobe'
    : 'ffprobe';

  const { stdout: probeOut } = await execFileAsync(ffprobeBin, [
    '-v', 'error',
    '-select_streams', 'v:0',
    '-show_entries', 'stream=width,height,duration,r_frame_rate',
    '-of', 'json',
    data.filePath
  ]);

  const probe = JSON.parse(probeOut);
  const stream = probe.streams[0];
  assert.equal(stream.width, 1280, '720p 16:9 width must be 1280');
  assert.equal(stream.height, 720, '720p 16:9 height must be 720');
  const dur = parseFloat(stream.duration);
  assert.ok(dur >= 2.5 && dur <= 4.0, `Video duration must match project duration (~3s), got ${dur}`);

  // Extract a frame at 1.5s to verify content is rendered properly
  const frameDir = path.resolve(process.cwd(), 'scratch', 'test_frames');
  fs.mkdirSync(frameDir, { recursive: true });
  const framePath = path.join(frameDir, 'frame_1_5s.png');

  const ffmpegBin = fs.existsSync('/home/tontonyuta/.local/bin/ffmpeg')
    ? '/home/tontonyuta/.local/bin/ffmpeg'
    : 'ffmpeg';

  await execFileAsync(ffmpegBin, [
    '-y',
    '-ss', '1.5',
    '-i', data.filePath,
    '-vframes', '1',
    framePath
  ]);

  assert.ok(fs.existsSync(framePath), 'Extracted frame must exist');
  const frameStat = fs.statSync(framePath);
  assert.ok(frameStat.size > 5000, 'Frame image must contain actual graphical data');
});

test('4. Generate New Video with Custom Duration Verification', async () => {
  const targetDuration = 25;
  const res = await fetch(`${BASE_URL}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'fast',
      topic: 'Giải phương trình bậc 2 bằng biệt thức Delta',
      duration: targetDuration,
      aspectRatio: '16:9',
      dialogueStyle: 'pedagogical',
      dialogueBoxStyle: 'bubble'
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.project);
  assert.equal(data.project.duration, targetDuration, `Project duration must equal requested custom duration (${targetDuration}s)`);
  assert.ok(data.project.characters.length >= 2, 'Generated project should have at least 2 characters');
  
  // Verify characters remain visible for the full custom duration
  data.project.characters.forEach(c => {
    assert.ok(c.duration >= targetDuration, `Character ${c.id} duration (${c.duration}s) must cover project duration (${targetDuration}s)`);
  });

  // Verify dialog blocks fit within the custom duration
  data.project.dialogBlocks.forEach(db => {
    assert.ok(db.startTime < targetDuration, `Dialog block ${db.id} must start within project duration`);
  });
});

test('5. Concept Clarification (Thầy vs Trò Archetype) Verification', async () => {
  const res = await fetch(`${BASE_URL}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'fast',
      topic: 'Cách AI chatbot hoạt động',
      duration: 15,
      aspectRatio: '16:9',
      dialogueStyle: 'pedagogical',
      dialogueBoxStyle: 'bubble'
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.project);
  assert.ok(data.project.characters.length >= 2, 'Must have at least Thầy and Trò');
  
  // Verify Mentor character
  const teacher = data.project.characters.find(c => c.id.includes('teacher') || (c.name && c.name.includes('Thầy')));
  assert.ok(teacher, 'Must contain a Teacher / Mentor character');
  assert.equal(teacher.flipX, false, 'Teacher must face right towards student');
  
  // Verify Student character
  const student = data.project.characters.find(c => c.id.includes('student') || (c.name && (c.name.includes('Trò') || c.name.includes('Tí'))));
  assert.ok(student, 'Must contain a Student / Learner character');
  assert.equal(student.flipX, true, 'Student must face left towards teacher');

  // Verify dialogue blocks exist and convey concept
  assert.ok(data.project.dialogBlocks.length >= 3, 'Must contain Socratic dialogue blocks');
  const hasAITopic = data.project.dialogBlocks.some(db => db.text.toLowerCase().includes('ai') || db.text.toLowerCase().includes('chatbot') || db.text.toLowerCase().includes('từ'));
  assert.ok(hasAITopic, 'Dialogue must address the core concept');
});

test('6. Non-Graph Topic Has No Unsolicited Function Graph', async () => {
  const res = await fetch(`${BASE_URL}/api/ai/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      provider: 'fast',
      topic: 'Cách AI chatbot hoạt động',
      duration: 15,
      aspectRatio: '16:9',
      dialogueStyle: 'pedagogical',
      dialogueBoxStyle: 'bubble'
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  
  // Verify props do NOT contain any function chart
  const chartProps = (data.project.props || []).filter(p => p.type === 'chart');
  assert.equal(chartProps.length, 0, 'Non-graph topics like AI chatbot must NEVER contain unsolicited chart props');
});

test('7. Smart Video Export with BGM Audio Muxing', async () => {
  const exportProject = {
    id: 'test-bgm-export-project',
    title: 'BGM Muxing Test',
    aspectRatio: '16:9',
    duration: 3,
    background: 'bg-slate-900',
    characters: [
      {
        id: 'char-1',
        name: 'Thầy Giáo',
        type: 'teacher',
        x: 25,
        y: 65,
        scale: 1,
        color: '#3b82f6',
        expression: 'speaking',
        flipX: false,
        startTime: 0,
        duration: 3
      }
    ],
    dialogBlocks: [
      {
        id: 'dialog-1',
        characterId: 'char-1',
        text: 'Thử nghiệm ghép nhạc nền Lo-fi!',
        startTime: 0.5,
        duration: 2.0,
        boxStyle: 'bubble'
      }
    ],
    props: [],
    audios: []
  };

  const res = await fetch(`${BASE_URL}/api/export-video`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      project: exportProject,
      resolution: '720p',
      fps: 30,
      bgmTrack: 'lofi',
      bgmVolume: 0.35
    })
  });

  assert.equal(res.status, 200);
  const data = await res.json();
  assert.equal(data.success, true);
  assert.ok(data.filePath, 'Export must return a filePath');
  assert.ok(fs.existsSync(data.filePath), `Exported file must exist at ${data.filePath}`);

  // Probe audio stream using ffprobe
  const ffprobeBin = fs.existsSync('/home/tontonyuta/.local/bin/ffprobe')
    ? '/home/tontonyuta/.local/bin/ffprobe'
    : 'ffprobe';

  const { stdout: probeOut } = await execFileAsync(ffprobeBin, [
    '-v', 'error',
    '-select_streams', 'a:0',
    '-show_entries', 'stream=codec_name,channels,sample_rate',
    '-of', 'json',
    data.filePath
  ]);

  const probe = JSON.parse(probeOut);
  assert.ok(probe.streams && probe.streams.length > 0, 'Exported video must contain an audio stream');
  const audioStream = probe.streams[0];
  assert.equal(audioStream.codec_name, 'aac', 'Audio codec must be AAC');
  assert.equal(audioStream.channels, 2, 'Audio must be stereo (2 channels)');
});


