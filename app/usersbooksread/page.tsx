import UsersBooksRead from "@/components/UsersBooksRead";
import { getCurrentUser } from "@/lib/auth-session";
import { BookStatusValues } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

const UsersBooksReadPage = async () => {
  const currentUser = await getCurrentUser();

  const friendsOfCurrentAppUser = await prisma.appUser.findUnique({
    where: {
      id: currentUser?.id,
    },
    select: {
      friends: true,
    },
  });

  const booksAndUsersWhoReadGroupedById: Record<string, string[]> =
    await prisma.userInfoBook
      .findMany({
        where: {
          status: BookStatusValues.READ,
        },
        select: {
          bookId: true,
          userId: true,
        },
      })
      .then((data: { userId: string; bookId: string }[]) =>
        data.reduce((acc, curr) => {
          if (!acc[curr.bookId]) {
            acc[curr.bookId] = [];
          }
          acc[curr.bookId].push(curr.userId);
          return acc;
        }, {} as Record<string, string[]>)
      );

  return (
    <UsersBooksRead
      booksAndUsersWhoReadGroupedById={booksAndUsersWhoReadGroupedById}
      friendsOfCurrentAppUser={friendsOfCurrentAppUser?.friends}
    />
  );
};

export default UsersBooksReadPage;
