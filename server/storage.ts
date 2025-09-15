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
  // User operations for email/password auth
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: Omit<UpsertUser, 'id'>): Promise<User>;
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

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: Omit<UpsertUser, 'id'>): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .returning();
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

    // base condition: only published herbs
    const conditions: any[] = [eq(herbs.isPublished, true)];

    if (search && search.trim().length > 0) {
      const s = `%${search.trim()}%`;
      // match against plantName OR benefits using ilike
      // drizzle doesn't have a built-in OR combinator helper in your snippet,
      // but you can use db.raw or two where conditions joined by or depending on your drizzle version.
      // We'll use `ilike` on plantName OR ilike on benefits by using `.where(sql\`...\`)` for safety.
      // If your drizzle version provides or(), replace accordingly.
      // Simpler approach: build an 'or' by using raw SQL fragment:
      query = query.where(
        and(
          ...conditions,
          // raw or expression
          // @ts-ignore
          db.raw(
            `(${herbs.plantName} ILIKE ? OR ${herbs.benefits} ILIKE ?)`,
            [s, s]
          )
        )
      );
    } else {
      if (category && category !== "All") {
        conditions.push(eq(herbs.category, category));
      }
      query = query.where(and(...conditions));
    }

    // If category is provided even with search, apply it too
    if (category && category !== "All") {
      // append category filter to current query conditions
      query = query.where(eq(herbs.category, category));
    }

    // order by plant name
    return await query.orderBy(asc(herbs.plantName));
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
