import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { keywordService } from "./keywordService";
import { insertWaitlistSchema } from "@shared/schema";
import { z } from "zod";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication
  setupAuth(app);
  
  // API routes
  
  // Middleware to check if user is authenticated
  const isAuthenticated = (req: Request, res: Response, next: Function) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.status(401).json({ message: "You must be logged in to access this resource" });
  };

  // Search history endpoint (public history)
  app.get("/api/keywords/history", async (req, res) => {
    try {
      const history = await keywordService.getSearchHistory();
      res.json(history);
    } catch (error) {
      console.error("Error fetching search history:", error);
      res.status(500).json({ message: "Failed to fetch search history" });
    }
  });
  
  // User-specific search history endpoint (protected)
  app.get("/api/user/keywords/history", isAuthenticated, async (req, res) => {
    try {
      // @ts-ignore - TypeScript doesn't recognize req.user.id properly here
      const userId = req.user.id;
      const history = await storage.getUserSearchHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching user search history:", error);
      res.status(500).json({ message: "Failed to fetch user search history" });
    }
  });

  // Search keywords endpoint
  app.post("/api/keywords/search", async (req, res) => {
    try {
      const { keyword } = req.body;
      
      if (!keyword || typeof keyword !== 'string') {
        return res.status(400).json({ message: "Valid keyword is required" });
      }
      
      // Get the user ID if authenticated
      const userId = req.isAuthenticated() ? (req.user as any).id : undefined;
      
      const keywordData = await keywordService.searchKeywords(keyword, userId);
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
  
  // Export keywords endpoint - with query parameter
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
  
  // Export keywords endpoint - with URL parameter
  app.get("/api/keywords/export/:keyword", async (req, res) => {
    try {
      const { keyword } = req.params;
      
      if (!keyword) {
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
