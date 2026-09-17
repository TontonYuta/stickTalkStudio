const { app, BrowserWindow, shell, ipcMain, Menu, dialog } = require('electron');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Handle unprivileged user namespaces and sandbox configurations on Linux
app.commandLine.appendSwitch('no-sandbox');
app.commandLine.appendSwitch('disable-gpu-sandbox');
app.commandLine.appendSwitch('disable-dev-shm-usage');

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
  process.exit(0);
}

let serverInstance = null;
let activePort = 3050;
let mainWindow = null;

function getIconPath() {
  const candidates = [
    path.join(__dirname, '..', 'public', 'icon.png'),
    path.join(__dirname, '..', 'dist', 'icon.png'),
    path.join(process.resourcesPath || '', 'app', 'public', 'icon.png'),
    path.join(process.resourcesPath || '', 'public', 'icon.png'),
    path.join(__dirname, 'public', 'icon.png')
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return undefined;
}

async function initServer() {
  process.env.NODE_ENV = 'production';
  process.env.EMBEDDED_DESKTOP = 'true';

  let serverModulePath = path.join(__dirname, '..', 'dist', 'server.cjs');
  if (!fs.existsSync(serverModulePath)) {
    serverModulePath = path.join(__dirname, 'dist', 'server.cjs');
  }
  if (!fs.existsSync(serverModulePath) && process.resourcesPath) {
    serverModulePath = path.join(process.resourcesPath, 'app', 'dist', 'server.cjs');
  }

  const { startServer } = require(serverModulePath);

  try {
    const res = await startServer(3050);
    serverInstance = res.server;
    activePort = res.port;
  } catch (err) {
    console.warn('[Desktop Main] Port 3050 không khả dụng, sử dụng cổng tự động...', err.message);
    const res = await startServer(0);
    serverInstance = res.server;
    activePort = res.port;
  }

  return activePort;
}

function createAppMenu() {
  const template = [
    {
      label: 'Tệp',
      submenu: [
        {
          label: 'Mở thư mục Video đã xuất',
          accelerator: 'CmdOrCtrl+Shift+E',
          click: () => {
            const videoDir = path.join(os.homedir(), 'Videos', 'StickTalk');
            fs.mkdirSync(videoDir, { recursive: true });
            shell.openPath(videoDir);
          }
        },
        { type: 'separator' },
        {
          label: 'Thoát',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Chỉnh sửa',
      submenu: [
        { label: 'Hoàn tác (Undo)', role: 'undo' },
        { label: 'Làm lại (Redo)', role: 'redo' },
        { type: 'separator' },
        { label: 'Cắt (Cut)', role: 'cut' },
        { label: 'Sao chép (Copy)', role: 'copy' },
        { label: 'Dán (Paste)', role: 'paste' },
        { label: 'Chọn tất cả', role: 'selectAll' }
      ]
    },
    {
      label: 'Xem',
      submenu: [
        { label: 'Tải lại (Reload)', role: 'reload' },
        { label: 'Buộc tải lại', role: 'forceReload' },
        { label: 'Bật/Tắt Công cụ Phát triển (DevTools)', role: 'toggleDevTools' },
        { type: 'separator' },
        { label: 'Phóng to', role: 'zoomIn' },
        { label: 'Thu nhỏ', role: 'zoomOut' },
        { label: 'Đặt lại cỡ', role: 'resetZoom' },
        { type: 'separator' },
        { label: 'Toàn màn hình', role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Trợ giúp',
      submenu: [
        {
          label: 'Giới thiệu StickTalk Studio',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'StickTalk Studio v2.0',
              message: '🎬 StickTalk Studio - Desktop App',
              detail: 'Ứng dụng máy tính trực tiếp (Standalone Desktop App).\nTích hợp Playwright Video Engine, Antigravity AI & Gemini.\nKhông cần trình duyệt, chạy trực tiếp trên hệ điều hành.',
              buttons: ['Đóng']
            });
          }
        },
        {
          label: 'Mở tài liệu hướng dẫn',
          click: () => {
            const readmePath = path.join(__dirname, '..', 'README.md');
            if (fs.existsSync(readmePath)) {
              shell.openPath(readmePath);
            }
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function createWindow(port) {
  const icon = getIconPath();
  mainWindow = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 1024,
    minHeight: 700,
    title: 'StickTalk Studio - AI Stickman Animation Studio',
    icon,
    autoHideMenuBar: false,
    backgroundColor: '#0f172a',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.cjs')
    }
  });

  mainWindow.loadURL(`http://127.0.0.1:${port}`);

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });

  createAppMenu();
}

ipcMain.handle('open-export-folder', async () => {
  const videoDir = path.join(os.homedir(), 'Videos', 'StickTalk');
  fs.mkdirSync(videoDir, { recursive: true });
  await shell.openPath(videoDir);
  return true;
});

ipcMain.handle('show-item-in-folder', async (_event, filePath) => {
  if (filePath && fs.existsSync(filePath)) {
    shell.showItemInFolder(filePath);
    return true;
  }
  return false;
});

ipcMain.handle('get-app-info', async () => {
  return {
    version: '2.0.0',
    name: 'StickTalk Studio',
    port: activePort,
    isPackaged: app.isPackaged
  };
});

app.on('second-instance', () => {
  if (mainWindow) {
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.focus();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  if (serverInstance) {
    try {
      serverInstance.close();
    } catch {}
  }
});

app.whenReady().then(async () => {
  const port = await initServer();
  createWindow(port);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow(port);
    }
  });
});
