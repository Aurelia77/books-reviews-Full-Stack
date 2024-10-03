import CustomLinkButton from "@/components/CustomLinkButton";
import Title from "@/components/Title";
import { BookOpen } from "lucide-react";

const MyBooksPage = (): JSX.Element => {
  return (
    <div className="h-screen">
      <div className="flex items-center gap-2">
        <Title>Mes livres</Title>
        <BookOpen size={30} className="text-primary" />
        <BookOpen />
        <BookOpen size={28} className="text-accent" />
        <BookOpen size={31} />
      </div>

      <div className="flex flex-col items-center gap-4 pb-12">
        <CustomLinkButton
          linkTo="/mybooks/myreadbooks"
          className="bg-secondary/80"
        >
          Livres lus
        </CustomLinkButton>
        <CustomLinkButton linkTo="/mybooks/myreadbooks" className="bg-primary">
          Livres en cours
        </CustomLinkButton>
        <CustomLinkButton
          linkTo="/mybooks/myreadbooks"
          className="bg-accent/60"
        >
          Livres à lire
        </CustomLinkButton>
        <CustomLinkButton
          linkTo="/mybooks/myreadbooks"
          className="bg-primary/45"
        >
          TOUS mes livres
        </CustomLinkButton>
      </div>
    </div>
  );
};

export default MyBooksPage;
