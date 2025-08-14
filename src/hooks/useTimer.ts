import { useState, useEffect, useRef } from 'react';

export type TimerState = 'focus' | 'break' | 'paused' | 'stopped';

export interface UseTimerReturn {
  timeLeft: number;
  state: TimerState;
  isRunning: boolean;
  progress: number;
  completedPhases: ('focus' | 'break')[];
  pause: () => void;
  startFocus: () => void;
  startBreak: () => void;
  resume: () => void;
  stop: () => void;
  formatTime: (seconds: number) => string;
  setCustomDuration: (minutes: number) => void;
}

export const useTimer = (
  focusDuration: number = 25 * 60 // 25 minutes in seconds
): UseTimerReturn => {
  const [timeLeft, setTimeLeft] = useState(focusDuration);
  const [state, setState] = useState<TimerState>('stopped');
  const [isRunning, setIsRunning] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(focusDuration);
  const [completedPhases, setCompletedPhases] = useState<('focus' | 'break')[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Calculate progress percentage
  const progress = state !== 'stopped' ? ((currentDuration - timeLeft) / currentDuration) * 100 : 0;

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            if (state === 'focus' || state === 'break') {
              setCompletedPhases(phases => {
                if (phases.length >= 5) return phases;
                return [...phases, state];
              });
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, state]);

  const pause = () => {
    setIsRunning(false);
    setState('paused');
  };

  const startFocus = () => {
    setTimeLeft(focusDuration);
    setState('focus');
    setCurrentDuration(focusDuration);
    setIsRunning(true);
    if (state === 'break') {
      setCompletedPhases(phases => {
        if (phases.length >= 5) return phases;
        return [...phases, 'break'];
      });
    }
  };

  const startBreak = () => {
    const fiveMinutes = 5 * 60; // Always use 5 minutes for break
    setTimeLeft(fiveMinutes);
    setState('break');
    setCurrentDuration(fiveMinutes);
    setIsRunning(true);
    setCompletedPhases(phases => {
      if (phases.length >= 5) return phases;
      return [...phases, 'focus'];
    });
  };

  const stop = () => {
    setIsRunning(false);
    setState('stopped');
    setTimeLeft(focusDuration);
    setCurrentDuration(focusDuration);
    setCompletedPhases([]);
  };

  const resume = () => {
    if (state === 'paused') {
      setState(timeLeft === focusDuration ? 'focus' : 'break');
      setIsRunning(true);
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}.${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const setCustomDuration = (minutes: number) => {
    // Only allow customizing focus duration
    if (state === 'focus' || state === 'stopped') {
      const newDuration = Math.max(1, Math.min(60, minutes)) * 60; // Convert to seconds, min 1 min, max 60 min
      focusDuration = newDuration;
      setTimeLeft(newDuration);
      setCurrentDuration(newDuration);
    }
  };

  return {
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
    setCustomDuration
  };
};