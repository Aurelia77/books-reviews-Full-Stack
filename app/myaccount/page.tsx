import MyAccount from "@/components/MyAccount";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

const MyAccountPage = async () => {
  // // Simulation pour loading / error
  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(3000);

  // throw new Error("Erreur simulée pour tester le fichier error.tsx");

  const currentUser = await getUser();

  console.log("💛💙💚❤️🤍🤎", currentUser?.id);

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
  console.log("💛💙💚❤️🤍🤎", myFriends);

  console.log("💛💙💚❤️currentUserInfo", currentAppUser);

  return <MyAccount currentAppUser={currentAppUser} myFriends={myFriends} />;
};

export default MyAccountPage;
