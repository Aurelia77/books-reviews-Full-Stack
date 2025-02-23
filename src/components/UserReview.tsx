import { DEFAULT_USER_IMAGE } from "@/constants";
import { UserBookInfoType } from "@/types";
import { Link } from "react-router-dom";
import StarRating from "./StarRating";
import { Avatar, AvatarImage } from "./ui/avatar";
import { DialogDescription } from "./ui/dialog";

type UserReviewProps = {
  userCommentsAndNote: UserBookInfoType;
};

const UserReview = ({ userCommentsAndNote }: UserReviewProps): JSX.Element => {
  return (
    <div className="p-4">
      <div className="flex justify-between">
        <Link to={`/account/${userCommentsAndNote.userId}`}>
          <div className="flex gap-2">
            <Avatar>
              <AvatarImage
                src={
                  userCommentsAndNote.imgURL !== ""
                    ? userCommentsAndNote.imgURL
                    : DEFAULT_USER_IMAGE
                }
              />
            </Avatar>
            <DialogDescription className="flex underline">
              {userCommentsAndNote.userName}
            </DialogDescription>
          </div>
        </Link>
        {userCommentsAndNote.userNote ? (
          <StarRating value={userCommentsAndNote.userNote} />
        ) : (
          <p>Aucune note</p>
        )}
      </div>

      <DialogDescription>
        {userCommentsAndNote.userComments || " Aucun commentaire"}
      </DialogDescription>
    </div>
  );
};

export default UserReview;
