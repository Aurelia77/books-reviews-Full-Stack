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
import useUserStore from "@/hooks/useUserStore";
import { AccountFormType, UserType } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
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
  const { currentUser } = useUserStore();

  console.log("999 userId", currentUser?.uid);

  const [imageUpload, setImageUpload] = useState<File | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [progress, setProgress] = useState(0);

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

  const onSubmit: SubmitHandler<AccountFormType> = (data) => {
    //console.log("data", data);
    addOrUpdateUserFirebase(currentUser?.uid, data);
    useUserStore.getState().setProfileImage(data.imgURL);
  };

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
      );
  }, [currentUser?.uid]);

  return (
    <div className="min-h-screen sm:p-2 max-w-3xl md:m-auto md:mt-8">
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
                        className="cursor-pointer text-muted"
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
        <Sparkles />
      </div>
      {friendsInfo.length > 0 ? (
        <UsersListView userInfoList={friendsInfo} />
      ) : (
        // friendsInfo.map((friendInfo, index) => (

        // <Link
        //   key={index}
        //   to={`/account/${friendInfo.id}`}
        //   className="font-semibold text-muted"
        // >
        //   <div className="flex items-center gap-2">
        //     <Avatar>
        //       <AvatarImage src={friendInfo.imgURL} />
        //     </Avatar>
        //     <p>{friendInfo.userName}</p>
        //   </div>
        // </Link>
        // ))
        <FeedbackMessage message="Aucun ami pour l'instant" />
      )}

      <div className="my-12 flex flex-col gap-4">
        <CustomLinkButton className="bg-secondary/70" linkTo="/mybooks">
          Mes livres
        </CustomLinkButton>
      </div>
    </div>
  );
};

export default MyAccountPage;
