import { DEFAULT_USER_IMAGE } from "@/constants";
import { UserType } from "@/types";
import { Link } from "react-router-dom";
import { Avatar, AvatarImage } from "./ui/avatar";

const UsersListView = ({
  userInfoList,
}: {
  userInfoList: UserType[];
}): JSX.Element => {
  return (
    <ul className="pb-40">
      {userInfoList.map((friend) => (
        <li key={friend.id}>
          <Link
            to={`/account/${friend.id}`}
            className="flex items-center gap-2"
          >
            <Avatar>
              <AvatarImage
                src={friend.imgURL !== "" ? friend.imgURL : DEFAULT_USER_IMAGE}
              />
            </Avatar>
            <p className="font-semibold text-muted">{friend.userName}</p>
            {friend.isMyFriend && (
              <p>{friend.isMyFriend ? "Ami" : "Non ami"}</p>
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
