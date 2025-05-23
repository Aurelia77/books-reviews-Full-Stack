import UserViewSkeleton from "@/components/skeletons/UserViewSkeleton";

const UsersLoading = () => {
  return (
    <div className="mt-8">
      <UserViewSkeleton />
      <UserViewSkeleton />
      <UserViewSkeleton />
      <UserViewSkeleton />
      <UserViewSkeleton />
    </div>
  );
};

export default UsersLoading;
