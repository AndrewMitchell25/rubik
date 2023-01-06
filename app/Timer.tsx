"use client";
import { run } from "node:test";
import { useEffect, useRef, useState } from "react";
import Time from "./Time";
import { timerDelay, formatTime } from "../constants";

function Timer() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [keyPressed, setKeyPressed] = useState<KeyboardEvent | null>(null);
  const [releaseTimer, setReleaseTimer] = useState(false);
  const [timeStyle, setTimeStyle] = useState("");
  const [downTime, setDownTime] = useState(0);
  const [downTimeIsRunning, setDownTimeIsRunning] = useState(false);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const isSpaceBar = keyPressed?.key === " ";

    if (downTimeIsRunning && isSpaceBar) {
      setDownTimeIsRunning(false);
    } else if (!downTimeIsRunning && isSpaceBar) {
      setDownTime(0);
      setDownTimeIsRunning(true);
    }

    if (isRunning && isSpaceBar) {
      //Stop the timer
      setIsRunning(false);
      //Generate new scramble?
      //Add time to database?
    } else if (!isRunning && isSpaceBar && releaseTimer) {
      //Start the timer
      setTime(0);
      setDownTime(0);
      setTimeStyle("");
      setIsRunning(true);
    }
  }, [keyPressed]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (isRunning) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    let interval: NodeJS.Timer;
    if (downTimeIsRunning) {
      interval = setInterval(() => {
        setDownTime((prevTime) => prevTime + 10);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [downTimeIsRunning]);

  //Continuously check how long the space button has been pressed
  useEffect(() => {
    if (downTime >= timerDelay) {
      setTimeStyle("text-green-600");
      setTime(0);
      setReleaseTimer(true);
      //Turn off everything except timer?
    } else if (downTime > 50) {
      setTimeStyle("text-red-600");
    }
  }, [downTime]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key !== " " || e.repeat) {
      return;
    }

    setKeyPressed(e);
    setReleaseTimer(false);
  };
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key != " ") {
      return;
    }

    setKeyPressed(e);
    setDownTime(0);
    setTimeStyle("");
  };

  return (
    <div>
      <Time time={formatTime(time)} style={timeStyle} />
    </div>
  );
}

export default Timer;
