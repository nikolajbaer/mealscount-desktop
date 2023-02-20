
let fileData = null

function init(){
  document.getElementById("open").onclick = async function() {
    fileData = await window.electronAPI.openFile()
    document.getElementById("loaded").innerText = `Loaded ${fileData.naame}`
    document.getElementById("run").style.display = "block"
  }
  document.getElementById("run").onclick = function() {
    window.electronAPI.startRun(fileData.tempfile,"WA",{hello:"World"})
  }
}

init();