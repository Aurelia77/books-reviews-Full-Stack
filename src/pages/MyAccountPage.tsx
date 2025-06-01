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
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import UsersListView from "@/components/UsersListView";
import {
  addOrUpdateUserFirebase,
  getDocsByQueryFirebase,
  storage,
  uploadImageOnFirebase,
} from "@/firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import useUserStore from "@/hooks/useUserStore";
import { AccountFormType, UserType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";

const accountFormSchema = z.object({
  userName: z.string().min(2, {
    message: "Entrez un nom d'au moins 2 caractères.",
  }),
  imgURL: z
    .string()
    .refine(
      (value) => value === "" || z.string().url().safeParse(value).success,
      {
        message: "Entrez une URL valide ou laissez vide.",
      }
    ),
  description: z.string().optional(),
});

const MyAccountPage = (): JSX.Element => {
  const [currentUserInfo, setCurrentUserInfo] = useState<UserType | null>(null);
  const [friendsInfo, setFriendsInfo] = useState<UserType[]>([]);
  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const { currentUser } = useUserStore();
  const { toast } = useToast();

  const uploadImage = () => {
    setIsImageLoading(true);
    if (imageUpload) {
      uploadImageOnFirebase(imageUpload, storage, setProgress)
        .then((url) => {
          setIsImageLoading(false);
          if (url) form.setValue("imgURL", url);
        })
        .catch((error) => {
          console.error("Erreur lors du téléchargement de l'image => ", error);
          setIsImageLoading(false);
        });
    }
  };

  const form = useForm<AccountFormType>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      userName: "",
      imgURL: "",
      description: "",
    },
  });

  const { reset } = form;

  useEffect(() => {
    if (currentUserInfo) {
      reset({
        userName: currentUserInfo.userName,
        imgURL: currentUserInfo.imgURL,
        description: currentUserInfo.description,
      });
    }
  }, [currentUserInfo, reset]);

  useEffect(() => {
    if (currentUser)
      // otherwise error if page reload
      getDocsByQueryFirebase<UserType>("users", "id", currentUser?.uid).then(
        (users) => {
          const userInfo = users[0];
          setCurrentUserInfo(userInfo);

          if (userInfo?.friends) {
            Promise.all(
              userInfo.friends.map((friendId) =>
                getDocsByQueryFirebase<UserType>("users", "id", friendId)
              )
            ).then((friends) => {
              setFriendsInfo(friends.map((friend) => friend[0]));
            });
          }
        }
      ); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser?.uid]);

  const onSubmit: SubmitHandler<AccountFormType> = (data) => {
    addOrUpdateUserFirebase(currentUser?.uid, data);
    useUserStore.getState().setProfileImage(data.imgURL);
    toast({
      title: "Profil enregistré !",
    });
  };

  return (
    <div className="min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <Title>Mon compte</Title>
      <Title level={2}>{`Identifiant : ${currentUser?.email ?? ""}`}</Title>
      <Form {...form}>
        <form
          className="mb-12 flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
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
          <div className="m-2 flex items-center justify-around gap-3">
            {form.watch("imgURL") ? (
              <img
                src={form.watch("imgURL") ?? ""}
                alt="Image sélectionnée"
                width="150"
                height="150"
                className="m-auto"
              />
            ) : (
              <p className="text-center">Aucune image de profile</p>
            )}
            <FormField
              control={form.control}
              name="imgURL"
              render={() => (
                <FormItem>
                  <FormControl>
                    <>
                      <Input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageUpload(e.target.files[0]);
                          }
                        }}
                        className="text-muted cursor-pointer"
                      />
                      {isImageLoading ? (
                        <Progress value={progress} />
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
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
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
      <div className="flex items-center gap-2">
        <Title level={2}>Mes amis</Title>
        <Sparkles
          className="bg-friend rounded-full p-2"
          size={40}
          color="black"
        />
      </div>
      {friendsInfo.length > 0 ? (
        <UsersListView userInfoList={friendsInfo} />
      ) : (
        <FeedbackMessage message="Aucun ami pour l'instant" />
      )}

      <div className="my-12 flex flex-col gap-4">
        <CustomLinkButton className="bg-primary/60" linkTo="/searchusers">
          Voir les Membres
        </CustomLinkButton>
        <CustomLinkButton className="bg-secondary/70" linkTo="/mybooks">
          Mes livres
        </CustomLinkButton>
      </div>
      <div className="bg-primary/20 p-2">
        <Link
          to="/resetpassword"
          className="text-foreground flex gap-5 font-semibold"
        >
          <p>Changer de mot de passe ?</p>
          <ChevronsRight />
          <p>Cliquez ici !</p>
        </Link>
      </div>
    </div>
  );
};

export default MyAccountPage;
