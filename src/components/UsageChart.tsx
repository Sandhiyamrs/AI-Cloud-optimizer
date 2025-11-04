import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface DataPoint {
  time: string;
  current: number;
  predicted: number;
}

interface UsageChartProps {
  data: DataPoint[];
}

export default function UsageChart({ data }: UsageChartProps) {
  return (
    <div className="p-6 rounded-xl backdrop-blur-xl bg-card/40 border border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] transition-all duration-300 shadow-[0_8px_32px_hsla(0,0%,0%,0.4)]">
      <h3 className="text-xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-[hsl(var(--primary))] to-[hsl(var(--neon-purple))]">
        CPU Usage vs Predicted Usage
      </h3>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
          <XAxis 
            dataKey="time" 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <YAxis 
            stroke="hsl(var(--muted-foreground))"
            tick={{ fill: 'hsl(var(--muted-foreground))' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'hsl(var(--card))', 
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.5rem',
              backdropFilter: 'blur(12px)'
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend 
            wrapperStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Line 
            type="monotone" 
            dataKey="current" 
            stroke="hsl(var(--primary))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', r: 4 }}
            name="Current Usage"
            filter="drop-shadow(0 0 8px hsl(var(--primary)))"
          />
          <Line 
            type="monotone" 
            dataKey="predicted" 
            stroke="hsl(var(--neon-green))" 
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--neon-green))', r: 4 }}
            name="Predicted Usage"
            filter="drop-shadow(0 0 8px hsl(var(--neon-green)))"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
