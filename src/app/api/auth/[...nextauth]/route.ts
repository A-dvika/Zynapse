// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "../../../../../lib/auth";


const handler = NextAuth(authOptions);

// Next.js 13 app router requires you to export these HTTP methods:
export { handler as GET, handler as POST };
