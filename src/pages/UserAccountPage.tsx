import AllBooksLists from "@/components/AllBooksLists";
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
import { cn } from "@/lib/utils";
import { UserType } from "@/types";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserAccountPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserType>();
  const [isFriend, setIsFriend] = useState<boolean>();
  console.log("isFriend", isFriend);

  //console.log("USER INFO", userInfo);

  const userInUrl = useParams<{ userId: string }>();
  console.log("userId", userInUrl);

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
    <div
      className={cn("min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8", {
        //"bg-friend/20": isFriend,
      })}
      //key={userInUrl.userId}
    >
      <Card className="mb-6">
        <div className="mr-2 flex items-center justify-between gap-10 pl-2 max-w-md">
          <Title>{userInfo?.userName ?? ""}</Title>
          <CardDescription>
            {isFriend ? (
              <div className="flex gap-4 items-center">
                <Sparkles
                  className="bg-friend rounded-full p-1 "
                  size={28}
                  color="black"
                />
                <p>Ami</p>
                <Button onClick={deleteFriendHandler}>Supprimer</Button>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
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
