import CustomLinkButton from "@/components/CustomLinkButton";
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
import { addOrUpdateUserFirebase, registerFirebase } from "@/firebase";
import { emptyUser } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
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
  const form = useForm<LoginFormType>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      verifyPassword: "",
    },
  });

  const onSubmit: SubmitHandler<LoginFormType> = (data) => {
    //console.log(data);
    registerFirebase(data.email, data.password).then((newUser) => {
      addOrUpdateUserFirebase(newUser.uid, {
        ...emptyUser,
        email: data.email,
        id: newUser.uid,
      });
      console.log("newUser", newUser.uid);
    });
  };

  return (
    <div className="sm:p-2">
      <Title>Inscription</Title>
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
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
          <Button type="submit">S'inscrire</Button>
        </form>
      </Form>
      <p>Déja inscrit ?</p>
      <CustomLinkButton linkTo="/login">Se connecter</CustomLinkButton>
    </div>
  );
};

export default RegisterPage;
