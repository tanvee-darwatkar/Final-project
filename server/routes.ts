import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { keywordService } from "./keywordService";
import { insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes
  
  // Search history endpoint
  app.get("/api/keywords/history", async (req, res) => {
    try {
      const history = await keywordService.getSearchHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching search history:", error);
      res.status(500).json({ message: "Failed to fetch search history" });
    }
  });

  // Search keywords endpoint
  app.post("/api/keywords/search", async (req, res) => {
    try {
      const { keyword } = req.body;
      
      if (!keyword || typeof keyword !== 'string') {
        return res.status(400).json({ message: "Valid keyword is required" });
      }
      
      const keywordData = await keywordService.searchKeywords(keyword);
      res.json(keywordData);
    } catch (error) {
      console.error("Error searching keywords:", error);
      res.status(500).json({ message: "Failed to search keywords" });
    }
  });

  // Get keyword data endpoint
  app.get("/api/keywords/data/:keyword", async (req, res) => {
    try {
      const { keyword } = req.params;
      
      if (!keyword) {
        return res.status(400).json({ message: "Keyword parameter is required" });
      }
      
      const keywordData = await keywordService.searchKeywords(keyword);
      res.json(keywordData);
    } catch (error) {
      console.error("Error fetching keyword data:", error);
      res.status(500).json({ message: "Failed to fetch keyword data" });
    }
  });
  
  // Export keywords endpoint
  app.get("/api/keywords/export", async (req, res) => {
    try {
      const { keyword } = req.query;
      
      if (!keyword || typeof keyword !== 'string') {
        return res.status(400).json({ message: "Valid keyword parameter is required" });
      }
      
      const csvData = await keywordService.exportKeywords(keyword);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="keyword-data-${keyword}.csv"`);
      res.send(csvData);
    } catch (error) {
      console.error("Error exporting keywords:", error);
      res.status(500).json({ message: "Failed to export keywords" });
    }
  });

  // Waitlist endpoint
  app.post("/api/waitlist", async (req, res) => {
    try {
      const validatedData = insertWaitlistSchema.parse(req.body);
      
      // Check if email already exists
      const existingUser = await storage.getWaitlistByEmail(validatedData.email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already registered to waitlist" });
      }
      
      const newEntry = await storage.createWaitlist(validatedData);
      res.status(201).json({ 
        message: "Successfully added to waitlist",
        id: newEntry.id
      });
    } catch (error) {
      if (error instanceof ZodError) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        console.error("Error adding to waitlist:", error);
        res.status(500).json({ message: "Failed to add to waitlist" });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
