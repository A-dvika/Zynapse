// /pages/api/history.ts
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import prisma from "../../../../lib/db";

import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Not signed in" });

  const { contentId, action } = req.body;

  const history = await prisma.userHistory.create({
    data: {
      userId: session.user.id,
      contentId,
      action, // 'viewed', 'clicked', etc.
    },
  });

  res.status(200).json({ success: true, history });
}
