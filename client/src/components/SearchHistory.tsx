import { useQuery } from '@tanstack/react-query';
import { Clock, Search, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';

interface SearchHistoryProps {
  onSelectKeyword: (keyword: string) => void;
}

const SearchHistory = ({ onSelectKeyword }: SearchHistoryProps) => {
  const { user } = useAuth();
  
  // Public search history
  const { data: publicHistory, isLoading: isPublicLoading } = useQuery({
    queryKey: ['/api/keywords/history'],
  });
  
  // User's search history (only fetched if user is logged in)
  const { data: userHistory, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/user/keywords/history'],
    enabled: !!user, // Only run this query if user is logged in
  });

  const handleKeywordSelect = (keyword: string) => {
    onSelectKeyword(keyword);
  };

  const renderHistoryList = (history: any, isLoading: boolean) => {
    if (isLoading) {
      return (
        <div className="space-y-2">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="mb-2">
              <Skeleton className="h-8 w-full" />
            </div>
          ))}
        </div>
      );
    }

    if (!history?.searches?.length) {
      return <p className="text-gray-500 text-sm">No search history yet.</p>;
    }

    return (
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
    );
  };

  // If user is not logged in, show only the public history
  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Clock className="mr-2 h-5 w-5" /> Recent Searches
          </CardTitle>
        </CardHeader>
        <CardContent>
          {renderHistoryList(publicHistory, isPublicLoading)}
        </CardContent>
      </Card>
    );
  }

  // If user is logged in, show tabs for public and user history
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <Clock className="mr-2 h-5 w-5" /> Search History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="user" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="user" className="flex items-center">
              <User className="mr-2 h-4 w-4" /> My Searches
            </TabsTrigger>
            <TabsTrigger value="public" className="flex items-center">
              <Search className="mr-2 h-4 w-4" /> Public Searches
            </TabsTrigger>
          </TabsList>
          <TabsContent value="user">
            {renderHistoryList(userHistory, isUserLoading)}
          </TabsContent>
          <TabsContent value="public">
            {renderHistoryList(publicHistory, isPublicLoading)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default SearchHistory;
