import { storage } from './storage';
import { InsertKeyword, InsertSearchHistory } from '@shared/schema';
import { getRandomInt } from '../client/src/lib/utils';
import { convertToCSV } from '../client/src/lib/utils';

// Sample data to generate realistic-looking keyword metrics
const generateRelatedKeywords = (baseKeyword: string): InsertKeyword[] => {
  const keywordPrefixes = ['best', 'top', 'affordable', 'cheap', 'premium', 'professional'];
  const keywordSuffixes = ['services', 'tools', 'software', 'platform', 'agency', 'companies', 'tips', 'guide', 'strategies', 'examples'];
  const keywords: InsertKeyword[] = [];
  
  // Generate variations of the base keyword
  const keywordParts = baseKeyword.split(' ');
  
  // Add the base keyword itself
  keywords.push({
    keyword: baseKeyword,
    volume: getRandomInt(5000, 30000),
    competition: parseFloat((Math.random() * 0.9 + 0.1).toFixed(2)),
    cpc: parseFloat((Math.random() * 7 + 2).toFixed(2)),
    trend: JSON.stringify(Array.from({ length: 5 }, () => getRandomInt(50, 100)))
  });
  
  // Add keyword with prefixes
  for (const prefix of keywordPrefixes) {
    if (Math.random() > 0.5) { // Add some randomness to the generated keywords
      const newKeyword = `${prefix} ${baseKeyword}`;
      keywords.push({
        keyword: newKeyword,
        volume: getRandomInt(1000, 15000),
        competition: parseFloat((Math.random() * 0.9 + 0.1).toFixed(2)),
        cpc: parseFloat((Math.random() * 7 + 2).toFixed(2)),
        trend: JSON.stringify(Array.from({ length: 5 }, () => getRandomInt(50, 100)))
      });
    }
  }
  
  // Add keyword with suffixes
  for (const suffix of keywordSuffixes) {
    if (Math.random() > 0.6) { // Add some randomness to the generated keywords
      const newKeyword = `${baseKeyword} ${suffix}`;
      keywords.push({
        keyword: newKeyword,
        volume: getRandomInt(800, 12000),
        competition: parseFloat((Math.random() * 0.9 + 0.1).toFixed(2)),
        cpc: parseFloat((Math.random() * 7 + 2).toFixed(2)),
        trend: JSON.stringify(Array.from({ length: 5 }, () => getRandomInt(50, 100)))
      });
    }
  }
  
  // Add some keyword phrases
  const phrases = [
    `how to use ${baseKeyword}`,
    `${baseKeyword} for beginners`,
    `${baseKeyword} vs competition`,
    `why ${baseKeyword} is important`
  ];
  
  for (const phrase of phrases) {
    if (Math.random() > 0.5) { // Add some randomness to the generated keywords
      keywords.push({
        keyword: phrase,
        volume: getRandomInt(500, 8000),
        competition: parseFloat((Math.random() * 0.9 + 0.1).toFixed(2)),
        cpc: parseFloat((Math.random() * 7 + 2).toFixed(2)),
        trend: JSON.stringify(Array.from({ length: 5 }, () => getRandomInt(50, 100)))
      });
    }
  }
  
  return keywords;
};

export const keywordService = {
  async searchKeywords(keyword: string) {
    // Record the search in history
    const searchEntry: InsertSearchHistory = { keyword };
    await storage.createSearchHistory(searchEntry);
    
    // Check if we already have data for this keyword
    let existingKeyword = await storage.getKeywordByName(keyword);
    let relatedKeywords = await storage.getRelatedKeywords(keyword);
    
    // If no data exists, generate some realistic sample data
    if (!existingKeyword) {
      const generatedKeywords = generateRelatedKeywords(keyword);
      
      // Store the generated keywords
      for (const keywordData of generatedKeywords) {
        await storage.createKeyword(keywordData);
      }
      
      // Refetch the keywords
      existingKeyword = await storage.getKeywordByName(keyword);
      relatedKeywords = await storage.getRelatedKeywords(keyword);
    }
    
    return {
      overview: existingKeyword,
      related: relatedKeywords,
    };
  },
  
  async getSearchHistory() {
    const history = await storage.getSearchHistory();
    return {
      searches: history,
    };
  },
  
  async exportKeywords(keyword: string) {
    const keywordData = await this.searchKeywords(keyword);
    
    if (!keywordData.related.length) {
      throw new Error('No keyword data available for export');
    }
    
    // Format data for CSV export
    const formattedData = keywordData.related.map(item => ({
      Keyword: item.keyword,
      'Search Volume': item.volume,
      Competition: item.competition,
      'CPC ($)': item.cpc,
    }));
    
    return convertToCSV(formattedData);
  }
};
