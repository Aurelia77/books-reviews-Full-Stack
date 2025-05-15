import MyAccount from "@/components/MyAccount";
import { getUser } from "@/lib/auth-session";

const UserAccountPage = async (props: {
  searchParams: Promise<Record<string, string>>;
}) => {
  //const books = await prisma.book.findMany(); // Récupération des données côté serveur

  const searchParams = await props.searchParams;

  console.log("💚❤️🤍", searchParams);

  const currentUser = await getUser();

  // const res = await fetch(`/api/appUser/getOne?userId=${currentUser?.id}`, {
  //   next: { revalidate: 60 },
  // });
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/appUser/getOne?userId=${currentUser?.id}`,
    {
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const currentUserInfo = await res.json();

  console.log("💛💙💚❤️currentUserInfo", currentUserInfo);

  return (
    <MyAccount currentUser={currentUser} currentUserInfo={currentUserInfo} />
  );
};

export default UserAccountPage;
