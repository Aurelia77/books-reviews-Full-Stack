import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
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
import {
  addOrUpdateUserFirebase,
  registerFirebase,
} from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { EMPTY_USER } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

type RegisterFormType = {
  email: string;
  userName: string;
  password: string;
  verifyPassword: string;
};

const registerFormSchema = z
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
  const { toast } = useToast();

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      userName: "",
      password: "",
      verifyPassword: "",
    },
  });

  const onSubmit: SubmitHandler<RegisterFormType> = (data) => {
    console.log("data", data);
    registerFirebase(data.email, data.password)
      .then((newUser) => {
        addOrUpdateUserFirebase(newUser.uid, {
          ...EMPTY_USER,
          id: newUser.uid,
          email: data.email,
          userName: data.userName,
          isAdmin: data.email === "aurelia.h@hotmail.fr",
        });
        navigate("/");
      })
      .then(() => {
        toast({
          title: "Inscription réussie",
          description:
            "Vous êtes connecté, bonne navigation au travers des livres !",
        });
      })
      .catch((error) => {
        console.error("Firebase register error:", error.message);
        setFirebaseError("L'email est déjà utilisé.");
      });
  };

  return (
    <div className="min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
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
          <Button
            type="submit"
            className="m-auto mt-7 w-4/5 text-lg font-semibold"
          >
            S'inscrire
          </Button>
        </form>
      </Form>
      <CustomLinkButton className="mb-4 bg-primary/50" linkTo="/login">
        Connexion
      </CustomLinkButton>

      {/* <p>Déja inscrit ?</p>
      <CustomLinkButton className="bg-secondary/70" linkTo="/login">
        Se connecter
      </CustomLinkButton> */}
    </div>
  );
};

export default RegisterPage;
