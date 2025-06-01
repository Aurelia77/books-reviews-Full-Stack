import AllBooksLists from "@/components/AllBooksLists";
import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";
import UserAccount from "@/components/UserAccount";
import { getConnectedUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { AppUserType } from "@/lib/types";

const User = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const currentUser = await getConnectedUser();

  const displayedAppUser = await prisma.appUser.findUnique({
    where: { id: id },
  });

  const currentAppUser: AppUserType | null = await prisma.appUser.findUnique({
    where: { id: currentUser?.id },
  });

  const books = await prisma.userInfoBook.findMany({
    where: {
      userId: id,
      status: "READ",
    },
    include: {
      book: true,
    },
  });

  return (
    displayedAppUser && (
      <div className="flex flex-col gap-6">
        <Title>Profil de {displayedAppUser.userName}</Title>
        <UserAccount currentUser={currentAppUser} userInfo={displayedAppUser} />
        <Title level={2}>Livre(s) du membre</Title>
        {books?.length > 0 && currentAppUser ? (
          <AllBooksLists displayedAppUser={displayedAppUser} />
        ) : (
          <FeedbackMessage message="Aucun livre pour l'instant" type="info" />
        )}
      </div>
    )
  );
};

export default User;
