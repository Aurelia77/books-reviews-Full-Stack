import { cn } from "@/lib/utils";
import { ReactNode } from "react";
import Link from "next/link";
import { Button } from "./ui/button";

type CustomLinkButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  //opacity?: number;
  linkTo?: string;
  className?: string;
};

const CustomLinkButton = ({
  children,
  linkTo = "/",
  className,
}: CustomLinkButtonProps) => {
  return (
    <Link href={linkTo}>
      <Button
        size="xxl"
        className={cn(
          "w-full text-3xl rounded-none flex-wrap flex gap-2 sm:rounded-md border border-border shadow-md shadow-foreground/30",
          className
        )}
      >
        {children}
      </Button>
    </Link>
  );
};

export default CustomLinkButton;
