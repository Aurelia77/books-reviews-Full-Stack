"use client";

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
import { Textarea } from "@/components/ui/textarea";
import UsersListView from "@/components/UsersListView";
import { AccountFormType, AppUserType } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronsRight, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Progress } from "./ui/progress";

const accountFormSchema = z.object({
  userName: z.string().min(2, {
    message: "Entrez un nom d'au moins 2 caractères.",
  }),
  imgURL: z
    .string()
    .refine(
      (value) =>
        value === "" ||
        z.string().url().safeParse(value).success ||
        value.startsWith("/"),
      {
        message:
          "Entrez une URL valide, un chemin " +
          "relatif commençant par /, ou laissez vide.",
      }
    ),
  description: z.string(),
});

const MyAccount = ({
  currentAppUser,
  myFriends,
}: {
  currentAppUser: AppUserType;
  myFriends: AppUserType[];
}) => {
  const router = useRouter();

  const [imageUpload, setImageUpload] = useState<File | null>(null);

  const [isImageLoading, setIsImageLoading] = useState(false);
  const [progress, setProgress] = useState<number>();

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
    if (currentAppUser) {
      reset({
        userName: currentAppUser.userName,
        imgURL: currentAppUser.imgURL,
        description: currentAppUser.description,
      });
    }
  }, [currentAppUser, reset]);

  const uploadImage = async () => {
    if (!imageUpload) return;
    setIsImageLoading(true);
    setProgress(0);

    const formProfileImgData = new FormData();
    formProfileImgData.append("file", imageUpload);

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/uploads", true);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsImageLoading(false);
      if (xhr.status === 200) {
        const result = JSON.parse(xhr.responseText);
        if (result && result.url) {
          form.setValue("imgURL", result.url);
        }
      } else {
        try {
          const errorData = JSON.parse(xhr.responseText);
          console.error("Erreur upload image :", errorData);
        } catch (e) {
          console.error("Erreur upload image :", xhr.responseText);
        }
      }
    };

    xhr.onerror = () => {
      setIsImageLoading(false);
      console.error("Erreur upload image :", xhr.statusText);
    };

    xhr.send(formProfileImgData);
  };

  const onSubmit: SubmitHandler<AccountFormType> = async (formData) => {
    try {
      const response = await fetch("/api/appUsers/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUserId: currentAppUser.id,
          data: formData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(
          "Erreur lors de la mise à jour du profil :",
          errorData.error,
          errorData.message
        );
        toast.error(
          "Impossible de mettre à jour le profil. Veuillez vérifier votre connexion ou réessayer plus tard."
        );
      } else {
        toast.success("Profil mis à jour avec succès !");
        router.refresh(); // to update the navbar with the new profile image
      }
    } catch (error) {
      console.error("Erreur lors de l'appel à l'API /appUser/update :", error);
      toast.error(
        "Une erreur est survenue lors de la mise à jour des informations. Veuillez réessayer plus tard."
      );
    }
  };

  return (
    <div>
      <Title level={2}>{`Identifiant : ${currentAppUser.email}`}</Title>
      <Form {...form}>
        <form
          className="my-12 flex flex-col gap-7 mb-24"
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
              <Image
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
                    <div>
                      <Input
                        type="file"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setImageUpload(e.target.files[0]);
                          }
                        }}
                        className="cursor-pointer text-muted mb-1"
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
                    </div>
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
          className="rounded-full bg-yellow-400 p-2"
          size={40}
          color="black"
        />
      </div>
      {myFriends.length > 0 ? (
        <UsersListView userInfoList={myFriends} />
      ) : (
        <FeedbackMessage message="Aucun ami pour l'instant" />
      )}

      <div className="my-24 flex flex-col gap-4">
        <CustomLinkButton className="bg-primary/60" linkTo="/users">
          Voir les Membres
        </CustomLinkButton>
        <CustomLinkButton className="bg-secondary/70" linkTo="/mybooks">
          Mes livres
        </CustomLinkButton>
      </div>
      <div className="bg-primary/20 p-2">
        <Link
          href="/resetpassword"
          className="flex gap-5 font-semibold text-foreground"
        >
          <p>Changer de mot de passe ?</p>
          <ChevronsRight />
          <p>Cliquez ici !</p>
        </Link>
      </div>
    </div>
  );
};

export default MyAccount;
