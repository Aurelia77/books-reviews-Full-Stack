"use client";

import FriendSparkles from "@/components/FriendSparkles";
import { Button } from "@/components/ui/button";
import { Card, CardDescription } from "@/components/ui/card";
// import {
//   addUserIdToMyFriendsFirebase,
//   deleteUserIdToMyFriendsFirebase,
//   getDocsByQueryFirebase,
//   isUserMyFriendFirebase,
// } from "@/firebase/firestore";
// import useUserStore from "@/hooks/useUserStore";
import { AppUserType } from "@/lib/types";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
// import { useParams } from "react-router-dom";

const UserAccount = ({
  currentUser,
  userInfo,
}: {
  currentUser: AppUserType | null;
  userInfo: AppUserType;
}) => {
  // const [userInfo, setUserInfo] = useState<UserType>();
  const [isFriend, setIsFriend] = useState<boolean>();
  console.log("isFriend", isFriend);

  //console.log("USER INFO", userInfo);

  // const userInUrl = useParams<{ userId: string }>();
  // console.log("userId", userInUrl);

  // const { currentUser } = useUserStore();

  useEffect(() => {
    // getDocsByQueryFirebase<UserType>("users", "id", userInUrl.userId)
    //   .then((users) => {
    //     setUserInfo(users[0]);
    //     return users[0];
    //   })
    //   .then((user) => isUserMyFriendFirebase(user.id, currentUser?.uid))
    //   .then((isFriend) => setIsFriend(isFriend));
    currentUser?.friends?.includes(userInfo.id)
      ? setIsFriend(true)
      : setIsFriend(false);
  }, [currentUser, userInfo]);

  const updateFriendHandler = async (action: "add" | "remove") => {
    if (currentUser?.id) {
      const updatedFriends =
        action === "add"
          ? [...currentUser.friends, userInfo.id]
          : currentUser.friends.filter((friendId) => friendId !== userInfo.id);

      try {
        const response = await fetch("/api/appUsers/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            currentUserId: currentUser.id,
            data: { friends: updatedFriends },
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error(
            "Erreur lors de la mise à jour du profil :",
            errorData.error,
            errorData.message
          );
          toast.error(
            "Impossible de mettre à jour le profil. Veuillez vérifier votre connexion ou réessayer plus tard."
          );
        } else {
          toast.success("Profil mis à jour avec succès !");
          setIsFriend(action === "add");
        }
      } catch (error) {
        console.error(
          "Erreur lors de l'appel à l'API /appUser/update :",
          error
        );
        toast.error(
          "Une erreur est survenue lors de la mise à jour des informations. Veuillez réessayer plus tard."
        );
      }
    }
  };

  return (
    <div
      // min-h-screen
      className={cn("max-w-3xl sm:p-2 md:m-auto md:mt-8 w-full", {
        //"bg-yellow-400/20": isFriend,
      })}
      //key={userInUrl.userId}
    >
      <Card className="mb-6">
        <div className="mr-2 flex items-center justify-between gap-10 p-4 max-w-md min-w-md mb-10">
          {/* <div className="mr-2 flex items-center justify-between gap-10 pl-2 max-w-md"> */}
          {/* <Title>{userInfo?.userName ?? ""}</Title> */}
          {/* <CardDescription> */}
          <div className="flex justify-end w-full">
            {isFriend ? (
              <div className="flex gap-4 items-center">
                <FriendSparkles />
                <p>Ami</p>
                <Button onClick={() => updateFriendHandler("remove")}>
                  Supprimer
                </Button>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <p>Non ami</p>
                <Button onClick={() => updateFriendHandler("add")}>
                  Ajouter
                </Button>
              </div>
            )}
          </div>
        </div>
        <div className="m-4 flex gap-4">
          {userInfo?.imgURL && (
            <Image
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

      {/* {userInfo && userInUrl.userId && <AllBooksLists userInfo={userInfo} />} */}
    </div>
  );
};

export default UserAccount;
