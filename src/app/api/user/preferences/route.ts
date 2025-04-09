// /pages/api/user/preferences.ts

import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import prisma from "../../../../../lib/db"


interface PreferencesPayload {
  interests: string[]
  sources: string[]
  contentTypes: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"])
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` })
  }

  // Verify the user session (requires NextAuth configured)
  const session = await getSession({ req })
  if (!session || !session.user?.id) {
    return res.status(401).json({ error: "You must be authenticated." })
  }

  const userId = session.user.id

  // Validate request body
  const { interests, sources, contentTypes } = req.body as PreferencesPayload

  if (
    !Array.isArray(interests) ||
    !Array.isArray(sources) ||
    !Array.isArray(contentTypes)
  ) {
    return res
      .status(400)
      .json({ error: "Invalid data. Preferences must be arrays." })
  }

  try {
    // Check if preferences already exist for the user
    const existingPreferences = await prisma.userPreferences.findUnique({
      where: { userId },
    })

    let updatedPreferences
    if (existingPreferences) {
      // Update the existing record
      updatedPreferences = await prisma.userPreferences.update({
        where: { userId },
        data: { interests, sources, contentTypes },
      })
    } else {
      // Create a new record for the user
      updatedPreferences = await prisma.userPreferences.create({
        data: { userId, interests, sources, contentTypes },
      })
    }

    return res.status(200).json(updatedPreferences)
  } catch (error) {
    console.error("Failed updating preferences:", error)
    return res
      .status(500)
      .json({ error: "An error occurred while updating preferences." })
  }
}
