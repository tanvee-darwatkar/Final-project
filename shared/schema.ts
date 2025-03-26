import { pgTable, text, serial, integer, timestamp, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Search history table
export const searchHistory = pgTable("search_history", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertSearchHistorySchema = createInsertSchema(searchHistory).pick({
  keyword: true,
});

// Waitlist table
export const waitlist = pgTable("waitlist", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  company: text("company"),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
});

export const insertWaitlistSchema = createInsertSchema(waitlist).pick({
  name: true,
  email: true,
  company: true,
});

// Keyword data table
export const keywords = pgTable("keywords", {
  id: serial("id").primaryKey(),
  keyword: text("keyword").notNull().unique(),
  volume: integer("volume").notNull(),
  competition: numeric("competition", { precision: 3, scale: 2 }).notNull(),
  cpc: numeric("cpc", { precision: 6, scale: 2 }).notNull(),
  trend: text("trend").notNull(), // Storing JSON as text instead of using array
});

export const insertKeywordSchema = createInsertSchema(keywords).pick({
  keyword: true,
  volume: true,
  competition: true,
  cpc: true,
  trend: true,
});

// Types
export type InsertSearchHistory = z.infer<typeof insertSearchHistorySchema>;
export type SearchHistory = typeof searchHistory.$inferSelect;

export type InsertWaitlist = z.infer<typeof insertWaitlistSchema>;
export type Waitlist = typeof waitlist.$inferSelect;

export type InsertKeyword = z.infer<typeof insertKeywordSchema>;
export type Keyword = typeof keywords.$inferSelect;
