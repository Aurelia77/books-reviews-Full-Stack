import CustomLinkButton from "@/components/CustomLinkButton";
import useUserStore from "@/hooks/useUserStore";

const HomePage = (): JSX.Element => {
  const { currentUser: user } = useUserStore();

  return (
    <div className="flex flex-col min-h-screen gap-4 py-12 max-w-3xl md:m-auto md:mt-8">
      {user ? (
        <div className="flex flex-col gap-4">
          <CustomLinkButton className="bg-primary" linkTo="/mybooks">
            Mes livres
          </CustomLinkButton>
          <CustomLinkButton className="bg-accent/60" linkTo="/friendsbooksread">
            Livres de mes amis
          </CustomLinkButton>
          <CustomLinkButton className="bg-primary/60" linkTo="/searchusers">
            Voir les Membres
          </CustomLinkButton>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <CustomLinkButton className="bg-secondary/80" linkTo="/login">
            Se connecter
          </CustomLinkButton>
          <CustomLinkButton className="bg-primary/80" linkTo="/register">
            S'inscrire
          </CustomLinkButton>
        </div>
      )}
      {/* <CustomLinkButton className="bg-primary/50">Suggestions</CustomLinkButton> */}
      <CustomLinkButton
        className="bg-secondary/50"
        linkTo="/mybooks/searchbooks"
      >
        Recherche de livre
      </CustomLinkButton>
    </div>
  );
};

export default HomePage;
