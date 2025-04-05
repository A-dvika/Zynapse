// /pages/api/check-preferences.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/db";


import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ exists: false });

  const prefs = await prisma.userPreferences.findUnique({
    where: { userId: session.user.id },
  });

  res.json({ exists: !!prefs });
}
