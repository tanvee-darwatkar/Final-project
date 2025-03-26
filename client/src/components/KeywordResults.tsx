import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Download, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import KeywordTable from './KeywordTable';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

interface KeywordResultsProps {
  keyword: string;
  isLoading: boolean;
}

const KeywordResults = ({ keyword, isLoading }: KeywordResultsProps) => {
  const [sortBy, setSortBy] = useState<string>('volume');
  const [minVolume, setMinVolume] = useState<string>('0');
  const { toast } = useToast();

  const { data: keywordData, isLoading: isDataLoading } = useQuery({
    queryKey: [`/api/keywords/data/${keyword}`],
    enabled: !!keyword && !isLoading,
  });

  const handleExport = async () => {
    try {
      const res = await fetch(`/api/keywords/export?keyword=${encodeURIComponent(keyword)}`);
      if (!res.ok) throw new Error('Failed to export data');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `keyword-data-${keyword}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Export successful',
        description: 'Your keyword data has been exported successfully.',
      });
    } catch (error) {
      toast({
        title: 'Export failed',
        description: 'Failed to export keyword data. Please try again.',
        variant: 'destructive',
      });
    }
  };

  if (!keyword) return null;

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in-0 slide-in-from-bottom-5">
      <Card>
        <CardContent className="p-0">
          {/* Overview Cards */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Overview for: <span className="text-primary">{keyword}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {isDataLoading ? (
                <>
                  {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="bg-blue-50">
                      <CardContent className="p-4">
                        <Skeleton className="h-4 w-24 mb-2" />
                        <Skeleton className="h-8 w-20" />
                      </CardContent>
                    </Card>
                  ))}
                </>
              ) : (
                <>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="text-gray-600 text-sm mb-1">Monthly Search Volume</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {keywordData?.overview?.volume?.toLocaleString() || '—'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="text-gray-600 text-sm mb-1">Competition</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {keywordData?.overview?.competition?.toFixed(2) || '—'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="text-gray-600 text-sm mb-1">Related Keywords</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {keywordData?.related?.length || '—'}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="bg-blue-50">
                    <CardContent className="p-4">
                      <div className="text-gray-600 text-sm mb-1">Avg. CPC</div>
                      <div className="text-2xl font-bold text-gray-800">
                        {keywordData?.overview?.cpc ? `$${keywordData.overview.cpc.toFixed(2)}` : '—'}
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </div>
          
          {/* Filters */}
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center">
                <label htmlFor="sortBy" className="text-gray-700 mr-2 text-sm">Sort by:</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger id="sortBy" className="w-[180px]">
                    <SelectValue placeholder="Search Volume" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="volume">
                      Search Volume <ArrowDown className="ml-2 h-4 w-4 inline" />
                    </SelectItem>
                    <SelectItem value="competition">Competition</SelectItem>
                    <SelectItem value="cpc">CPC</SelectItem>
                    <SelectItem value="relevance">Relevance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center">
                <label htmlFor="minVolume" className="text-gray-700 mr-2 text-sm">Min. Volume:</label>
                <Select value={minVolume} onValueChange={setMinVolume}>
                  <SelectTrigger id="minVolume" className="w-[120px]">
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Any</SelectItem>
                    <SelectItem value="100">100+</SelectItem>
                    <SelectItem value="1000">1,000+</SelectItem>
                    <SelectItem value="10000">10,000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center ml-auto">
                <Button 
                  variant="ghost" 
                  onClick={handleExport}
                  disabled={isDataLoading || !keywordData?.related?.length}
                  className="text-primary hover:text-primary/90 hover:bg-primary/10"
                >
                  <Download className="mr-1 h-4 w-4" /> Export
                </Button>
              </div>
            </div>
          </div>
          
          {/* Results Table */}
          <KeywordTable 
            keywordData={keywordData?.related || []}
            isLoading={isDataLoading}
            sortBy={sortBy}
            minVolume={parseInt(minVolume)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default KeywordResults;
