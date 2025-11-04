import { Activity, Cpu, Database, Wifi } from "lucide-react";

interface MonitoringCardProps {
  title: string;
  value: number;
  icon: "cpu" | "memory" | "storage" | "network";
}

const iconMap = {
  cpu: Cpu,
  memory: Activity,
  storage: Database,
  network: Wifi,
};

export default function MonitoringCard({ title, value, icon }: MonitoringCardProps) {
  const Icon = iconMap[icon];
  
  const getColorClass = () => {
    if (value < 60) return "text-[hsl(var(--neon-green))]";
    if (value < 80) return "text-[hsl(var(--neon-orange))]";
    return "text-[hsl(var(--destructive))]";
  };
  
  const getGlowClass = () => {
    if (value < 60) return "shadow-[0_0_20px_hsla(150,100%,50%,0.3)]";
    if (value < 80) return "shadow-[0_0_20px_hsla(30,100%,60%,0.3)]";
    return "shadow-[0_0_20px_hsla(0,100%,60%,0.3)]";
  };

  return (
    <div 
      className={`relative p-6 rounded-xl backdrop-blur-xl bg-card/40 border border-[hsl(var(--border))] 
        transition-all duration-300 hover:scale-105 hover:border-[hsl(var(--primary))] ${getGlowClass()} 
        hover:shadow-[0_0_30px_hsla(190,100%,50%,0.5)] group cursor-pointer`}
    >
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-[hsl(var(--primary))]/10 to-transparent" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <Icon className={`w-8 h-8 ${getColorClass()} transition-colors duration-300`} />
          <span className="text-muted-foreground text-sm font-medium">{title}</span>
        </div>
        
        <div className="space-y-2">
          <div className={`text-4xl font-bold ${getColorClass()} transition-all duration-300`}>
            {value}%
          </div>
          
          <div className="relative h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className={`absolute left-0 top-0 h-full rounded-full transition-all duration-700 ${
                value < 60 
                  ? "bg-gradient-to-r from-[hsl(var(--neon-green))] to-[hsl(var(--primary))]" 
                  : value < 80 
                  ? "bg-gradient-to-r from-[hsl(var(--neon-orange))] to-[hsl(var(--destructive))]"
                  : "bg-gradient-to-r from-[hsl(var(--destructive))] to-red-700"
              }`}
              style={{ width: `${value}%` }}
            >
              <div className="absolute inset-0 animate-glow-pulse" />
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
