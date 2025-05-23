"use client";

import { UserTypePlusIsMyFriend } from "@/lib/types";
import { X } from "lucide-react";
import { useState } from "react";
import FeedbackMessage from "./FeedbackMessage";
import Title from "./Title";
import { Input } from "./ui/input";
import UsersListView from "./UsersListView";

type UsersSearchProps = {
  users: UserTypePlusIsMyFriend[];
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
        <Title>Recherche de membres</Title>
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
        <UsersListView userInfoList={filteredUsers} />
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
