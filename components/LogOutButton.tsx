"use client";

import { authClient } from "@/lib/auth-client";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";
import { ComponentPropsWithRef, useState } from "react";

const LogOutButton = (props: ComponentPropsWithRef<"button">) => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  return (
    <button
      {...props} // à mettre avant onClick pour pas que ça l'écrase
      onClick={() =>
        authClient.signOut(
          {},
          {
            onRequest: () => {
              setIsLoading(true);
            },
            onSuccess: () => {
              setIsLoading(false);
              //router.push("/");
              router.refresh(); // la NavBar se met à jour
            },
            onError: (ctx) => {
              console.error(ctx.error.message);
            },
          }
        )
      }
      className="cursor-pointer"
    >
      {isLoading ? (
        <div className="w-7 h-7 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      ) : (
        <X />
      )}
    </button>
  );
};

export default LogOutButton;
