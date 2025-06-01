import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";
import { Input } from "@/components/ui/input";
import {
  getDocsByQueryFirebase,
  isUserMyFriendFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { UserType } from "@/lib/types";
//import { books } from "@/data";
import UsersListView from "@/components/UsersListView";
import UserViewSkeleton from "@/components/skeletons/UserViewSkeleton";
import { X } from "lucide-react";
import { useRef, useState } from "react";
import useSWR from "swr";

const otherUsersFetcher = ([userNameInput, currentUserId]: string[]): Promise<
  UserType[]
> => {
  return getDocsByQueryFirebase<UserType>("users")
    .then((allUsers) => {
      return allUsers.filter((user: UserType) => user.id !== currentUserId);
    })
    .then((otherUsers: UserType[]) => {
      return otherUsers.filter((user) =>
        user.userName.toLowerCase().includes(userNameInput.toLowerCase())
      );
    })
    .then((filteredUsers: UserType[]) => {
      const promises = filteredUsers.map((user: UserType) =>
        isUserMyFriendFirebase(user.id, currentUserId).then(
          (isFriend: boolean) => ({
            ...user,
            isMyFriend: isFriend,
          })
        )
      );

      return Promise.all(promises).then((otherUsersFriendType: UserType[]) => {
        const sortedUsers = otherUsersFriendType.sort(
          (a: UserType, b: UserType) => (a.userName > b.userName ? 1 : -1)
        );
        return sortedUsers;
      });
    });
};

const UsersSearchPage = (): JSX.Element => {
  const [userNameInput, setUserNameInput] = useState<string>("");

  const titleInputRef = useRef<HTMLInputElement>(null);

  const { currentUser } = useUserStore();

  const {
    data: otherUsers = [],
    error,
    isLoading,
  } = useSWR<UserType[]>(
    [userNameInput, currentUser?.uid ?? ""],
    ([searchUserName, currentUserId]) =>
      otherUsersFetcher([searchUserName, currentUserId])
  ); // impossible to add only userNameInput as param because if it's null or "", otherUsersFetcher will not work

  return (
    <div className="h-full min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <div className="flex h-full flex-col gap-6">
        <div className="bg-background/70 sticky top-10 z-10 flex flex-col gap-3 duration-500">
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

        {isLoading ? (
          <div>
            <UserViewSkeleton />
            <UserViewSkeleton />
            <UserViewSkeleton />
            <UserViewSkeleton />
            <UserViewSkeleton />
          </div>
        ) : error ? (
          <FeedbackMessage message="Aucun membre trouvé" type="info" />
        ) : (
          <UsersListView userInfoList={otherUsers} />
        )}
      </div>
    </div>
  );
};

export default UsersSearchPage;
