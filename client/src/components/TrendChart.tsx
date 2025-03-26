import { useMemo } from 'react';

interface TrendChartProps {
  data: number[] | string;
}

const TrendChart = ({ data }: TrendChartProps) => {
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
  
  // Normalize the data to fit in the chart (0-100%)
  const normalizedData = useMemo(() => {
    if (!parsedData || parsedData.length === 0) return [];
    
    const max = Math.max(...parsedData);
    return parsedData.map((value: number) => max === 0 ? 0 : (value / max));
  }, [parsedData]);

  if (!data || data.length === 0) {
    return (
      <div className="w-20 h-10 bg-gray-100 flex items-center justify-center">
        <span className="text-xs text-gray-400">No data</span>
      </div>
    );
  }

  return (
    <div className="w-20 h-10 bg-gray-100">
      <div className="h-full w-full flex items-end">
        {normalizedData.map((value, index) => (
          <div 
            key={index}
            className="bg-primary" 
            style={{ 
              height: `${Math.max(value * 100, 10)}%`, 
              width: `${100 / normalizedData.length}%`
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default TrendChart;
