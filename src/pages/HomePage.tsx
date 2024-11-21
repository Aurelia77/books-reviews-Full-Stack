import CustomLinkButton from "@/components/CustomLinkButton";
import useUserStore from "@/hooks/useUserStore";

const HomePage = (): JSX.Element => {
  const { user } = useUserStore();

  return (
    <div
      className="flex h-screen flex-col gap-4 py-12"
      // items-center
    >
      {user ? (
        <div className="flex flex-col gap-4">
          <CustomLinkButton className="bg-primary" linkTo="/mybooks">
            Mes livres
          </CustomLinkButton>
          <CustomLinkButton className="bg-secondary/80">
            Livres de mes amis
          </CustomLinkButton>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <CustomLinkButton className="bg-primary/80" linkTo="/login">
            Se connecter
          </CustomLinkButton>
          <CustomLinkButton className="bg-secondary/80" linkTo="/register">
            S'inscrire
          </CustomLinkButton>
        </div>
      )}
      <CustomLinkButton className="bg-primary/50">Suggestions</CustomLinkButton>
      <CustomLinkButton className="bg-accent/60" linkTo="/mybooks/searchbook">
        Recherche de livre
      </CustomLinkButton>
    </div>
  );
};

export default HomePage;
