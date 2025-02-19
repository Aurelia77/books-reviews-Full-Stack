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

  //console.log("99999 currentUser", currentUser);

  //console.log(currentUser);

  useEffect(() => {
    //console.log("999 USEEFFECT");
    //console.log("999 currentUser?.uid", currentUser?.uid);

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
      {userInfo && <AllBooksLists userInfo={userInfo} />}
      <CustomLinkButton className="bg-primary/80" linkTo="/searchbooks">
        Recherche de livre
      </CustomLinkButton>
    </div>
  );
};

export default MyBooksPage;
