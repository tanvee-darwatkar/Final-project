import { 
  SearchHistory, 
  InsertSearchHistory, 
  Waitlist, 
  InsertWaitlist, 
  Keyword, 
  InsertKeyword
} from "@shared/schema";

export interface IStorage {
  // Search history methods
  getSearchHistory(): Promise<SearchHistory[]>;
  createSearchHistory(search: InsertSearchHistory): Promise<SearchHistory>;
  
  // Waitlist methods
  getWaitlistByEmail(email: string): Promise<Waitlist | undefined>;
  createWaitlist(entry: InsertWaitlist): Promise<Waitlist>;
  
  // Keyword methods
  getKeywordByName(keyword: string): Promise<Keyword | undefined>;
  getRelatedKeywords(keyword: string): Promise<Keyword[]>;
  createKeyword(keyword: InsertKeyword): Promise<Keyword>;
}

export class MemStorage implements IStorage {
  private searchHistory: Map<number, SearchHistory>;
  private waitlist: Map<number, Waitlist>;
  private keywords: Map<number, Keyword>;
  private currentSearchId: number;
  private currentWaitlistId: number;
  private currentKeywordId: number;

  constructor() {
    this.searchHistory = new Map();
    this.waitlist = new Map();
    this.keywords = new Map();
    this.currentSearchId = 1;
    this.currentWaitlistId = 1;
    this.currentKeywordId = 1;
  }

  // Search history methods
  async getSearchHistory(): Promise<SearchHistory[]> {
    return Array.from(this.searchHistory.values())
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  async createSearchHistory(search: InsertSearchHistory): Promise<SearchHistory> {
    const id = this.currentSearchId++;
    const newSearch: SearchHistory = { 
      ...search, 
      id, 
      timestamp: new Date() 
    };
    this.searchHistory.set(id, newSearch);
    return newSearch;
  }

  // Waitlist methods
  async getWaitlistByEmail(email: string): Promise<Waitlist | undefined> {
    return Array.from(this.waitlist.values()).find(entry => entry.email === email);
  }

  async createWaitlist(entry: InsertWaitlist): Promise<Waitlist> {
    const id = this.currentWaitlistId++;
    const newEntry: Waitlist = {
      ...entry,
      id,
      timestamp: new Date(),
      company: entry.company || null
    };
    this.waitlist.set(id, newEntry);
    return newEntry;
  }

  // Keyword methods
  async getKeywordByName(keyword: string): Promise<Keyword | undefined> {
    return Array.from(this.keywords.values()).find(
      k => k.keyword.toLowerCase() === keyword.toLowerCase()
    );
  }

  async getRelatedKeywords(keyword: string): Promise<Keyword[]> {
    const lowerKeyword = keyword.toLowerCase();
    return Array.from(this.keywords.values()).filter(
      k => k.keyword.toLowerCase().includes(lowerKeyword) || 
           lowerKeyword.includes(k.keyword.toLowerCase())
    );
  }

  async createKeyword(keyword: InsertKeyword): Promise<Keyword> {
    const id = this.currentKeywordId++;
    const newKeyword: Keyword = {
      ...keyword,
      id,
    };
    this.keywords.set(id, newKeyword);
    return newKeyword;
  }
}

export const storage = new MemStorage();
