import { cn } from "@/lib/utils";
import { AnimatedGradientText } from "./AnimatedGradientText";

export const Hero = () => {
  return (
    <div className="text-center mb-12 animate-fade-in">
      <div className="mb-6">
        <div className="group relative mx-auto flex w-fit items-center justify-center rounded-full px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]">
          <span
            className={cn(
              "animate-gradient absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-[#ffaa40]/50 via-[#9c40ff]/50 to-[#ffaa40]/50 bg-[length:300%_100%] p-[1px]"
            )}
            style={{
              WebkitMask:
                "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              WebkitMaskComposite: "destination-out",
              mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
              maskComposite: "subtract",
              WebkitClipPath: "padding-box",
            }}
          />
          <span className="relative flex items-center gap-1">
            <span className="text-lg">✨</span>
            <hr className="h-4 w-px shrink-0 bg-neutral-500" />
            <AnimatedGradientText
              speed={3}
              colorFrom="#ffaa40"
              colorTo="#9c40ff"
              className="text-sm font-medium"
            >
              PDF Processing Tool
            </AnimatedGradientText>
          </span>
        </div>
      </div>
      
      <h1 className="text-6xl md:text-7xl font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
        SlideClean
      </h1>
      
      <div className="flex justify-center items-center gap-2 mb-6">
        <div className="w-12 h-1 bg-gradient-to-r from-primary to-accent rounded-full"></div>
        <span className="text-lg font-semibold text-muted-foreground">by</span>
        <AnimatedGradientText
          speed={3}
          colorFrom="#3b82f6"
          colorTo="#06b6d4"
          className="text-lg font-semibold"
        >
          Bidibo
        </AnimatedGradientText>
        <div className="w-12 h-1 bg-gradient-to-r from-accent to-primary rounded-full"></div>
      </div>
      
      <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
        Transform your slide PDFs into clean, readable black-and-white prints with enhanced contrast. 
        Arrange multiple slides per page for efficient studying and printing.
      </p>
      
      <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm">
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/5 border border-primary/10">
          <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Works Offline</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent/5 border border-accent/10">
          <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Enhanced Contrast</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/5 border border-purple-500/10">
          <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="font-medium">Customizable Layout</span>
        </div>
      </div>
    </div>
  );
};
