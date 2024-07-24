import NextAuth, { NextAuthConfig, type DefaultSession } from "next-auth";
import { UserRole } from "../server/db/schema";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      role?: UserRole;
    };
  }

  interface User {
    role?: UserRole;
  }
}
