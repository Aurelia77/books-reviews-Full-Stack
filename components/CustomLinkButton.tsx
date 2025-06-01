import { cn } from "@/lib/utils";
import Link from "next/link";
import { ReactNode } from "react";
import { Button } from "./ui/button";

type CustomLinkButtonProps = React.HTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
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
          "w-full text-3xl rounded-xs flex-wrap flex gap-2 sm:rounded-md border-4 border-border/20 shadow-md shadow-foreground/30",
          className
        )}
      >
        {children}
      </Button>
    </Link>
  );
};

export default CustomLinkButton;
