import { getServerSession } from "next-auth";
import prisma from "../../../../lib/db";
import { authOptions } from "../../../../lib/auth";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not signed in" });

  if (req.method === "POST") {
    const { interests, sources, contentTypes } = req.body;

    try {
      const prefs = await prisma.userPreferences.create({
        data: {
          userId: session.user.id,
          interests,
          sources,
          contentTypes,
        },
      });

      res.status(200).json(prefs);
    } catch (err) {
      console.error("Failed to save preferences", err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
