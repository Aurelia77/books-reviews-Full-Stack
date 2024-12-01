import { FriendType } from "@/types";
import { Link } from "react-router-dom";
import { CardFooter } from "./ui/card";

const FriendsWhoReadBook = ({
  friendsWhoReadBook,
}: {
  friendsWhoReadBook: FriendType[];
}) => {
  return (
    <CardFooter className="bg-gray-500/40">
      <div className="flex flex-row gap-2 ">
        <p className="font-semibold">Lu par mes amis :</p>
        {friendsWhoReadBook.map((friend) => (
          <Link
            key={friend.id}
            to={`/account/${friend.id}`}
            className="font-semibold text-muted"
          >
            {friend.userName}
          </Link>
        ))}
      </div>
    </CardFooter>
  );
};

export default FriendsWhoReadBook;
