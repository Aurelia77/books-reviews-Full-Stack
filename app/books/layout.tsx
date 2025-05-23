import { PropsWithChildren } from "react";

const BooksLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="h-full min-h-screen max-w-3xl sm:p-2 md:m-auto md:mt-8">
      {children}
    </div>
  );
};

export default BooksLayout;
