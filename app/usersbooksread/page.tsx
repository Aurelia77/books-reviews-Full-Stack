import UsersBooksRead from "@/components/UsersBooksRead";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { BookStatus } from "@prisma/client";

const UsersBooksReadPage = async () => {
  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(3000);

  // throw new Error("Erreur simulée pour tester le fichier error.tsx");

  const currentUser = await getUser();

  const friendsOfCurrentAppUser = await prisma.appUser.findUnique({
    where: {
      id: currentUser?.id,
    },
    select: {
      friends: true,
    },
  });
  console.log("💚💙🤎 friendsOfCurrentAppUser", friendsOfCurrentAppUser);

  const booksAndUsersWhoReadGroupedById: Record<string, string[]> =
    await prisma.userInfoBook
      .findMany({
        where: {
          status: BookStatus.READ,
        },
        select: {
          bookId: true,
          userId: true,
        },
      })
      .then((data) =>
        data.reduce((acc, curr) => {
          if (!acc[curr.bookId]) {
            acc[curr.bookId] = [];
          }
          acc[curr.bookId].push(curr.userId);
          return acc;
        }, {} as Record<string, string[]>)
      );

  console.log(
    "💚💙🤎 booksAndUsersWhoReadGroupedById",
    booksAndUsersWhoReadGroupedById
  );

  //  displayBookStatus,
  // // sortState,
  // // setSortState,
  // books,
  // bookIds,
  // displayedAppUserId,
  // withDateOption = false,

  return (
    <UsersBooksRead
      booksAndUsersWhoReadGroupedById={booksAndUsersWhoReadGroupedById}
      friendsOfCurrentAppUser={friendsOfCurrentAppUser?.friends}
      //usersBooksReadIds={usersBooksReadIdsWithUsersWhoReadIds}
      //friendsOfCurrentAppUser={friendsOfCurrentAppUser?.friends}
    />
  );
  // <UsersBooksRead currentUserId={currentUser?.id} />
};

export default UsersBooksReadPage;
