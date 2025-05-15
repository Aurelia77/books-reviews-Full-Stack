"use client";

import { UserType } from "@/lib/types";
import { X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import FeedbackMessage from "./FeedbackMessage";
import FriendSparkles from "./FriendSparkles";
import Title from "./Title";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Input } from "./ui/input";

type UsersSearchProps = {
  users: UserType[];
};

const UsersSearch = ({ users }: UsersSearchProps) => {
  const [userNameInput, setUserNameInput] = useState("");

  // Filtrer les utilisateurs en fonction de la recherche
  const filteredUsers = users.filter((user) =>
    user.userName.toLowerCase().includes(userNameInput.toLowerCase())
  );

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="sticky top-10 z-10 flex flex-col gap-3 bg-background/70 duration-500">
        <Title level={2}>Recherche de membres</Title>
        <div className="relative">
          <Input
            value={userNameInput}
            //ref={titleInputRef}
            placeholder="Nom"
            onChange={(e) => setUserNameInput(e.target.value)}
          />
          <X
            onClick={() => setUserNameInput("")}
            className="absolute right-2 top-2 cursor-pointer"
          />
        </div>
      </div>
      {filteredUsers.length > 0 ? (
        <ul className="flex flex-col gap-8">
          {filteredUsers.map((user: UserType) => (
            <li key={user.id} className="flex items-center gap-6">
              <Link
                href={`/users/${user.id}`}
                className="relative flex items-center gap-3 p-3"
              >
                {user.imgURL !== "" ? (
                  <Avatar>
                    <AvatarImage src={user.imgURL} className="object-cover" />
                  </Avatar>
                ) : (
                  <Avatar className="flex items-center justify-center bg-secondary">
                    {user.userName.charAt(0).toUpperCase()}
                  </Avatar>
                )}
                <p className="font-semibold text-muted">{user.userName}</p>
              </Link>

              {/* /////////////////////////////////////////////// */}
              {user.isMyFriend ? (
                <p>Ami</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  NON !!! (à supp)
                </p>
              )}

              {user.isMyFriend && user.isMyFriend && (
                <div className="flex items-center gap-4">
                  <FriendSparkles />
                  <p>Ami</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <FeedbackMessage
          message="Aucun membre trouvé !"
          type="info"
          className="p-5"
        />
      )}
    </div>
  );
};

export default UsersSearch;
