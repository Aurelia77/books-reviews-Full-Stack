import AllBooksLists from "@/components/AllBooksLists";
import CustomLinkButton from "@/components/CustomLinkButton";
import { getUser } from "@/lib/auth-session";
import { prisma } from "@/lib/prisma";
import { AppUserType } from "@/lib/types";

const MyBooksPage = async () => {
  const currentUser = await getUser();

  const currentAppUser: AppUserType | null = await prisma.appUser.findUnique({
    where: { id: currentUser?.id },
  });

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
