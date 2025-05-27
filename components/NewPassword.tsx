"use client";

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
import { useRouter, useSearchParams } from "next/navigation";
// import { sendPasswordResetEmailFirebase } from "@/firebase/firestore";
// import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsRight } from "lucide-react";
//import { useState } from "react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

type NewPasswordType = {
  password: string;
};

const newPasswordSchema = z.object({
  password: z
    .string()
    .min(8, {
      message: "Le mot de passe doit contenir au moins 8 caractères.",
    })
    .max(20, {
      message: "Le mot de passe doit contenir au maximum 20 caractères.",
    }),
});

const ResetPassword = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const form = useForm<NewPasswordType>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit: SubmitHandler<NewPasswordType> = async (data) => {
    if (!token) {
      toast.error("Lien de réinitialisation invalide.");
      return;
    }
    const { error } = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });
    if (error) {
      toast.error("Erreur lors du changement de mot de passe.");
    } else {
      toast.success("Mot de passe modifié avec succès !");
      router.push("/auth/signin");
    }
  };

  return (
    <div>
      {/* <form onSubmit={handleSubmit}>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nouveau mot de passe"
      />
      <button type="submit">Valider</button>
    </form> */}

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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Nouveau mot de passe"
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
            Valider
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
    </div>
  );
};

export default ResetPassword;
