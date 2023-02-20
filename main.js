// Links
// https://til.simonwillison.net/electron/python-inside-electron
// https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app 
const { app, BrowserWindow, ipcMain, dialog } = require('electron')
const cp = require("child_process");
const path = require("path");
const fs = require("fs");
const xlsx = require("xlsx")
const os = require('os');

const tmpDir = os.tmpdir()
const tempFiles = []

const isDev = require('electron-is-dev')

let sendToWindow = null

// TODO import from js file (extract from mealscount-backend/src/components/district/ImportModal.vue)
const REQUIRED_COLS = [
  "school_name",
  "total_enrolled",
  "total_eligible",
  "daily_breakfast_served",
  "daily_lunch_served",
]

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
  })

  sendToWindow = (event,payload) => {
    win.webContents.send(event,payload)
  }

  win.loadURL(
    isDev ? 'http://localhost:5173' : `file://${path.join(__dirname,'vite_dist/index.html')}`
  )
  // win.loadFile('dist/index.html')
}

async function handleOpenFile(event) {
  const { canceled, filePaths }  = await dialog.showOpenDialog()
  if(canceled){
    return
  }
  const file = filePaths[0]
  const workbook = xlsx.readFile(file)
  const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
  console.log("Loaded",data[0])
  const missing_cols = REQUIRED_COLS.filter(col => data[0][col] === undefined)
  console.log("Processed ",file," Missing cols: ",missing_cols)  

  // Create stats
  const stats = {districts:null,schools:null}
  if(missing_cols.length===0){
    // get district count, school count
    stats.districts = data.reduce((s,d) => { s.add(d.district_code); return s; },new Set()).size;
    stats.schools = data.length;
  }

  // TODO signal to renderer
  return {
    tempfile: file,
    valid: missing_cols.length === 0,
    missing_cols:missing_cols,
    stats: stats,
  }
}

function handleRunOptimization( event,file,state,options) {
  console.log("Running "+file+" for state "+state+" with options "+JSON.stringify(options));
  const outputFile = path.join(tmpDir,`statewide-${state}-output-${new Date().getTime()}.csv`)
  tempFiles.push(outputFile)

  const cmd = path.join("dist","statewide","statewide.exe")
  const args = ["--csv-file",file,"--state",state,"--output-file",outputFile,"--debug"]
  console.log(cmd)
  const controller = new AbortController()
  const {signal} = controller;
  console.log("Running",cmd,args)
  const proc = cp.spawn(cmd,args) //,{signal:signal})
  // TODO progressbar
  proc.stdout.on('data',(data) => {
    const lines = data.toString().split()
    const last = lines[lines.length-1]
    const v = Number(last)
    if(!isNaN(v)){
      sendToWindow("progress",v)
    }
  }) 
  proc.stderr.on('data',(data) => {
    //console.error("E",data.toString())
  })
  proc.on('close', () => {
    const workbook = xlsx.readFile(outputFile)
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
    sendToWindow('complete',data)
  })
}

async function handleCancelOptimization( event) {
  console.log("TODO cancel") 
}

app.whenReady().then(() => {
  ipcMain.handle('openFile',handleOpenFile)
  ipcMain.on('run',handleRunOptimization)
  ipcMain.on('cancel',handleCancelOptimization)
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// TODO delete tempFiles?