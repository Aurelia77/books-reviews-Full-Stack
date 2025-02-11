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
import { UserType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsRight } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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

const emptyUser: UserType = {
  id: "",
  email: "",
  userName: "",
  imgURL: "",
  description: "",
  booksRead: [],
  booksInProgress: [],
  booksToRead: [],
  friends: [],
};

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
          ...emptyUser,
          email: data.email,
          userName: data.userName,
          id: newUser.uid,
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
    <div className="min-h-screen sm:p-2 max-w-3xl md:m-auto md:mt-8">
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
                    //type="password"
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
                    //type="password"
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
      <div className="bg-primary/20 p-2 mt-4">
        <Link to="/login" className="text-foreground font-semibold flex gap-5">
          <p>Déja inscrit ?</p>
          <ChevronsRight />
          <p>Connectez-vous ici !</p>
        </Link>
      </div>
      {/* <p>Déja inscrit ?</p>
      <CustomLinkButton className="bg-secondary/70" linkTo="/login">
        Se connecter
      </CustomLinkButton> */}
    </div>
  );
};

export default RegisterPage;
