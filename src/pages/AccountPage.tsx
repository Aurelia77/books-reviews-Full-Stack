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
import useUserStore from "@/hooks/useUserStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

type AccountFormType = {
  displayName: string;
  email: string;
  imgURL: string;
  description: string;
  //password: string;                                               // plus tard
};

const accountFormSchema = z.object({
  displayName: z.string().min(3, {
    message: "Entrez un nom d'au moins 3 caractères.",
  }),
  email: z.string().email({
    message: "Entrez une adresse email valide.", // mettre qu'on ne pt pas la changer !
  }),
  imgURL: z.string().url({
    message: "Entrez une URL valide.",
  }),
  description: z.string().optional(),
  //   password: z.string().min(8, {
  //     message: "Entrez un mot de passe d'au moins 8 caractères.",
  //   }),
});

const AccountPage = (): JSX.Element => {
  const form = useForm<AccountFormType>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      displayName: "",
      email: "",
      imgURL: "",
      description: "",
      //password: "",
    },
  });

  const onSubmit: SubmitHandler<AccountFormType> = (data) => {
    console.log(data);
  };

  const { user } = useUserStore();

  return (
    <div className="sm:p-2">
      <Title>Mon compte</Title>
      <p>Email : {user?.email}</p>
      <Form {...form}>
        <form
          className="mb-20 flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="displayName"
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
            name="imgURL"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="lien img" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="m-auto mt-7 w-4/5 text-lg font-semibold"
          >
            Enregistrer
          </Button>
        </form>
      </Form>
      <CustomLinkButton className="bg-secondary/70" linkTo="/mybooks">
        Mes livres
      </CustomLinkButton>
    </div>
  );
};

export default AccountPage;
