import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

const client = prisma;

export const auth = betterAuth({
  database: prismaAdapter(client, {
    provider: "postgresql",
  }),
  appName: "book-reviews-fullstack",
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
