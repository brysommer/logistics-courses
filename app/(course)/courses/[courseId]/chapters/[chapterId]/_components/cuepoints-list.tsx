import { Fragment } from "react";

type CuePoint = { time: number; value: string };

const formatTime = (seconds: number | undefined) => {
    if (seconds == null) return "--:--";
    const date = new Date(0);
    date.setSeconds(seconds);
    const substrStart = seconds / (60 * 60) >= 1 ? 11 : 14;
    const timeString = date.toISOString().substring(substrStart, 19);
    return timeString;
  };

const TranscriptCuePointRenderer = ({
    cuePoint,
    onCuePointSelected = () => {}
  }: {
    cuePoint: CuePoint;
    onCuePointSelected?: (cuePoint: CuePoint) => void;
  }) => {
    const { value, time } = cuePoint;
    return (
        <>
      <span
        onClick={() => onCuePointSelected(cuePoint)}
      > 
        <span className="text-blue-400">{formatTime(time)}</span> {value}
       
        
      </span><br></br>
      </>
      
    );
  };
  const TranscriptRenderer = ({
    cuePoints = [],
    onCuePointSelected = () => {}
  }: {
    cuePoints: CuePoint[];
    onCuePointSelected?: (cuePoint: CuePoint) => void;
  }) => {
    return (
      <div className="transcript">
        {cuePoints.map((cuePoint, i) => {
          const spacer = i < cuePoints.length - 1 ? " " : "";
          return (
            <Fragment key={cuePoint.time}>
              <TranscriptCuePointRenderer
                onCuePointSelected={onCuePointSelected}
                cuePoint={cuePoint}
              />
              {spacer}
            </Fragment>
          );
        })}
      </div>
    );
  };

  export default TranscriptRenderer