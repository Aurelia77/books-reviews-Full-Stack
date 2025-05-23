import UserViewSkeleton from "@/components/skeletons/UserViewSkeleton";

const ResetPasswordLoading = () => {
  return (
    <div className="mt-16">
      <UserViewSkeleton />
      <UserViewSkeleton />
      <UserViewSkeleton />
      <UserViewSkeleton />
      <UserViewSkeleton />
    </div>
  );
};

export default ResetPasswordLoading;
