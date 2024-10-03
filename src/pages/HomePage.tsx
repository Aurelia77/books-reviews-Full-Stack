import CustomLinkButton from "@/components/CustomLinkButton";

const HomePage = (): JSX.Element => {
  return (
    <div className="flex h-screen flex-col items-center gap-4 py-12">
      <CustomLinkButton className="bg-primary" linkTo="/mybooks">
        Mes livres
      </CustomLinkButton>
      <CustomLinkButton className="bg-secondary/80">
        Livres de mes amis
      </CustomLinkButton>
      <CustomLinkButton className="bg-primary/50">Suggestions</CustomLinkButton>
      <CustomLinkButton className="bg-accent/60" linkTo="/mybooks/searchbook">
        Recherche de livre
      </CustomLinkButton>
    </div>
  );
};

export default HomePage;
