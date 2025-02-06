import { DEFAULT_USER_IMAGE } from "@/constants";
import { UserType } from "@/types";
import { Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";

const UsersListView = ({
  userInfoList,
}: {
  userInfoList: UserType[];
}): JSX.Element => {
  return (
    // <ul className="flex items-center gap-4 p-5">

    <ul className="pb-40">
      {userInfoList.map((friend: UserType) => (
        <li key={friend.id}>
          <Link
            to={`/account/${friend.id}`}
            className="relative flex items-center gap-4 p-3"
          >
            <Avatar>
              <AvatarImage
                src={friend.imgURL !== "" ? friend.imgURL : DEFAULT_USER_IMAGE}
              />
            </Avatar>
            <p className="font-semibold text-muted">{friend.userName}</p>
            {friend.isMyFriend && (
              <div>
                {friend.isMyFriend ? (
                  <div className="flex gap-2">
                    <Sparkles />
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
  );

  {
    /*  friendsInfo.map((friendInfo, index) => (
          <Link
            key={index}
            to={`/account/${friendInfo.id}`}
            className="font-semibold text-muted"
          >
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src={friendInfo.imgURL} />
              </Avatar>
              <p>{friendInfo.userName}</p>
            </div>
          </Link>
        )) */
  }
};

export default UsersListView;
