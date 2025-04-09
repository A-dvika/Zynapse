// app/profile/page.tsx
import ProfilePageUI from "./ProfilePageUI"; // This is a client component.
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/db";

export default async function ProfilePage() {
  // This is allowed because it's a server component.
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return <div>Not signed in</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      preferences: true,
      history: {
        include: { content: true },
      },
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  // Pass data to the client component
  return <ProfilePageUI user={{ ...user, preferences: user.preferences ?? undefined }} />;
}
