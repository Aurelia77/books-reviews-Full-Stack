import Admin from "@/components/Admin";
import FeedbackMessage from "@/components/FeedbackMessage";
import { getCurrentUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

const AdminPage = async () => {
  const currentUser = await getCurrentUser();
  console.log("💛💙💚❤️🤍🤎", currentUser?.email);

  const isAdmin = await prisma.appUser.findFirst({
    where: {
      id: currentUser?.id,
      isAdmin: true,
    },
  });

  return (
    <div className="min-h-screen">
      {isAdmin && currentUser ? (
        <Admin currentUserId={currentUser?.id} />
      ) : (
        <FeedbackMessage
          type="error"
          message="Vous n'êtes pas autorisé à accéder à cette page, vous devez être Admin."
        />
      )}
    </div>
  );
};

export default AdminPage;
