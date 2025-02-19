import { getUsersWhoReadBookFirebase } from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Stars from "./Stars";
import { CardFooter } from "./ui/card";

const FriendsWhoReadBook = ({
  bookId,
  userViewId,
}: {
  bookId: string;
  userViewId?: string;
}) => {
  const [friendsWhoReadBook, setFriendsWhoReadBook] = useState<
    {
      id: string;
      userName: string;
    }[]
  >([]);
  //console.log("***friendsWhoReadBook", friendsWhoReadBook);

  const { currentUser } = useUserStore();

  useEffect(() => {
    getUsersWhoReadBookFirebase(bookId, currentUser?.uid, userViewId).then(
      (users) => {
        //console.log("xxx***USERS", users);
        const friends = users.map((user) => ({
          id: user.id,
          userName: user.userName,
        }));
        //console.log("xxx***FRIENDS", friends);
        setFriendsWhoReadBook(friends);
      }
    );
  }, [bookId, userViewId, currentUser?.uid]);

  return (
    friendsWhoReadBook.length > 0 && (
      <CardFooter className="flex gap-2 bg-gray-500/40">
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild> */}
        <Stars />
        {/* </TooltipTrigger>
            <TooltipContent className="-mt-12 ml-8 rounded-md bg-foreground/50 px-2 py-1 text-secondary">
              <p>Livre lu par un ou plusieurs de mes amis</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
        <div className="flex flex-row gap-2 ">
          {friendsWhoReadBook.length > 1 ? (
            <p className="font-semibold">Amis qui ont lu ce livre :</p>
          ) : (
            <p className="font-semibold">Ami qui a lu ce livre :</p>
          )}
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
    )
  );
};

export default FriendsWhoReadBook;
