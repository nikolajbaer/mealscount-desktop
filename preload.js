const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('openFile'),
  startRun: (file,state,options) => ipcRenderer.send('run', file,state,options),
  cancelRun: () => ipcRenderer.send('cancel'),
  progress: (callback) => ipcRenderer.on('progress', callback),
  complete: (callback) => ipcRenderer.on('complete', callback),
  canceled: (callback) => ipcRenderer.on('canceled', callback),
})