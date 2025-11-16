import { AnimatedGradientText } from "./AnimatedGradientText";

export const Footer = () => {
  return (
    <footer className="mt-16 text-center text-muted-foreground">
      <p className="flex items-center justify-center gap-2">
        Made with
        <svg
          className="w-4 h-4 text-red-500 animate-pulse"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        by{" "}
        <AnimatedGradientText
          speed={3}
          colorFrom="#3b82f6"
          colorTo="#06b6d4"
          className="font-semibold"
        >
          Bidibo
        </AnimatedGradientText>
      </p>
    </footer>
  );
};
