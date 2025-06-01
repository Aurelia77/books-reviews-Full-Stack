import UserViewSkeleton from "@/components/skeletons/UserViewSkeleton";
import Title from "@/components/Title";

const UsersLoading = () => {
  return (
    <div>
      <Title>Affichage d'un ou plusieurs membre(s)</Title>
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

export default UsersLoading;
