import AllBooksLists from "@/components/AllBooksLists";
import CustomLinkButton from "@/components/CustomLinkButton";
import Title from "@/components/Title";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { UserType } from "@/types";
import { useEffect, useState } from "react";

const MyBooksPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserType>();

  const { currentUser } = useUserStore();

  console.log("99999 currentUser", currentUser);

  console.log(currentUser);

  useEffect(() => {
    console.log("999 USEEFFECT");
    console.log("999 currentUser?.uid", currentUser?.uid);

    if (currentUser)
      getDocsByQueryFirebase<UserType>("users", "id", currentUser?.uid).then(
        (users) => {
          setUserInfo(users[0]);
          return users[0];
        }
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid]);

  return (
    <div className="min-h-screen max-w-3xl md:m-auto md:mt-8">
      <Title level={2}>Mes Livres</Title>
      {userInfo && (
        <AllBooksLists userInfo={userInfo} userIdInUrl={undefined} />
      )}
      <CustomLinkButton
        className="bg-secondary/80"
        linkTo="/mybooks/searchbooks"
      >
        Recherche de livre
      </CustomLinkButton>
    </div>
    // <div className="h-full min-h-screen">
    //   <Title>Mes livres lus</Title>

    //   {isLoading ? (
    //     <div>
    //       <BookSkeleton />
    //       <BookSkeleton />
    //       <BookSkeleton />
    //     </div>
    //   ) : error ? (
    //     <FeedbackMessage message={message} type="error" />
    //   ) : myReadBooksIds && myReadBooksIds.length > 0 ? (
    //     <div>
    //       <ul className="flex h-full flex-col pb-16">
    //         {myReadBooksIds.map(
    //           (bookId) =>
    //             bookId && (
    //               // Ici on passe le bookId en props (et pas le book complet comme dans BooksSearchPage)
    //               <BookInfos
    //                 key={bookId}
    //                 bookId={bookId}
    //                 //friendsWhoReadBook={["Loulou"]}
    //               />
    //             )
    //         )}
    //       </ul>
    //       <CustomLinkButton
    //         className="bg-accent/60"
    //         linkTo="/mybooks/searchbooks"
    //       >
    //         Ajouter d'autres livres
    //       </CustomLinkButton>
    //     </div>
    //   ) : (
    //     <div>
    //       <FeedbackMessage message="Aucun livre pour l'instant" />
    //       <div className="flex flex-col gap-4 py-12">
    //         <p className="ml-1">Essayez d'aller par là !</p>
    //         <CustomLinkButton
    //           className="bg-accent/60"
    //           linkTo="/mybooks/searchbooks"
    //         >
    //           Recherche de livre
    //         </CustomLinkButton>
    //         <CustomLinkButton className="bg-secondary/80">
    //           Livres de mes amis
    //         </CustomLinkButton>
    //         <CustomLinkButton className="bg-primary/50">
    //           Suggestions
    //         </CustomLinkButton>
    //         {/* <FeedbackMessage
    //         message="Vous n'avez pas encore lu de livre."
    //         type="error"
    //       /> */}
    //       </div>
    //     </div>
    //   )}
    // </div>
  );
};

export default MyBooksPage;
