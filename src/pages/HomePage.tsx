import CustomLinkButton from "@/components/CustomLinkButton";
import useUserStore from "@/hooks/useUserStore";
import {
  ArrowDownToLine,
  BookOpen,
  CircleUser,
  LibraryBig,
  LogIn,
  Search,
  Users,
} from "lucide-react";

const HomePage = (): JSX.Element => {
  const { currentUser: user } = useUserStore();

  return (
    <div className="flex min-h-screen max-w-3xl flex-col gap-4 py-12 md:m-auto md:mt-8">
      {user ? (
        <div className="flex flex-col gap-4">
          <CustomLinkButton className="bg-primary" linkTo="/mybooks">
            Mes Livres
            <LibraryBig
              size={40}
              className="bg-foreground/10 rounded-full p-2"
            />
          </CustomLinkButton>
          <CustomLinkButton
            className="bg-accent/60 flex gap-2"
            linkTo="/usersbooksread"
          >
            Lus par les membres
            <BookOpen size={40} className="bg-foreground/10 rounded-full p-2" />
            <Users size={40} className="bg-foreground/10 rounded-full p-2" />
          </CustomLinkButton>
          <CustomLinkButton className="bg-primary/60" linkTo="/searchusers">
            Les Membres
            <Users size={40} className="bg-foreground/10 rounded-full p-2" />
          </CustomLinkButton>
          <CustomLinkButton className="bg-secondary/60" linkTo="/searchusers">
            Mon compte
            <CircleUser
              size={40}
              className="bg-foreground/10 rounded-full p-2"
            />
          </CustomLinkButton>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <CustomLinkButton className="bg-primary/80" linkTo="/login">
            Se connecter
            <LogIn size={40} className="bg-foreground/10 rounded-full p-2" />
          </CustomLinkButton>
          <CustomLinkButton className="bg-secondary/80" linkTo="/register">
            S'inscrire
            <ArrowDownToLine
              size={40}
              className="bg-foreground/10 rounded-full p-2"
            />
          </CustomLinkButton>
        </div>
      )}
      {/* <CustomLinkButton className="bg-primary/50">Suggestions</CustomLinkButton> */}
      <CustomLinkButton className="bg-primary/50" linkTo="/searchbooks">
        Recherche de livre
        <Search size={40} className="bg-foreground/10 rounded-full p-2" />
      </CustomLinkButton>
    </div>
  );
};

export default HomePage;
