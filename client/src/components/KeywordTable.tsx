import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown, ChevronDown, ChevronUp, Download, Filter, BarChart } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import TrendChart from './TrendChart';

interface KeywordData {
  keyword: string;
  volume: number;
  competition: number;
  cpc: number;
  trend: number[];
  difficulty: number;
  intent: string;
  relevance: number;
  countries: string; // JSON string to be parsed
}

interface KeywordTableProps {
  keywordData: KeywordData[];
  isLoading: boolean;
  sortBy: string;
  minVolume: number;
}

const KeywordTable = ({ keywordData, isLoading, sortBy, minVolume }: KeywordTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [intentFilter, setIntentFilter] = useState<string>("all");
  const [difficultyRange, setDifficultyRange] = useState<[number, number]>([0, 100]);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});
  const [showFilters, setShowFilters] = useState(false);
  const itemsPerPage = 5;

  const filteredAndSortedData = useMemo(() => {
    // Apply all filters
    const filtered = keywordData.filter(item => {
      // Filter by minimum volume
      if (item.volume < minVolume) return false;
      
      // Filter by intent if not set to "all"
      if (intentFilter !== "all" && item.intent !== intentFilter) return false;
      
      // Filter by difficulty range
      if (item.difficulty < difficultyRange[0] || item.difficulty > difficultyRange[1]) return false;
      
      return true;
    });
    
    // Then sort by the selected criteria
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume - a.volume;
        case 'competition':
          return b.competition - a.competition;
        case 'cpc':
          return b.cpc - a.cpc;
        case 'difficulty':
          return b.difficulty - a.difficulty;
        case 'relevance':
          return b.relevance - a.relevance;
        default:
          return b.volume - a.volume;
      }
    });
  }, [keywordData, sortBy, minVolume, intentFilter, difficultyRange]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div>
        <div className="mb-4">
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Search Volume</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>CPC</TableHead>
                <TableHead>Diff.</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Trend</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="hover:bg-blue-50">
                  <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  // Empty state
  if (keywordData.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">No keyword data available.</p>
      </div>
    );
  }

  const toggleRow = (index: number) => {
    setExpanded(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleExport = (keyword: string) => {
    window.location.href = `/api/keywords/export/${keyword}`;
  };

  return (
    <div>
      {/* Filter Controls */}
      <div className="mb-4">
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 mb-2"
        >
          <Filter className="h-4 w-4" />
          {showFilters ? 'Hide Filters' : 'Show Filters'}
          {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        {showFilters && (
          <Card className="mb-4">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Search Intent</label>
                  <Select value={intentFilter} onValueChange={setIntentFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Intents</SelectItem>
                      <SelectItem value="informational">Informational</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="transactional">Transactional</SelectItem>
                      <SelectItem value="navigational">Navigational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium mb-2 block">Difficulty Range</label>
                  <div className="px-2">
                    <Slider 
                      value={difficultyRange} 
                      min={0} 
                      max={100} 
                      step={1}
                      onValueChange={(value) => setDifficultyRange(value as [number, number])}
                      className="my-4"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{difficultyRange[0]}</span>
                      <span>{difficultyRange[1]}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold text-gray-700">Keyword</TableHead>
              <TableHead className="font-semibold text-gray-700 whitespace-nowrap">
                Search Volume
                {sortBy === 'volume' && <ArrowDown className="inline ml-1 h-4 w-4" />}
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Competition
                {sortBy === 'competition' && <ArrowDown className="inline ml-1 h-4 w-4" />}
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                CPC
                {sortBy === 'cpc' && <ArrowDown className="inline ml-1 h-4 w-4" />}
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Diff.
                {sortBy === 'difficulty' && <ArrowDown className="inline ml-1 h-4 w-4" />}
              </TableHead>
              <TableHead className="font-semibold text-gray-700">Intent</TableHead>
              <TableHead className="font-semibold text-gray-700">Trend</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <>
                <TableRow 
                  key={index} 
                  className="border-b border-gray-200 hover:bg-blue-50"
                  onClick={() => toggleRow(index)}
                >
                  <TableCell className="text-gray-800 font-medium">{item.keyword}</TableCell>
                  <TableCell className="text-gray-800">{item.volume.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-800">{item.competition.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-800">${item.cpc.toFixed(2)}</TableCell>
                  <TableCell className="text-gray-800">
                    <div className="flex items-center">
                      <span className={`h-2 w-2 rounded-full mr-2 ${
                        item.difficulty > 70 ? 'bg-red-500' : 
                        item.difficulty > 40 ? 'bg-yellow-500' : 
                        'bg-green-500'
                      }`}></span>
                      {item.difficulty}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-800">
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.intent === 'informational' ? 'bg-blue-100 text-blue-800' :
                      item.intent === 'commercial' ? 'bg-green-100 text-green-800' :
                      item.intent === 'transactional' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {item.intent}
                    </span>
                  </TableCell>
                  <TableCell>
                    <TrendChart data={item.trend} />
                  </TableCell>
                  <TableCell>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleExport(item.keyword);
                      }}
                    >
                      <Download className="h-3 w-3 mr-1" /> Export
                    </Button>
                  </TableCell>
                </TableRow>
                {expanded[index] && (
                  <TableRow className="bg-gray-50">
                    <TableCell colSpan={8} className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Relevance Score</h4>
                          <div className="flex items-center">
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${item.relevance}%` }}></div>
                            </div>
                            <span className="ml-2 text-sm">{item.relevance}%</span>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Geographic Distribution</h4>
                          <div className="flex flex-col gap-1">
                            {JSON.parse(item.countries).map((country: {country: string, percentage: number}, i: number) => (
                              <div key={i} className="flex items-center text-sm">
                                <span className="w-24 text-gray-600">{country.country}:</span>
                                <div className="w-full bg-gray-200 rounded-full h-2 flex-1 mx-2">
                                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${country.percentage}%` }}></div>
                                </div>
                                <span className="text-gray-600">{country.percentage}%</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 flex justify-between items-center bg-white border-t border-gray-200">
          <div className="text-gray-600 text-sm">
            Showing <span className="font-medium">{startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredAndSortedData.length)}</span> of <span className="font-medium">{filteredAndSortedData.length}</span> results
          </div>
          <div className="flex space-x-1">
            <button 
              className={`p-2 border border-gray-300 rounded-md flex items-center justify-center ${
                currentPage === 1 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-600 bg-white hover:bg-gray-100'
              }`}
              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ArrowUp className="h-4 w-4 -rotate-90" />
            </button>
            
            {Array.from({ length: Math.min(totalPages, 3) }, (_, i) => {
              // Calculate which page numbers to show
              let pageNum = i + 1;
              if (totalPages > 3 && currentPage > 2) {
                if (currentPage === totalPages) {
                  pageNum = currentPage - 2 + i;
                } else {
                  pageNum = currentPage - 1 + i;
                }
              }
              
              return (
                <button
                  key={pageNum}
                  className={`p-2 border border-gray-300 rounded-md min-w-[36px] ${
                    currentPage === pageNum
                      ? 'text-white bg-primary hover:bg-primary/90'
                      : 'text-gray-600 bg-white hover:bg-gray-100'
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button 
              className={`p-2 border border-gray-300 rounded-md flex items-center justify-center ${
                currentPage === totalPages 
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                  : 'text-gray-600 bg-white hover:bg-gray-100'
              }`}
              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ArrowDown className="h-4 w-4 -rotate-90" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordTable;
