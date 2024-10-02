import CustomLinkButton from "@/components/CustomLinkButton";
import Title from "@/components/Title";

const MyBooksPage = (): JSX.Element => {
  return (
    <div>
      <Title>Mes livres</Title>
      <div className="flex flex-col items-center gap-4 pb-12">
        <CustomLinkButton
          linkTo="/mybooks/myreadbooks"
          className="bg-primary/70"
        >
          Livres lus
        </CustomLinkButton>
        <CustomLinkButton
          linkTo="/mybooks/myreadbooks"
          className="bg-primary/50"
        >
          Livres en cours
        </CustomLinkButton>
        <CustomLinkButton
          linkTo="/mybooks/myreadbooks"
          className="bg-primary/75"
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
