import CustomLinkButton from "@/components/CustomLinkButton";

const MyBooks = () => {
  return (
    <div>
      <div className="flex flex-col items-center gap-4 py-12">
        <h1 className="text-5xl">Mes livres</h1>
        <CustomLinkButton linkTo="/mybooks/myreadbooks" opacity={50}>
          Livres lus
        </CustomLinkButton>
        <CustomLinkButton linkTo="/mybooks/myreadbooks" opacity={40}>
          Livres en cours
        </CustomLinkButton>
        <CustomLinkButton linkTo="/mybooks/myreadbooks" opacity={60}>
          Livres à lire
        </CustomLinkButton>
      </div>
    </div>
  );
};

export default MyBooks;
