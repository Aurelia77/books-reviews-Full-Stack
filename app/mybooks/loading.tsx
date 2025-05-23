import BookSkeleton from "@/components/skeletons/BookSkeleton";

const MyBooksLoading = () => {
  return (
    <div className="mt-8">
      <BookSkeleton />
      <BookSkeleton />
      <BookSkeleton />
      <BookSkeleton />
      <BookSkeleton />
    </div>
  );
};

export default MyBooksLoading;
