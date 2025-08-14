import { useState } from "react";
import { Card } from "../components/ui/card";
import { ProgressRing } from "../components/ui/progress-ring";
import { useTimer } from "../hooks/useTimer";
import { text } from "../styles/text";
import { layout } from "../styles/layout";

export const App = (): JSX.Element => {
  const {
    timeLeft,
    state,
    isRunning,
    progress,
    completedPhases,
    pause,
    startFocus,
    startBreak,
    resume,
    stop,
    formatTime,
    setCustomDuration,
  } = useTimer();

  const [sessionTitle, setSessionTitle] = useState("Practice Coding");

  const getSessionSubtitle = () => {
    switch (state) {
      case "focus":
        return "Focus";
      case "break":
        return "Break";
      case "paused":
        return "Paused";
      case "stopped":
        return "Ready to focus";
      default:
        return "Focus";
    }
  };

  return (
    <Card className="flex w-[328px] h-[144px] rounded-3xl justify-between p-3.5">
      {/* Timer */}
      <div className="relative w-[116px] h-[116px]">
          {/* Circular Progress Bar */}
          <div className="absolute w-full h-full">
              <ProgressRing 
                progress={progress}
                isRunning={isRunning}
                variant={state === "break" ? "break" : "focus"}
              />
              {/* Content container */}
              <div className={layout.contentContainer}>
                {/* Phase icon - positioned at 22% from top */}
                <div className={layout.phaseIconPosition}>
                  <div className={`inline-flex items-center ${layout.phaseIcon}`}>
                    <span className="material-symbols-rounded">
                      {(state === "focus" || state === "stopped") && "bolt"}
                      {state === "break" && "coffee"}
                      {state === "paused" && "pause"}
                    </span>
                  </div>
                </div>
                {/* Center timer */}
                <div className={layout.centered}>
                  {isRunning || state === 'paused' ? (
                    <div className={text.timer}>
                      {formatTime(timeLeft)}
                    </div>
                  ) : (
                    <div 
                      className={`${text.timer} cursor-text`}
                      onClick={() => {
                        const minutes = Math.floor(timeLeft / 60);
                        const input = prompt("Enter duration in minutes (1-60):", minutes.toString());
                        const value = parseInt(input || "");
                        if (!isNaN(value)) {
                          setCustomDuration(value);
                        }
                      }}
                    >
                      {formatTime(timeLeft)}
                    </div>
                  )}
                </div>

                {/* Phase dots - positioned at 67% from top */}
                <div className={layout.phaseDotsPosition}>
                  <div className="inline-flex items-center gap-0.5">
                    {completedPhases.slice(0, 5).map((phase, index) => (
                      <div
                        key={index}
                        className={`${
                          phase === "focus"
                            ? "bg-colorsblue"
                            : "bg-colorsgreen"
                        } ${layout.phaseDot}`}
                      />
                    ))}
                    {Array(5 - completedPhases.length)
                      .fill(null)
                      .map((_, index) => (
                        <div
                          key={index + completedPhases.length}
                          className="bg-labelstertiary relative w-1.5 h-1.5 rounded-[3px]"
                        />
                      ))}
                  </div>
                </div>
              </div>
          </div>
      </div>
      {/* Menu */}
      <div className="flex flex-col justify-between">
            {/* Header */}
            <div className={layout.headerContainer}>
              <div className={layout.headerDivider} />
              <div className="flex flex-col flex-none justify-center">
                <div className={text.title}
                    onClick={() => {
                    const newTitle = prompt("Enter session title:", sessionTitle);
                    if (newTitle) {
                      setSessionTitle(newTitle);
                    }
                  }}
                >
                  {sessionTitle}
                </div>
                <div className={text.subtitle}>
                  {getSessionSubtitle()}
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              {/* Controls */}
              {(isRunning || state === "paused") && (
              <div className={layout.buttonContainer}>
                <button
                  onClick={state === "paused" ? resume : pause}
                  disabled={state === "stopped"}
                  className={layout.controlButton}
                >
                  <div className={text.button}>
                    {state === "paused" ? "􀊄" : "􀊆"}
                  </div>
                  <div className={text.button}>
                    {state === "paused" ? "Continue" : "Pause"}
                  </div>
                </button>
                <button
                  onClick={stop}
                  className={layout.stopButton}
                >
                  <div className={text.button}>
                    􀛷
                  </div>
                </button>
              </div>
              )}
            {/* Action Button */}
            <button
              onClick={
                state === "stopped"
                  ? startFocus
                  : state === "break"
                  ? startFocus
                  : startBreak
              }
              className={`${layout.actionButton} ${
                state === "break" ? "bg-colorsgreen" : "bg-colorsblue"
              }`}
            >
              <div className={`${text.button} text-white`}>
                {state === "stopped"
                  ? "Start Focus"
                  : state === "break"
                  ? "Focus"
                  : "Break"}
              </div>
            </button>
              </div>
      </div>
    </Card>
  );
};
