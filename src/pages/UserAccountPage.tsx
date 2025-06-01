import AllBooksLists from "@/components/AllBooksLists";
import FriendSparkles from "@/components/FriendSparkles";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
import {
  addUserIdToMyFriendsFirebase,
  deleteUserIdToMyFriendsFirebase,
  getDocsByQueryFirebase,
  isUserMyFriendFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { UserType } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserAccountPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserType>();
  const [isFriend, setIsFriend] = useState<boolean>();

  const userInUrl = useParams<{ userId: string }>();

  const { currentUser } = useUserStore();

  useEffect(() => {
    getDocsByQueryFirebase<UserType>("users", "id", userInUrl.userId)
      .then((users) => {
        setUserInfo(users[0]);
        return users[0];
      })
      .then((user) => isUserMyFriendFirebase(user.id, currentUser?.uid))
      .then((isFriend) => setIsFriend(isFriend));
  }, [userInUrl, currentUser?.uid]);

  const addFriendHandler = () => {
    addUserIdToMyFriendsFirebase(currentUser?.uid, userInUrl.userId).then(() =>
      setIsFriend(true)
    );
  };

  const deleteFriendHandler = () => {
    deleteUserIdToMyFriendsFirebase(currentUser?.uid, userInUrl.userId).then(
      () => setIsFriend(false)
    );
  };

  return (
    <div className={cn("min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8", {})}>
      <Card className="mb-6">
        <div className="mr-2 flex max-w-md items-center justify-between gap-10 pl-2">
          <Title>{userInfo?.userName ?? ""}</Title>
          <CardDescription>
            {isFriend ? (
              <div className="flex items-center gap-4">
                <FriendSparkles />
                <p>Ami</p>
                <Button onClick={deleteFriendHandler}>Supprimer</Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <p>Non ami</p>
                <Button onClick={addFriendHandler}>Ajouter</Button>
              </div>
            )}
          </CardDescription>
        </div>
        <div className="m-4 flex gap-4">
          {userInfo?.imgURL && (
            <img
              src={userInfo?.imgURL}
              alt={`Image de profil de ${userInfo?.userName}`}
              width="150"
              height="150"
              className="rounded-xl"
            />
          )}
          <CardDescription className="m-2 whitespace-pre-wrap">
            {userInfo?.description || "Aucune description"}
          </CardDescription>
        </div>
      </Card>

      <Title level={2}>Livres du membre</Title>
      {userInfo && userInUrl.userId && <AllBooksLists userInfo={userInfo} />}
    </div>
  );
};

export default UserAccountPage;
