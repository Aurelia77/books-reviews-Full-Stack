import MyAccount from "@/components/MyAccount";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";

const MyAccountPage = async () => {
  const currentUser = await getUser();

  console.log("💛💙💚❤️🤍🤎", currentUser?.id);

  console.log("💛💙💚❤️🤍🤎", process.env.NEXT_PUBLIC_BASE_URL);

  // const res = await fetch(`/api/appUser/getOne?userId=${currentUser?.id}`, {
  //   next: { revalidate: 60 },
  // });
  const currentUserInfo = await prisma.appUser.findUnique({
    where: { id: currentUser?.id },
  });

  if (!currentUserInfo) {
    throw new Error("User not found");
  }

  console.log("💛💙💚❤️currentUserInfo", currentUserInfo);

  return (
    <MyAccount currentUser={currentUser} currentUserInfo={currentUserInfo} />
  );
};

export default MyAccountPage;
