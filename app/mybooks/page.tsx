import AllBooksLists from "@/components/AllBooksLists";
import CustomLinkButton from "@/components/CustomLinkButton";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { AppUserType } from "@/lib/types";

// const fetcher = async (uid: string) => {
//   const users = await getDocsByQueryFirebase<UserType>("users", "id", uid);
//   return users[0];
// };

const MyBooksPage = async () => {
  // // Simulation pour loading / error
  // const delay = (ms: number) =>
  //   new Promise((resolve) => setTimeout(resolve, ms));
  // await delay(3000);

  // throw new Error("Erreur simulée pour tester le fichier error.tsx");

  // const { currentUser } = useUserStore();

  const currentUser = await getUser();

  const currentAppUser: AppUserType | null = await prisma.appUser.findUnique({
    where: { id: currentUser?.id },
  });

  // const {
  //   data: userInfo,
  //   error,
  //   isLoading,
  // } = useSWR(currentUser ? currentUser.uid : null, fetcher);

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  // const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`; // VOIR !!!!

  // isLoading ? (
  //   // {/* Mettre un Spinner pour pas voir rapidement le message Aucun membre */}
  //   <div>
  //     <BookSkeleton />
  //     <BookSkeleton />
  //     <BookSkeleton />
  //   </div>
  // ) : error ? (
  //   <FeedbackMessage message={message} type="error" />
  // ) :
  return (
    <div>
      {currentAppUser && <AllBooksLists displayedAppUser={currentAppUser} />}
      <CustomLinkButton className="bg-primary/80 mt-36" linkTo="/books">
        Recherche de livres
      </CustomLinkButton>
    </div>
  );
};

export default MyBooksPage;
