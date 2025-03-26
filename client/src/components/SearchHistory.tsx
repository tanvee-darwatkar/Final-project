import { useQuery } from '@tanstack/react-query';
import { Clock, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface SearchHistoryProps {
  onSelectKeyword: (keyword: string) => void;
}

const SearchHistory = ({ onSelectKeyword }: SearchHistoryProps) => {
  const { data: history, isLoading } = useQuery({
    queryKey: ['/api/keywords/history'],
  });

  const handleKeywordSelect = (keyword: string) => {
    onSelectKeyword(keyword);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5" /> Recent Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="mb-2">
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (!history?.searches?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5" /> Recent Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-sm">No search history yet.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5" /> Recent Searches
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {history.searches.map((item: any, index: number) => (
            <div key={index} className="flex justify-between items-center p-2 rounded-md hover:bg-gray-100">
              <div className="flex items-center">
                <Search className="mr-2 h-4 w-4 text-gray-400" />
                <span className="text-gray-800">{item.keyword}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-gray-500 mr-3">
                  {new Date(item.timestamp).toLocaleDateString()}
                </span>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => handleKeywordSelect(item.keyword)}
                  className="text-primary hover:text-primary hover:bg-primary/10"
                >
                  Search Again
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
