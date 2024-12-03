import { getFriendsWhoReadBookFirebase } from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CardFooter } from "./ui/card";

const FriendsWhoReadBook = ({
  bookId,
  userIdNotToCount,
}: {
  bookId: string;
  userIdNotToCount?: string;
}) => {
  const [friendsWhoReadBook, setFriendsWhoReadBook] = useState<
    {
      id: string;
      userName: string;
    }[]
  >([]);

  const { currentUser } = useUserStore();

  useEffect(() => {
    getFriendsWhoReadBookFirebase(
      bookId,
      currentUser?.uid,
      userIdNotToCount
    ).then((users) => {
      //console.log("xxxFRIENDS", users);
      const friends = users.map((user) => ({
        id: user.id,
        userName: user.userName,
      }));
      setFriendsWhoReadBook(friends);
    });
  }, [bookId, userIdNotToCount]);

  return (
    friendsWhoReadBook.length > 0 && (
      <CardFooter className="bg-gray-500/40">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
              //className="relative"
              >
                <Star
                  size={48}
                  strokeWidth={3}
                  className="absolute left-[3.8rem] top-3 drop-shadow-sm text-stroke-lg"
                  color="white"
                />
                <Star
                  className="absolute left-16 top-[0.95rem] drop-shadow-sm text-stroke-lg"
                  size={42}
                  color="gray"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent className="-mt-12 ml-8 rounded-md bg-foreground/50 px-2 py-1 text-secondary">
              <p>Livre lu par un ou plusieurs de vos amis</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        {/* <Star
        size={65}
        strokeWidth={2}
        className="absolute left-[3.25rem] top-[0.54rem] drop-shadow-sm text-stroke-lg"
        color="white"
      />
      <Star
        className="absolute left-[3.56rem] top-[0.9rem] drop-shadow-sm text-stroke-lg"
        size={55}
        color="gray"
      /> */}
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
    )
  );
};

export default FriendsWhoReadBook;
