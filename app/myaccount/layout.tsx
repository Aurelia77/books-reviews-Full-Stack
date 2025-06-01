import Title from "@/components/Title";
import { PropsWithChildren } from "react";

const Userslayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <Title>Mon compte</Title>
      {children}
    </div>
  );
};

export default Userslayout;
