import Title from "@/components/Title";
import { PropsWithChildren } from "react";

const MyBooksLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen max-w-3xl md:m-auto md:mt-8">
      <Title>Mes Livres</Title>
      {children}
    </div>
  );
};

export default MyBooksLayout;
