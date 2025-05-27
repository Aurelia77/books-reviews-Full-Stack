import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";
import { resend } from "./resend";

const client = prisma;

export const auth = betterAuth({
  database: prismaAdapter(client, {
    provider: "postgresql",
  }),
  appName: "book-reviews-fullstack",
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      try {
        await resend.emails.send({
          to: user.email,
          from: "BookReviews <onboarding@resend.dev>", // adresse test de Resend
          subject: "Redéfinir ton mot de passe BookReviews",
          text: `Hello, clique ici pour redéfinir ton mot de passe : ${url}`,
        });
      } catch (e) {
        console.error("Erreur Resend:", e);
      }
    },
  },
  plugins: [nextCookies()],
});
