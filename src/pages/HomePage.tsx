import CustomLinkButton from "@/components/CustomLinkButton";

const HomePage = (): JSX.Element => {
  return (
    <div className="flex flex-col items-center gap-4  py-12">
      <CustomLinkButton className="bg-primary/80" linkTo="/mybooks">
        Mes livres
      </CustomLinkButton>
      <CustomLinkButton className="bg-primary/50">
        Livres de mes amis
      </CustomLinkButton>
      <CustomLinkButton className="bg-primary/80">Suggestions</CustomLinkButton>
    </div>
  );
};

export default HomePage;
