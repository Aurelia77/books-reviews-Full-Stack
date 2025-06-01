import { Skeleton } from "../ui/skeleton";

const UserViewSkeleton = () => {
  return (
    <div className="flex items-center gap-4 p-5">
      <Skeleton className="size-10 rounded-full" />
      <Skeleton className="h-5 w-32" />
    </div>
  );
};

export default UserViewSkeleton;
