import { User } from "better-auth";
import { headers } from "next/headers";
import { auth } from "./auth";

export const getCurrentUser = async (): Promise<User | undefined> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
};
