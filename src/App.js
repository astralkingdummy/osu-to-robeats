import './App.css';
import { useEffect, useState } from "react"
import { Button, TextField } from '@material-ui/core';
import * as md5 from "md5"
import { parseContent } from "osu-parser"

const xToTrackMap = {
  64: 1,
  192: 2,
  320: 3,
  448: 4
}

function getManiaKeys(osuText) {
  let stringOut = ""
  let cs = "CircleSize:";
  const csIdx = osuText.substring(osuText.indexOf("CircleSize:"), osuText.indexOf("CircleSize:") + "CircleSize:".length + 1);
  const keys = csIdx.substring(csIdx.length - 1, csIdx.length)
  return keys
}

function App() {
  const [ osuText, setOsuText ] = useState("")
  const [ conversion, setConversion ] = useState("")
  const [ assetId, setAssetId ] = useState(0)
  
  return (
    <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <div>
  		  <TextField helperText={".osu file input"} style = {{width: "40%"}} multiline value={osuText} rows={20} onChange={(event) => setOsuText(event.target.value)}/>
      </div>
      <div>
        <Button color="primary" onClick={() => {
          let finalStrOut = ""
          const data = parseContent(osuText)
          let out = {
            "AudioArtist": data.Artist,
            "AudioFilename": data.Title,
            "AudioDifficulty": 1,
            "AudioMapper": data.Creator,
            "AudioVolume": 0.5,
            "AudioTimeOffset": -75,
            "AudioAssetId": `rbxassetid://${assetId}`,
            "AudioCoverImageAssetId": "",
            "AudioDescription": "",
            "AudioHitSFXGroup": 0,
            "AudioMod": 0,
            "AudioNotePrebufferTime": 1000,
            "HitObjects": [],
            "TimingPoints" : []
          }

          let out_2 = {
            "KeyMode": getManiaKeys(data),
            
          }

          // data.hitObjects.forEach(hitObject => {
          //   switch (hitObject.objectName) {
          //     case "circle":
          //       out.HitObjects.push({
          //         "Type": 1,
          //         "Time": hitObject.startTime,
          //         "Track": xToTrackMap[hitObject.position[0]]
          //       })
          //       break
          //     case "slider":
          //       out.HitObjects.push({
          //         "Type": 2,
          //         "Time": hitObject.startTime,
          //         "Track": xToTrackMap[hitObject.position[0]],
          //         "Duration": hitObject.endTime - hitObject.startTime
          //       })
          //       break
          //     default:
          //       break
          //   }
          // })

          const hitObjectJsonString = JSON.stringify(out.HitObjects)
          const audioMD5Hash = md5(hitObjectJsonString)

          out.AudioMD5Hash = audioMD5Hash

          //This for loop doesn't parse the data properly which is annoying
          data.timingPoints.forEach(tp => {
            out.TimingPoints.push({
              "Time": tp.offset,
              "BeatLength": tp.beatLength,
              "BPM": tp.bpm
            })
          }) 

          // setConversion(JSON.stringify(out, null, 2))
        }}>COMPRESS</Button>
      </div>
      <div>
		    <TextField helperText={"txt output"} style = {{width: "40%"}} multiline rows={20} value={conversion}></TextField>
      </div>
    </div>
  );
}

export default App;
