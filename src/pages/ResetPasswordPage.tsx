//import FeedbackMessage from "@/components/FeedbackMessage";
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
import { sendPasswordResetEmailFirebase } from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsRight } from "lucide-react";
//import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

type forgotPasswordType = {
  email: string;
};

const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Entrez une adresse email valide.",
  }),
});

const ResetPasswordPage = (): JSX.Element => {
  //const navigate = useNavigate();
  //const [firebaseError, setFirebaseError] = useState<string | null>(null);

  const { toast } = useToast();

  const form = useForm<forgotPasswordType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit: SubmitHandler<forgotPasswordType> = (data) => {
    console.log("data", data);
    sendPasswordResetEmailFirebase(data.email);
    toast({
      title: "Mail de réinitialisation envoyé",
      description:
        "Si vous ne voyez pas le mail, pensez à vérifier vos spams !",
    });
  };

  return (
    <div className="min-h-screen sm:p-2 max-w-3xl md:m-auto md:mt-8">
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
        <Link to="/login" className="text-foreground font-semibold flex gap-5">
          <p>Se connecter ?</p>
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

export default ResetPasswordPage;
