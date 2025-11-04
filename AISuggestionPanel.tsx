import { Brain, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";

interface AISuggestionPanelProps {
  suggestion: string;
  predictedValue: number;
  isSpeaking: boolean;
}

export default function AISuggestionPanel({ suggestion, predictedValue, isSpeaking }: AISuggestionPanelProps) {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (suggestion) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [suggestion]);

  const getSuggestionIcon = () => {
    if (predictedValue > 80) return "⚠️";
    if (predictedValue < 30) return "🟢";
    return "🟣";
  };

  return (
    <div className={`relative p-6 rounded-xl backdrop-blur-xl bg-card/40 border transition-all duration-500 ${
      isSpeaking 
        ? "border-[hsl(var(--neon-purple))] shadow-[0_0_40px_hsla(270,60%,70%,0.6)] animate-border-glow" 
        : "border-[hsl(var(--border))] shadow-[0_8px_32px_hsla(0,0%,0%,0.4)]"
    }`}>
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[hsl(var(--neon-purple))]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Brain className={`w-8 h-8 text-[hsl(var(--neon-purple))] ${isSpeaking ? 'animate-glow-pulse' : 'animate-float'}`} />
            <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--primary))]">
              AI Optimization Insights
            </h3>
          </div>
          {isSpeaking && (
            <Volume2 className="w-6 h-6 text-[hsl(var(--neon-purple))] animate-glow-pulse" />
          )}
        </div>
        
        <div className={`p-4 rounded-lg bg-muted/50 border border-[hsl(var(--border))] transition-all duration-300 ${
          shouldAnimate ? 'scale-105' : 'scale-100'
        }`}>
          <div className="flex items-start gap-3">
            <span className="text-2xl flex-shrink-0">{getSuggestionIcon()}</span>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Predicted CPU: <span className="text-[hsl(var(--primary))] font-bold">{predictedValue.toFixed(1)}%</span>
              </p>
              <p className="text-foreground font-medium leading-relaxed">
                {suggestion || "Analyzing system performance..."}
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-[hsl(var(--neon-green))] animate-glow-pulse" />
          <span>AI Model Active</span>
        </div>
      </div>
    </div>
  );
}
