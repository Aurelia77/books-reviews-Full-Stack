import useUserStore from "@/hooks/useUserStore";
import { FriendType, UserType } from "@/types";

import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import {
  getDocsByQueryFirebase,
  isUserMyFriendFirebase,
} from "@/firebase/firestore";
//import { books } from "@/data";
import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// const MAX_RESULTS = 10; // jusqu'à 40

const UsersSearchPage = (): JSX.Element => {
  const { currentUser } = useUserStore();
  //console.log("currentUser", currentUser?.uid);

  const [otherUsers, setOtherUsers] = useState<FriendType[]>([]);
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
              id: user.id,
              userName: user.userName,
              isMyFriend: isFriend,
            })
          )
        );

        Promise.all(promises).then((otherUsersFriendType: FriendType[]) => {
          //console.log("Résultats des promesses", otherUsersFriendType);
          const sortedUsers = otherUsersFriendType.sort(
            (a: FriendType, b: FriendType) => (a.userName > b.userName ? 1 : -1)
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

        {otherUsers?.length > 0 ? (
          <ul className="pb-40">
            {otherUsers.map((friend) => (
              <li key={friend.id}>
                <Link
                  to={`/account/${friend.id}`}
                  className="font-semibold text-muted"
                >
                  {friend.userName}
                </Link>
                <p>{friend.isMyFriend ? "Ami" : "Non ami"}</p>
              </li>
            ))}
          </ul>
        ) : (
          <FeedbackMessage message="Aucun membre trouvé" type="info" />
        )}
      </div>
    </div>
  );
};

export default UsersSearchPage;
