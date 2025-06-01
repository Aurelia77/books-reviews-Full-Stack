"use client";

import CustomLinkButton from "@/components/CustomLinkButton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type SignUpFormType = {
  email: string;
  userName: string;
  password: string;
  verifyPassword: string;
};

const signUpFormSchema = z
  .object({
    email: z.string().email({
      message: "Entrez une adresse email valide.",
    }),
    userName: z
      .string()
      .min(2, {
        message: "Le pseudo doit contenir au moins 2 caractères.",
      })
      .max(10, {
        message: "Le pseudo doit contenir au maximum 10 caractères.",
      }),
    password: z.string().min(8, {
      message: "Entrez un mot de passe d'au moins 8 caractères.",
    }),
    verifyPassword: z.string(),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["verifyPassword"],
  });

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<SignUpFormType>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      verifyPassword: "",
    },
  });

  const addAppUser = async (id: string, email: string, userName: string) => {
    try {
      const response = await fetch("/api/appUsers/new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, email, userName }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erreur lors de l'ajout dans AppUser :", errorData.error);
        toast.error("Une erreur est survenue lors de l'ajout dans AppUser.");
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API AppUser :", error);
      toast.error("Une erreur est survenue lors de l'inscription.");
    }
  };

  const onSubmit: SubmitHandler<SignUpFormType> = (data) => {
    setIsLoading(true);

    authClient.signUp.email(
      {
        email: data.email,
        password: data.password,
        name: data.userName,
        callbackURL: "/", // Redirect URL after email verification
      },
      {
        onRequest: () => {
          setIsLoading(true);
        },
        onSuccess: async (user) => {
          // retrieve the created user's id to use it in addAppUser => so we have the same ids in AppUser and BetterAuth tables
          const userId = user.data.user.id;

          await addAppUser(userId, data.email, data.userName);

          router.push("/");
          router.refresh(); // to update the navbar
          toast.success("Inscription réussie", {
            description:
              "Vous êtes connecté, bonne navigation au travers des livres !",
          });
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
          setIsLoading(false);
        },
      }
    );
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="mb-20 flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="userName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Pseudo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Mot de passe"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="verifyPassword"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Vérification du mot de passe"
                    {...field}
                    type="password"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {isLoading ? (
            <div className="flex justify-center mt-7">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <Button
              type="submit"
              className="m-auto mt-7 w-4/5 text-lg font-semibold"
            >
              S'inscrire
            </Button>
          )}
        </form>
      </Form>
      <CustomLinkButton className="mb-4 bg-primary/50" linkTo="/auth/signin">
        Connexion
      </CustomLinkButton>
    </div>
  );
};

export default SignUp;
