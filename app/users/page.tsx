import FeedbackMessage from "@/components/FeedbackMessage";
import UsersSearch from "@/components/UsersSearch";
import { getConnectedUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { AppUserType, UserTypePlusIsMyFriend } from "@/lib/types";

const UsersPage = async () => {
  const currentUser = await getConnectedUser();

  const otherUsers: AppUserType[] = await prisma.appUser.findMany({
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

  const otherUsersPlusIsMyFriend: UserTypePlusIsMyFriend[] = otherUsers.map(
    (user) => {
      const isMyFriend = myFriendsIds[0].friends.includes(user.id) ?? false;
      return {
        ...user,
        isMyFriend,
      };
    }
  );
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
