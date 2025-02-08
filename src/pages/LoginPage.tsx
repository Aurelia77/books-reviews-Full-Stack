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
import { loginFirebase } from "@/firebase/firestore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsRight } from "lucide-react";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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

const LoginPage = (): JSX.Element => {
  const navigate = useNavigate();
  const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const form = useForm<LoginFormType>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormType> = (data) => {
    loginFirebase(data.email, data.password)
      .then((user) => {
        console.log("user login", user.email);
        navigate("/");
      })
      .catch((error) => {
        console.error("Firebase login error:", error.message);
        setFirebaseError("Email ou mot de passe incorrect.");
      });
  };

  return (
    <div className="min-h-screen sm:p-2 max-w-3xl md:m-auto md:mt-8">
      <Title>Connexion</Title>
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
          <Button
            type="submit"
            className="m-auto mt-7 w-4/5 text-lg font-semibold"
          >
            Se connecter
          </Button>
        </form>
      </Form>
      <div className="bg-primary/20 p-2">
        <Link
          to="/forgotpassword"
          className="text-foreground font-semibold flex gap-5"
        >
          <p>Mot de passe oublié ?</p>
          <ChevronsRight />
          <p>Cliquez ici !</p>
        </Link>
      </div>
      <div className="bg-secondary/20 p-2 mt-4">
        <Link
          to="/register"
          className="text-foreground font-semibold flex gap-5"
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

export default LoginPage;
