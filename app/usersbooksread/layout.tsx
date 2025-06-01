import Title from "@/components/Title";
import { PropsWithChildren } from "react";

const UsersBooksReadlayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <div className="sticky top-10 z-10">
        <Title>Livres lus par les membres</Title>
      </div>
      {children}
    </div>
  );
};

export default UsersBooksReadlayout;
