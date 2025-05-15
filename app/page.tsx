import CustomLinkButton from "@/components/CustomLinkButton";
//import useUserStore from "@/hooks/useUserStore";
import { getUser } from "@/lib/auth-session";
import {
  ArrowDownToLine,
  BookOpen,
  CircleUser,
  LibraryBig,
  LogIn,
  Search,
  Users,
} from "lucide-react";
import Link from "next/link";

const HomePage = async () => {
  // const { currentUser: user } = useUserStore();
  const currentUser = await getUser();

  return (
    <div className="flex min-h-screen max-w-3xl flex-col gap-4 py-12 md:m-auto md:mt-8">
      {currentUser ? (
        <div className="flex flex-col gap-4">
          <CustomLinkButton className="bg-primary" linkTo="/mybooks">
            Mes Livres
            <LibraryBig
              size={40}
              className="rounded-full bg-foreground/10 p-2"
            />
          </CustomLinkButton>
          <CustomLinkButton
            className="flex gap-2 bg-accent/60"
            linkTo="/usersbooksread"
          >
            Lus par les membres
            <BookOpen size={40} className="rounded-2xl bg-foreground/10 p-2" />
            <Users size={40} className="rounded-full bg-foreground/10 p-2" />
          </CustomLinkButton>
          <CustomLinkButton className="bg-primary/60" linkTo="/users">
            Les Membres
            <Users size={40} className="rounded-full bg-foreground/10 p-2" />
          </CustomLinkButton>
          <CustomLinkButton className="bg-secondary/60" linkTo="/myaccount">
            Mon compte
            <CircleUser
              size={40}
              className="rounded-full bg-foreground/10 p-2"
            />
          </CustomLinkButton>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <CustomLinkButton className="bg-primary/80" linkTo="/auth/signin">
            Se connecter
            <LogIn size={40} className="rounded-full bg-foreground/10 p-2" />
          </CustomLinkButton>
          <CustomLinkButton className="bg-secondary/80" linkTo="/auth/signup">
            S'inscrire
            <ArrowDownToLine
              size={40}
              className="rounded-full bg-foreground/10 p-2"
            />
          </CustomLinkButton>
        </div>
      )}
      {/* <CustomLinkButton className="bg-primary/50">Suggestions</CustomLinkButton> */}
      <CustomLinkButton className="bg-primary/50" linkTo="/books">
        Recherche de livre
        <Search size={40} className="rounded-full bg-foreground/10 p-2" />
      </CustomLinkButton>
    </div>
  );
};

export default HomePage;
