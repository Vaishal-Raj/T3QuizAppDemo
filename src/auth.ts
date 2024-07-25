import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Discord from "next-auth/providers/discord";
import { db } from "./server/db";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { users,accounts } from "./server/db/schema";
import { UserRole } from "./server/db/schema";
import { getUserById } from "./server/actions";
import { env } from "./env";
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
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }),
    Google({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      checks:["none"]
      
    }),
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET
    }),
  ],
  secret:env.AUTH_SECRET,
  cookies: {
    pkceCodeVerifier: {
      name: "next-auth.pkce.code_verifier",
      options: {
        httpOnly: false,
        sameSite: "none",
        path: "/",
        secure: process.env.NODE_ENV === 'production'
      },
    },
  },
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
