import Title from "@/components/Title";
import { PropsWithChildren } from "react";

const ResetPasswordLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      <Title>Réinitialiser le mot de passe</Title>
      {children}
    </div>
  );
};

export default ResetPasswordLayout;
