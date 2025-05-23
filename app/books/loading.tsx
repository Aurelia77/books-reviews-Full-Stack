import BookSkeleton from "@/components/skeletons/BookSkeleton";
import Title from "@/components/Title";

const BooksLoading = () => {
  return (
    <div>
      <Title>Affichage d'un ou plusieurs livre(s)</Title>
      <div className="mt-8">
        <BookSkeleton />
        <BookSkeleton />
        <BookSkeleton />
        <BookSkeleton />
        <BookSkeleton />
      </div>
    </div>
  );
};

export default BooksLoading;
