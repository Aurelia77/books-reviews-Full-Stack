import AllBooksLists from "@/components/AllBooksLists";
import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import BookSkeleton from "@/components/skeletons/BookSkeleton";
import Title from "@/components/Title";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { UserType } from "@/types";
import useSWR from "swr";

const fetcher = async (uid: string) => {
  const users = await getDocsByQueryFirebase<UserType>("users", "id", uid);
  return users[0];
};

const MyBooksPage = (): JSX.Element => {
  //const [userInfo, setUserInfo] = useState<UserType>();

  const { currentUser } = useUserStore();
  const {
    data: userInfo,
    error,
    isLoading,
  } = useSWR(currentUser ? currentUser.uid : null, fetcher);

  // ici on utilise une constante et pas un state car les message ne change pas et s'affiche seulement si useSWR renvoie une erreur
  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`; // VOIR !!!!

  //console.log("99999 currentUser", currentUser);

  //console.log(currentUser);

  // useEffect(() => {
  //   //console.log("999 USEEFFECT");
  //   //console.log("999 currentUser?.uid", currentUser?.uid);

  //   if (currentUser)
  //     getDocsByQueryFirebase<UserType>("users", "id", currentUser?.uid).then(
  //       (users) => {
  //         setUserInfo(users[0]);
  //         return users[0];
  //       }
  //     );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [currentUser?.uid]);

  return isLoading ? (
    // {/* Mettre un Spinner pour pas voir rapidement le message Aucun membre */}
    <div>
      <BookSkeleton />
      <BookSkeleton />
      <BookSkeleton />
    </div>
  ) : error ? (
    <FeedbackMessage message={message} type="error" />
  ) : (
    <div className="min-h-screen max-w-3xl md:m-auto md:mt-8">
      <Title level={2}>Mes Livres</Title>
      {userInfo && <AllBooksLists userInfo={userInfo} />}
      <CustomLinkButton className="bg-primary/80" linkTo="/searchbooks">
        Recherche de livre
      </CustomLinkButton>
    </div>
  );
};

export default MyBooksPage;
