import { Skeleton } from "../ui/skeleton";

const BookSkeleton = (): JSX.Element => {
  return (
    <div className="flex gap-4 p-5 pt-10">
      <Skeleton className="h-48 w-32 rounded-md" />
      <div className="grow space-y-7">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-2 w-[100px]" />
        <Skeleton className="h-2 w-[80px]" />
      </div>
    </div>
  );
};

export default BookSkeleton;
