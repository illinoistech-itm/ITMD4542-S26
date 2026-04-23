import { auth } from "@/auth";
import { SignOut } from "@/components/auth/signout-button";

export async function UserBar() {
  const session = await auth();
  if (!session?.user) return null;
  console.log("Session:", session);

  return (
    <div className="flex items-center justify-between mb-4">
      <div className="text-lg font-bold text-white">
        Hello {session.user?.name}
      </div>
      <div className="text-white">
        <SignOut />
      </div>
    </div>
  );
}
