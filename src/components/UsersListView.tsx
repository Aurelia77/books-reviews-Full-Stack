import { UserType } from "@/types";
import { Link } from "react-router-dom";
import FeedbackMessage from "./FeedbackMessage";
import FriendSparkles from "./FriendSparkles";
import { Avatar, AvatarImage } from "./ui/avatar";

const UsersListView = ({
  userInfoList,
}: {
  userInfoList: UserType[];
}): JSX.Element => {
  return (
    // <ul className="flex items-center gap-4 p-5">

    userInfoList.length > 0 ? (
      <ul className="flex flex-col gap-8">
        {userInfoList.map((friend: UserType) => (
          <li key={friend.id} className="flex items-center gap-6">
            <Link
              to={`/account/${friend.id}`}
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

            {friend.isMyFriend && friend.isMyFriend && (
              <div className="flex gap-4 items-center">
                <FriendSparkles />
                <p>Ami</p>
              </div>
            )}
          </li>
        ))}
      </ul>
    ) : (
      <FeedbackMessage
        message="Aucun autre utilisateur pour l'instant."
        type="info"
        className="p-5"
      />
    )
  );
};

export default UsersListView;
