import { prisma } from "@/lib/prisma";
//import {
//  getDocsByQueryFirebase,
//  isUserMyFriendFirebase,
//} from "@/firebase/firestore";
//import useUserStore from "@/hooks/useUserStore";
// import UsersListView from "@/components/UsersListView";
// import UserViewSkeleton from "@/components/skeletons/UserViewSkeleton";
import FeedbackMessage from "@/components/FeedbackMessage";
import UsersSearch from "@/components/UsersSearch";
import { getUser } from "@/lib/auth-session";
import { UserInfoBookType, UserType } from "@/lib/types";
//import useSWR from "swr";

const UsersPage = async () => {
  const user = await getUser();

  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(3000);

  // throw new Error("Erreur simulée pour tester le fichier error.tsx");

  const otherUsers = await prisma.appUser.findMany({
    where: {
      id: { not: user?.id },
    },
  });

  // Car certains champs sont de type UserInfoBookType[]
  const transformedUsers: UserType[] = otherUsers.map((user) => ({
    ...user,
    booksRead: Array.isArray(user.booksRead)
      ? (user.booksRead as UserInfoBookType[])
      : [],
    booksInProgress: Array.isArray(user.booksInProgress)
      ? (user.booksInProgress as UserInfoBookType[])
      : [],
    booksToRead: Array.isArray(user.booksToRead)
      ? (user.booksToRead as UserInfoBookType[])
      : [],
  }));

  return (
    <div className="flex h-full flex-col gap-6">
      {transformedUsers.length > 0 ? (
        <UsersSearch users={transformedUsers} />
      ) : (
        <FeedbackMessage message="Aucun autre utilisateur pour l'instant." />
      )}
    </div>
  );
};

export default UsersPage;
