import { useMemo, useState } from 'react';
import { LineChart, Line, Tooltip, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { BarChart as BarChartIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TrendChartProps {
  data: number[] | string;
}

const TrendChart = ({ data }: TrendChartProps) => {
  const [showDetailed, setShowDetailed] = useState(false);
  
  // Parse data if it's a JSON string
  const parsedData = useMemo(() => {
    if (typeof data === 'string') {
      try {
        return JSON.parse(data);
      } catch (e) {
        console.error('Error parsing trend data:', e);
        return [];
      }
    }
    return data;
  }, [data]);
  
  // Convert data to format needed for Recharts
  const chartData = useMemo(() => {
    if (!parsedData || parsedData.length === 0) return [];
    
    return parsedData.map((value: number, index: number) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index % 12],
      value: value
    }));
  }, [parsedData]);
  
  // Determine trend direction
  const trendDirection = useMemo(() => {
    if (parsedData.length < 2) return 'neutral';
    
    const firstHalf = parsedData.slice(0, Math.floor(parsedData.length / 2));
    const secondHalf = parsedData.slice(Math.floor(parsedData.length / 2));
    
    const firstAvg = firstHalf.reduce((sum, val) => sum + val, 0) / firstHalf.length;
    const secondAvg = secondHalf.reduce((sum, val) => sum + val, 0) / secondHalf.length;
    
    return secondAvg > firstAvg ? 'up' : 'down';
  }, [parsedData]);
  
  // Normalize the data to fit in the chart (0-100%)
  const normalizedData = useMemo(() => {
    if (!parsedData || parsedData.length === 0) return [];
    
    const max = Math.max(...parsedData);
    return parsedData.map((value: number) => max === 0 ? 0 : (value / max));
  }, [parsedData]);

  if (!data || parsedData.length === 0) {
    return (
      <div className="w-20 h-10 bg-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-400">No data</span>
      </div>
    );
  }

  if (showDetailed) {
    return (
      <div className="relative">
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute top-0 right-0 z-10" 
          onClick={() => setShowDetailed(false)}
        >
          <BarChartIcon className="h-3 w-3" />
        </Button>
        <div className="w-64 h-40 bg-white p-2 rounded shadow-md">
          <h4 className="text-xs font-medium mb-1">Monthly Trend</h4>
          <ResponsiveContainer width="100%" height={100}>
            <LineChart data={chartData}>
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 10 }} 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}k`}
              />
              <Tooltip 
                formatter={(value) => [`${value}k`, 'Volume']}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Line 
                type="monotone" 
                dataKey="value" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 2 }} 
                activeDot={{ r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  }

  return (
    <div className="relative group">
      <div 
        className="w-20 h-10 bg-gray-100 cursor-pointer" 
        onClick={() => setShowDetailed(true)}
      >
        <div className="h-full w-full flex items-end">
          {normalizedData.map((value, index) => (
            <div 
              key={index}
              className={`${trendDirection === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
              style={{ 
                height: `${Math.max(value * 100, 10)}%`, 
                width: `${100 / normalizedData.length}%`,
                marginLeft: '1px'
              }}
            />
          ))}
        </div>
        {trendDirection === 'up' ? (
          <TrendingUp className="absolute top-0 right-0 h-3 w-3 text-green-500" />
        ) : (
          <TrendingDown className="absolute top-0 right-0 h-3 w-3 text-red-500" />
        )}
      </div>
      <div className="hidden group-hover:block absolute bottom-full left-0 bg-black text-white text-xs p-1 rounded mb-1 whitespace-nowrap">
        Click for detailed view
      </div>
    </div>
  );
};

export default TrendChart;
