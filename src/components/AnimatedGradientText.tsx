import { CSSProperties } from "react";

interface AnimatedGradientTextProps {
  children: string;
  speed?: number;
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

export function AnimatedGradientText({
  children,
  speed = 2,
  colorFrom = "#4ade80",
  colorTo = "#06b6d4",
  className = "",
}: AnimatedGradientTextProps) {
  const animationDuration = `${speed}s`;

  const style: CSSProperties = {
    backgroundImage: `linear-gradient(90deg, ${colorFrom}, ${colorTo}, ${colorFrom})`,
    backgroundSize: "200% auto",
    backgroundClip: "text",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    animation: `gradient-flow ${animationDuration} linear infinite`,
  };

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
}
