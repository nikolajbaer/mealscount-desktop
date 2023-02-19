const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  startRun: (file,state,options) => ipcRenderer.send('run', file,state,options),
  cancelRun: () => ipcRenderer.send('cancel'),
})