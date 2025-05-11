import UserViewSkeleton from "@/components/skeletons/UserViewSkeleton";

export default function UsersLoading() {
  return (
    <div>
      <UserViewSkeleton />
      <UserViewSkeleton />
      <UserViewSkeleton />
      <UserViewSkeleton />
      <UserViewSkeleton />
    </div>
  );
}
