import AllBooksLists from "@/components/AllBooksLists";
import CustomLinkButton from "@/components/CustomLinkButton";
import FeedbackMessage from "@/components/FeedbackMessage";
import BookSkeleton from "@/components/skeletons/BookSkeleton";
import Title from "@/components/Title";
import { getDocsByQueryFirebase } from "@/firebase/firestore";
import useUserStore from "@/hooks/useUserStore";
import { UserType } from "@/lib/types";
import useSWR from "swr";

const fetcher = async (uid: string) => {
  const users = await getDocsByQueryFirebase<UserType>("users", "id", uid);
  return users[0];
};

const MyBooksPage = (): JSX.Element => {
  const { currentUser } = useUserStore();
  const {
    data: userInfo,
    error,
    isLoading,
  } = useSWR(currentUser ? currentUser.uid : null, fetcher);

  const message = `Un problème est survenu dans la récupération du livre => ${error?.message}`;

  return isLoading ? (
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
