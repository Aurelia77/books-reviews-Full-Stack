import CustomLinkButton from "@/components/CustomLinkButton";
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
import { addOrUpdateUserFirebase, getDocsByQueryFirebase } from "@/firebase";
import useUserStore from "@/hooks/useUserStore";
import { AccountFormType, UserType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const accountFormSchema = z.object({
  displayName: z.string().min(3, {
    message: "Entrez un nom d'au moins 3 caractères.",
  }),
  // imgURL: z.string().url({
  //   message: "Entrez une URL valide.",
  // }),
  // description: z.string().optional(),
  //   password: z.string().min(8, {
  //     message: "Entrez un mot de passe d'au moins 8 caractères.",
  //   }),
});

const AccountPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const { user } = useUserStore();

  console.log("USER INFO", userInfo);

  const form = useForm<AccountFormType>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      displayName: "",
      //imgURL: "",
      //description: "",
      //password: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (userInfo) {
      reset({
        displayName: userInfo.username,
      });
    }
  }, [userInfo, reset]);

  const onSubmit: SubmitHandler<AccountFormType> = (data) => {
    console.log(data);
    addOrUpdateUserFirebase(user?.uid ?? "", data);
  };

  useEffect(() => {
    getDocsByQueryFirebase<UserType>("users", "id", user?.uid ?? "").then(
      (users) => {
        setUserInfo(users[0]);
      }
    );
  }, [user]);

  return (
    <div className="h-screen sm:p-2">
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
          {/* <FormField
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
          /> */}
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
