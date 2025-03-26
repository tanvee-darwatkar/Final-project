import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface ChartProps {
  data: { name: string; value: number }[];
  height?: number;
  colors?: string[];
  showAxis?: boolean;
  showTooltip?: boolean;
  className?: string;
}

export function Chart({
  data,
  height = 300,
  colors = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))'],
  showAxis = true,
  showTooltip = true,
  className,
}: ChartProps) {
  return (
    <div className={className} style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
          {showAxis && <CartesianGrid strokeDasharray="3 3" vertical={false} />}
          {showAxis && <XAxis dataKey="name" />}
          {showAxis && <YAxis />}
          {showTooltip && <Tooltip />}
          <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
