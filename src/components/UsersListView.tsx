import { UserType } from "@/types";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import FeedbackMessage from "./FeedbackMessage";
import { Avatar, AvatarImage } from "./ui/avatar";

const UsersListView = ({
  userInfoList,
}: {
  userInfoList: UserType[];
}): JSX.Element => {
  return (
    // <ul className="flex items-center gap-4 p-5">

    userInfoList.length > 0 ? (
      <ul>
        {userInfoList.map((friend: UserType) => (
          <li key={friend.id} className="flex items-center gap-8">
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

            {friend.isMyFriend && (
              <div>
                {friend.isMyFriend ? (
                  <div className="flex gap-3">
                    <Sparkles
                      className="bg-friend rounded-full p-1 "
                      size={28}
                      color="black"
                    />
                    <p>Ami</p>
                  </div>
                ) : (
                  <p>NON Ami</p>
                )}
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
