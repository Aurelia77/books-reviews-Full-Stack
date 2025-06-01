import { AppUserType, UserTypePlusIsMyFriend } from "@/lib/types";
import Link from "next/link";
import FeedbackMessage from "./FeedbackMessage";
import FriendSparkles from "./FriendSparkles";
import { Avatar, AvatarImage } from "./ui/avatar";

const UsersListView = ({
  userInfoList,
}: {
  userInfoList: (AppUserType | UserTypePlusIsMyFriend)[];
}) => {
  return userInfoList.length > 0 ? (
    <ul className="flex flex-col gap-8">
      {userInfoList.map((user: AppUserType) => (
        <li key={user.id} className="flex items-center gap-6">
          <Link
            href={`/users/${user.id}`}
            className="relative flex items-center gap-3 p-3"
          >
            {user.imgURL !== "" ? (
              <Avatar>
                <AvatarImage src={user.imgURL} className="object-cover" />
              </Avatar>
            ) : (
              <Avatar className="flex items-center justify-center bg-secondary">
                {user.userName.charAt(0).toUpperCase()}
              </Avatar>
            )}
            <p className="font-semibold text-muted">{user.userName}</p>
          </Link>

          {"isMyFriend" in user && user.isMyFriend ? (
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
  );
};

export default UsersListView;
