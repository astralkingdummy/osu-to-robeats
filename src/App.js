import './App.css';
import { useEffect, useState } from "react"
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component';
import { Button, TextField, ToolTip } from '@material-ui/core';
import * as md5 from "md5"
import { parseContent } from "osu-parser"

const xToTrackMap = {
  64: 1,
  192: 2,
  320: 3,
  448: 4
}

function isInherited(timingPoint) {
  if (timingPoint.timingChange === true)
    return 1
  else
    return 0
}

function getHeritageValue(isInherited, tp) {
  if (isInherited === true) {
    return tp.velocity
  } else {
    return tp.beatLength
  }
}

function App() {
  const [ osuText, setOsuText ] = useState("")
  const [ conversion, setConversion ] = useState("")
  const [ assetId, setAssetId ] = useState(0)
  const [ copiedText, setCopiedText ] = useState()
  
  return (
    <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
      <div>
          <TextField helperText={".osu file input"} style = {{width: "40%"}} multiline value={osuText} rows={20} onChange={(event) => setOsuText(event.target.value)}/>
      </div>
      <div>
        <Button color="primary" onClick={() => {
          const data = parseContent(osuText)
          const tpoints = data.timingPoints;
          let str_final = data.CircleSize + "\nT\n"

          tpoints.forEach(tp => {
            const inherited = isInherited(tp)
            const heritageVal = getHeritageValue(inherited, tp)

            str_final += tp.offset + "," + inherited + "," + heritageVal + "\n"
          })

          str_final += "H\n"

          data.hitObjects.forEach(hitObject => {
            console.log(hitObject.objectName)
            switch (hitObject.objectName) {
              case "circle":
                str_final += hitObject.startTime + "," + xToTrackMap[hitObject.position[0]] + "," + "0," + "0" +"\n"
                break
              case "slider":
                let duration = hitObject.endTime - hitObject.startTime
                str_final += hitObject.startTime + "," + xToTrackMap[hitObject.position[0]] + "," + "1," + duration +"\n"
                break
              default:
                break
            }
          })

          setConversion(str_final)
        }}>COMPRESS</Button>
      </div>
      <div>
            <TextField helperText={"compressed output"} style = {{width: "50%"}} multiline rows={20} value={conversion}></TextField>
      </div>
    </div>
  );
}

export default App;
