import { headers } from "next/headers";
import { auth } from "./auth"; // path to your Better Auth server instance

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

  return session?.user;
};
