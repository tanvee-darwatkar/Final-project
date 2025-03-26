import { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMutation } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface KeywordSearchProps {
  onSearch: (keyword: string) => void;
  isLoading: boolean;
}

const SAMPLE_KEYWORDS = ['digital marketing', 'content strategy', 'seo tools'];

const KeywordSearch = ({ onSearch, isLoading }: KeywordSearchProps) => {
  const [keyword, setKeyword] = useState('');
  const { toast } = useToast();

  const searchMutation = useMutation({
    mutationFn: async (searchKeyword: string) => {
      const res = await apiRequest('POST', '/api/keywords/search', { keyword: searchKeyword });
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/keywords/history'] });
      onSearch(keyword);
    },
    onError: (error) => {
      toast({
        title: 'Search failed',
        description: error.message || 'Failed to search for keywords. Please try again.',
        variant: 'destructive',
      });
    }
  });

  const handleSearch = () => {
    if (!keyword.trim()) return;
    searchMutation.mutate(keyword);
  };

  const handleSampleKeywordClick = (sampleKeyword: string) => {
    setKeyword(sampleKeyword);
    searchMutation.mutate(sampleKeyword);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="max-w-3xl mx-auto mb-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center border border-gray-300 rounded-md overflow-hidden">
          <Search className="ml-3 text-gray-500" />
          <Input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Enter a keyword (e.g., 'digital marketing')"
            className="border-0 shadow-none focus-visible:ring-0"
          />
          <Button 
            onClick={handleSearch}
            disabled={isLoading || !keyword.trim()} 
            className="rounded-none"
          >
            Search
          </Button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="text-sm text-gray-500">Try:</span>
          {SAMPLE_KEYWORDS.map((sampleKeyword) => (
            <button
              key={sampleKeyword}
              className="text-sm text-primary hover:underline"
              onClick={() => handleSampleKeywordClick(sampleKeyword)}
              disabled={isLoading}
            >
              {sampleKeyword}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KeywordSearch;
