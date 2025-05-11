import Title from "@/components/Title";
import { PropsWithChildren } from "react";

const Userslayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <Title>Livre(s)</Title>
      {children}
    </div>
  );
};

export default Userslayout;
