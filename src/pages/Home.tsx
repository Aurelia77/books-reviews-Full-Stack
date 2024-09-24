import CustomLinkButton from "@/components/CustomLinkButton";

const Home = () => {
  return (
    <div className="flex flex-col items-center gap-4  py-12">
      <CustomLinkButton opacity={50} linkTo="/mybooks">
        Mes livres
      </CustomLinkButton>
      <CustomLinkButton opacity={40}>Livres de mes amis</CustomLinkButton>
      <CustomLinkButton opacity={60}>Suggestions</CustomLinkButton>
    </div>
  );
};

export default Home;
