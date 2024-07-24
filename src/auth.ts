import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { db } from "./server/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { users,accounts } from "./server/db/schema";
import { eq } from "drizzle-orm";
import { UserRole } from "./server/db/schema";
import { getUserById } from "./server/actions";
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
  }),
  session: {
    strategy: "jwt",
  },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET
    }),
    Discord({
      clientId: process.env.AUTH_DISCORD_ID,
      clientSecret: process.env.AUTH_DISCORD_SECRET
    }),
  ],
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;
      const exsistingUser = await getUserById(token.sub);
      if (!exsistingUser) {
        return token;
      }
      token.role = exsistingUser.role as UserRole;
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});
