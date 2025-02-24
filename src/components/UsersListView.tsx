import { DEFAULT_USER_IMAGE } from "@/constants";
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
          <li key={friend.id}>
            <Link
              to={`/account/${friend.id}`}
              className="relative flex items-center gap-4 p-3"
            >
              <Avatar>
                <AvatarImage
                  src={
                    friend.imgURL !== "" ? friend.imgURL : DEFAULT_USER_IMAGE
                  }
                />
              </Avatar>
              <p className="font-semibold text-muted">{friend.userName}</p>
              {friend.isMyFriend && (
                <div>
                  {friend.isMyFriend ? (
                    <div className="flex gap-2">
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
            </Link>
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
