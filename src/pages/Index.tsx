import { useState, useEffect, useCallback } from "react";
import { Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import MonitoringCard from "@/components/MonitoringCard";
import UsageChart from "@/components/UsageChart";
import AISuggestionPanel from "@/components/AISuggestionPanel";
import CostEstimator from "@/components/CostEstimator";

interface ResourceData {
  cpu: number;
  memory: number;
  storage: number;
  network: number;
}

interface ChartDataPoint {
  time: string;
  current: number;
  predicted: number;
}

const Index = () => {
  const { toast } = useToast();
  const [resources, setResources] = useState<ResourceData>({
    cpu: 45,
    memory: 62,
    storage: 38,
    network: 55,
  });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [suggestion, setSuggestion] = useState("");
  const [predictedValue, setPredictedValue] = useState(0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [avgCPU, setAvgCPU] = useState(50);

  const generateRandomData = (): ResourceData => ({
    cpu: Math.floor(Math.random() * 76) + 20,
    memory: Math.floor(Math.random() * 61) + 30,
    storage: Math.floor(Math.random() * 61) + 25,
    network: Math.floor(Math.random() * 71) + 10,
  });

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const runAIPrediction = useCallback(() => {
    const recentCPU = chartData.length >= 5 
      ? chartData.slice(-5).map(d => d.current)
      : [resources.cpu];
    
    const avgRecent = recentCPU.reduce((a, b) => a + b, 0) / recentCPU.length;
    const predicted = avgRecent + (Math.random() * 10 - 5);
    const finalPredicted = Math.max(10, Math.min(95, predicted));

    let suggestionText = "";
    if (finalPredicted > 80) {
      suggestionText = "High usage incoming — Scale Up cloud resources";
    } else if (finalPredicted < 30) {
      suggestionText = "Low usage detected — Scale Down to save cost";
    } else {
      suggestionText = "Stable performance — Maintain current configuration";
    }

    setSuggestion(suggestionText);
    setPredictedValue(finalPredicted);
    
    const fullText = `AI Suggestion: ${suggestionText}. Predicted CPU usage is ${finalPredicted.toFixed(1)} percent.`;
    speakText(fullText);

    toast({
      title: "AI Prediction Complete",
      description: suggestionText,
    });
  }, [chartData, resources.cpu, speakText, toast]);

  const simulateData = useCallback(() => {
    const newData = generateRandomData();
    setResources(newData);

    const newPoint: ChartDataPoint = {
      time: getCurrentTime(),
      current: newData.cpu,
      predicted: predictedValue || newData.cpu,
    };

    setChartData(prev => {
      const updated = [...prev, newPoint];
      return updated.slice(-15);
    });

    // Calculate average CPU
    const recentCPU = [...chartData.slice(-9), newPoint].map(d => d.current);
    const avg = recentCPU.reduce((a, b) => a + b, 0) / recentCPU.length;
    setAvgCPU(avg);

    toast({
      title: "Data Refreshed",
      description: "System metrics updated successfully",
    });
  }, [chartData, predictedValue, toast]);

  const handleCostCalculation = useCallback((currentCost: number) => {
    const efficiencyFactor = (100 - avgCPU) / 100;
    const savings = currentCost * efficiencyFactor * 0.5;
    const newCost = currentCost - savings;
    
    const costText = `Estimated monthly cost after optimization is ${newCost.toFixed(2)} dollars. You can save approximately ${savings.toFixed(2)} dollars.`;
    speakText(costText);
  }, [avgCPU, speakText]);

  // Auto-update every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      simulateData();
    }, 10000);

    return () => clearInterval(interval);
  }, [simulateData]);

  // Initial data
  useEffect(() => {
    simulateData();
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center space-y-4 py-8">
          <div className="flex items-center justify-center gap-4">
            <Brain className="w-16 h-16 text-[hsl(var(--neon-purple))] animate-glow-pulse" />
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] via-[hsl(var(--neon-green))] to-[hsl(var(--neon-purple))] animate-float">
              AI-Powered Cloud Resource Optimizer
            </h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Smart AI system for predicting and managing cloud resources efficiently
          </p>
        </header>

        {/* Monitoring Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <MonitoringCard title="CPU Usage" value={resources.cpu} icon="cpu" />
          <MonitoringCard title="Memory Usage" value={resources.memory} icon="memory" />
          <MonitoringCard title="Storage Usage" value={resources.storage} icon="storage" />
          <MonitoringCard title="Network Bandwidth" value={resources.network} icon="network" />
        </div>

        {/* Chart */}
        <UsageChart data={chartData} />

        {/* AI Suggestion Panel */}
        <AISuggestionPanel 
          suggestion={suggestion} 
          predictedValue={predictedValue}
          isSpeaking={isSpeaking}
        />

        {/* Cost Estimator */}
        <CostEstimator avgCPU={avgCPU} onCalculate={handleCostCalculation} />

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center pt-4">
          <Button
            onClick={simulateData}
            className="bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--neon-green))] hover:from-[hsl(var(--neon-green))] hover:to-[hsl(var(--primary))] text-foreground font-bold px-8 py-6 text-lg transition-all duration-300 shadow-[0_0_20px_hsla(190,100%,50%,0.3)] hover:shadow-[0_0_30px_hsla(190,100%,50%,0.5)] hover:scale-105"
          >
            Simulate Resource Data
          </Button>
          <Button
            onClick={runAIPrediction}
            className="bg-gradient-to-r from-[hsl(var(--neon-purple))] to-[hsl(var(--primary))] hover:from-[hsl(var(--primary))] hover:to-[hsl(var(--neon-purple))] text-foreground font-bold px-8 py-6 text-lg transition-all duration-300 shadow-[0_0_20px_hsla(270,60%,70%,0.3)] hover:shadow-[0_0_30px_hsla(270,60%,70%,0.5)] hover:scale-105"
          >
            Run AI Prediction
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
