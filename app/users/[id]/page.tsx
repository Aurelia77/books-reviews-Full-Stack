import AllBooksLists from "@/components/AllBooksLists";
import FeedbackMessage from "@/components/FeedbackMessage";
import UserAccount from "@/components/UserAccount";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { AppUserType } from "@/lib/types";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const currentUser = await getUser();

  const displayedAppUser = await prisma.appUser.findUnique({
    where: { id: id },
  });

  const currentAppUser: AppUserType | null = await prisma.appUser.findUnique({
    where: { id: currentUser?.id },
  });

  const livres = await prisma.userInfoBook.findMany({
    where: {
      userId: id,
      status: "READ",
    },
    include: {
      book: true, // inclut les infos du livre
    },
  });

  console.log("💛💙💚❤️🤍🤎livres", livres);
  console.log("💛💙💚❤️🤍🤎livres", livres[0]);
  console.log(
    "💛💙💚❤️🤍🤎livres",
    livres.map((l) => l.book)
  );

  return (
    displayedAppUser && (
      <div className="flex flex-col gap-6">
        <UserAccount currentUser={currentAppUser} userInfo={displayedAppUser} />
        {livres?.length > 0 && currentAppUser ? (
          <AllBooksLists displayedAppUser={displayedAppUser} />
        ) : (
          // <BooksWithSortControls
          //   displayBookStatus={BookStatus.READ}
          //   userId={currentUser?.id}
          //   books={livres.map((l) => l.book)} // ????????
          // />
          <FeedbackMessage message="Aucun livre trouvé" type="info" />
        )}
      </div>
    )
  );
}
