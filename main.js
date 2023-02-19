// Links
// https://til.simonwillison.net/electron/python-inside-electron
// https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app 
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const cp = require("child_process");
const util = require("util");
const execFile = util.promisify(cp.execFile);
const path = require("path");


const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })
  win.loadFile('index.html')
}

async function handleRunOptimization( event,state,options) {
  const { canceled, filePaths }  = await dialog.showOpenDialog()
  if(canceled){
    return
  }
  const file = filePaths[0]
  console.log("Would run "+file+" for state "+state+" with options "+JSON.stringify(options));
  await execFile("dist/statewide/statewide.exe", ["--csv-file",file,"--state",state,"--output-file",`output/statewide-${state}-output.csv`,"--debug"]);
}

async function handleCancelOptimization( event) {
  console.log("TODO cancel") 
}

app.whenReady().then(() => {
  ipcMain.on('run',handleRunOptimization)
  ipcMain.on('cancel',handleCancelOptimization)
  createWindow()
})