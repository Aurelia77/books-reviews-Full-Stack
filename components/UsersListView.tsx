import { UserType, UserTypePlusIsMyFriend } from "@/lib/types";
import Link from "next/link";
import FeedbackMessage from "./FeedbackMessage";
import FriendSparkles from "./FriendSparkles";
import { Avatar, AvatarImage } from "./ui/avatar";

const UsersListView = ({
  userInfoList,
}: {
  userInfoList: (UserType | UserTypePlusIsMyFriend)[];
}) => {
  ////////////////////////////////////////
  ////////////////////////////////////////
  userInfoList.map((friend: UserType) => {
    console.log(friend);
    console.log(friend.userName);
  });
  ////////////////////////////////////////
  ////////////////////////////////////////

  return (
    // <ul className="flex items-center gap-4 p-5">

    userInfoList.length > 0 ? (
      <ul className="flex flex-col gap-8">
        {userInfoList.map((friend: UserType) => (
          <li key={friend.id} className="flex items-center gap-6">
            <Link
              href={`/users/${friend.id}`}
              className="relative flex items-center gap-3 p-3"
            >
              {friend.imgURL !== "" ? (
                <Avatar>
                  <AvatarImage src={friend.imgURL} className="object-cover" />
                </Avatar>
              ) : (
                <Avatar className="flex items-center justify-center bg-secondary">
                  {friend.userName.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <p className="font-semibold text-muted">{friend.userName}</p>
            </Link>

            {"isMyFriend" in friend && friend.isMyFriend ? (
              <div className="flex items-center gap-4">
                <FriendSparkles />
                <p>Ami</p>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    ) : (
      <FeedbackMessage
        message="Aucun membre trouvé."
        type="info"
        className="p-5"
      />
    )
  );
};

export default UsersListView;
