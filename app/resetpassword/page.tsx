"use client";

import Title from "@/components/Title";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
// import { sendPasswordResetEmailFirebase } from "@/firebase/firestore";
// import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsRight } from "lucide-react";
//import { useState } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type ForgotPasswordType = {
  email: string;
};

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Entrez une adresse email valide.",
  }),
});

const ResetPasswordPage = () => {
  //const navigate = useNavigate();
  //const [firebaseError, setFirebaseError] = useState<string | null>(null);

  // const { toast } = useToast();

  const form = useForm<ForgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<ForgotPasswordType> = async (data) => {
    console.log("data", data);
    try {
      const res = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
        }),
      });
      if (!res.ok) {
        throw new Error("Erreur lors de la demande.");
      }
      toast.success(
        "Un mail de réinitialisation a été envoyé à votre adresse."
      );
    } catch (e) {
      toast.error("Erreur lors de la demande.");
    }
  };

  return (
    <div className="min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <Title>Réinitialiser le mot de passe</Title>
      {/* {firebaseError && (
        <FeedbackMessage message={firebaseError} type="error" />
      )} */}
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
          <Button
            type="submit"
            className="m-auto mt-7 w-4/5 text-lg font-semibold"
          >
            Recevoir mail de réinitialisation
          </Button>
        </form>
      </Form>
      <div className="bg-primary/20 p-2">
        <Link
          href="/auth/signin"
          className="flex gap-5 font-semibold text-foreground"
        >
          <p>Se connecter ?</p>
          <ChevronsRight />
          <p>Cliquez ici !</p>
        </Link>
      </div>
      <div className="mt-4 bg-secondary/20 p-2">
        <Link
          href="/auth/signup"
          className="flex gap-5 font-semibold text-foreground"
        >
          <p>Pas encore inscrit ?</p>
          <ChevronsRight />
          <p>Inscrivez-vous ici !</p>
        </Link>
      </div>
      {/* <p className="ml-1">Pas encore inscrit ?</p>
      <CustomLinkButton className="bg-secondary/70" linkTo="/register">
        S'inscrire
      </CustomLinkButton> */}
    </div>
  );
};

export default ResetPasswordPage;
