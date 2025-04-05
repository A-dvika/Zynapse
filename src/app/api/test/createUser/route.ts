// src/app/api/test/createUser/route.ts
import { NextResponse } from "next/server";
import prisma from "../../../../../lib/db";


export async function POST(request: Request) {
  try {
    const { name, email, image } = await request.json();
    const newUser = await prisma.user.create({
      data: { name, email, image },
    });
    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    console.error("User creation error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
