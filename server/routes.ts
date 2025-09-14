import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertHerbSchema, insertUserHistorySchema, insertUserBookmarkSchema } from "@shared/schema";
import { NLPService } from "./services/nlpService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', async (req: any, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated() || !req.user?.claims?.sub) {
        return res.status(401).json({ message: "Not authenticated" });
      }
      
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Herbs routes
  app.get('/api/herbs', async (req, res) => {
    try {
      const { search, category } = req.query;
      const herbs = await storage.getAllHerbs(
        search as string,
        category as string
      );
      res.json(herbs);
    } catch (error) {
      console.error("Error fetching herbs:", error);
      res.status(500).json({ message: "Failed to fetch herbs" });
    }
  });

  app.get('/api/herbs/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const herb = await storage.getHerbById(id);
      
      if (!herb) {
        return res.status(404).json({ message: "Herb not found" });
      }
      
      res.json(herb);
    } catch (error) {
      console.error("Error fetching herb:", error);
      res.status(500).json({ message: "Failed to fetch herb" });
    }
  });

  // Admin routes for herb management
  app.post('/api/admin/herbs', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const herbData = insertHerbSchema.parse(req.body);
      const newHerb = await storage.createHerb(herbData);
      res.status(201).json(newHerb);
    } catch (error) {
      console.error("Error creating herb:", error);
      res.status(500).json({ message: "Failed to create herb" });
    }
  });

  app.put('/api/admin/herbs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      const herbData = insertHerbSchema.partial().parse(req.body);
      const updatedHerb = await storage.updateHerb(id, herbData);
      res.json(updatedHerb);
    } catch (error) {
      console.error("Error updating herb:", error);
      res.status(500).json({ message: "Failed to update herb" });
    }
  });

  app.delete('/api/admin/herbs/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }

      const id = parseInt(req.params.id);
      await storage.deleteHerb(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting herb:", error);
      res.status(500).json({ message: "Failed to delete herb" });
    }
  });

  // AI Recommendations route
  app.post('/api/ai/recommend', isAuthenticated, async (req: any, res) => {
    try {
      const { symptoms } = req.body;
      
      if (!symptoms || typeof symptoms !== 'string') {
        return res.status(400).json({ message: "Symptoms text is required" });
      }

      const recommendation = await NLPService.analyzeSymptoms(symptoms);
      
      // Save to user history
      const userId = req.user.claims.sub;
      await storage.createUserHistory({
        userId,
        symptoms,
        recommendation: JSON.stringify(recommendation),
        recommendedHerbs: recommendation.recommendations.map(r => r.herbId)
      });

      res.json(recommendation);
    } catch (error) {
      console.error("Error generating AI recommendation:", error);
      res.status(500).json({ message: "Failed to generate recommendation" });
    }
  });

  // User history routes
  app.get('/api/user/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const history = await storage.getUserHistory(userId);
      res.json(history);
    } catch (error) {
      console.error("Error fetching user history:", error);
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // User bookmarks routes
  app.post('/api/user/bookmarks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookmarkData = insertUserBookmarkSchema.parse({
        ...req.body,
        userId
      });
      
      const bookmark = await storage.createBookmark(bookmarkData);
      res.status(201).json(bookmark);
    } catch (error) {
      console.error("Error creating bookmark:", error);
      res.status(500).json({ message: "Failed to create bookmark" });
    }
  });

  app.delete('/api/user/bookmarks/:herbId', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const herbId = parseInt(req.params.herbId);
      
      await storage.removeBookmark(userId, herbId);
      res.status(204).send();
    } catch (error) {
      console.error("Error removing bookmark:", error);
      res.status(500).json({ message: "Failed to remove bookmark" });
    }
  });

  app.get('/api/user/bookmarks', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const bookmarks = await storage.getUserBookmarks(userId);
      res.json(bookmarks);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      res.status(500).json({ message: "Failed to fetch bookmarks" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
