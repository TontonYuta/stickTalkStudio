const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('sticktalkDesktop', {
  isDesktop: true,
  openExportFolder: () => ipcRenderer.invoke('open-export-folder'),
  showItemInFolder: (filePath) => ipcRenderer.invoke('show-item-in-folder', filePath),
  getAppInfo: () => ipcRenderer.invoke('get-app-info')
});
