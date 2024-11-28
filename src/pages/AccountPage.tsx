import CustomLinkButton from "@/components/CustomLinkButton";
import Title from "@/components/TitleH1";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  addOrUpdateUserFirebase,
  getDocsByQueryFirebase,
  uploadImageOnFirebase,
} from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { AccountFormType, UserType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";

const accountFormSchema = z.object({
  username: z.string().min(3, {
    message: "Entrez un nom d'au moins 3 caractères.",
  }),
  imgURL: z
    .string()
    .refine(
      (value) => value === "" || z.string().url().safeParse(value).success,
      {
        message: "Entrez une URL valide ou laissez vide.",
      }
    ),
  // description: z.string().optional(),
  //   password: z.string().min(8, {
  //     message: "Entrez un mot de passe d'au moins 8 caractères.",
  //   }),
});

const AccountPage = (): JSX.Element => {
  const [userInfo, setUserInfo] = useState<UserType | null>(null);
  const { user } = useUserStore();

  console.log("USER INFO", userInfo);

  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);

  const uploadImage = () => {
    setIsImageLoading(true);
    if (imageUpload) {
      console.log("!!!");
      uploadImageOnFirebase(imageUpload)
        .then((url) => {
          setIsImageLoading(false);
          if (url) form.setValue("imgURL", url);
        })
        .catch((error) => {
          console.error("Erreur lors du téléchargement de l'image => ", error);
        });
    }
  };

  const form = useForm<AccountFormType>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      username: "",
      imgURL: "",
      //description: "",
      //password: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (userInfo) {
      reset({
        username: userInfo.username,
        imgURL: userInfo.imgURL,
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
      <p>Identifiant : {user?.email}</p>
      <Form {...form}>
        <form
          className="mb-20 flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="username"
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
            name="imgURL"
            render={() => (
              <FormItem>
                <FormLabel>Image du profil</FormLabel>
                <FormControl>
                  <>
                    <Input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageUpload(e.target.files[0]);
                        }
                      }}
                      className="cursor-pointer"
                    />
                    {isImageLoading ? (
                      // <Spinner />
                      <p>Chargement...</p>
                    ) : (
                      imageUpload && (
                        <Button type="button" onClick={uploadImage}>
                          Télécharger l'image
                        </Button>
                      )
                    )}
                  </>
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
                <FormLabel>Image de profil</FormLabel>
                <FormControl>
                  <div className="flex flex-col items-center gap-4">
                    <Input
                      type="file"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          setImageUpload(e.target.files[0]);
                        }
                      }}
                      className="cursor-pointer"
                    />
                    {isImageLoading ? (
                      //<Spinner />
                      <p>Chargement...</p>
                    ) : (
                      imageUpload && (
                        <Button type="button" onClick={uploadImage}>
                          Télécharger l'image
                        </Button>
                      )
                    )}
                    {/* <Label htmlFor="picture" className="cursor-pointer">
                      <div className="relative size-24 overflow-hidden rounded-full border-2 border-primary hover:opacity-80">
                        <img
                          src={userInfo?.imgURL || defaultUserImage}
                          alt="Photo de profil"
                          className="size-full object-cover"
                        />
                      </div>
                    </Label>
                    <Input
                      id="picture"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      // onChange={(e) => {
                      //   const file = e.target.files?.[0];
                      //   if (file) {
                      //     uploadImageOnFirebase(file)?.then((url) => {
                      //       if (url && userInfo) {
                      //         addOrUpdateUserFirebase(user?.uid ?? "", {
                      //           ...userInfo,
                      //           imgURL: url,
                      //         });
                      //       }
                      //     });
                      //   }
                      // }}
                      {...field}
                    /> 
                    
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

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

          {form.watch("imgURL") && (
            <img src={form.watch("imgURL") ?? ""} alt="Image sélectionnée" />
          )}

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
