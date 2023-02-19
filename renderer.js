
function init(){
  document.getElementById("run").onclick = function() {
    window.electronAPI.startRun("WA",{hello:"World"})
  }
}

init();