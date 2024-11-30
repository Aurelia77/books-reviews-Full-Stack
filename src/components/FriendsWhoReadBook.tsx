import { FriendType } from "@/types";
import { Link } from "react-router-dom";
import { CardFooter } from "./ui/card";

const FriendsWhoReadBook = ({
  friendsWhoReadBook,
}: {
  friendsWhoReadBook: FriendType[];
}) => {
  console.log("!!!FRIENDS WHO READ BOOK");

  return (
    <CardFooter className="bg-gray-500/40">
      <div className="flex flex-row gap-2 ">
        <p className="font-semibold">Lu par :</p>
        {friendsWhoReadBook.map((friend, index) => {
          console.log("**friend", friend);
          return (
            <>
              <Link
                key={index}
                to={`/account/${friend.id}`}
                className="font-semibold text-muted"
              >
                {friend.userName}
              </Link>
            </>
          );
        })}
      </div>
    </CardFooter>
  );
};

export default FriendsWhoReadBook;
