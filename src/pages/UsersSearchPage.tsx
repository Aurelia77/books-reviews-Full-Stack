import useUserStore from "@/hooks/useUserStore";
import { UserType } from "@/types";

import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import {
  getDocsByQueryFirebase,
  isUserMyFriendFirebase,
} from "@/firebase/firestore";
//import { books } from "@/data";
import UsersListView from "@/components/UsersListView";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// const MAX_RESULTS = 10; // jusqu'à 40

const UsersSearchPage = (): JSX.Element => {
  const { currentUser } = useUserStore();
  //console.log("currentUser", currentUser?.uid);

  const [otherUsers, setOtherUsers] = useState<UserType[]>([]);
  //console.log("otherUsers", otherUsers);

  useEffect(() => {
    getDocsByQueryFirebase<UserType>("users")
      .then((allUsers) =>
        allUsers.filter((user: UserType) => user.id !== currentUser?.uid)
      )
      .then((otherUsers: UserType[]) => {
        const promises = otherUsers.map((user: UserType) =>
          isUserMyFriendFirebase(user.id, currentUser?.uid).then(
            (isFriend: boolean) => ({
              ...user,
              isMyFriend: isFriend,
            })
          )
        );

        Promise.all(promises).then((otherUsersFriendType: UserType[]) => {
          const sortedUsers = otherUsersFriendType.sort(
            (a: UserType, b: UserType) => (a.userName > b.userName ? 1 : -1)
          );
          setOtherUsers(sortedUsers);
        });
      });
  }, []);

  const [userNameInput, setUserNameInput] = useState<string>("");
  //console.log("titleInput", titleInput);

  const titleInputRef = useRef<HTMLInputElement>(null);

  // const [inFriendsLists, setInFriendsLists] = useState(true);
  // const [inApi, setInApi] = useState(true);

  useEffect(() => {
    const filteredUsers = otherUsers.filter((user) =>
      user.userName.includes(userNameInput)
    );
    setOtherUsers(filteredUsers);
  }, [userNameInput]);

  return (
    <div className="h-full min-h-screen sm:p-2">
      <div className="flex h-full flex-col gap-6">
        <div className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500">
          <Title>Recherche de membres</Title>
          <div className="relative">
            <Input
              value={userNameInput}
              ref={titleInputRef}
              placeholder="Nom"
              onChange={(e) => setUserNameInput(e.target.value)}
            />
            <X
              onClick={() => setUserNameInput("")}
              className="absolute right-2 top-2 cursor-pointer"
            />
          </div>
        </div>

        {/* Mettre un Spinner pour pas voir rapidement le message Aucun membre */}
        {otherUsers?.length > 0 ? (
          <UsersListView userInfoList={otherUsers} />
        ) : (
          <FeedbackMessage message="Aucun membre trouvé" type="info" />
        )}
      </div>
    </div>
  );
};

export default UsersSearchPage;
