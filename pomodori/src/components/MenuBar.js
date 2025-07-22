'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './pomodori.module.css';

const DURATIONS = {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
};

export default function MenuBar() {
    const [open, setOpen] = useState(false);
    const [phase, setPhase] = useState('work');
    const [seconds, setSeconds] = useState(DURATIONS.work);
    const [isActive, setIsActive] = useState(false);
    const [cycle, setCycle] = useState(1);
    const [finished, setFinished] = useState(false);
    const alarmRef = useRef(null);

    // Timer logic
    useEffect(() => {
        let interval = null;
        if (isActive && seconds > 0) {
            interval = setInterval(() => setSeconds((s) => s - 1), 1000);
        } else if (isActive && seconds === 0) {
            setIsActive(false);
            setFinished(true);
            alarmRef.current?.play();
            showNotification();
            handleNextPhase();
        }
        return () => clearInterval(interval);
    }, [isActive, seconds]);

    const handleNextPhase = () => {
        setTimeout(() => {
            if (phase === 'work') {
                if (cycle < 4) {
                    setPhase('shortBreak');
                    setSeconds(DURATIONS.shortBreak);
                } else {
                    setPhase('longBreak');
                    setSeconds(DURATIONS.longBreak);
                }
            } else {
                setPhase('work');
                setSeconds(DURATIONS.work);
                setCycle((prev) => (phase === 'longBreak' ? 1 : prev + 1));
            }
        }, 1000);
    };

    const showNotification = () => {
        if (Notification.permission === 'granted') {
            new Notification(`Phase complete: ${phase}`, {
                body: phase === 'work' ? 'Take a short break!' : 'Back to work!',
            });
        }
    };

    const handleReset = () => {
        setIsActive(false);
        setFinished(false);
        setPhase('work');
        setSeconds(DURATIONS.work);
        setCycle(1);
    };

    const manualSwitch = (newPhase) => {
        setIsActive(false);
        setFinished(false);
        setPhase(newPhase);
        setSeconds(DURATIONS[newPhase]);
    };

    return (
        <div className={styles.menuContainer}>
            <div className={styles.menuIcon} onClick={() => setOpen(!open)}>
                🍅
            </div>

            {open && (
                <div className={styles.popover}>
                    <div className={styles.popoverHeader}>
                        <span>Pomodori</span>
                        <button onClick={() => setOpen(false)}>x</button>
                    </div>
                    <div className={styles.timerDisplay}>
                        {`${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}`}
                    </div>
                    <div className={styles.controls}>
                        <button className={styles.button} onClick={() => {
                            setIsActive(!isActive);
                            setFinished(false);
                        }}>
                            {isActive ? 'Pause' : 'Start'}
                        </button>
                        <button className={styles.button} onClick={handleReset}>Reset</button>
                    </div>
                    <div className={styles.status}>
                        Phase: {phase} | Cycle: {cycle}/4
                    </div>
                    <div className={styles.switcher}>
                        Switch Phase
                        <div className={styles.switcherButtons}>
                            <button
                                className={`${styles.phaseButton} ${phase === 'work' ? styles.phaseButtonActive : ''}`}
                                onClick={() => manualSwitch('work')}
                            >
                                Work
                            </button>
                            <button
                                className={`${styles.phaseButton} ${phase === 'shortBreak' ? styles.phaseButtonActive : ''}`}
                                onClick={() => manualSwitch('shortBreak')}
                            >
                                Short Break
                            </button>
                            <button
                                className={`${styles.phaseButton} ${phase === 'longBreak' ? styles.phaseButtonActive : ''}`}
                                onClick={() => manualSwitch('longBreak')}
                            >
                                Long Break
                            </button>
                        </div>
                    </div>
                    {finished && (
                        <div className={styles.finished}>
                            Phase Complete: {phase === 'work' ? 'Work Session' : 'Break'}
                        </div>
                    )}
                </div>
            )}

            <audio ref={alarmRef} preload="auto">
                <source src="/alarm.mp3" type="audio/mpeg" />
            </audio>
        </div>
    );
}