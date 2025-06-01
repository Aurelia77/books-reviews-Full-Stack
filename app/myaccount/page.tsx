import MyAccount from "@/components/MyAccount";
import { getConnectedUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

const MyAccountPage = async () => {
  const currentUser = await getConnectedUser();

  const currentAppUser = await prisma.appUser.findUnique({
    where: { id: currentUser?.id },
  });

  if (!currentAppUser) {
    throw new Error("User not found");
  }

  const myFriends = await prisma.appUser.findMany({
    where: {
      id: {
        in: currentAppUser?.friends || [],
      },
    },
  });

  return <MyAccount currentAppUser={currentAppUser} myFriends={myFriends} />;
};

export default MyAccountPage;
