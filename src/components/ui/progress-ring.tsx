interface ProgressRingProps {
    progress: number;
    isRunning: boolean;
    variant?: "focus" | "break";
    size?: number;
    strokeWidth?: number;
}

export function ProgressRing({
    progress,
    isRunning,
    variant = "focus",
    size = 100,
    strokeWidth = 6,
}: ProgressRingProps) {
    const radius = size / 2 - strokeWidth;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference * (1 - (progress || 0) / 100);
    const color =
        variant === "break" ? "rgba(52, 199, 89, 1)" : "rgba(0, 136, 255, 1)";

    return (
        <div className="absolute w-full h-full">
            <svg
                className="absolute w-full h-full transform -rotate-90"
                viewBox={`0 0 ${size} ${size}`}
            >
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="rgba(118, 118, 128, 0.12)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    style={{
                        transition: isRunning ? "stroke-dashoffset 1s linear" : "none",
                    }}
                />
            </svg>
        </div>
    );
}
