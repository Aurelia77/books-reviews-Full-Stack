import BookInfos from "@/components/BookInfos";
import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addUserIdToMyFriendsFirebase,
  deleteUserIdToMyFriendsFirebase,
  getDocsByQueryFirebase,
  isUserMyFriendFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { MyInfoBookType, UserType } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const UserAccountPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserType>();
  const [isFriend, setIsFriend] = useState<boolean>();
  console.log("isFriend", isFriend);

  //console.log("USER INFO", userInfo);

  const userInUrl = useParams<{ userId: string }>();
  console.log("userId", userInUrl);

  const { currentUser } = useUserStore();

  useEffect(() => {
    getDocsByQueryFirebase<UserType>("users", "id", userInUrl.userId)
      .then((users) => {
        setUserInfo(users[0]);
        return users[0];
      })
      .then((user) => isUserMyFriendFirebase(user.id, currentUser?.uid))
      .then((isFriend) => setIsFriend(isFriend));
  }, [userInUrl]);

  const addFriendHandler = () => {
    addUserIdToMyFriendsFirebase(
      currentUser?.uid,
      userInUrl.userId,
      userInfo?.userName
    ).then(() => setIsFriend(true));
  };

  const deleteFriendHandler = () => {
    deleteUserIdToMyFriendsFirebase(currentUser?.uid, userInUrl.userId).then(
      () => setIsFriend(false)
    );
  };

  return (
    <div className="min-h-screen sm:p-2" key={userInUrl.userId}>
      <Title>{userInfo?.userName ?? ""}</Title>
      <p>{isFriend ? "Ami" : "Non ami"}</p>
      {isFriend ? (
        <Button onClick={deleteFriendHandler}>Supprimer de mes amis</Button>
      ) : (
        <Button onClick={addFriendHandler}>Ajouter à mes amis</Button>
      )}
      {userInfo?.imgURL && (
        <img
          src={userInfo?.imgURL}
          alt="Image sélectionnée"
          width="150"
          height="150"
          className="m-auto mb-4"
        />
      )}
      <div className="m-2">
        <Label>{userInfo?.description}</Label>
      </div>

      <hr className="my-4 border-t border-primary" />

      <Title level={2}>Livres</Title>
      <Tabs defaultValue="booksRead" className="mt-4">
        <TabsList>
          <TabsTrigger value="booksRead">Lus</TabsTrigger>
          <TabsTrigger value="booksInProgress">En cours</TabsTrigger>
          <TabsTrigger value="booksToRead">À lire</TabsTrigger>
        </TabsList>
        <TabsContent value="booksRead">
          {userInfo?.booksRead && userInfo?.booksRead?.length > 0 ? (
            userInfo?.booksRead
              .sort((a, b) => (a.bookYear ?? 0) - (b.bookYear ?? 0))
              .map((book: MyInfoBookType) => (
                <BookInfos
                  key={book.bookId}
                  bookId={book.bookId}
                  userIdNotToCount={userInfo.id}
                />
              ))
          ) : (
            <FeedbackMessage
              message="Aucun livre pour l'instant"
              className="mt-8"
            />
          )}
        </TabsContent>
        <TabsContent value="booksInProgress">
          {userInfo?.booksInProgress &&
          userInfo?.booksInProgress?.length > 0 ? (
            userInfo?.booksInProgress.map((book: MyInfoBookType) => (
              <BookInfos
                key={book.bookId}
                bookId={book.bookId}
                userIdNotToCount={userInfo.id}
              />
            ))
          ) : (
            <FeedbackMessage
              message="Aucun livre pour l'instant"
              className="mt-8"
            />
          )}
        </TabsContent>
        <TabsContent value="booksToRead">
          {userInfo?.booksToRead && userInfo?.booksToRead?.length > 0 ? (
            userInfo?.booksToRead.map((book: MyInfoBookType) => (
              <BookInfos
                key={book.bookId}
                bookId={book.bookId}
                userIdNotToCount={userInUrl.userId}
              />
            ))
          ) : (
            <FeedbackMessage
              message="Aucun livre pour l'instant"
              className="mt-8"
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserAccountPage;
