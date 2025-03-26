import { useState, useMemo } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import TrendChart from './TrendChart';

interface KeywordData {
  keyword: string;
  volume: number;
  competition: number;
  cpc: number;
  trend: number[];
}

interface KeywordTableProps {
  keywordData: KeywordData[];
  isLoading: boolean;
  sortBy: string;
  minVolume: number;
}

const KeywordTable = ({ keywordData, isLoading, sortBy, minVolume }: KeywordTableProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredAndSortedData = useMemo(() => {
    // First filter by minimum volume
    const filtered = keywordData.filter(item => item.volume >= minVolume);
    
    // Then sort by the selected criteria
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'volume':
          return b.volume - a.volume;
        case 'competition':
          return b.competition - a.competition;
        case 'cpc':
          return b.cpc - a.cpc;
        case 'relevance':
          // For relevance, we would need a specific algorithm
          // For now, just maintain the original order which might be based on relevance
          return 0;
        default:
          return b.volume - a.volume;
      }
    });
  }, [keywordData, sortBy, minVolume]);

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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Keyword</TableHead>
                <TableHead>Search Volume</TableHead>
                <TableHead>Competition</TableHead>
                <TableHead>CPC</TableHead>
                <TableHead>Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array(5).fill(0).map((_, i) => (
                <TableRow key={i} className="hover:bg-blue-50">
                  <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-6 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-10 w-20" /></TableCell>
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

  return (
    <div>
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
              <TableHead className="font-semibold text-gray-700">Trend</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item, index) => (
              <TableRow key={index} className="border-b border-gray-200 hover:bg-blue-50">
                <TableCell className="text-gray-800">{item.keyword}</TableCell>
                <TableCell className="text-gray-800">{item.volume.toLocaleString()}</TableCell>
                <TableCell className="text-gray-800">{item.competition.toFixed(2)}</TableCell>
                <TableCell className="text-gray-800">${item.cpc.toFixed(2)}</TableCell>
                <TableCell>
                  <TrendChart data={item.trend} />
                </TableCell>
              </TableRow>
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
