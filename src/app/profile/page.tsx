// app/profile/page.tsx
import { getServerSession } from "next-auth"

import ProfilePageUI from "./ProfilePageUI"
import { authOptions } from "../../../lib/auth"
import prisma from "../../../lib/db"

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return <div>Not signed in</div>
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      preferences: true,
      history: {
        include: { content: true },
      },
    },
  })

  // Debugging
  console.log("Fetched user:", user)

  if (!user) {
    return <div>User not found</div>
  }

  return <ProfilePageUI user={{ ...user, preferences: user.preferences ?? undefined }} />
}
