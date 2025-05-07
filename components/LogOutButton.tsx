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
      {...props} // à mettre avant le onClick pour pas que ça l'écrase
      onClick={() =>
        authClient.signOut(
          {},
          {
            onRequest: () => {
              setIsLoading(true);
            },
            onSuccess: () => {
              setIsLoading(false);
              router.push("/");
              router.refresh();
            },
            onError: (ctx) => {
              console.error(ctx.error.message);
            },
          }
        )
      }
      {...props}
    >
      {isLoading ? "Logging out..." : <X />}
    </button>
  );
};

export default LogOutButton;
