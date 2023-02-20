import { useState, useEffect } from 'react'
import logo from '../mealscount-backend/src/assets/MC_Logo@2x.png'
//import './App.css'

function App() {
  const [fileData,setFileData] = useState(null)
  const [runStarted,setRunStarted] = useState(null)
  const [progress,setProgress] = useState(0)
  const [resultData,setResultData] = useState(null)

  const handleRunProgress = (event,p) => {
    setProgress(p)
  }

  const handleRunCanceled = (event) => {
    alert("Run Canceled")
    setRunStarted(null)
    setProgress(0)
  }

  const handleRunComplete = (event,data) => {
    const results = JSON.parse(data)
    console.log(results)
    setResultData(results)
  }

  useEffect( () => {
    console.log("registering callbacks from main")
    window.electronAPI.progress(handleRunProgress)
    window.electronAPI.complete(handleRunComplete)
    window.electronAPI.canceled(handleRunCanceled)
  },[])

  const handleOpenClick = async () => {
    const data = await window.electronAPI.openFile()
    setFileData(data)
  }

  const handleRun = async () => {
    if(fileData){
      void window.electronAPI.startRun(fileData.tempfile,"WA",{hello:"World"})
      setRunStarted(new Date())
    }else{
      alert("Unable to load file data, please select file")
    }
  }

  const handleCancelRun = async () => {
    // TODO
  }

  return (
    <div className="App">
      <div>
        <img src={logo} className="logo react" alt="MealsCount Logo" />
      </div>

      <h1>MealsCount Bulk Tool</h1>
      <p>Download Template: <a>TODO</a></p>

      <div className="card">
        <button onClick={handleOpenClick}>Open File</button>
        {fileData?<div>
          Loaded {fileData.tempfile}
          {(fileData.missing_cols.length > 0)?<p class="error">
            Missing Columns: {fileData.missing_cols.join(',')}
          </p>:<div>
            <button onClick={handleRun}>Run Optimization</button>
          </div>}
        </div>:null}
      </div>
      {runStarted?<div>
        <div>Running for {(((new Date()).getTime() - runStarted.getTime())/1000).toFixed(0)} seconds</div>
        <button onClick={handleCancelRun}>Cancel</button>
        <div style={{width: '400px',height: '20px',border: '1px solid black'}}>
          <div style={{width:`${Math.round(progress*100)}%`,height:'100%',backgroundColor:'blue'}} />
        </div>
      </div>:null}
    </div>
  )
}

export default App
