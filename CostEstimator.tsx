import { DollarSign, TrendingDown } from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useState } from "react";

interface CostEstimatorProps {
  avgCPU: number;
  onCalculate: (currentCost: number) => void;
}

export default function CostEstimator({ avgCPU, onCalculate }: CostEstimatorProps) {
  const [currentCost, setCurrentCost] = useState<string>("");
  const [estimatedSavings, setEstimatedSavings] = useState<number | null>(null);
  const [newCost, setNewCost] = useState<number | null>(null);

  const handleCalculate = () => {
    const cost = parseFloat(currentCost);
    if (isNaN(cost) || cost <= 0) {
      return;
    }

    // Calculate efficiency factor (higher usage = lower potential savings)
    const efficiencyFactor = (100 - avgCPU) / 100;
    const savings = cost * efficiencyFactor * 0.5;
    const optimizedCost = cost - savings;

    setEstimatedSavings(savings);
    setNewCost(optimizedCost);
    onCalculate(cost);
  };

  const savingsPercentage = estimatedSavings && currentCost 
    ? ((estimatedSavings / parseFloat(currentCost)) * 100).toFixed(1)
    : "0";

  return (
    <div className="p-6 rounded-xl backdrop-blur-xl bg-card/40 border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] transition-all duration-300 shadow-[0_8px_32px_hsla(0,0%,0%,0.4)]">
      <div className="flex items-center gap-3 mb-6">
        <DollarSign className="w-8 h-8 text-[hsl(var(--neon-green))] animate-float" />
        <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--neon-green))] to-[hsl(var(--primary))]">
          Cloud Cost Savings Estimator
        </h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground mb-2 block">
            Current Monthly Cost ($)
          </label>
          <Input
            type="number"
            placeholder="Enter current monthly cost"
            value={currentCost}
            onChange={(e) => setCurrentCost(e.target.value)}
            className="bg-muted/50 border-[hsl(var(--border))] focus:border-[hsl(var(--primary))] transition-colors"
          />
        </div>

        <Button
          onClick={handleCalculate}
          className="w-full bg-gradient-to-r from-[hsl(var(--neon-green))] to-[hsl(var(--primary))] hover:from-[hsl(var(--primary))] hover:to-[hsl(var(--neon-green))] text-foreground font-bold transition-all duration-300 shadow-[0_0_20px_hsla(150,100%,50%,0.3)] hover:shadow-[0_0_30px_hsla(150,100%,50%,0.5)]"
        >
          Calculate Savings
        </Button>

        {estimatedSavings !== null && newCost !== null && (
          <div className="space-y-3 pt-4 border-t border-[hsl(var(--border))]">
            <div className="flex items-center justify-between p-3 rounded-lg bg-[hsl(var(--neon-green))]/10 border border-[hsl(var(--neon-green))]/30">
              <span className="text-sm font-medium">Estimated Cost After Optimization</span>
              <span className="text-xl font-bold text-[hsl(var(--neon-green))]">
                ${newCost.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-[hsl(var(--neon-green))]" />
                <span className="text-sm font-medium">Estimated Savings</span>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-[hsl(var(--neon-green))]">
                  ${estimatedSavings.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  (~{savingsPercentage}%)
                </div>
              </div>
            </div>

            <div className="relative h-3 bg-muted rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-[hsl(var(--neon-green))] to-[hsl(var(--primary))] transition-all duration-700"
                style={{ width: `${savingsPercentage}%` }}
              >
                <div className="absolute inset-0 animate-glow-pulse" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
