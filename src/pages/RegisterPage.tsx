import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import Title from "@/components/TitleH1";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { addOrUpdateUserFirebase, registerFirebase } from "@/firebase";
import { emptyUser } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type LoginFormType = {
  email: string;
  password: string;
  verifyPassword: string;
};

const registerFormSchema = z
  .object({
    email: z.string().email({
      message: "Entrez une adresse email valide.",
    }),
    password: z.string().min(6, {
      message: "Entrez un mot de passe d'au moins 6 caractères.",
    }),
    verifyPassword: z.string(),
  })
  .refine((data) => data.password === data.verifyPassword, {
    message: "Les mots de passe ne correspondent pas.",
    path: ["verifyPassword"],
  });

const RegisterPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      verifyPassword: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormType> = (data) => {
    console.log("data", data);
    registerFirebase(data.email, data.password)
      .then((newUser) => {
        addOrUpdateUserFirebase(newUser.uid, {
          ...emptyUser,
          email: data.email,
          id: newUser.uid,
        });
        navigate("/");
      })
      .catch((error) => {
        console.error("Firebase register error:", error.message);
        setFirebaseError("L'email est déjà utilisé.");
      });
  };

  return (
    <div className="h-screen sm:p-2">
      <Title>Inscription</Title>
      {firebaseError && (
        <FeedbackMessage message={firebaseError} type="error" />
      )}

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
                  <Input placeholder="Mot de passe" {...field} />
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
            S'inscrire
          </Button>
        </form>
      </Form>
      <p>Déja inscrit ?</p>
      <CustomLinkButton className="bg-secondary/70" linkTo="/login">
        Se connecter
      </CustomLinkButton>
    </div>
  );
};

export default RegisterPage;
