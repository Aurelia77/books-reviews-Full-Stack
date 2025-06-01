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
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type LoginFormType = {
  email: string;
  password: string;
};

const loginFormSchema = z.object({
  email: z.string().email({
    message: "Entrez une adresse email valide.",
  }),
  password: z.string().min(6, {
    message: "Entrez un mot de passe d'au moins 6 caractères.",
  }),
});

const SignIn = () => {
  const router = useRouter();

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("unauthorized") === "1") {
      toast.error("Vous devez être connecté pour accéder à cette page.");
    }
  }, [searchParams]);

  const onSubmit: SubmitHandler<LoginFormType> = (data) => {
    const { email, password } = data;

    authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onSuccess: () => {
          router.push("/");
          router.refresh(); // to update the navbar
        },
        onError: (ctx: { error: { message: string } }) => {
          console.error("Erreur côté client :", ctx.error);
          toast.error(ctx.error.message);
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
          <Button
            type="submit"
            className="m-auto mt-7 w-4/5 text-lg font-semibold"
          >
            Se connecter
          </Button>
        </form>
      </Form>
      <CustomLinkButton
        className="mb-4 bg-secondary/60"
        linkTo="/resetpassword"
      >
        Mot de passe oublié ?
      </CustomLinkButton>
      <CustomLinkButton className="bg-primary/60" linkTo="/auth/signup">
        Inscription
      </CustomLinkButton>
    </div>
  );
};

export default SignIn;
