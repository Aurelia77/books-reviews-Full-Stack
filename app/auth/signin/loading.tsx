import UserViewSkeleton from "@/components/skeletons/UserViewSkeleton";

const BooksLoading = () => {
  return (
    <div>
      <div className="mt-8">
        <UserViewSkeleton />
        <UserViewSkeleton />
        <UserViewSkeleton />
        <UserViewSkeleton />
        <UserViewSkeleton />
      </div>
    </div>
  );
};

export default BooksLoading;
