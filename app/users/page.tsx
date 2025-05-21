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
import { UserType, UserTypePlusIsMyFriend } from "@/lib/types";
//import useSWR from "swr";

const UsersPage = async () => {
  const currentUser = await getUser();

  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(3000);

  // throw new Error("Erreur simulée pour tester le fichier error.tsx");

  const otherUsers: UserType[] = await prisma.appUser.findMany({
    where: {
      id: { not: currentUser?.id },
    },
  });

  const myFriendsIds = await prisma.appUser.findMany({
    where: {
      id: currentUser?.id,
    },
    select: {
      friends: true,
    },
  });

  console.log("💛💙💚❤️🤍🤎", myFriendsIds[0].friends);

  const otherUsersPlusIsMyFriend: UserTypePlusIsMyFriend[] = otherUsers.map(
    (user) => {
      const isMyFriend = myFriendsIds[0].friends.includes(user.id) ?? false;
      return {
        ...user,
        isMyFriend,
      };
    }
  );

  console.log("💛💙💚❤️🤍🤎otherUsersPlusIsMyFriend", otherUsersPlusIsMyFriend);

  return (
    <div className="flex h-full flex-col gap-6">
      {otherUsers.length > 0 ? (
        <UsersSearch users={otherUsersPlusIsMyFriend} />
      ) : (
        <FeedbackMessage message="Aucun autre utilisateur pour l'instant." />
      )}
    </div>
  );
};

export default UsersPage;
