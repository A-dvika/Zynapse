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

  // Normalize the user data: if user.email is null, set a default (e.g., empty string)
  const normalizedUser = {
    ...user,
    email: user.email ?? "",
    name: user.name ?? "Unknown",
    // Optionally, preferences can be transformed as needed.
    preferences: user.preferences ?? undefined,
    image: user.image ?? undefined, // Normalize image to string | undefined
  };

  return <ProfilePageUI user={normalizedUser} />;
}
