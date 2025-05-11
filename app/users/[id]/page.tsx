import Title from "@/components/Title";
import { Card, CardDescription } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { cn } from "@/lib/utils";

export default async function Post({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await prisma.appUser.findUnique({
    where: { id: id },
    // include: {
    //   author: true,
    // },
  });

  return (
    user && (
      <div
        className={cn("min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8", {
          //"bg-friend/20": isFriend,
        })}
        //key={userInUrl.userId}
      >
        <Card className="mb-6">
          <div className="mr-2 flex items-center justify-between gap-10 pl-2 max-w-md">
            <Title>{user?.userName ?? ""}</Title>
            <CardDescription>
              {/* {isFriend ? (
                <div className="flex gap-4 items-center">
                  <FriendSparkles />
                  <p>Ami</p>
                  <Button onClick={deleteFriendHandler}>Supprimer</Button>
                </div>
              ) : (
                <div className="flex gap-4 items-center">
                  <p>Non ami</p>
                  <Button onClick={addFriendHandler}>Ajouter</Button>
                </div>
              )} */}
            </CardDescription>
          </div>
          <div className="m-4 flex gap-4">
            {user?.imgURL && (
              <img
                src={user?.imgURL}
                alt={`Image de profil de ${user?.userName}`}
                width="150"
                height="150"
                className="rounded-xl"
              />
            )}
            <CardDescription className="m-2 whitespace-pre-wrap">
              {user?.description || "Aucune description"}
            </CardDescription>
          </div>
        </Card>

        {/* <Title level={2}>Livres du membre</Title>
        {user && userInUrl.userId && <AllBooksLists user={user} />} */}
      </div>
    )
  );
}
