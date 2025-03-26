import { storage } from './storage';
import { InsertKeyword, InsertSearchHistory } from '@shared/schema';
import { getRandomInt } from '../client/src/lib/utils';

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
    trend: JSON.stringify(Array.from({ length: 5 }, () => getRandomInt(50, 100))),
    difficulty: getRandomInt(20, 80),
    intent: ['informational', 'commercial', 'transactional', 'navigational'][getRandomInt(0, 3)],
    relevance: getRandomInt(60, 100),
    countries: JSON.stringify([
      { country: 'United States', percentage: getRandomInt(30, 60) },
      { country: 'United Kingdom', percentage: getRandomInt(10, 25) },
      { country: 'Canada', percentage: getRandomInt(5, 15) },
      { country: 'Australia', percentage: getRandomInt(5, 10) },
      { country: 'Other', percentage: getRandomInt(5, 20) }
    ])
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
        trend: JSON.stringify(Array.from({ length: 5 }, () => getRandomInt(50, 100))),
        difficulty: getRandomInt(30, 90),
        intent: ['informational', 'commercial', 'transactional', 'navigational'][getRandomInt(0, 3)],
        relevance: getRandomInt(50, 95),
        countries: JSON.stringify([
          { country: 'United States', percentage: getRandomInt(25, 55) },
          { country: 'United Kingdom', percentage: getRandomInt(10, 20) },
          { country: 'Canada', percentage: getRandomInt(5, 15) },
          { country: 'Australia', percentage: getRandomInt(5, 15) },
          { country: 'Other', percentage: getRandomInt(10, 25) }
        ])
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
        trend: JSON.stringify(Array.from({ length: 5 }, () => getRandomInt(50, 100))),
        difficulty: getRandomInt(25, 85),
        intent: ['informational', 'commercial', 'transactional', 'navigational'][getRandomInt(0, 3)],
        relevance: getRandomInt(55, 90),
        countries: JSON.stringify([
          { country: 'United States', percentage: getRandomInt(20, 50) },
          { country: 'United Kingdom', percentage: getRandomInt(8, 18) },
          { country: 'Canada', percentage: getRandomInt(8, 16) },
          { country: 'Australia', percentage: getRandomInt(7, 14) },
          { country: 'Other', percentage: getRandomInt(12, 28) }
        ])
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
        trend: JSON.stringify(Array.from({ length: 5 }, () => getRandomInt(50, 100))),
        difficulty: getRandomInt(15, 70),
        intent: 'informational', // Phrases are usually informational
        relevance: getRandomInt(60, 85),
        countries: JSON.stringify([
          { country: 'United States', percentage: getRandomInt(30, 55) },
          { country: 'United Kingdom', percentage: getRandomInt(10, 20) },
          { country: 'Canada', percentage: getRandomInt(5, 15) },
          { country: 'Australia', percentage: getRandomInt(5, 12) },
          { country: 'Other', percentage: getRandomInt(8, 25) }
        ])
      });
    }
  }
  
  return keywords;
};

export const keywordService = {
  async searchKeywords(keyword: string, userId?: number) {
    // Record the search in history (associate with user if logged in)
    const searchEntry: InsertSearchHistory = { 
      keyword,
      userId: userId || null
    };
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
  
  async getUserSearchHistory(userId: number) {
    const history = await storage.getUserSearchHistory(userId);
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
      'Difficulty': item.difficulty,
      'Intent': item.intent,
      'Relevance': item.relevance,
      'Countries': JSON.parse(item.countries)
        .map((c: {country: string, percentage: number}) => `${c.country}: ${c.percentage}%`)
        .join(', '),
    }));
    
    // Server-side implementation of CSV conversion
    return this.convertToCSV(formattedData);
  },
  
  // Server-side implementation of CSV conversion
  convertToCSV(objArray: any[]): string {
    if (!objArray || objArray.length === 0) {
      return '';
    }
    
    const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
    let csv = '';

    // Add headers
    const headers = Object.keys(array[0]);
    csv += headers.join(',') + '\r\n';

    // Add data rows
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (const index in headers) {
        if (line !== '') line += ',';
        const header = headers[index];
        let value = array[i][header];
        
        // Handle undefined or null values
        if (value === undefined || value === null) {
          value = '';
        }
        
        // Handle strings with commas, quotes, or newlines by wrapping in quotes
        if (typeof value === 'string') {
          // Escape quotes by doubling them
          if (value.includes('"')) {
            value = value.replace(/"/g, '""');
          }
          
          // Wrap in quotes if it contains commas, quotes, or newlines
          if (value.includes(',') || value.includes('"') || value.includes('\n') || value.includes('\r')) {
            value = `"${value}"`;
          }
        }
        
        line += value;
      }
      csv += line + '\r\n';
    }

    return csv;
  }
};
