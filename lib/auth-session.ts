import { headers } from "next/headers";
import { auth } from "./auth";
import { User } from "better-auth";

export const getUser = async (): Promise<User | undefined> => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
};
