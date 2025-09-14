import {
  users,
  herbs,
  userHistory,
  userBookmarks,
  type User,
  type UpsertUser,
  type Herb,
  type InsertHerb,
  type UserHistory,
  type InsertUserHistory,
  type UserBookmark,
  type InsertUserBookmark,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, ilike, desc, asc } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Herb operations
  getAllHerbs(search?: string, category?: string): Promise<Herb[]>;
  getHerbById(id: number): Promise<Herb | undefined>;
  createHerb(herb: InsertHerb): Promise<Herb>;
  updateHerb(id: number, herb: Partial<InsertHerb>): Promise<Herb>;
  deleteHerb(id: number): Promise<void>;
  
  // User history operations
  createUserHistory(history: InsertUserHistory): Promise<UserHistory>;
  getUserHistory(userId: string): Promise<UserHistory[]>;
  
  // User bookmark operations
  createBookmark(bookmark: InsertUserBookmark): Promise<UserBookmark>;
  removeBookmark(userId: string, herbId: number): Promise<void>;
  getUserBookmarks(userId: string): Promise<UserBookmark[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Herb operations
  async getAllHerbs(search?: string, category?: string): Promise<Herb[]> {
    let query = db.select().from(herbs);
    
    let conditions = [eq(herbs.isPublished, true)];
    
    if (search) {
      conditions.push(ilike(herbs.plantName, `%${search}%`));
    }
    
    if (category) {
      conditions.push(eq(herbs.category, category));
    }
    
    return await query.where(and(...conditions)).orderBy(asc(herbs.plantName));
  }

  async getHerbById(id: number): Promise<Herb | undefined> {
    const [herb] = await db.select().from(herbs).where(eq(herbs.id, id));
    return herb;
  }

  async createHerb(herb: InsertHerb): Promise<Herb> {
    const [newHerb] = await db.insert(herbs).values(herb).returning();
    return newHerb;
  }

  async updateHerb(id: number, herbData: Partial<InsertHerb>): Promise<Herb> {
    const [updatedHerb] = await db
      .update(herbs)
      .set({ ...herbData, updatedAt: new Date() })
      .where(eq(herbs.id, id))
      .returning();
    return updatedHerb;
  }

  async deleteHerb(id: number): Promise<void> {
    await db.delete(herbs).where(eq(herbs.id, id));
  }

  // User history operations
  async createUserHistory(history: InsertUserHistory): Promise<UserHistory> {
    const [newHistory] = await db.insert(userHistory).values(history).returning();
    return newHistory;
  }

  async getUserHistory(userId: string): Promise<UserHistory[]> {
    return await db
      .select()
      .from(userHistory)
      .where(eq(userHistory.userId, userId))
      .orderBy(desc(userHistory.createdAt));
  }

  // User bookmark operations
  async createBookmark(bookmark: InsertUserBookmark): Promise<UserBookmark> {
    const [newBookmark] = await db.insert(userBookmarks).values(bookmark).returning();
    return newBookmark;
  }

  async removeBookmark(userId: string, herbId: number): Promise<void> {
    await db
      .delete(userBookmarks)
      .where(
        and(
          eq(userBookmarks.userId, userId),
          eq(userBookmarks.herbId, herbId)
        )
      );
  }

  async getUserBookmarks(userId: string): Promise<UserBookmark[]> {
    return await db
      .select()
      .from(userBookmarks)
      .where(eq(userBookmarks.userId, userId))
      .orderBy(desc(userBookmarks.createdAt));
  }
}

export const storage = new DatabaseStorage();
