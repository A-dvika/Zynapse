// src/lib/auth.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "./db";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    // ... more providers if you want
  ],

  // If you want to store sessions in your DB, you can use the "database" strategy:
  session: {
    strategy: "database",
  },

  // A secret used to encrypt session tokens. You must set this for production.
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async session({ session, user }) {
      // By default, NextAuth includes "name", "email", and "image" in the session.
      // If you want to attach the user ID, do something like:
      if (session.user) {
        session.user.id = user.id;
      }
      return session;
    },
  },
};
