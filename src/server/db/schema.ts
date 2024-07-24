// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */


export type UserRole = "user" | "admin";

export const createTable = pgTableCreator((name) => `t3-appdemo_${name}`);


import {
  boolean,
  pgTable,
  text,
  primaryKey,
  integer,
} from "drizzle-orm/pg-core"
import postgres from "postgres"
import { drizzle } from "drizzle-orm/postgres-js"
import type { AdapterAccountType } from "next-auth/adapters"
 
const connectionString = "postgres://postgres:postgres@localhost:5432/drizzle"
const pool = postgres(connectionString, { max: 1 })
 
export const db = drizzle(pool)

export interface User{
  name:string,
  email:string,
  image:string
}

 
export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  role: text("role").$type<UserRole>().notNull().default("user"),
  authProviderId: text("authProviderId"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
  })
)
 
export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
})
 
export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => ({
    compositePk: primaryKey({
      columns: [verificationToken.identifier, verificationToken.token],
    }),
  })
)
 
export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

// ----------------------------------------------------------------------------------------
// quizzes: Stores quiz metadata like title, creator, and timestamps.
// questions: Stores questions with a reference to the quiz.
// options: Stores options for each question, indicating the correct answer.
// participants: Stores participants' information and their scores.


export const quizzes = createTable(
  "quiz",
  {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 256 }).unique(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
    creatorId: text("creatorId").references(() => users.id, { onDelete: "cascade" }),
  }
);

// Question Table
export const questions = createTable(
  "question",
  {
    id: serial("id").primaryKey(),
    quizId: integer("quizId").references(() => quizzes.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    order: integer("order"),
  }
);

// Option Table
export const options = createTable(
  "option",
  {
    id: serial("id").primaryKey(),
    questionId: integer("questionId").references(() => questions.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    isCorrect: boolean("isCorrect").notNull(),
  }
);

// Participant Table
export const participants = createTable(
  "participant",
  {
    id: serial("id").primaryKey(),
    quizId: integer("quizId").references(() => quizzes.id, { onDelete: "cascade" }),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
    name:text("name"),
    email:text("email"),
    score: integer("score").default(0),
    image:text("image"),
    time: timestamp("time").defaultNow(),
  }
);
