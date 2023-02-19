// Links
// https://til.simonwillison.net/electron/python-inside-electron
// https://www.electronjs.org/docs/latest/tutorial/tutorial-first-app 
const { app, BrowserWindow } = require('electron')
const cp = require("child_process");
const util = require("util");
const execFile = util.promisify(cp.execFile);


//await execFile(path_to_python, ["-m", "random"]);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
  })

  win.loadFile('index.html')

}

app.whenReady().then(() => {
  createWindow()
})