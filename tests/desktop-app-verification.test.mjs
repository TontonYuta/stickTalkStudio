import test from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

test('Desktop App - Standalone Package & Direct Execution Verification', async (t) => {
  const rootDir = process.cwd();
  const binaryPath = path.join(rootDir, 'dist-app', 'StickTalk-Studio-linux-x64', 'StickTalk-Studio');
  const launcherScript = path.join(rootDir, 'sticktalk-studio');
  const iconPath = path.join(rootDir, 'public', 'icon.png');
  const desktopFile = path.join(process.env.HOME || '', '.local', 'share', 'applications', 'sticktalk-studio.desktop');

  // 1. Check file existence and permissions
  assert.ok(fs.existsSync(binaryPath), 'Packaged standalone binary must exist');
  assert.ok((fs.statSync(binaryPath).mode & 0o111) !== 0, 'Binary must be executable');
  assert.ok(fs.existsSync(launcherScript), 'Launcher script sticktalk-studio must exist');
  assert.ok((fs.statSync(launcherScript).mode & 0o111) !== 0, 'Launcher script must be executable');
  assert.ok(fs.existsSync(iconPath), 'App icon must exist');
  assert.ok(fs.existsSync(desktopFile), 'Desktop entry must exist');

  // 2. Spawn standalone desktop app process
  const child = spawn(binaryPath, ['--no-sandbox'], {
    cwd: path.dirname(binaryPath),
    env: {
      ...process.env,
      DISPLAY: process.env.DISPLAY || ':0'
    },
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let capturedPort = 3050;
  let serverReady = false;

  child.stdout.on('data', (data) => {
    const text = data.toString();
    const match = text.match(/http:\/\/127\.0\.0\.1:(\d+)/);
    if (match) {
      capturedPort = parseInt(match[1], 10);
      serverReady = true;
    }
  });

  child.stderr.on('data', (data) => {
    // Collect stderr without failing on standard electron/gtk warnings
  });

  try {
    // Wait for the desktop app's embedded server to be responsive
    const startTime = Date.now();
    let isHealthy = false;

    while (Date.now() - startTime < 15000) {
      try {
        const res = await fetch(`http://127.0.0.1:${capturedPort}/api/health`, {
          signal: AbortSignal.timeout(600)
        });
        if (res.ok) {
          const data = await res.json();
          if (data.status === 'ok' && data.app === 'StickTalk Studio') {
            isHealthy = true;
            assert.equal(data.app, 'StickTalk Studio');
            assert.equal(data.version, '2.0.0');
            break;
          }
        }
      } catch {}
      await new Promise((r) => setTimeout(r, 400));
    }

    assert.ok(isHealthy, 'Desktop App embedded server must respond ok to /api/health within 15s');
  } finally {
    // Terminate the app
    child.kill('SIGTERM');
    await new Promise((r) => setTimeout(r, 500));
    try {
      child.kill('SIGKILL');
    } catch {}
  }
});
