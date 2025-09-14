import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table for email/password auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  name: varchar("name").notNull(),
  password: varchar("password").notNull(),
  role: varchar("role").default("user"), // 'user' or 'admin'
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Herbs database table
export const herbs = pgTable("herbs", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  plantName: varchar("plant_name", { length: 255 }).notNull(),
  scientificName: varchar("scientific_name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  benefits: text("benefits").notNull(),
  cultivation: text("cultivation"),
  climate: text("climate"),
  category: varchar("category", { length: 100 }),
  imageUrl: varchar("image_url", { length: 500 }),
  model3dUrl: varchar("model_3d_url", { length: 500 }),
  usageInstructions: text("usage_instructions"),
  isPublished: boolean("is_published").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User recommendation history
export const userHistory = pgTable("user_history", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  symptoms: text("symptoms").notNull(),
  recommendation: text("recommendation").notNull(),
  recommendedHerbs: jsonb("recommended_herbs"), // Array of herb IDs
  createdAt: timestamp("created_at").defaultNow(),
});

// User bookmarks
export const userBookmarks = pgTable("user_bookmarks", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: varchar("user_id").notNull().references(() => users.id),
  herbId: integer("herb_id").notNull().references(() => herbs.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Auth schemas
export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
});

export const signInSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required")
});

export type SignUpData = z.infer<typeof signUpSchema>;
export type SignInData = z.infer<typeof signInSchema>;

export type InsertHerb = typeof herbs.$inferInsert;
export type Herb = typeof herbs.$inferSelect;

export type InsertUserHistory = typeof userHistory.$inferInsert;
export type UserHistory = typeof userHistory.$inferSelect;

export type InsertUserBookmark = typeof userBookmarks.$inferInsert;
export type UserBookmark = typeof userBookmarks.$inferSelect;

// Zod schemas
export const insertHerbSchema = createInsertSchema(herbs).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserHistorySchema = createInsertSchema(userHistory).omit({
  id: true,
  createdAt: true,
});

export const insertUserBookmarkSchema = createInsertSchema(userBookmarks).omit({
  id: true,
  createdAt: true,
});
