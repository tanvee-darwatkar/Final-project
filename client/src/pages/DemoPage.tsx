import { useState } from 'react';
import KeywordSearch from '@/components/KeywordSearch';
import KeywordResults from '@/components/KeywordResults';
import SearchHistory from '@/components/SearchHistory';
import { useQuery } from '@tanstack/react-query';

const DemoPage = () => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const { data: searchHistory } = useQuery({
    queryKey: ['/api/keywords/history'],
  });

  const handleSearch = (keyword: string) => {
    setIsSearching(true);
    
    // Simulate delay for search operation
    setTimeout(() => {
      setSearchKeyword(keyword);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <main>
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Try the Demo</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the power of KeywordInsight with our interactive demo. Enter a keyword to see related terms and metrics.
            </p>
          </div>
          
          <KeywordSearch onSearch={handleSearch} isLoading={isSearching} />
          
          {isSearching ? (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden p-6">
                <div className="flex justify-center items-center flex-col">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mb-4"></div>
                  <p className="text-gray-600">Searching for keywords...</p>
                </div>
              </div>
            </div>
          ) : (
            searchKeyword && <KeywordResults keyword={searchKeyword} isLoading={isSearching} />
          )}
          
          {(searchHistory?.searches?.length > 0 || searchKeyword) && (
            <div className="mt-12 max-w-6xl mx-auto">
              <SearchHistory onSelectKeyword={handleSearch} />
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default DemoPage;
